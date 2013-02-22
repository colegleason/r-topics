var fill = d3.scale.category20();

function draw(words) {
    d3.select("body").append("svg")
        .attr("width", 300)
        .attr("height", 300)
		.append("g")
        .attr("transform", "translate(150,150)")
		.selectAll("text")
        .data(words)
		.enter().append("text")
        .style("font-size", function(d) { return d.size + "px"; })
        .style("font-family", "Impact")
        .style("fill", function(d, i) { return fill(i); })
        .attr("text-anchor", "middle")
        .attr("transform", function(d) {
				return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
			})
        .text(function(d) { return d.text; });
}