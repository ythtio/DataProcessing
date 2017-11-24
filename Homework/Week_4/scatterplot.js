/**
 * scatterplot.js
 *
 * Minor programmeren
 * Yol Tio 10753222
 *
 * Implements a scatterplot showing the ratio of UEFA-points vs. population
 * of the top 100 soccer nations. Size of the dots shows the number of qualifications 
 * for the FIFA World Cup for a certain country.
 */

// sets dimensions and margins of scatterplot
var margin = {top: 100, right: 200, bottom: 30, left: 100},
    width = 1200 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// functions to scale x-axis
var x = d3.scale.linear()
    .range([0, width]);

// function to scale y-axis
var y = d3.scale.linear()
    .range([height, 0]);

// function to scale dot size
var r = d3.scale.linear()
    .range([3.5, 18]);

// function to append color
var color = d3.scale.category10();

// appends x-axis to bottom
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

// appends y-axis to left axis
var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

// creates tooltip
var div = d3.select("body").append("div") 
    .attr("class", "tooltip")       
    .style("opacity", 0);

// input svgfile
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


// loads json.data
d3.json("soccer.json", function(error, data) {
  if (error) throw error;

// iterates over all data
  data.forEach(function(d) {
    d.Points =+ d.Points;
    d.Log_Population =+ d.Log_Population;
    d.WCQuali =+ d.WCQuali;
  });

// scales domain of x and y coordinates
  x.domain(d3.extent(data, function(d) { return d.Log_Population; })).nice();
  y.domain(d3.extent(data, function(d) { return d.Points; })).nice();

  // scales size of dots
  r.domain(d3.extent(data, function(d) { return d.WCQuali; })).nice();

// creates plot title
  svg.append("text")
      .attr("x", (width / 2))
      .attr("y", 0 - (margin.top / 2))
      .attr("text-anchor", "middle")
      .style("font", "30px sans-serif")
      .text("UEFA points per capita(log)");

// adjusts x-axis to data
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .style("font", "20px sans-serif")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", - 6)
      .style("text-anchor", "end")
      .text("Population (ln)");

// adjusts y-axis to data
  svg.append("g")
      .attr("class", "y axis")
      .style("font", "20px sans-serif")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("UEFA-points");

// adjusts dot to data and adds tooltip
  svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", function(d) { return r(d.WCQuali); })
      .attr("cx", function(d) { return x(d.Log_Population); })
      .attr("cy", function(d) { return y(d.Points); })
      .style("fill", function(d) { return color(d.Continent); })
      .on("mouseover", function(d) {    
          div.transition()      
            .style("opacity", .9);    
          div .html(d.Land + "<br/>"  + "UEFA-Points: " + d.Points +
                    "<br/>" + "WC Qualifications:" + d.WCQuali)  
            .style("left", (d3.event.pageX) + "px")   
            .style("top", (d3.event.pageY - 28) + "px");  
      })          
      .on("mouseout", function(d) {   
          div.transition()     
            .style("opacity", 0); 
      });

// creates legend
  var legend = svg.selectAll(".legend")
      .data(color.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

// appends colorcode to legend
  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

// appends text to legend 
  legend.append("text")
      .style("font", "20px sans-serif")
      .attr("x", width + 10)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "start")
      .text(function(d) { return d; });
});