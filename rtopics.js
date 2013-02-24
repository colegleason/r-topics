var fill = d3.scale.category20();

var width = 800;
var height = 600;

function make_stream(jsonpath) {
	var stack = d3.layout.stack()
		.offset("wiggle")
		.values(function(d) {return d.values;});

	d3.json(jsonpath, function(json) {
		var layers = [];
		console.log(layers);

		d3.layout.stack(layers);

		var x = d3.scale.linear()
			.domain([d3.min(layers, function(layer) { return d3.min(layer, function(d) { return d.x;}) }), 
					 d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d.x;}) })
					])
			.range([0, width]);
	
		var y = d3.scale.linear()
			.domain([0, d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d.y0 + d.y; }); })])
			.range([height, 0]);
		
		var color = d3.scale.linear()
			.range(["#aad", "#556"]);
		
		var area = d3.svg.area()
			.x(function(d) { return x(d.x); })
			.y0(function(d) { return y(d.y0); })
			.y1(function(d) { return y(d.y0 + d.y); });
		
		var svg = d3.select("body").append("svg")
			.attr("width", width)
			.attr("height", height);
		
		svg.selectAll("path")
			.data(layers)
			.enter().append("path")
			.attr("d", area)
			.style("fill", function() { return color(Math.random()); });
		
	})
	
	
}

function make_cloud(jsonpath) {
	d3.layout.cloud().size([width, height])
		.words(d3.json(jsonpath, function(json) {
			json.phrases.map(function(d) {
				return {text: d, size: 10 + Math.random() * 90};
			})
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

