var jsdom = require('jsdom');

function svgGen(data,callback){


jsdom.env(
	"<html><body></body></html>",
	[ 'http://d3js.org/d3.v3.min.js' ],
function (err, window) {

var margin = {top: 30, right: 40, bottom: 30, left: 50},
   width = 600 - margin.left - margin.right,
   height = 270 - margin.top - margin.bottom;

// Parse the date / time
var parseDate = window.d3.time.format("%Y-%m-%d").parse;

// Set the ranges
var x = window.d3.time.scale().range([0, width]);
var y = window.d3.scale.linear().range([height, 0]);

var xAxis = window.d3.svg.axis().scale(x)
    .orient("bottom").ticks(5);

var yAxis = window.d3.svg.axis().scale(y)
    .orient("left").ticks(5);

var valueline = window.d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.high); });
  
var svg = window.d3.select("body")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" 
            + margin.left 
            + "," + margin.top + ")");

    data.query.results.quote.forEach(function(d) {
        d.date = parseDate(d.Date);
        d.high = +d.High;
        d.low = +d.Low;
    });

    // Scale the range of the data
    x.domain(window.d3.extent(data.query.results.quote, function(d) {
        return d.date; }));
    y.domain([
        window.d3.min(data.query.results.quote, function(d) { return d.low; }), 
        window.d3.max(data.query.results.quote, function(d) { return d.high; })
]);

    svg.append("path")        // Add the valueline path.
        .attr("class", "line")
        .attr("d", valueline(data.query.results.quote));

    svg.append("g")            // Add the X Axis
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")            // Add the Y Axis
        .attr("class", "y axis")
        .call(yAxis);

    svg.append("text")          // Add the label
        .attr("class", "label")
        .attr("transform", "translate(" + (width+3) + "," 
            + y(data.query.results.quote[0].high) + ")")
        .attr("dy", ".35em")
        .attr("text-anchor", "start")
        .style("fill", "orange")

    
	    callback(window.d3.select("body").html().toString());
	});
}

module.exports.svgGen = svgGen;

