var fill = d3.scale.category20();

var width = 800;
var height = 600;

function make_stream(filename) {
	var graph = d3.csv(csvpath, function(data) {
		data.forEach(function(d) {
			d.date = format.parse(d.date);
			d.value = d.value;
		})
	})
}

function make_cloud(words) {
	d3.layout.cloud().size([width, height])
		.words(words.map(function(d) {
			return {text: d, size: 10 + Math.random() * 90};
		}))
		.font("Impact")
		.fontSize(function(d) { return d.size; })
		.on("end", draw)
		.start();
}

function draw(words) {
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

