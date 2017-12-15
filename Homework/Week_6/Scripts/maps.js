// maps.js
// Yol Tio 10753222 
// Minor programmeren
// Creates interactive map showing Crime Index per country and barchart showing amount of homocides per 100.000 people per country

// create map projection
var width = 700;
    height = 500;

// create map projection
var projection = d3.geo.mercator()
    .center([13, 52])
    .translate([width / 2, height / 2])
    .scale([width / 1.5]);

var path = d3.geo.path()
    .projection(projection);

// dict with id"s for selecting country
var dict = {"coun1":"Albania", "coun2":"Belgium", "coun3":"Bulgaria", "coun4":"Austria", "coun5":"Bosnia and Herzegovina", "coun6":"Belarus", "coun7":"Switzerland",
 			"coun8":"Czech Republic", "coun9":"Denmark", "coun10":"Germany", "coun11":"Spain", "coun12":"Estonia", "coun13":"Finland", "coun14":"France",
 			"coun15":"United Kingdom", "coun16":"Greece", "coun17":"Croatia", "coun18":"Hungary", "coun19":"Ireland", "coun20":"Iceland", "coun21":"Italy",
 			"coun22":"Kosovo", "coun23":"Lithuania", "coun24":"Luxembourg", "coun25":"Latvia", "coun26":"Moldova", "coun27":"Macedonia", "coun28":"Montenegro",
 			"coun29":"Netherlands", "coun30":"Norway", "coun31":"Portugal", "coun32":"Poland", "coun33":"Romania", "coun34":"Russia", "coun35":"Serbia",
 			"coun36":"Slovakia", "coun37":"Slovenia", "coun38":"Sweden", "coun39":"Ukraine"}

var color = d3.scale.linear()
    .domain([2000, 5500])
    .range(["#ff6600", "#cc0000"]);

// wait for all data to be loaded
d3.queue()
    .defer(d3.json, "Data/europe.topojson")
    .defer(d3.json, "Data/crime.json")
    .await(makemap);

var svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

var dataNest = [],
    error, vector = svg;

// creates map
function makemap(error, europe, crime) {

    countries = topojson.feature(europe, europe.objects.collection);

    // drawing map and adding colour
    vector.selectAll("path")
        .data(countries.features)
        .enter()
        .append("path")
        .attr("class", "country")
        .attr("id", function(d) {
            return "coun" + d.properties.indx
        })
        .attr("d", path)
        .on("mouseover", function(d) {
            d3.select("#coun" + d.properties.indx).style("stroke", "777").style("stroke-width", 2);
            d3.select("#" + dict[this.id]).style("fill", "red");
            var country = dict[this.id]
            svg.append("text")
                .attr("id", "CrimeIndex")
                .attr("x", (500))
                .attr("y", (1 / height))
                .attr("text-anchor", "middle")
                .style("font-size", "20px")
                .text(function() {
                    for (i = 0; i < 40; i++) {
                        if (crime[i].Country == country) {
                            return (country + " Crime Index: " + crime[i].CrimeIndex / 100);
                        }
                    }
                })
        })
        .on("mouseout", function(d) {
            d3.select("#coun" + d.properties.indx).style("stroke", "ddd").style("stroke-width", 0);
            d3.select("#" + dict[this.id]).style("fill", "darkred")
            d3.select("#CrimeIndex").remove()

        })
    colorMap(crime)

// colours map
function colorMap(crime) {
    vector.selectAll(".country")
        .style("fill", function() {
            var country = dict[this.id]
            for (i = 0; i < 40; i++) {
                if (country == crime[i].Country) {
                    return color(crime[i].CrimeIndex);
                }
            }
        })
}
}

var margin = {
        top: 100,
        right: 0,
        bottom: 160,
        left: 50
    },
    width = 1000 - margin.left - margin.right,
    height = 550 - margin.top - margin.bottom;

// sets up scales and axis
var x = d3.scale.ordinal().rangeRoundBands([0, width], .1);

var y = d3.scale.linear().range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var svg = d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// implements tooltip
var tip = d3.tip()
    .attr("class", "d3-tip")
    .offset([-10, 0])
    .html(function(d) {
        return d.Country + "<br>" + "Homocide Offences:" + d.Homocide;
    })

svg.call(tip);

// loads data
d3.json("Data/crime.json", function(error, data) {

    data.forEach(function(d) {
        d.Country = d.Country;
        d.Homocide =+ d.Homocide / 100;
    });

    // scales ranges of data
    x.domain(data.map(function(d) {
        return d.Country;
    }));
    y.domain([0, d3.max(data, function(d) {
        return d.Homocide;
    })]);

    // creates table
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.7em")
        .attr("dy", "-.1em")
        .attr("transform", "rotate(-45)");

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -40)
        .attr("dy", ".5em")
        .text("per 100.000 inhabitants");

    svg.append("text")
        .attr("class", "header")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .text("Homocides per 100.000 inhabitants");

    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("id", function(d) {
            return (d.Country);
        })
        .attr("class", "bar")
        .attr("x", function(d) {
            return x(d.Country);
        })
        .attr("width", x.rangeBand())
        .attr("y", function(d) {
            return y(d.Homocide);
        })
        .attr("height", function(d) {
            return height - y(d.Homocide);
        })
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide);
});