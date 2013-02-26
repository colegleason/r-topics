var fill = d3.scale.category20b();

var width = 1000;
var height = 600;

function make_cloud(jsonpath) {
	var initPhrases = new Array();
	var initWeight = new Array();
	var index = 0;

	d3.json(jsonpath,function(json) {
		var max_weight = -1;
		var min_weight = json.clusters[0].total_activity;

		json.clusters.forEach(function(cluster) {
			initPhrases[index] = cluster.phrases[0];
			initWeight[index] = cluster.total_activity;
			max_weight = cluster.total_activity > max_weight? cluster.total_activity : max_weight;
			min_weight = cluster.total_activity < min_weight? cluster.total_activity : min_weight;
			index += 1;
		})

		var size_scale = d3.scale.linear()
			.domain([min_weight, max_weight])
			.range([13, 60])
		
		index = 0;
		d3.layout.cloud().size([width, height])
			.words(initPhrases.map(function(d) {
				return {text: d, size: size_scale(initWeight[index++])};
			}))
			.rotate(function() { return 0; })
			.font("Impact")
			.fontSize(function(d) { return d.size; })
			.on("end", draw_cloud)
			.start();
	})

}

function draw_cloud(words) {
    d3.select(".cloud").append("svg")
        .attr("width", width)
        .attr("height", height)
		.attr("class", "cloud")
		.append("g")
        .attr("transform", "translate("+width/2+","+height/2+")")
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
