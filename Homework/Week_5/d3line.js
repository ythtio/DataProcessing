/**
 * d3line.js
 *
 * Minor programmeren
 * Yol Tio 10753222
 *
 * The HTML file contains a multiline graph showing the daily
 * maximum, minimum and average temperature at Schiphol Airport
 *
 * Tooltip based on: https://bl.ocks.org/larsenmtl/e3b8b7c2ca4787f77d78f58d41c3da91
 *
 */

// sets dimensions and margins of scatterplot
var margin = {top: 100, right: 200, bottom: 100, left: 100},
    width = 1200 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// input svgfile
var chart = d3.select("svg").append("g")
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// convert Date to right format
var parseTime = d3.timeParse("%Y%m%d");

// functions to scale x-axis
var x = d3.scaleTime()
    .range([0, width]);

// function to scale y-axis
var y = d3.scaleLinear()
    .range([height, 0]);

// function to scale colours
var color = d3.scaleOrdinal(d3.schemeCategory10);

// create line for different temperatures
var Templine = d3.line()
    .x(function(d) { return x(d.Date); })
    .y(function(d) { return y(d.Temp); });

// load the chosen data
// d3.selectAll(".m")
//     .on("click", function() {
//     var month = this.getAttribute("value");

//     // set the chosen data set al str
//     var dataset;
//     if(month == "1"){
//       dataset = "janTemp.json";
//     }else if(month == "2"){
//       dataset = "febTemp.json";
//     }

// loads json.data
d3.json("janTemp.json", function(error, data) {
  if (error) throw error;
  
  // format the data
  data.forEach(function(d) {
      d.Date = parseTime(d.Date);
      d.Temp =+ d.Temp/10;
  });

// scales domain of x and y coordinates
  x.domain(d3.extent(data, function(d) { return d.Date; }));
  y.domain([d3.min(data, function(d) {
    return Math.min(d.Temp)}),
    d3.max(data, function(d) {
    return Math.max(d.Temp)}) ]);

// sorts Temperatures
var dataNest = d3.nest()
    .key(function(d) {return d.TempSort;})
    .entries(data);

// creates space for Legend
legendSpace = width/dataNest.length;

// creates paths and legends
dataNest.forEach(function(d,i) { 
    
    chart.append("path")
        .attr("class", "line")
        .style("stroke", function() {
            return d.color = color(d.key); })
        .attr("d", Templine(d.values));

    chart.append("text")
        .attr("x", (legendSpace/2)+i*legendSpace)
        .attr("y", height + margin.bottom/2)
        .attr("class", "legend")
        .style("font", "18px sans-serif")
        .style("fill", function() {
            return d.color = color(d.key); })
        .text(d.key); 
});

// adjusts x-axis to data
chart.append("g")
    .attr("transform", "translate(0," + height + ")")
    .style("font", "14px sans-serif")
    .call(d3.axisBottom(x))

// adjusts y-axis to data
chart.append("g")
    .style("font", "14px sans-serif")
    .call(d3.axisLeft(y))

// adds title to y-axis 
chart.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -30)
    .style("font", "20px sans-serif")
    .style("text-anchor", "end")
    .text("Temperature (Celsius)");

// creates plot title
chart.append("text")
    .attr("x", (width / 2))
    .attr("y", 0 - (margin.top / 2))
    .attr("text-anchor", "middle")
    .style("font", "30px sans-serif")
    .text("Average, Minimum and Maximum Temperature at Schiphol Airport");

var mouseG = chart.append("g")
    .attr("class", "mouse-over-effects");

// creates vertical line that follows tooltip
mouseG.append("path")
    .attr("class", "mouse-line")
    .style("stroke", "black")
    .style("stroke-width", "1px")
    .style("opacity", "0");
    
var lines = document.getElementsByClassName('line');

var mousePerLine = mouseG.selectAll('.mouse-per-line')
    .data(data)
    .enter()
    .append("g")
    .attr("class", "mouse-per-line");

// appends circle to mouse
mousePerLine.append("circle")
    .attr("r", 7)
    .style("stroke", "black")
    .style("fill", "none");

// appends text to circle, with right indentation
mousePerLine.append("text")
  .attr("transform", "translate(10,3)")

// appends a rect where mousemovements are recorded, as this cannot be done on a g element.
mouseG.append('svg:rect')
  .attr('width', width) 
  .attr('height', height)
  .attr('fill', 'none')
  .attr('pointer-events', 'all')

// when mouse leaves rect, hides all tooltip attributes
.on('mouseout', function() { 
  d3.select(".mouse-line")
    .style("opacity", "0");
  d3.selectAll(".mouse-per-line circle")
    .style("opacity", "0");
  d3.selectAll(".mouse-per-line text")
    .style("opacity", "0");
  })

  // when mouse enters rect, shows according tooltip attributes
.on('mouseover', function() {
  d3.select(".mouse-line")
    .style("opacity", "1");
  d3.selectAll(".mouse-per-line circle")
    .style("opacity", "1");
  d3.selectAll(".mouse-per-line text")
    .style("opacity", "1");
})

// moves tooltip when mouse is moved inside rect
.on('mousemove', function() {
  var mouse = d3.mouse(this);
  d3.select(".mouse-line")
    .attr("d", function() {
      var d = "M" + mouse[0] + "," + height;
      d += " " + mouse[0] + "," + 0;
      return d;
    });

d3.selectAll(".mouse-per-line")
  .attr("transform", function(d, i) {
        var xDate = x.invert(mouse[0]),
        bisect = d3.bisector(function(d) { return d.Date; }).right;
        idx = bisect(d.Temp, xDate);
        
        var beginning = 0,
            end = lines[i].getTotalLength(),
            target = null;

        while (true){
          target = Math.floor((beginning + end) / 2);
          pos = lines[i].getPointAtLength(target);
          if ((target === end || target === beginning) && pos.x !== mouse[0]) {
              break;
          }
          if (pos.x > mouse[0])      end = target;
          else if (pos.x < mouse[0]) beginning = target;
          else break;
        }
        
        d3.select(this).select('text')
          .text(y.invert(pos.y).toFixed(2) + ' Celsius')
          .style("font-weight", "bold");
          
        return "translate(" + mouse[0] + "," + pos.y + ")";
        });
    });
});
// });
