var jsdom = require('jsdom');

function svgGen(callback){


    jsdom.env(
	"<html><body></body></html>",
	[ 'http://d3js.org/d3.v3.min.js' ],
	function (err, window) {
	    var svg = window.d3.select("body")
		.append("svg")
		.attr("width", 100).attr("height", 100);

	    svg.append("rect")
		.attr("x", 10)
		.attr("y", 10)
		.attr("width", 80)
		.attr("height", 80)
		.style("fill", "orange");

	    callback(window.d3.select("body").html().toString());
	});
}

module.exports.svgGen = svgGen;

/*
var result = svgGen(function (svg) {
    console.log(svg); 
});
*/

