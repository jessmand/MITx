var data = [ 4, 8, 8, 15, 16, 23, 42 ];

//var chart = $("<div></div>").addClass("chart");
//$('.chart-container').append(chart);

//data.forEach(function (d) {
//    chart.append($("<div></div>").css("width", d * 10 + "px").text(d)); 
//});

var outerHeight = 300;
var outerWidth = 300;

var margin = { top: 20, right: 20, bottom: 20, left: 20 };

var chartWidth = outerWidth - margin.left - margin.right;
var chartHeight = outerHeight - margin.top - margin.bottom;

var yScale = d3.scale.linear().domain([0, d3.max(data)]).range([chartHeight, 0]);
var xScale = d3.scale.ordinal().domain(d3.keys(data)).rangeBands([0, chartWidth]);

var chart = d3.select(".chart-container").append("svg")
    .attr("class", "chart")
    .attr("height", outerHeight)
    .attr("width", outerWidth)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

chart.selectAll("line").data(yScale.ticks(10)).enter().append("line")
    .attr("x1", 0)
    .attr("x2", chartWidth)
    .attr("y1", yScale)
    .attr("y2", yScale);

chart.selectAll(".y-scale-label").data(yScale.ticks(10)).enter().append("text")
    .attr("class", "y-scale-label")
    .attr("x", 0)
    .attr("y", yScale)
    .attr("dx", -margin.left / 8)
    .attr("dy", "0.3em")
    .attr("text-anchor", "end")
    .text(String);

chart.selectAll("rect").data(data).enter().append("rect")
    .attr("x", function (d, i) { return xScale(i); })
    .attr("y", yScale)
    .attr("width", xScale.rangeBand())
    .attr("height", function (d) { return chartHeight - yScale(d); });

chart.selectAll(".bar-label").data(data)
    .enter().append("text")
    .attr("class", "bar-label")
    .attr("y", function (d) { return yScale(d) + margin.top / 4; })
    .attr("x", function (d, i) { return xScale(i) + xScale.rangeBand() / 2; })
    .attr("dy", "0.7em")
    .attr("text-anchor", "middle")
    .text(function (d) { return d; });

