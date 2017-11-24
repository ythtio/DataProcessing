/**
 * svg.js
 *
 * Minor programmeren
 * Yol Tio 10753222
 *
 * Implements a legenda
 */

window.onload = function() {

// loads test.svg
d3.xml("test.svg", "image/svg+xml", function(error, xml) {
    if (error) throw error;    
    document.body.appendChild(xml.documentElement);    

// data arrays
var colours = ['#ccece6','#99d8c9','#66c2a4','#41ae76','#238b45','#005824'];
var texts = ['100', '1000', '10000', '100000', '1000000', '10000000'];

var svg = d3.select("svg");

for(i = 0; i < colours.length; i++) {

// appends text to textrectangles
text = svg.append('text').text(texts[i])
    .attr("font", "20px sans-serif")
    .attr("x", 46.5)
	.attr("y", 38 + 43.4 * i)
    .attr('fill', 'black');

// creates colour rectangles and fills with colour
var rect = svg.append("rect")
	.attr("id", "kleur" + i)
	.attr("x", 13)
	.attr("y", 13 + 43.4 * i)
	.attr("class", "st1")
	.attr("width", 21)
	.attr("height", 29)
	.attr("fill", colours[i]);

// creates text rectangles
var rect = svg.append("rect")
	.attr("id", "text" + i)
	.attr("x", 46.5)
	.attr("y", 13 + 43.4 * i)
	.attr("class", "st2")
	.attr("width", 119.1)
	.attr("height", 29);
}
});
};