var avaibleCountries = ["Austria", "Belgium", "Bulgaria", "Cyprus", "Croatia", "Denmark", "Estonia", 
	"Finland", "France", "Germany", "Greece", "Ireland", "Iceland", "Italy", "Latvia", "Lithuania", 
	"Luxembourg", "Malta", "Norway", "Poland", "Portugal", "Czech Republic", "Romania", "Slovakia", 
	"Slovenia", "Spain", "Sweden", "Hungary", "United Kingdom"];

var width = 800, height = 600;

var projection = d3.geo.mercator() 	
	.center([13, 52])
	.translate([width / 2, height / 2]) 
	.scale([width / 1.5]);

var path = d3.geo.path()
	.projection(projection);

var svg = d3.select("#container")
	.append("svg")
	.attr("width", width)
	.attr("height", height);

var div = d3.select("body").append("div")   
	.attr("class", "tooltip")               
	.style("opacity", 0);

var color = d3.scale.linear()
			.domain([0, 1 ,2300])      // <--- min and MAX of your value
         	.range(["#0000ff","#ffffff","lightblue"]);

var dataNest=[],error,vector = svg;
	
d3.queue()
	.defer(d3.json, 'europe.topojson')
	.defer(d3.json, 'crime.json')
	.await(makemap);

function makemap(error, europe, dessease) {

	countries = topojson.feature(europe, europe.objects.collection);
	vector.selectAll("path")
		.data(countries.features)
	  .enter()
		.append("path")
		.attr("class", "country")
		.style("fill", 'green')
		.attr("id", function(d){ 
			  return "coun"+d.properties.indx})
		.attr("d", path)
		.on("mouseover", function(d) {
			d3.select("#coun"+d.properties.indx).style('fill', 'steelblue')
		
		})
		.on("mouseout", function(d) {
			d3.select("#coun"+d.properties.indx).style('fill', 'green')
		})
}