var fill = d3.scale.category20();

var width = 1000;
var height = 600;

function make_cloud(jsonpath) {
	var initPhrases = new Array();
	var initWeights = new Array();
	var index = -1;

	d3.json(jsonpath,function(json) {
		json.clusters.forEach(function(cluster) {
			index +=1;
			cluster.total_activity.forEach(function(activity) {
				initWeights[index] = activity;
			})
			cluster.phrases.forEach(function(phrase) {
				initPhrases[index] = phrase;
				//console.log('initWeights[index]');
			})
		})
		index = -1;
		d3.layout.cloud().size([width, height])
			.words(initPhrases.map(function(d) {
				index +=1;
				return {text: d, size: initWeights[index]};
			}))
			.rotate(function() { return ~~(Math.random() * 2) * 90; })
			.font("Impact")
			.fontSize(function(d) { return d.size; })
			.on("end", draw)
			.start();
	})

}

function draw(words) {
	d3.select("svg").remove() // remove the current graph if it exits

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
