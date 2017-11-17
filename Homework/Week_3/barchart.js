/**
 * barchart.js
 *
 * Minor programmeren
 * Yol Tio 10753222
 *
 * Implements a barchart that shows holiday destinations
 * of Dutch tourists in 2016
 */


// sets dimensions of and margins of charbart
var margin = {top: 100, right: 30, bottom: 100, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// function scales y-coordinates
var x = d3.scale.ordinal().rangeRoundBands([0, width], .1);

// function to scale x-coordinates
var y = d3.scale.linear().range([height, 0]);

// appends x-axis to bottom axis
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

// appends y-axis to left axis
var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

// creates the chart, implements margins
var chart = d3.select(".chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");

// implements tooltip inspired by: http://bl.ocks.org/Caged/6476579
var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      return "<strong>vakantiegangers:<strong>" + parseInt(d.bezoekers * 100000);
    }) 

chart.call(tip);

// loads data
d3.json("vakantie.json", function(error, data) {
  
    data.forEach(function(d) {
      d.bezoekers = (d.bezoekers / 10);
    });

  // scales ranges of data
    x.domain(data.map(function(d) { return d.land; }));
    y.domain([0, d3.max(data, function(d) { return d.bezoekers; })]);

 // adds x-axis
  chart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.7em")
      .attr("dy", "-.1em")
      .attr("transform", "rotate(-45)" );

  // adds y-axis
  chart.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -40) 
      .attr("dy", ".5em")
      .style("text-anchor", "end")
      .text("x100000 vakantiegangers");

  // adds title 
  chart.append("text")
      .attr("x", (width / 2))
      .attr("y", 0 - (margin.top / 2))
      .attr("text-anchor", "middle")
      .style("font-size", "30px")
      .text("Bestemmingen Vakantiegangers 2016");

  // adds bars and tooltip popup
  chart.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.land); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.bezoekers); })
      .attr("height", function(d) { return height - y(d.bezoekers); })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);
});
