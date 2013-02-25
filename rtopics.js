var width = 1000;
var height = 600;

function make_stream(jsonpath) {
	d3.json(jsonpath, function(json) {

		var stack = d3.layout.stack()
			.offset("zero")
			.values(function (layer) {
				return layer.values;
			});

		var layers = stack(json.clusters);
		var x, y, xAxis, yAxis;
		var padding = 35;

		var set_scales = function(layers) {
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
				var spec = d3.time.format("%e %B %Y");
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

		set_scales(layers);

		var area = d3.svg.area()
			.x(function(d) { return x(d.x); })
			.y0(function(d) { return y(d.y0); })
			.y1(function(d) { return y(d.y0 + d.y); });
		
		d3.select("svg").remove() // remove the current graph if it exits

		var svg = d3.select("body").append("svg")
			.attr("width", width)
			.attr("height", height)
			.attr("class", "stream");

		var curr_color = 0;
		
		var color = d3.scale.category20b();

		var redraw = function(new_layers) {
			set_scales(new_layers);
			var nodes = d3.selectAll("path")
				.data(new_layers);

			nodes.transition()
				.duration(2500)
				.attr("d", function(d) { return area(d.values); });

			nodes.exit()
				.remove();

			draw_axes(d3.select("svg"));

		}

		svg.selectAll("path")
			.data(layers)
			.enter().append("path")
			.attr("d", function(d) { return area(d.values);})
			.style("fill", function() { return color(curr_color++); })
			.on("click", function(d) { redraw(stack([layers[d.id]]));})
			.append("title")
			.text(function(d) { return d.phrases; });

			draw_axes(svg);
	})	
}