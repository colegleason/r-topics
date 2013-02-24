var fill = d3.scale.category20();

var width = 1000;
var height = 700;

function make_stream(jsonpath) {
	d3.json(jsonpath, function(json) {

		var stack = d3.layout.stack()
			.values(function (layer) {
				return layer.values;
			});

		var layers = stack(json.clusters);

		var min_x = d3.min(json.clusters, function(layer) { return d3.min(layer.values, function(d) { return d.x;}) })
		var max_x =  d3.max(json.clusters, function(layer) { return d3.max(layer.values, function(d) { return d.x;}) });

		var max_y =  d3.max(json.clusters, function(layer) { return d3.max(layer.values, function(d) { return d.y;}) });

		var x = d3.scale.linear()
			.domain([min_x, max_x])
			.range([0, width]);
	
		var y = d3.scale.linear()
			.domain([0, max_y])
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
			.attr("d", function(d) { return area(d.values);})
			.style("fill", function() { return color(Math.random()); })
			.append("title")
			.text(function(d) { return d.phrases; });;	
	})	
}

function make_cloud(jsonpath) {
	var initPhrases = new Array();
	var index = -1;

	d3.json(jsonpath,function(json) {
		json.clusters.forEach(function(cluster) {
			cluster.phrases.forEach(function(phrase) {
				//console.log(phrase)
				index +=1;
				//console.log(index);
				initPhrases[index] = phrase;
				//console.log(initPhrases[index]);
			})
		})
	})

	d3.layout.cloud().size([width, height])
		.initPhrases.map(function(d) {
			return {text: d, size: 10 + Math.random() * 90};
		})
		.font("Impact")
		.fontSize(function(d) { return d.size; })
		.on("end", draw)
		.start();
	//console.log(initPhrases);
}
	//return initPhrases

/*	d3.layout.cloud().size([width, height])
		.words(d3.json(jsonpath, function(json) {
			initPhrases.map(function(d) {
				return {text: d, size: 10 + Math.random() * 90};
			})
		}))
		.font("Impact")
		.fontSize(function(d) { return d.size; })
		.on("end", draw)
		.start();
}*/

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

