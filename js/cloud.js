var fill = d3.scale.category20b();

var width = 1000;
var height = 600;

function make_cloud(jsonpath) {
	var initPhrases = new Array();
	var index = -1;

	d3.json(jsonpath,function(json) {
		json.clusters.forEach(function(cluster) {
			cluster.phrases.forEach(function(phrase) {
				index +=1;
				initPhrases[index] = phrase;
			})
		})
		d3.layout.cloud().size([width, height])
			.words(initPhrases.map(function(d) {
				return {text: d, size: 20};
			}))
			.rotate(function() { return 0; })
			.font("Impact")
			.fontSize(function(d) { return d.size; })
			.on("end", draw_cloud)
			.start();
	})

}

function draw_cloud(words) {
    d3.select("body").append("svg")
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
