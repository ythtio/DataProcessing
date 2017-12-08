var margin = {top: 100, right: 30, bottom: 100, left: 50},
    width = 1200 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

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

// implements tooltip
var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      return  "<strong>Homocide Offences:<strong>" + d.Homocide;
    }) 

chart.call(tip);

// loads data
d3.json("crime.json", function(error, data) {
  
  data.forEach(function(d) {
      d.Homocide =+ d.Homocide / 100;
    });

  // scales ranges of data
    x.domain(data.map(function(d) { return d.Country; }));
    y.domain([0, d3.max(data, function(d) { return d.Homocide; })]);

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
      .text("per 100.000 people");

  // adds title 
  chart.append("text")
      .attr("x", (width / 2))
      .attr("y", 0 - (margin.top / 2))
      .attr("text-anchor", "middle")
      .style("font-size", "30px")
      .text("Homocide per 100000 people");

  // adds bars and tooltip popup
  chart.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.Country); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.Homocide); })
      .attr("height", function(d) { return height - y(d.Homocide); })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);
});