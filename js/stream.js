var width = 1000;
var height = 600;
var padding = 40;
var colors = d3.scale.category20b();

var x, y, xAxis, yAxis, svg, area, stack, raw_layers;

function make_stream(jsonpath, reddit_name) {
	d3.json(jsonpath, function(json) {

		stack = d3.layout.stack()
			.offset("expand")
			.values(function(d) { return d.values; });

		raw_layers = json.clusters;
		var layers = stack(raw_layers);

		layers.forEach(function(layer) {
			layer.color = colors(layer.id);
		})

		set_scales(layers);

		area = d3.svg.area()
			.x(function(d) { return x(d.x); })
			.y0(function(d) { return y(d.y0); })
			.y1(function(d) { return y(d.y0 + d.y); });
		
		d3.select(".redditname").text("/r/" + reddit_name + " > ");

		svg = d3.select(".stream").append("svg")
			.attr("width", width)
			.attr("height", height)
			.attr("class", "stream");

		draw_layers(layers);

	})	
}

function draw_layers(layers) {
	svg.selectAll(".layer")
		.data(layers)
		.enter().append("path")
		.attr("d", function(d) { return area(d.values);})
		.attr("class",  "layer")
		.style("fill", function(d) { return d.color })
		.on("click", function(d) { change_layers([layers[d.id]]);})
		.on("mouseover", function(d) { 
			d3.select(".topicname")
				.text(d.phrases[0])
				.style("color", d.color); 
		})
		.append("title")
		.text(function(d) { return d.phrases });

	draw_axes(svg);
}

function change_layers(new_layers) {
	stack.offset("zero");

	new_layers = stack(new_layers);
	
	set_scales(new_layers);

	var nodes = d3.selectAll("path")
		.data(new_layers, function(d) { return d.id;});

	nodes.transition()
		.duration(2500)
		.attr("d", function(d) { return area(d.values); });
	
	nodes.exit()
		.remove();
	
	draw_axes(svg);
}


function set_scales(layers) {
	var min_x = d3.min(layers, function(layer) { return d3.min(layer.values, function(d) { return d.x;}) })
	var max_x =  d3.max(layers, function(layer) { return d3.max(layer.values, function(d) { return d.x;}) });
	
	var max_y =  d3.max(layers, function(layer) { return d3.max(layer.values, function(d) { return d.y + d.y0;}) });
	
	// x and y scale mappings
	x = d3.scale.linear()
		.domain([min_x, max_x])
		.range([padding, width - padding]);
	
	y = d3.scale.linear()
		.domain([0, max_y])
		.range([height - padding, padding]);
	
	// a date formatter for the x axis in the graph
	var formatDate = function(time) {
		var spec = d3.time.format("%m/%d/%y");
		return spec(new Date(time * 1000));
	}
	
	xAxis = d3.svg.axis()
		.scale(x).orient("bottom")
		.tickFormat(formatDate);
	
	yAxis = d3.svg.axis()
		.scale(y).orient("left");
}

var draw_axes = function(svg) {
	d3.selectAll("g").remove()
	
	svg.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(0," + (height - padding) + ")")
		.call(xAxis);
	
	svg.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(" + padding + ",0)")
		.call(yAxis);
}
