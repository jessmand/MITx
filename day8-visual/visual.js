var data = [ 0, 4, 8, 8, 15, 16, 23, 42 ];

//var chart = $("<div></div>").addClass("chart");
//$('.chart-container').append(chart);

//data.forEach(function (d) {
//    chart.append($("<div></div>").css("width", d * 10 + "px").text(d)); 
//});

var chartHeight = 140;

var xScale = d3.scale.linear().domain([0, d3.max(data)]).range(["0%", "100%"]);
var yScale = d3.scale.ordinal().domain(d3.keys(data)).rangeBands([0, chartHeight]);

var chart = d3.select(".chart-container").append("svg").attr("class", "chart");

chart.selectAll("rect").data(data).enter().append("rect")
    .attr("y", function (d, i) { return yScale(i); })
    .attr("width", xScale)
    .attr("height", 20);

chart.selectAll("text").data(data)
    .enter().append("text")
    .attr("x", xScale)
    .attr("y", function (d, i) { return yScale(i) + yScale.rangeBand() / 2; })
    .attr("dx", -3)
    .attr("dy", "0.35em")
    .attr("text-anchor", "end")
    .text(function (d) { return d; });