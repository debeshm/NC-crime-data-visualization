
	// set the dimensions and margins of the graph
	var margin = {top: 80, right: 20, bottom: 30, left: 40},
	width = 960 - margin.left - margin.right,
	height = 500 - margin.top - margin.bottom;
	simulation_global=0;

	// set the ranges
	var x = d3.scaleBand()
				.range([0, width])
				.padding(0.1);
	var y = d3.scaleLinear()
				.range([height, 0]);

	var binned_json=[{}];
	var bin_s=1;

	var colors =  ['#9999cc','#613505','blue','red','#006837','orange','#910868', '#aea30a', '#079290', '#661805', '#910868'];

	var svg = d3.select("body").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform",
		"translate(" + margin.left + "," + margin.top + ")");


		csv_data='';
		d3.csv("Crime.csv", function(error, data) {
			if(error){
				console.log(error);
				throw error;
			}
			console.log(data);
			csv_data=data;

			max=0
			min=100000
			data.forEach(function(d) {
				d.crmrte = +d.crmrte;
				if(d.crmrte>max){
					max=d.crmrte;
				}
				if(d.crmrte<min){
					min=d.crmrte
				}
			});
			console.log(max);
			console.log(min);

			bin_size=Math.ceil((max-min)/0.020);
			console.log(bin_size);

			binned_data_x=['0.000-0.020', '0.021-0.040', '0.041-0.060', '0.061-0.080', '0.081-0.100', '0.101-0.120', '0.121-0.140', '0.141-0.160', '0.161-0.180'];

			binned_data_y=[0, 0, 0, 0, 0, 0, 0, 0, 0];


			data.forEach(function(d){
				binned_data_y[Math.floor((d.crmrte-min)/0.020)]++;
			});

			console.log(binned_data_y);
			console.log(binned_data_x[0]);
			//binned_json=[{x:binned_data_x[0], y:binned_data_y[0]}];
			binned_json=binned_json.concat([{x:binned_data_x[0], y:binned_data_y[0]}]);
			for(i=1;i<=9;++i){
				binned_json=binned_json.concat([{x:binned_data_x[i], y:binned_data_y[i]}]);
			}
			binned_json.shift();

			console.log(binned_json);


			// Scale the range of the data in the domains
			x.domain(binned_json.map(function(d) { return d.x; }));
			y.domain([0, d3.max(binned_json, function(d) { return d.y; })]);

			// append the rectangles for the bar chart
			svg.selectAll(".bar")
				.data(binned_json)
				.enter().append("rect")
				.attr("class", "bar")
				.on("mouseover", onMouseOver)
				.on("mouseout", onMouseOut)
				.attr("x", function(d) { return  x(d.x); })
				.attr("width", x.bandwidth())
				.transition()
				.ease(d3.easeLinear)
				.duration(400)
				.delay(function (d, i) {
					 return i * 50;
				 })
				.attr("y", function(d) { return y(d.y); })
				.style("fill",function(d,i)
				{
					return colors[i];
				})
				.attr("height", function(d) { return height - y(d.y); });

			// add the x Axis
			svg.append("g")
				.attr("transform", "translate(0," + height + ")")
				.call(d3.axisBottom(x));

			// add the y Axis
			svg.append("g")
				.call(d3.axisLeft(y));
			});


			var svg2 = d3.select("body").append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.append("g")
				.attr("transform",
				"translate(" + 350 + "," + margin.top + ")");


			var x_slider = d3.scaleLinear()
			    .domain([0, 100])
			    .range([0, 150])
			    .clamp(true);

			var height_slider=1;
			var slider = svg2.append("g")
			    .attr("class", "slider")
			    .attr("transform", "translate(" + margin.left + "," + height_slider + ")");

			slider.append("line")
			    .attr("class", "track")
			    .attr("x1", x_slider.range()[0])
			    .attr("x2", x_slider.range()[1])
			  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
			    .attr("class", "track-inset")
			  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
			    .attr("class", "track-overlay")
			    .call(d3.drag()
			        .on("start.interrupt", function() { slider.interrupt(); })
			        .on("start drag", function() { hue(x_slider.invert(d3.event.x)); }));

			var handle = slider.insert("circle", ".track-overlay")
			    .attr("class", "handle")
			    .attr("r", 9);


			slider.transition() // Gratuitous intro!
			    .duration(750)
			    .tween("hue", function() {
			      var i = d3.interpolate(0, 100);
			      return function(t) { hue(i(t)); };
			    });

			function hue(h) {
			  handle.attr("cx", x_slider(h));
				bin_s=h/100;
				var ul = document.getElementById("menu");
				var items = ul.getElementsByTagName("a");

				for (var i = 0; i < items.length; ++i) {
					if(document.getElementById('head').innerText=="Percentage of young males")
					{
							transition_bars_pctymle2(h/100);
							break;
					}
					if(document.getElementById('head').innerText=="Average sentence days")
					{
							transition_bars_avgsendays2(h/100);
							break;
					}
					if(document.getElementById('head').innerText=="Per capita tax revenue")
					{
							transition_bars_taxpc2(h/100);
							break;
					}
					if(document.getElementById('head').innerText=="Population density")
					{
							transition_bars_taxpc2(h/100);
							break;
					}

					if(document.getElementById('head').innerText=="Probability of prisonment")
					{
							transition_bars_prbpris2(h/100);
							break;
					}

					if(document.getElementById('head').innerText=="Percent of minorities")
					{
							transition_bars_pctmin2(h/100);
							break;
					}

					if(document.getElementById('head').innerText=="Probability of arrests")
					{
							transition_bars_prbarr2(h/100);
							break;
					}

					if(document.getElementById('head').innerText=="Probability of conviction")
					{
							transition_bars_prbconv2(h/100);
							break;
					}

					if(document.getElementById('head').innerText=="Police per capita")
					{
							transition_bars_polpc2(h/100);
							break;
					}

					if(document.getElementById('head').innerText=="Crime Rates (North Carolina)")
					{
							transition_bars_crmrte2(h/100);
							break;
					}
				}
				//transition_bars_pctymle(h/100)

			}

			function dragstarted(d) {
			  if (!d3.event.active) simulation_global.alphaTarget(0.3).restart();
			  d.fx = d.x;
			  d.fy = d.y;
			}

			function dragged(d) {
			  d.fx = d3.event.x;
			  d.fy = d3.event.y;
			}

			function dragended(d) {
			  if (!d3.event.active) simulation_global.alphaTarget(0);
			  d.fx = null;
			  d.fy = null;
			}


			function onMouseOver(d, i) {
	        d3.select(this).attr('class', 'highlight'); // this, is the object that "owns" the JavaScript code
	         //selected bar (given by the 'this' object) d3.select(this) creates a 1-element selection containing the current node
	        d3.select(this)
	          .transition()     // adds animation
	          .duration(400)
	          .attr('width', x.bandwidth() + 7)
	          .attr("y", function(d) { return y(d.y) - 10; })
	          .attr("height", function(d) { return height - y(d.y) + 10; });

	        svg.append("text")
	         .attr('class', 'val')
	         .attr('x', function() {
	             return x(d.x);
	         })
	         .attr('y', function() {
	             return y(d.y) - 15;
	         })
	         .text(function() {
	             return "Value: "+[+d.y];  // Value of the text
	         });
	    }

	    //mouseout event handler function
	    function onMouseOut(d, i) {
	        // use the text label class to remove label on mouseout
	        d3.select(this).attr('class', 'bar');
	        d3.select(this)
	          .transition()     // adds animation
	          .duration(400)
	          .attr('width', x.bandwidth())
	          .attr("y", function(d) { return y(d.y); }) // What if we don't again fix this Value ?
	          .attr("height", function(d) { return height - y(d.y); }); // Play with changing the Value

	        d3.selectAll('.val')
	          .remove()
	    }


		function transition_bars_avgsendays()
		{
			document.getElementById('head').innerText="Average sentence days";

			svg.selectAll('text').remove();
			svg.selectAll('g').remove();
			max=0
			min=100000
			csv_data.forEach(function(d) {
				d.avgsen = +d.avgsen;
				if(d.avgsen>max){
					max=d.avgsen;
				}
				if(d.avgsen<min){
					min=d.avgsen
				}
			});
			console.log(max);
			console.log(min);

			binned_data_x=['4.2-6.4', '6.4-8.6', '8.6-10.8', '10.8-13', '13-15.2', '15.2-17.4', '17.4-19.6', '19.6-21.8', '21.8-24', '24-26.2'];

			binned_data_y=[0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

			csv_data.forEach(function(d){
				binned_data_y[Math.floor((d.avgsen-min)/2.2)]++;
			});
			binned_Accept=[{}]
			binned_Accept=binned_Accept.concat([{x:binned_data_x[0], y:binned_data_y[0]}]);
			for(i=1;i<=Math.floor(9*bin_s);++i){
				binned_Accept=binned_Accept.concat([{x:binned_data_x[i], y:binned_data_y[i]}]);
			}
			binned_Accept.shift();
			console.log(binned_Accept);

			if(document.getElementById('pie_button').checked)
			{
				svg.selectAll("*").remove();
								//var width = 300,
							// Think back to 5th grade. Radius is 1/2 of the diameter. What is the limiting factor on the diameter? Width or height, whichever is smaller
						radius = Math.min(width, height) / 2;

					  var pie = d3.pie()
						.value(function(d) { return d.y; })(binned_Accept);

					  var arc = d3.arc()
						.outerRadius(radius - 10)
						.innerRadius(0);

						var labelArc = d3.arc()
							.outerRadius(radius - 40)
							.innerRadius(radius - 40);

				    var g = svg.selectAll("arc")
				    	.data(pie)
				    	.enter().append("g")
				    	.attr("class", "arc")
							.attr('transform', 'translate(' + width/2 +  ',' + height/2 +')');

						 g.append("path")
							.attr("d", arc)
							.on("mouseover",function(d,i) {
             g.append("text")
                .attr("dy", ".5em")
								.attr('stroke', 'black')
                .style("text-anchor", "middle")
								.style("font-size", 40)
                .style("fill", function(d,i){return "white";})
                .text("Value: "+d.data.y)
            })
						.on("mouseout", function(d) {

                g.select("text").remove();
            })
							.style("fill", function(d, i) { return colors[i];});


							var legendRectSize = 18;                                  // NEW
						  var legendSpacing = 4;

						  var legend = svg.selectAll('.legend')                     // NEW
						  .data(binned_data_x)                                   // NEW
						  .enter()                                                // NEW
						  .append('g')                                            // NEW
						  .attr('class', 'legend')                                // NEW
						  .attr('transform', function(d, i) {                     // NEW
						    var height = legendRectSize + legendSpacing;          // NEW
						    var offset =  height * colors.length / 2;     // NEW
						    var horz = 700+legendRectSize;                       // NEW
						    var vert = i * height +90;                       // NEW
						    return 'translate(' + horz + ',' + vert + ')';        // NEW
						  });                                                     // NEW
						legend.append('rect')                                     // NEW
						  .attr('width', legendRectSize)                          // NEW
						  .attr('height', legendRectSize)                         // NEW
						  .style('fill', function(d, i) { return colors[i];})                                   // NEW
						  .style('stroke', 'black');                                // NEW
						legend.append('text')                                     // NEW
						  .attr('x', legendRectSize + legendSpacing)              // NEW
						  .attr('y', legendRectSize - legendSpacing)
							.style("fill", function(d,i){return "black";})          // NEW
						  .text(function(d) { return d; });

				return;
			}

			if(document.getElementById('fdl_button').checked)
			{

				var color = d3.scaleOrdinal(d3.schemeCategory20);

				var simulation = d3.forceSimulation()
						.force("link", d3.forceLink().id(function(d) { return d.id; }))
						.force("charge", d3.forceManyBody())
						.force("center", d3.forceCenter(width / 2, height / 2));
				simulation_global=simulation

				d3.json("avgsen_fdl.json", function(error, graph) {
					if (error)
					{
						console.log(error)
						throw error;
					}

					var link = svg.append("g")
						.attr("class", "links")
						.selectAll("line")
						.data(graph.links)
						.enter().append("line")
						.attr("stroke-width", function(d) { return 1; });

					var node = svg.append("g")
						.attr("class", "nodes")
						.selectAll("g")
						.data(graph.nodes)
						.enter().append("g")

					var circles = node.append("circle")
						.attr("r", 5)
						.attr("fill", function(d) { return color(d.group); })
						.call(d3.drag()
								.on("start", dragstarted)
								.on("drag", dragged)
								.on("end", dragended));


					var lables = node.append("text")
					.style("font-size", "10px")
							.text(function(d) {
								return d.id;
							})
							.attr('x', 6)
							.attr('y', 3);


					node.append("title")
							.text(function(d) { return d.id; });

					simulation
							.nodes(graph.nodes)
							.on("tick", ticked);

					simulation.force("link")
							.links(graph.links);

					function ticked() {
						link
								.attr("x1", function(d) { return d.source.x; })
								.attr("y1", function(d) { return d.source.y; })
								.attr("x2", function(d) { return d.target.x; })
								.attr("y2", function(d) { return d.target.y; });

						node
								.attr("transform", function(d) {
									return "translate(" + d.x + "," + d.y + ")";
								})
					}
				});

				return;
			}

			// Scale the range of the data in the domains
			x.domain(binned_Accept.map(function(d) { return d.x; }));
			y.domain([0, d3.max(binned_Accept, function(d) { return d.y; })]);

			//Update all rects
      svg.selectAll("rect")
          .data(binned_Accept)
					.transition()
          .delay(function(d, i) {
              return i * 100;
          })
					.duration(1000)
					.ease(d3.easeBounceOut)
          .attr("y", function(d) {
              return y(d.y);
          })
          .attr("height", function(d) {
              return height-y(d.y);
          })
          .attr("fill", function(d, i) {
              return colors[i];
          });
					// add the x Axis
					svg.append("g")
						.attr("transform", "translate(0," + height + ")")
						.call(d3.axisBottom(x));

					// add the y Axis
					svg.append("g")
						.call(d3.axisLeft(y));

		}



		function transition_bars_density()
		{
			document.getElementById('head').innerText="Population density";

			svg.selectAll('text').remove();
			svg.selectAll('g').remove();
			max=0
			min=100000
			csv_data.forEach(function(d) {
				d.density = +d.density;
				if(d.density>max){
					max=d.density;
				}
				if(d.density<min){
					min=d.density
				}
			});
			console.log(max);
			console.log(min);

			binned_data_x=['0-1', '1-2', '2-3', '3-4', '4-5', '5-6', '6-7', '7-8', '8-9', '9-10'];

			binned_data_y=[0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

			csv_data.forEach(function(d){
				binned_data_y[Math.floor((d.density-min)/1)]++;
			});
			binned_Accept=[{}]
			binned_Accept=binned_Accept.concat([{x:binned_data_x[0], y:binned_data_y[0]}]);
			for(i=1;i<=Math.floor(9*bin_s);++i){
				binned_Accept=binned_Accept.concat([{x:binned_data_x[i], y:binned_data_y[i]}]);
			}
			binned_Accept.shift();
			console.log(binned_Accept);

			if(document.getElementById('pie_button').checked)
			{
				svg.selectAll("*").remove();
								//var width = 300,
							// Think back to 5th grade. Radius is 1/2 of the diameter. What is the limiting factor on the diameter? Width or height, whichever is smaller
							radius = Math.min(width, height) / 2;

							var pie = d3.pie()
							.value(function(d) { return d.y; })(binned_Accept);

							var arc = d3.arc()
							.outerRadius(radius - 10)
							.innerRadius(0);

						var labelArc = d3.arc()
							.outerRadius(radius - 40)
							.innerRadius(radius - 40);

								var g = svg.selectAll("arc")
									.data(pie)
									.enter().append("g")
									.attr("class", "arc")
									.attr('transform', 'translate(' + width/2 +  ',' + height/2 +')');

									g.append("path")
							.attr("d", arc)
							.on("mouseover",function(d,i) {
             g.append("text")
                .attr("dy", ".5em")
								.attr('stroke', 'black')
                .style("text-anchor", "middle")
								.style("font-size", 40)
                .style("fill", function(d,i){return "white";})
                .text("Value: "+d.data.y)
            })
						.on("mouseout", function(d) {

                g.select("text").remove();
            })
							.style("fill", function(d, i) { return colors[i];});

							var legendRectSize = 18;                                  // NEW
						  var legendSpacing = 4;

						  var legend = svg.selectAll('.legend')                     // NEW
						  .data(binned_data_x)                                   // NEW
						  .enter()                                                // NEW
						  .append('g')                                            // NEW
						  .attr('class', 'legend')                                // NEW
						  .attr('transform', function(d, i) {                     // NEW
						    var height = legendRectSize + legendSpacing;          // NEW
						    var offset =  height * colors.length / 2;     // NEW
						    var horz = 700+legendRectSize;                       // NEW
						    var vert = i * height +90;                       // NEW
						    return 'translate(' + horz + ',' + vert + ')';        // NEW
						  });                                                     // NEW
						legend.append('rect')                                     // NEW
						  .attr('width', legendRectSize)                          // NEW
						  .attr('height', legendRectSize)                         // NEW
						  .style('fill', function(d, i) { return colors[i];})                                   // NEW
						  .style('stroke', 'black');                                // NEW
						legend.append('text')                                     // NEW
						  .attr('x', legendRectSize + legendSpacing)              // NEW
						  .attr('y', legendRectSize - legendSpacing)
							.style("fill", function(d,i){return "black";})          // NEW
						  .text(function(d) { return d; });

				return;
			}

			// Scale the range of the data in the domains
			x.domain(binned_Accept.map(function(d) { return d.x; }));
			y.domain([0, d3.max(binned_Accept, function(d) { return d.y; })]);

			//Update all rects
      svg.selectAll("rect")
          .data(binned_Accept)
					.transition()
          .delay(function(d, i) {
              return i * 100;
          })
					.duration(1000)
					.ease(d3.easeBounceOut)
          .attr("y", function(d) {
              return y(d.y);
          })
          .attr("height", function(d) {
              return height-y(d.y);
          })
          .attr("fill", function(d, i) {
              return colors[i];
          });
					// add the x Axis
					svg.append("g")
						.attr("transform", "translate(0," + height + ")")
						.call(d3.axisBottom(x));

					// add the y Axis
					svg.append("g")
						.call(d3.axisLeft(y));

		}





//*************************
function transition_bars_crmrte()
{
	document.getElementById('head').innerText="Crime Rates (North Carolina)";

	svg.selectAll('text').remove();
	svg.selectAll('g').remove();
	max=0
	min=100000
	csv_data.forEach(function(d) {
		d.crmrte = +d.crmrte;
		if(d.crmrte>max){
			max=d.crmrte;
		}
		if(d.crmrte<min){
			min=d.crmrte
		}
	});
	console.log(max);
	console.log(min);

	binned_data_x=['0.000-0.020', '0.021-0.040', '0.041-0.060', '0.061-0.080', '0.081-0.100', '0.101-0.120', '0.121-0.140', '0.141-0.160', '0.161-0.180'];

	binned_data_y=[0, 0, 0, 0, 0, 0, 0, 0, 0];

	csv_data.forEach(function(d){
		binned_data_y[Math.floor((d.crmrte-min)/0.020)]++;
	});
	binned_Accept=[{}]
	binned_Accept=binned_Accept.concat([{x:binned_data_x[0], y:binned_data_y[0]}]);
	for(i=1;i<=Math.floor(9*bin_s);++i){
		binned_Accept=binned_Accept.concat([{x:binned_data_x[i], y:binned_data_y[i]}]);
	}
	binned_Accept.shift();
	console.log(binned_Accept);

	if(document.getElementById('pie_button').checked)
	{
		svg.selectAll("*").remove();
						//var width = 300,
					// Think back to 5th grade. Radius is 1/2 of the diameter. What is the limiting factor on the diameter? Width or height, whichever is smaller
					radius = Math.min(width, height) / 2;

					var pie = d3.pie()
					.value(function(d) { return d.y; })(binned_Accept);

					var arc = d3.arc()
					.outerRadius(radius - 10)
					.innerRadius(0);

				var labelArc = d3.arc()
					.outerRadius(radius - 40)
					.innerRadius(radius - 40);

						var g = svg.selectAll("arc")
							.data(pie)
							.enter().append("g")
							.attr("class", "arc")
							.attr('transform', 'translate(' + width/2 +  ',' + height/2 +')');

							g.append("path")
					.attr("d", arc)
					.on("mouseover",function(d,i) {
				 g.append("text")
						.attr("dy", ".5em")
						.attr('stroke', 'black')
						.style("text-anchor", "middle")
						.style("font-size", 40)
						.style("fill", function(d,i){return "white";})
						.text("Value: "+d.data.y)
				})
				.on("mouseout", function(d) {

						g.select("text").remove();
				})
					.style("fill", function(d, i) { return colors[i];});

					var legendRectSize = 18;                                  // NEW
					var legendSpacing = 4;

					var legend = svg.selectAll('.legend')                     // NEW
					.data(binned_data_x)                                   // NEW
					.enter()                                                // NEW
					.append('g')                                            // NEW
					.attr('class', 'legend')                                // NEW
					.attr('transform', function(d, i) {                     // NEW
						var height = legendRectSize + legendSpacing;          // NEW
						var offset =  height * colors.length / 2;     // NEW
						var horz = 700+legendRectSize;                       // NEW
						var vert = i * height +90;                       // NEW
						return 'translate(' + horz + ',' + vert + ')';        // NEW
					});                                                     // NEW
				legend.append('rect')                                     // NEW
					.attr('width', legendRectSize)                          // NEW
					.attr('height', legendRectSize)                         // NEW
					.style('fill', function(d, i) { return colors[i];})                                   // NEW
					.style('stroke', 'black');                                // NEW
				legend.append('text')                                     // NEW
					.attr('x', legendRectSize + legendSpacing)              // NEW
					.attr('y', legendRectSize - legendSpacing)
					.style("fill", function(d,i){return "black";})          // NEW
					.text(function(d) { return d; });

		return;
	}

	// Scale the range of the data in the domains
	x.domain(binned_Accept.map(function(d) { return d.x; }));
	y.domain([0, d3.max(binned_Accept, function(d) { return d.y; })]);

	//Update all rects
	svg.selectAll("rect")
			.data(binned_Accept)
			.transition()
			.delay(function(d, i) {
					return i * 100;
			})
			.duration(1000)
			.ease(d3.easeBounceOut)
			.attr("y", function(d) {
					return y(d.y);
			})
			.attr("height", function(d) {
					return height-y(d.y);
			})
			.attr("fill", function(d, i) {
					return colors[i];
			});
			// add the x Axis
			svg.append("g")
				.attr("transform", "translate(0," + height + ")")
				.call(d3.axisBottom(x));

			// add the y Axis
			svg.append("g")
				.call(d3.axisLeft(y));

}

//*************************









				function transition_bars_prbpris()
				{
					document.getElementById('head').innerText="Probability of prisonment";


					svg.selectAll('text').remove();
					svg.selectAll('g').remove();
					max=0
					min=100000
					csv_data.forEach(function(d) {
						d.prbpris = +d.prbpris;
						if(d.prbpris>max){
							max=d.prbpris;
						}
						if(d.prbpris<min){
							min=d.prbpris
						}
					});
					console.log(max);
					console.log(min);

					binned_data_x=['0.00-0.10', '0.10-0.20', '0.20-0.30', '0.30-0.40', '0.40-0.50', '0.50-0.60', '0.60-0.70', '0.70-0.80', '0.80-0.90', '0.90-1.00'];

					binned_data_y=[0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

					csv_data.forEach(function(d){
						binned_data_y[Math.floor((d.prbpris-min)/0.10)]++;
					});
					binned_Accept=[{}]
					binned_Accept=binned_Accept.concat([{x:binned_data_x[0], y:binned_data_y[0]}]);
					for(i=1;i<=Math.floor(9*bin_s);++i){
						binned_Accept=binned_Accept.concat([{x:binned_data_x[i], y:binned_data_y[i]}]);
					}
					binned_Accept.shift();
					console.log(binned_Accept);

					if(document.getElementById('pie_button').checked)
					{
						svg.selectAll("*").remove();

									// Think back to 5th grade. Radius is 1/2 of the diameter. What is the limiting factor on the diameter? Width or height, whichever is smaller
									radius = Math.min(width, height) / 2;

									var pie = d3.pie()
									.value(function(d) { return d.y; })(binned_Accept);

									var arc = d3.arc()
									.outerRadius(radius - 10)
									.innerRadius(0);

								var labelArc = d3.arc()
									.outerRadius(radius - 40)
									.innerRadius(radius - 40);

										var g = svg.selectAll("arc")
											.data(pie)
											.enter().append("g")
											.attr("class", "arc")
											.attr('transform', 'translate(' + width/2 +  ',' + height/2 +')');

											g.append("path")
									.attr("d", arc)
									.on("mouseover",function(d,i) {
		             g.append("text")
		                .attr("dy", ".5em")
										.attr('stroke', 'black')
		                .style("text-anchor", "middle")
										.style("font-size", 40)
		                .style("fill", function(d,i){return "white";})
		                .text("Value: "+d.data.y)
		            })
								.on("mouseout", function(d) {

		                g.select("text").remove();
		            })
									.style("fill", function(d, i) { return colors[i];});

									var legendRectSize = 18;                                  // NEW
								  var legendSpacing = 4;

								  var legend = svg.selectAll('.legend')                     // NEW
								  .data(binned_data_x)                                   // NEW
								  .enter()                                                // NEW
								  .append('g')                                            // NEW
								  .attr('class', 'legend')                                // NEW
								  .attr('transform', function(d, i) {                     // NEW
								    var height = legendRectSize + legendSpacing;          // NEW
								    var offset =  height * colors.length / 2;     // NEW
								    var horz = 700+legendRectSize;                       // NEW
								    var vert = i * height +90;                       // NEW
								    return 'translate(' + horz + ',' + vert + ')';        // NEW
								  });                                                     // NEW
								legend.append('rect')                                     // NEW
								  .attr('width', legendRectSize)                          // NEW
								  .attr('height', legendRectSize)                         // NEW
								  .style('fill', function(d, i) { return colors[i];})                                   // NEW
								  .style('stroke', 'black');                                // NEW
								legend.append('text')                                     // NEW
								  .attr('x', legendRectSize + legendSpacing)              // NEW
								  .attr('y', legendRectSize - legendSpacing)
									.style("fill", function(d,i){return "black";})          // NEW
								  .text(function(d) { return d; });

						return;
					}

					if(document.getElementById('fdl_button').checked)
					{

						var color = d3.scaleOrdinal(d3.schemeCategory20);

						var simulation = d3.forceSimulation()
								.force("link", d3.forceLink().id(function(d) { return d.id; }))
								.force("charge", d3.forceManyBody())
								.force("center", d3.forceCenter(width / 2, height / 2));
						simulation_global=simulation

						d3.json("prbpris_fdl.json", function(error, graph) {
							if (error)
							{
								console.log(error)
								throw error;
							}

							var link = svg.append("g")
									.attr("class", "links")
								.selectAll("line")
								.data(graph.links)
								.enter().append("line")
									.attr("stroke-width", function(d) { return 1; });

							var node = svg.append("g")
									.attr("class", "nodes")
								.selectAll("g")
								.data(graph.nodes)
								.enter().append("g")

							var circles = node.append("circle")
									.attr("r", 5)
									.attr("fill", function(d) { return color(d.group); })
									.call(d3.drag()
											.on("start", dragstarted)
											.on("drag", dragged)
											.on("end", dragended));


							var lables = node.append("text")
							.style("font-size", "10px")
									.text(function(d) {
										return d.id;
									})
									.attr('x', 6)
									.attr('y', 3);


							node.append("title")
									.text(function(d) { return d.id; });

							simulation
									.nodes(graph.nodes)
									.on("tick", ticked);

							simulation.force("link")
									.links(graph.links);

							function ticked() {
								link
										.attr("x1", function(d) { return d.source.x; })
										.attr("y1", function(d) { return d.source.y; })
										.attr("x2", function(d) { return d.target.x; })
										.attr("y2", function(d) { return d.target.y; });

								node
										.attr("transform", function(d) {
											return "translate(" + d.x + "," + d.y + ")";
										})
							}
						});

						return;
					}


					// Scale the range of the data in the domains
					x.domain(binned_Accept.map(function(d) { return d.x; }));
					y.domain([0, d3.max(binned_Accept, function(d) { return d.y; })]);

					//Update all rects
		      svg.selectAll("rect")
		          .data(binned_Accept)
							.transition()
		          .delay(function(d, i) {
		              return i * 100;
		          })
							.duration(1000)
							.ease(d3.easeBounceOut)
		          .attr("y", function(d) {
		              return y(d.y);
		          })
		          .attr("height", function(d) {
		              return height-y(d.y);
		          })
		          .attr("fill", function(d, i) {
		              return colors[i];
		          });
							// add the x Axis
							svg.append("g")
								.attr("transform", "translate(0," + height + ")")
								.call(d3.axisBottom(x));

							// add the y Axis
							svg.append("g")
								.call(d3.axisLeft(y));

				}


		function transition_bars_pctymle()
		{
			document.getElementById('head').innerText='Percentage of young males';

			svg.selectAll('text').remove();
			svg.selectAll('g').remove();
			max=0
			min=100000
			csv_data.forEach(function(d) {
				d.pctymle = +d.pctymle;
				if(d.pctymle>max){
					max=d.pctymle;
				}
				if(d.pctymle<min){
					min=d.pctymle
				}
			});
			console.log(max);
			console.log(min);

			binned_data_x=['0-0.030', '0.030-0.060', '0.060-0.090', '0.090-0.120', '0.120-0.150', '0.150-0.180', '0.180-0.210', '0.210-0.240', '0.240-0.270', '0.270-0.290'];

			binned_data_y=[0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

			csv_data.forEach(function(d){
				binned_data_y[Math.floor((d.pctymle-min)/0.030)]++;
			});
			binned_Accept=[{}]
			binned_Accept=binned_Accept.concat([{x:binned_data_x[0], y:binned_data_y[0]}]);
			for(i=1;i<=Math.floor(9*bin_s);++i){
				binned_Accept=binned_Accept.concat([{x:binned_data_x[i], y:binned_data_y[i]}]);
			}
			binned_Accept.shift();
			console.log(binned_Accept);

			if(document.getElementById('pie_button').checked)
			{
				svg.selectAll("*").remove();
							// Think back to 5th grade. Radius is 1/2 of the diameter. What is the limiting factor on the diameter? Width or height, whichever is smaller
							radius = Math.min(width, height) / 2;

							var pie = d3.pie()
							.value(function(d) { return d.y; })(binned_Accept);

							var arc = d3.arc()
							.outerRadius(radius - 10)
							.innerRadius(0);

						var labelArc = d3.arc()
							.outerRadius(radius - 40)
							.innerRadius(radius - 40);

								var g = svg.selectAll("arc")
									.data(pie)
									.enter().append("g")
									.attr("class", "arc")
									.attr('transform', 'translate(' + width/2 +  ',' + height/2 +')');

									g.append("path")
							.attr("d", arc)
							.on("mouseover",function(d,i) {
             g.append("text")
                .attr("dy", ".5em")
								.attr('stroke', 'black')
                .style("text-anchor", "middle")
								.style("font-size", 40)
                .style("fill", function(d,i){return "white";})
                .text("Value: "+d.data.y)
            })
						.on("mouseout", function(d) {

                g.select("text").remove();
            })
							.style("fill", function(d, i) { return colors[i];});

							var legendRectSize = 18;                                  // NEW
						  var legendSpacing = 4;

						  var legend = svg.selectAll('.legend')                     // NEW
						  .data(binned_data_x)                                   // NEW
						  .enter()                                                // NEW
						  .append('g')                                            // NEW
						  .attr('class', 'legend')                                // NEW
						  .attr('transform', function(d, i) {                     // NEW
						    var height = legendRectSize + legendSpacing;          // NEW
						    var offset =  height * colors.length / 2;     // NEW
						    var horz = 700+legendRectSize;                       // NEW
						    var vert = i * height +90;                       // NEW
						    return 'translate(' + horz + ',' + vert + ')';        // NEW
						  });                                                     // NEW
						legend.append('rect')                                     // NEW
						  .attr('width', legendRectSize)                          // NEW
						  .attr('height', legendRectSize)                         // NEW
						  .style('fill', function(d, i) { return colors[i];})                                   // NEW
						  .style('stroke', 'black');                                // NEW
						legend.append('text')                                     // NEW
						  .attr('x', legendRectSize + legendSpacing)              // NEW
						  .attr('y', legendRectSize - legendSpacing)
							.style("fill", function(d,i){return "black";})          // NEW
						  .text(function(d) { return d; });

				return;
			}

			// Scale the range of the data in the domains
			x.domain(binned_Accept.map(function(d) { return d.x; }));
			y.domain([0, d3.max(binned_Accept, function(d) { return d.y; })]);

			//Update all rects
      svg.selectAll("rect")
          .data(binned_Accept)
					.transition()
          .delay(function(d, i) {
              return i * 100;
          })
					.duration(1000)
					.ease(d3.easeBounceOut)
          .attr("y", function(d) {
              return y(d.y);
          })
          .attr("height", function(d) {
              return height-y(d.y);
          })
          .attr("fill", function(d, i) {
              return colors[i];
          });
					// add the x Axis
					svg.append("g")
						.attr("transform", "translate(0," + height + ")")
						.call(d3.axisBottom(x));

					// add the y Axis
					svg.append("g")
						.call(d3.axisLeft(y));

		}


		function transition_bars_pctmin()
		{
			document.getElementById('head').innerText="Percent of minorities";


			svg.selectAll('text').remove();
			svg.selectAll('g').remove();
			max=0
			min=100000
			csv_data.forEach(function(d) {
				d.pctmin = +d.pctmin;
				if(d.pctmin>max){
					max=d.pctmin;
				}
				if(d.pctmin<min){
					min=d.pctmin
				}
			});
			console.log(max);
			console.log(min);

			binned_data_x=['0-7', '7-14', '14-21', '21-28', '28-35', '35-42', '42-49', '49-56', '56-63', '63-70'];

			binned_data_y=[0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

			csv_data.forEach(function(d){
				binned_data_y[Math.floor((d.pctmin-min)/7)]++;
			});
			binned_Accept=[{}]
			binned_Accept=binned_Accept.concat([{x:binned_data_x[0], y:binned_data_y[0]}]);
			for(i=1;i<=Math.floor(9*bin_s);++i){
				binned_Accept=binned_Accept.concat([{x:binned_data_x[i], y:binned_data_y[i]}]);
			}
			binned_Accept.shift();
			console.log(binned_Accept);

			if(document.getElementById('pie_button').checked)
			{
				svg.selectAll("*").remove();
							// Think back to 5th grade. Radius is 1/2 of the diameter. What is the limiting factor on the diameter? Width or height, whichever is smaller
							radius = Math.min(width, height) / 2;

							var pie = d3.pie()
							.value(function(d) { return d.y; })(binned_Accept);

							var arc = d3.arc()
							.outerRadius(radius - 10)
							.innerRadius(0);

						var labelArc = d3.arc()
							.outerRadius(radius - 40)
							.innerRadius(radius - 40);

								var g = svg.selectAll("arc")
									.data(pie)
									.enter().append("g")
									.attr("class", "arc")
									.attr('transform', 'translate(' + width/2 +  ',' + height/2 +')');

									g.append("path")
							.attr("d", arc)
							.on("mouseover",function(d,i) {
             g.append("text")
                .attr("dy", ".5em")
								.attr('stroke', 'black')
                .style("text-anchor", "middle")
								.style("font-size", 40)
                .style("fill", function(d,i){return "white";})
                .text("Value: "+d.data.y)
            })
						.on("mouseout", function(d) {

                g.select("text").remove();
            })
							.style("fill", function(d, i) { return colors[i];});

							var legendRectSize = 18;                                  // NEW
						  var legendSpacing = 4;

						  var legend = svg.selectAll('.legend')                     // NEW
						  .data(binned_data_x)                                   // NEW
						  .enter()                                                // NEW
						  .append('g')                                            // NEW
						  .attr('class', 'legend')                                // NEW
						  .attr('transform', function(d, i) {                     // NEW
						    var height = legendRectSize + legendSpacing;          // NEW
						    var offset =  height * colors.length / 2;     // NEW
						    var horz = 700+legendRectSize;                       // NEW
						    var vert = i * height +90;                       // NEW
						    return 'translate(' + horz + ',' + vert + ')';        // NEW
						  });                                                     // NEW
						legend.append('rect')                                     // NEW
						  .attr('width', legendRectSize)                          // NEW
						  .attr('height', legendRectSize)                         // NEW
						  .style('fill', function(d, i) { return colors[i];})                                   // NEW
						  .style('stroke', 'black');                                // NEW
						legend.append('text')                                     // NEW
						  .attr('x', legendRectSize + legendSpacing)              // NEW
						  .attr('y', legendRectSize - legendSpacing)
							.style("fill", function(d,i){return "black";})          // NEW
						  .text(function(d) { return d; });

				return;
			}

			// Scale the range of the data in the domains
			x.domain(binned_Accept.map(function(d) { return d.x; }));
			y.domain([0, d3.max(binned_Accept, function(d) { return d.y; })]);

			//Update all rects
      svg.selectAll("rect")
          .data(binned_Accept)
					.transition()
          .delay(function(d, i) {
              return i * 100;
          })
					.duration(1000)
					.ease(d3.easeBounceOut)
          .attr("y", function(d) {
              return y(d.y);
          })
          .attr("height", function(d) {
              return height-y(d.y);
          })
          .attr("fill", function(d, i) {
              return colors[i];
          });
					// add the x Axis
					svg.append("g")
						.attr("transform", "translate(0," + height + ")")
						.call(d3.axisBottom(x));

					// add the y Axis
					svg.append("g")
						.call(d3.axisLeft(y));

		}



		function transition_bars_prbarr()
		{
			document.getElementById('head').innerText="Probability of arrests";

			svg.selectAll('text').remove();
			svg.selectAll('g').remove();

			max=0
			min=100000
			csv_data.forEach(function(d) {
				d.prbarr = +d.prbarr;
				if(d.prbarr>max){
					max=d.prbarr;
				}
				if(d.prbarr<min){
					min=d.prbarr
				}
			});
			console.log(max);
			console.log(min);

			binned_data_x=['0.00-0.10', '0.10-0.20', '0.20-0.30', '0.30-0.40', '0.40-0.50', '0.50-0.60', '0.60-0.70', '0.70-0.80', '0.80-0.90', '0.90-1.00'];

			binned_data_y=[0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

			csv_data.forEach(function(d){
				binned_data_y[Math.floor((d.prbarr-min)/0.10)]++;
			});
			binned_Accept=[{}]
			binned_Accept=binned_Accept.concat([{x:binned_data_x[0], y:binned_data_y[0]}]);
			for(i=1;i<=Math.floor(9*bin_s);++i){
				binned_Accept=binned_Accept.concat([{x:binned_data_x[i], y:binned_data_y[i]}]);
			}
			binned_Accept.shift();
			console.log(binned_Accept);

			if(document.getElementById('pie_button').checked)
			{
				svg.selectAll("*").remove();
							// Think back to 5th grade. Radius is 1/2 of the diameter. What is the limiting factor on the diameter? Width or height, whichever is smaller
							radius = Math.min(width, height) / 2;

							var pie = d3.pie()
							.value(function(d) { return d.y; })(binned_Accept);

							var arc = d3.arc()
							.outerRadius(radius - 10)
							.innerRadius(0);

						var labelArc = d3.arc()
							.outerRadius(radius - 40)
							.innerRadius(radius - 40);

								var g = svg.selectAll("arc")
									.data(pie)
									.enter().append("g")
									.attr("class", "arc")
									.attr('transform', 'translate(' + width/2 +  ',' + height/2 +')');

									g.append("path")
							.attr("d", arc)
							.on("mouseover",function(d,i) {
             g.append("text")
                .attr("dy", ".5em")
								.attr('stroke', 'black')
                .style("text-anchor", "middle")
								.style("font-size", 40)
                .style("fill", function(d,i){return "white";})
                .text("Value: "+d.data.y)
            })
						.on("mouseout", function(d) {

                g.select("text").remove();
            })
							.style("fill", function(d, i) { return colors[i];});

							var legendRectSize = 18;                                  // NEW
						  var legendSpacing = 4;

						  var legend = svg.selectAll('.legend')                     // NEW
						  .data(binned_data_x)                                   // NEW
						  .enter()                                                // NEW
						  .append('g')                                            // NEW
						  .attr('class', 'legend')                                // NEW
						  .attr('transform', function(d, i) {                     // NEW
						    var height = legendRectSize + legendSpacing;          // NEW
						    var offset =  height * colors.length / 2;     // NEW
						    var horz = 700+legendRectSize;                       // NEW
						    var vert = i * height +90;                       // NEW
						    return 'translate(' + horz + ',' + vert + ')';        // NEW
						  });                                                     // NEW
						legend.append('rect')                                     // NEW
						  .attr('width', legendRectSize)                          // NEW
						  .attr('height', legendRectSize)                         // NEW
						  .style('fill', function(d, i) { return colors[i];})                                   // NEW
						  .style('stroke', 'black');                                // NEW
						legend.append('text')                                     // NEW
						  .attr('x', legendRectSize + legendSpacing)              // NEW
						  .attr('y', legendRectSize - legendSpacing)
							.style("fill", function(d,i){return "black";})          // NEW
						  .text(function(d) { return d; });

				return;
			}


			if(document.getElementById('fdl_button').checked)
			{

				var color = d3.scaleOrdinal(d3.schemeCategory20);

				var simulation = d3.forceSimulation()
						.force("link", d3.forceLink().id(function(d) { return d.id; }))
						.force("charge", d3.forceManyBody())
						.force("center", d3.forceCenter(width / 2, height / 2));
				simulation_global=simulation

				d3.json("prbarr_fdl.json", function(error, graph) {
					if (error)
					{
						console.log(error)
						throw error;
					}

					var link = svg.append("g")
							.attr("class", "links")
						.selectAll("line")
						.data(graph.links)
						.enter().append("line")
							.attr("stroke-width", function(d) { return 1; });

					var node = svg.append("g")
							.attr("class", "nodes")
						.selectAll("g")
						.data(graph.nodes)
						.enter().append("g")

					var circles = node.append("circle")
							.attr("r", 5)
							.attr("fill", function(d) { return color(d.group); })
							.call(d3.drag()
									.on("start", dragstarted)
									.on("drag", dragged)
									.on("end", dragended));


					var lables = node.append("text")
					.style("font-size", "10px")
							.text(function(d) {
								return d.id;
							})
							.attr('x', 6)
							.attr('y', 3);


					node.append("title")
							.text(function(d) { return d.id; });

					simulation
							.nodes(graph.nodes)
							.on("tick", ticked);

					simulation.force("link")
							.links(graph.links);

					function ticked() {
						link
								.attr("x1", function(d) { return d.source.x; })
								.attr("y1", function(d) { return d.source.y; })
								.attr("x2", function(d) { return d.target.x; })
								.attr("y2", function(d) { return d.target.y; });

						node
								.attr("transform", function(d) {
									return "translate(" + d.x + "," + d.y + ")";
								})
					}
				});

				return;
			}

			// Scale the range of the data in the domains
			x.domain(binned_Accept.map(function(d) { return d.x; }));
			y.domain([0, d3.max(binned_Accept, function(d) { return d.y; })]);

			//Update all rects
      svg.selectAll("rect")
          .data(binned_Accept)
					.transition()
          .delay(function(d, i) {
              return i * 100;
          })
					.duration(1000)
					.ease(d3.easeBounceOut)
          .attr("y", function(d) {
              return y(d.y);
          })
          .attr("height", function(d) {
              return height-y(d.y);
          })
          .attr("fill", function(d, i) {
              return colors[i];
          });
					// add the x Axis
					svg.append("g")
						.attr("transform", "translate(0," + height + ")")
						.call(d3.axisBottom(x));

					// add the y Axis
					svg.append("g")
						.call(d3.axisLeft(y));

		}




				function transition_bars_prbconv()
				{
					document.getElementById('head').innerText="Probability of conviction";


					svg.selectAll('text').remove();
					svg.selectAll('g').remove();
					max=0
					min=100000
					csv_data.forEach(function(d) {
						d.prbconv = +d.prbconv;
						if(d.prbconv>max){
							max=d.prbconv;
						}
						if(d.prbconv<min){
							min=d.prbconv
						}
					});
					console.log(max);
					console.log(min);

					binned_data_x=['0.00-0.10', '0.10-0.20', '0.20-0.30', '0.30-0.40', '0.40-0.50', '0.50-0.60', '0.60-0.70', '0.70-0.80', '0.80-0.90', '0.90-1.00'];

					binned_data_y=[0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

					csv_data.forEach(function(d){
						binned_data_y[Math.floor((d.prbconv-min)/0.10)]++;
					});
					binned_Accept=[{}]
					binned_Accept=binned_Accept.concat([{x:binned_data_x[0], y:binned_data_y[0]}]);
					for(i=1;i<=Math.floor(9*bin_s);++i){
						binned_Accept=binned_Accept.concat([{x:binned_data_x[i], y:binned_data_y[i]}]);
					}
					binned_Accept.shift();
					console.log(binned_Accept);

					if(document.getElementById('pie_button').checked)
					{
						svg.selectAll("*").remove();
									// Think back to 5th grade. Radius is 1/2 of the diameter. What is the limiting factor on the diameter? Width or height, whichever is smaller
									radius = Math.min(width, height) / 2;

									var pie = d3.pie()
									.value(function(d) { return d.y; })(binned_Accept);

									var arc = d3.arc()
									.outerRadius(radius - 10)
									.innerRadius(0);

								var labelArc = d3.arc()
									.outerRadius(radius - 40)
									.innerRadius(radius - 40);

										var g = svg.selectAll("arc")
											.data(pie)
											.enter().append("g")
											.attr("class", "arc")
											.attr('transform', 'translate(' + width/2 +  ',' + height/2 +')');

											g.append("path")
									.attr("d", arc)
									.on("mouseover",function(d,i) {
		             g.append("text")
		                .attr("dy", ".5em")
										.attr('stroke', 'black')
		                .style("text-anchor", "middle")
										.style("font-size", 40)
		                .style("fill", function(d,i){return "white";})
		                .text("Value: "+d.data.y)
		            })
								.on("mouseout", function(d) {

		                g.select("text").remove();
		            })
									.style("fill", function(d, i) { return colors[i];});

									var legendRectSize = 18;                                  // NEW
								  var legendSpacing = 4;

								  var legend = svg.selectAll('.legend')                     // NEW
								  .data(binned_data_x)                                   // NEW
								  .enter()                                                // NEW
								  .append('g')                                            // NEW
								  .attr('class', 'legend')                                // NEW
								  .attr('transform', function(d, i) {                     // NEW
								    var height = legendRectSize + legendSpacing;          // NEW
								    var offset =  height * colors.length / 2;     // NEW
								    var horz = 700+legendRectSize;                       // NEW
								    var vert = i * height +90;                       // NEW
								    return 'translate(' + horz + ',' + vert + ')';        // NEW
								  });                                                     // NEW
								legend.append('rect')                                     // NEW
								  .attr('width', legendRectSize)                          // NEW
								  .attr('height', legendRectSize)                         // NEW
								  .style('fill', function(d, i) { return colors[i];})                                   // NEW
								  .style('stroke', 'black');                                // NEW
								legend.append('text')                                     // NEW
								  .attr('x', legendRectSize + legendSpacing)              // NEW
								  .attr('y', legendRectSize - legendSpacing)
									.style("fill", function(d,i){return "black";})          // NEW
								  .text(function(d) { return d; });

						return;
					}


					if(document.getElementById('fdl_button').checked)
					{

						var color = d3.scaleOrdinal(d3.schemeCategory20);

						var simulation = d3.forceSimulation()
								.force("link", d3.forceLink().id(function(d) { return d.id; }))
								.force("charge", d3.forceManyBody())
								.force("center", d3.forceCenter(width / 2, height / 2));
						simulation_global=simulation

						d3.json("prbconv_fdl.json", function(error, graph) {
							if (error)
							{
								console.log(error)
								throw error;
							}

							var link = svg.append("g")
									.attr("class", "links")
								.selectAll("line")
								.data(graph.links)
								.enter().append("line")
									.attr("stroke-width", function(d) { return 1; });

							var node = svg.append("g")
									.attr("class", "nodes")
								.selectAll("g")
								.data(graph.nodes)
								.enter().append("g")

							var circles = node.append("circle")
									.attr("r", 5)
									.attr("fill", function(d) { return color(d.group); })
									.call(d3.drag()
											.on("start", dragstarted)
											.on("drag", dragged)
											.on("end", dragended));


							var lables = node.append("text")
							.style("font-size", "10px")
									.text(function(d) {
										return d.id;
									})
									.attr('x', 6)
									.attr('y', 3);


							node.append("title")
									.text(function(d) { return d.id; });

							simulation
									.nodes(graph.nodes)
									.on("tick", ticked);

							simulation.force("link")
									.links(graph.links);

							function ticked() {
								link
										.attr("x1", function(d) { return d.source.x; })
										.attr("y1", function(d) { return d.source.y; })
										.attr("x2", function(d) { return d.target.x; })
										.attr("y2", function(d) { return d.target.y; });

								node
										.attr("transform", function(d) {
											return "translate(" + d.x + "," + d.y + ")";
										})
							}
						});

						return;
					}

					// Scale the range of the data in the domains
					x.domain(binned_Accept.map(function(d) { return d.x; }));
					y.domain([0, d3.max(binned_Accept, function(d) { return d.y; })]);

					//Update all rects
		      svg.selectAll("rect")
		          .data(binned_Accept)
							.transition()
		          .delay(function(d, i) {
		              return i * 100;
		          })
							.duration(1000)
							.ease(d3.easeBounceOut)
		          .attr("y", function(d) {
		              return y(d.y);
		          })
		          .attr("height", function(d) {
		              return height-y(d.y);
		          })
		          .attr("fill", function(d, i) {
		              return colors[i];
		          });
							// add the x Axis
							svg.append("g")
								.attr("transform", "translate(0," + height + ")")
								.call(d3.axisBottom(x));

							// add the y Axis
							svg.append("g")
								.call(d3.axisLeft(y));

				}






		function transition_bars_polpc()
		{
			document.getElementById('head').innerText="Police per capita";


			svg.selectAll('text').remove();
			svg.selectAll('g').remove();
			max=0
			min=100000
			csv_data.forEach(function(d) {
				d.polpc = +d.polpc;
				if(d.polpc>max){
					max=d.polpc;
				}
				if(d.polpc<min){
					min=d.polpc
				}
			});
			console.log(max);
			console.log(min);

			binned_data_x=['0-0.0036', '0.0036-0.0072', '0.0072-0.0108', '0.0108-0.0144', '0.0144-0.0180', '0.0180-0.0216', '0.0216-0.0252', '0.0252-0.0288', '0.0288-0.0324', '0.0324-0.0360'];

			binned_data_y=[0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

			csv_data.forEach(function(d){
				binned_data_y[Math.floor((d.polpc-min)/0.0036)]++;
			});
			binned_Accept=[{}]
			binned_Accept=binned_Accept.concat([{x:binned_data_x[0], y:binned_data_y[0]}]);
			for(i=1;i<=Math.floor(9*bin_s);++i){
				binned_Accept=binned_Accept.concat([{x:binned_data_x[i], y:binned_data_y[i]}]);
			}
			binned_Accept.shift();
			console.log(binned_Accept);

			if(document.getElementById('pie_button').checked)
			{
				svg.selectAll("*").remove();
								//var width = 300,
							// Think back to 5th grade. Radius is 1/2 of the diameter. What is the limiting factor on the diameter? Width or height, whichever is smaller
							radius = Math.min(width, height) / 2;

							var pie = d3.pie()
							.value(function(d) { return d.y; })(binned_Accept);

							var arc = d3.arc()
							.outerRadius(radius - 10)
							.innerRadius(0);

						var labelArc = d3.arc()
							.outerRadius(radius - 40)
							.innerRadius(radius - 40);

								var g = svg.selectAll("arc")
									.data(pie)
									.enter().append("g")
									.attr("class", "arc")
									.attr('transform', 'translate(' + width/2 +  ',' + height/2 +')');

									g.append("path")
							.attr("d", arc)
							.on("mouseover",function(d,i) {
             g.append("text")
                .attr("dy", ".5em")
								.attr('stroke', 'black')
                .style("text-anchor", "middle")
								.style("font-size", 40)
                .style("fill", function(d,i){return "white";})
                .text("Value: "+d.data.y)
            })
						.on("mouseout", function(d) {

                g.select("text").remove();
            })
							.style("fill", function(d, i) { return colors[i];});

							var legendRectSize = 18;                                  // NEW
						  var legendSpacing = 4;

						  var legend = svg.selectAll('.legend')                     // NEW
						  .data(binned_data_x)                                   // NEW
						  .enter()                                                // NEW
						  .append('g')                                            // NEW
						  .attr('class', 'legend')                                // NEW
						  .attr('transform', function(d, i) {                     // NEW
						    var height = legendRectSize + legendSpacing;          // NEW
						    var offset =  height * colors.length / 2;     // NEW
						    var horz = 700+legendRectSize;                       // NEW
						    var vert = i * height +90;                       // NEW
						    return 'translate(' + horz + ',' + vert + ')';        // NEW
						  });                                                     // NEW
						legend.append('rect')                                     // NEW
						  .attr('width', legendRectSize)                          // NEW
						  .attr('height', legendRectSize)                         // NEW
						  .style('fill', function(d, i) { return colors[i];})                                   // NEW
						  .style('stroke', 'black');                                // NEW
						legend.append('text')                                     // NEW
						  .attr('x', legendRectSize + legendSpacing)              // NEW
						  .attr('y', legendRectSize - legendSpacing)
							.style("fill", function(d,i){return "black";})          // NEW
						  .text(function(d) { return d; });

				return;
			}

			// Scale the range of the data in the domains
			x.domain(binned_Accept.map(function(d) { return d.x; }));
			y.domain([0, d3.max(binned_Accept, function(d) { return d.y; })]);

			//Update all rects
      svg.selectAll("rect")
          .data(binned_Accept)
					.transition()
          .delay(function(d, i) {
              return i * 100;
          })
					.duration(1000)
					.ease(d3.easeBounceOut)
          .attr("y", function(d) {
              return y(d.y);
          })
          .attr("height", function(d) {
              return height-y(d.y);
          })
          .attr("fill", function(d, i) {
              return colors[i];
          });
					// add the x Axis
					svg.append("g")
						.attr("transform", "translate(0," + height + ")")
						.call(d3.axisBottom(x));

					// add the y Axis
					svg.append("g")
						.call(d3.axisLeft(y));

		}


		function transition_bars_taxpc()
		{
			document.getElementById('head').innerText="Per capita tax revenue";


			svg.selectAll('text').remove();
			svg.selectAll('g').remove();
			max=0
			min=100000
			csv_data.forEach(function(d) {
				d.taxpc = +d.taxpc;
				if(d.taxpc>max){
					max=d.taxpc;
				}
				if(d.taxpc<min){
					min=d.taxpc
				}
			});
			console.log(max);
			console.log(min);

			binned_data_x=['11-22', '22-33', '33-44', '44-55', '55-66', '66-77', '77-88', '88-99', '99-110', '110-121'];

			binned_data_y=[0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

			csv_data.forEach(function(d){
				binned_data_y[Math.floor((d.taxpc-min)/11)]++;
			});
			binned_Accept=[{}]
			binned_Accept=binned_Accept.concat([{x:binned_data_x[0], y:binned_data_y[0]}]);
			for(i=1;i<=Math.floor(9*bin_s);++i){
				binned_Accept=binned_Accept.concat([{x:binned_data_x[i], y:binned_data_y[i]}]);
			}
			binned_Accept.shift();
			console.log(binned_Accept);

			if(document.getElementById('pie_button').checked)
			{
				svg.selectAll("*").remove();

							// Think back to 5th grade. Radius is 1/2 of the diameter. What is the limiting factor on the diameter? Width or height, whichever is smaller
							radius = Math.min(width, height) / 2;

							var pie = d3.pie()
							.value(function(d) { return d.y; })(binned_Accept);

							var arc = d3.arc()
							.outerRadius(radius - 10)
							.innerRadius(0);

						var labelArc = d3.arc()
							.outerRadius(radius - 40)
							.innerRadius(radius - 40);

								var g = svg.selectAll("arc")
									.data(pie)
									.enter().append("g")
									.attr("class", "arc")
									.attr('transform', 'translate(' + width/2 +  ',' + height/2 +')');

									g.append("path")
							.attr("d", arc)
							.on("mouseover",function(d,i) {
             g.append("text")
                .attr("dy", ".5em")
								.attr('stroke', 'black')
                .style("text-anchor", "middle")
								.style("font-size", 40)
                .style("fill", function(d,i){return "white";})
                .text("Value: "+d.data.y)
            })
						.on("mouseout", function(d) {

                g.select("text").remove();
            })
							.style("fill", function(d, i) { return colors[i];});

							var legendRectSize = 18;                                  // NEW
						  var legendSpacing = 4;

						  var legend = svg.selectAll('.legend')                     // NEW
						  .data(binned_data_x)                                   // NEW
						  .enter()                                                // NEW
						  .append('g')                                            // NEW
						  .attr('class', 'legend')                                // NEW
						  .attr('transform', function(d, i) {                     // NEW
						    var height = legendRectSize + legendSpacing;          // NEW
						    var offset =  height * colors.length / 2;     // NEW
						    var horz = 700+legendRectSize;                       // NEW
						    var vert = i * height +90;                       // NEW
						    return 'translate(' + horz + ',' + vert + ')';        // NEW
						  });                                                     // NEW
						legend.append('rect')                                     // NEW
						  .attr('width', legendRectSize)                          // NEW
						  .attr('height', legendRectSize)                         // NEW
						  .style('fill', function(d, i) { return colors[i];})                                   // NEW
						  .style('stroke', 'black');                                // NEW
						legend.append('text')                                     // NEW
						  .attr('x', legendRectSize + legendSpacing)              // NEW
						  .attr('y', legendRectSize - legendSpacing)
							.style("fill", function(d,i){return "black";})          // NEW
						  .text(function(d) { return d; });

				return;
			}

			// Scale the range of the data in the domains
			x.domain(binned_Accept.map(function(d) { return d.x; }));
			y.domain([0, d3.max(binned_Accept, function(d) { return d.y; })]);

			//Update all rects
      svg.selectAll("rect")
          .data(binned_Accept)
					.transition()
          .delay(function(d, i) {
              return i * 100;
          })
					.duration(1000)
					.ease(d3.easeBounceOut)
          .attr("y", function(d) {
              return y(d.y);
          })
          .attr("height", function(d) {
              return height-y(d.y);
          })
          .attr("fill", function(d, i) {
              return colors[i];
          });
					// add the x Axis
					svg.append("g")
						.attr("transform", "translate(0," + height + ")")
						.call(d3.axisBottom(x));

					// add the y Axis
					svg.append("g")
						.call(d3.axisLeft(y));

		}



		function transition_bars_pctymle2(bin_size)
		{
			console.log("hello");

			svg.selectAll("*").remove();

			max=0
			min=100000
			csv_data.forEach(function(d) {
				d.pctymle = +d.pctymle;
				if(d.pctymle>max){
					max=d.pctymle;
				}
				if(d.pctymle<min){
					min=d.pctymle
				}
			});
			console.log(max);
			console.log(min);

			binned_data_x=['0-0.030', '0.030-0.060', '0.060-0.090', '0.090-0.120', '0.120-0.150', '0.150-0.180', '0.180-0.210', '0.210-0.240', '0.240-0.270', '0.270-0.290'];

			binned_data_y=[0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

			csv_data.forEach(function(d){
				binned_data_y[Math.floor((d.pctymle-min)/0.030)]++;
			});
			binned_Accept=[{}]
			binned_Accept=binned_Accept.concat([{x:binned_data_x[0], y:binned_data_y[0]}]);
			for(i=1;i<=Math.floor(bin_size*9);++i){
				binned_Accept=binned_Accept.concat([{x:binned_data_x[i], y:binned_data_y[i]}]);
			}
			binned_Accept.shift();
			console.log(binned_Accept);

			if(document.getElementById('pie_button').checked)
			{
								//var width = 300,
							// Think back to 5th grade. Radius is 1/2 of the diameter. What is the limiting factor on the diameter? Width or height, whichever is smaller
							radius = Math.min(width, height) / 2;

							var pie = d3.pie()
							.value(function(d) { return d.y; })(binned_Accept);

							var arc = d3.arc()
							.outerRadius(radius - 10)
							.innerRadius(0);

						var labelArc = d3.arc()
							.outerRadius(radius - 40)
							.innerRadius(radius - 40);

								var g = svg.selectAll("arc")
									.data(pie)
									.enter().append("g")
									.attr("class", "arc")
									.attr('transform', 'translate(' + width/2 +  ',' + height/2 +')');

									g.append("path")
							.attr("d", arc)
							.on("mouseover",function(d,i) {
             g.append("text")
                .attr("dy", ".5em")
								.attr('stroke', 'black')
                .style("text-anchor", "middle")
								.style("font-size", 40)
                .style("fill", function(d,i){return "white";})
                .text("Value: "+d.data.y)
            })
						.on("mouseout", function(d) {

                g.select("text").remove();
            })
							.style("fill", function(d, i) { return colors[i];});

							var legendRectSize = 18;                                  // NEW
						  var legendSpacing = 4;

						  var legend = svg.selectAll('.legend')                     // NEW
						  .data(binned_data_x)                                   // NEW
						  .enter()                                                // NEW
						  .append('g')                                            // NEW
						  .attr('class', 'legend')                                // NEW
						  .attr('transform', function(d, i) {                     // NEW
						    var height = legendRectSize + legendSpacing;          // NEW
						    var offset =  height * colors.length / 2;     // NEW
						    var horz = 700+legendRectSize;                       // NEW
						    var vert = i * height +90;                       // NEW
						    return 'translate(' + horz + ',' + vert + ')';        // NEW
						  });                                                     // NEW
						legend.append('rect')                                     // NEW
						  .attr('width', legendRectSize)                          // NEW
						  .attr('height', legendRectSize)                         // NEW
						  .style('fill', function(d, i) { return colors[i];})                                   // NEW
						  .style('stroke', 'black');                                // NEW
						legend.append('text')                                     // NEW
						  .attr('x', legendRectSize + legendSpacing)              // NEW
						  .attr('y', legendRectSize - legendSpacing)
							.style("fill", function(d,i){return "black";})          // NEW
						  .text(function(d) { return d; });
				return;
			}


			// Scale the range of the data in the domains
			x.domain(binned_Accept.map(function(d) { return d.x; }));
			y.domain([0, d3.max(binned_Accept, function(d) { return d.y; })]);

			// append the rectangles for the bar chart
			svg.selectAll(".bar")
				.data(binned_Accept)
				.enter().append("rect")
				.attr("class", "bar")
				.on("mouseover", onMouseOver)
				.on("mouseout", onMouseOut)
				.attr("x", function(d) { return x(d.x); })
				.attr("width", x.bandwidth())
				.transition()
				.ease(d3.easeBackIn)
				.duration(400)
				.delay(function (d, i) {
					 return i * 50;
				 })
				.attr("y", function(d) { return y(d.y); })
				.style("fill",function(d,i)
				{
					return colors[i];
				})
				.attr("height", function(d) { return height - y(d.y); });

			// add the x Axis
			svg.append("g")
				.attr("transform", "translate(0," + height + ")")
				.call(d3.axisBottom(x));

			// add the y Axis
			svg.append("g")
				.call(d3.axisLeft(y));
		}





		function transition_bars_avgsendays2(bin_size)
		{
			console.log("hello");

			svg.selectAll("*").remove();

			max=0
			min=100000
			csv_data.forEach(function(d) {
				d.avgsen = +d.avgsen;
				if(d.avgsen>max){
					max=d.avgsen;
				}
				if(d.avgsen<min){
					min=d.avgsen
				}
			});
			console.log(max);
			console.log(min);

			binned_data_x=['4.2-6.4', '6.4-8.6', '8.6-10.8', '10.8-13', '13-15.2', '15.2-17.4', '17.4-19.6', '19.6-21.8', '21.8-24', '24-26.2'];

			binned_data_y=[0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

			csv_data.forEach(function(d){
				binned_data_y[Math.floor((d.avgsen-min)/2.2)]++;
			});
			binned_Accept=[{}]
			binned_Accept=binned_Accept.concat([{x:binned_data_x[0], y:binned_data_y[0]}]);
			for(i=1;i<=Math.floor(bin_size*9);++i){
				binned_Accept=binned_Accept.concat([{x:binned_data_x[i], y:binned_data_y[i]}]);
			}
			binned_Accept.shift();
			console.log(binned_Accept);

			if(document.getElementById('pie_button').checked)
			{
				svg.selectAll("*").remove();
								//var width = 300,
							// Think back to 5th grade. Radius is 1/2 of the diameter. What is the limiting factor on the diameter? Width or height, whichever is smaller
							radius = Math.min(width, height) / 2;

							var pie = d3.pie()
							.value(function(d) { return d.y; })(binned_Accept);

							var arc = d3.arc()
							.outerRadius(radius - 10)
							.innerRadius(0);

						var labelArc = d3.arc()
							.outerRadius(radius - 40)
							.innerRadius(radius - 40);

								var g = svg.selectAll("arc")
									.data(pie)
									.enter().append("g")
									.attr("class", "arc")
									.attr('transform', 'translate(' + width/2 +  ',' + height/2 +')');

									g.append("path")
							.attr("d", arc)
							.on("mouseover",function(d,i) {
             g.append("text")
                .attr("dy", ".5em")
								.attr('stroke', 'black')
                .style("text-anchor", "middle")
								.style("font-size", 40)
                .style("fill", function(d,i){return "white";})
                .text("Value: "+d.data.y)
            })
						.on("mouseout", function(d) {

                g.select("text").remove();
            })
							.style("fill", function(d, i) { return colors[i];});

							var legendRectSize = 18;                                  // NEW
						  var legendSpacing = 4;

						  var legend = svg.selectAll('.legend')                     // NEW
						  .data(binned_data_x)                                   // NEW
						  .enter()                                                // NEW
						  .append('g')                                            // NEW
						  .attr('class', 'legend')                                // NEW
						  .attr('transform', function(d, i) {                     // NEW
						    var height = legendRectSize + legendSpacing;          // NEW
						    var offset =  height * colors.length / 2;     // NEW
						    var horz = 700+legendRectSize;                       // NEW
						    var vert = i * height +90;                       // NEW
						    return 'translate(' + horz + ',' + vert + ')';        // NEW
						  });                                                     // NEW
						legend.append('rect')                                     // NEW
						  .attr('width', legendRectSize)                          // NEW
						  .attr('height', legendRectSize)                         // NEW
						  .style('fill', function(d, i) { return colors[i];})                                   // NEW
						  .style('stroke', 'black');                                // NEW
						legend.append('text')                                     // NEW
						  .attr('x', legendRectSize + legendSpacing)              // NEW
						  .attr('y', legendRectSize - legendSpacing)
							.style("fill", function(d,i){return "black";})          // NEW
						  .text(function(d) { return d; });

				return;
			}

			if(document.getElementById('fdl_button').checked)
			{

				var color = d3.scaleOrdinal(d3.schemeCategory20);

				var simulation = d3.forceSimulation()
						.force("link", d3.forceLink().id(function(d) { return d.id; }))
						.force("charge", d3.forceManyBody())
						.force("center", d3.forceCenter(width / 2, height / 2));
				simulation_global=simulation

				d3.json("avgsen_fdl.json", function(error, graph) {
					if (error)
					{
						console.log(error)
						throw error;
					}

					var link = svg.append("g")
							.attr("class", "links")
						.selectAll("line")
						.data(graph.links)
						.enter().append("line")
							.attr("stroke-width", function(d) { return 1; });

					var node = svg.append("g")
							.attr("class", "nodes")
						.selectAll("g")
						.data(graph.nodes)
						.enter().append("g")

					var circles = node.append("circle")
							.attr("r", 5)
							.attr("fill", function(d) { return color(d.group); })
							.call(d3.drag()
									.on("start", dragstarted)
									.on("drag", dragged)
									.on("end", dragended));


					var lables = node.append("text")
					.style("font-size", "10px")
							.text(function(d) {
								return d.id;
							})
							.attr('x', 6)
							.attr('y', 3);


					node.append("title")
							.text(function(d) { return d.id; });

					simulation
							.nodes(graph.nodes)
							.on("tick", ticked);

					simulation.force("link")
							.links(graph.links);

					function ticked() {
						link
								.attr("x1", function(d) { return d.source.x; })
								.attr("y1", function(d) { return d.source.y; })
								.attr("x2", function(d) { return d.target.x; })
								.attr("y2", function(d) { return d.target.y; });

						node
								.attr("transform", function(d) {
									return "translate(" + d.x + "," + d.y + ")";
								})
					}
				});

				return;
			}

			// Scale the range of the data in the domains
			x.domain(binned_Accept.map(function(d) { return d.x; }));
			y.domain([0, d3.max(binned_Accept, function(d) { return d.y; })]);

			// append the rectangles for the bar chart
			svg.selectAll(".bar")
				.data(binned_Accept)
				.enter().append("rect")
				.attr("class", "bar")
				.on("mouseover", onMouseOver)
				.on("mouseout", onMouseOut)
				.attr("x", function(d) { return x(d.x); })
				.attr("width", x.bandwidth())
				.transition()
				.ease(d3.easeBackIn)
				.duration(400)
				.delay(function (d, i) {
					 return i * 50;
				 })
				.attr("y", function(d) { return y(d.y); })
				.style("fill",function(d,i)
				{
					return colors[i];
				})
				.attr("height", function(d) { return height - y(d.y); });

			// add the x Axis
			svg.append("g")
				.attr("transform", "translate(0," + height + ")")
				.call(d3.axisBottom(x));

			// add the y Axis
			svg.append("g")
				.call(d3.axisLeft(y));
		}

		function transition_bars_taxpc2(bin_size)
		{
			console.log("hello");

			svg.selectAll("*").remove();

			max=0
			min=100000
			csv_data.forEach(function(d) {
				d.taxpc = +d.taxpc;
				if(d.taxpc>max){
					max=d.taxpc;
				}
				if(d.taxpc<min){
					min=d.taxpc
				}
			});
			console.log(max);
			console.log(min);

			binned_data_x=['11-22', '22-33', '33-44', '44-55', '55-66', '66-77', '77-88', '88-99', '99-110', '110-121'];

			binned_data_y=[0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

			csv_data.forEach(function(d){
				binned_data_y[Math.floor((d.taxpc-min)/11)]++;
			});
			binned_Accept=[{}]
			binned_Accept=binned_Accept.concat([{x:binned_data_x[0], y:binned_data_y[0]}]);
			for(i=1;i<=Math.floor(bin_size*9);++i){
				binned_Accept=binned_Accept.concat([{x:binned_data_x[i], y:binned_data_y[i]}]);
			}
			binned_Accept.shift();
			console.log(binned_Accept);

			if(document.getElementById('pie_button').checked)
			{
				svg.selectAll("*").remove();
								//var width = 300,
							// Think back to 5th grade. Radius is 1/2 of the diameter. What is the limiting factor on the diameter? Width or height, whichever is smaller
							radius = Math.min(width, height) / 2;

							var pie = d3.pie()
							.value(function(d) { return d.y; })(binned_Accept);

							var arc = d3.arc()
							.outerRadius(radius - 10)
							.innerRadius(0);

						var labelArc = d3.arc()
							.outerRadius(radius - 40)
							.innerRadius(radius - 40);

								var g = svg.selectAll("arc")
									.data(pie)
									.enter().append("g")
									.attr("class", "arc")
									.attr('transform', 'translate(' + width/2 +  ',' + height/2 +')');

									g.append("path")
							.attr("d", arc)
							.on("mouseover",function(d,i) {
             g.append("text")
                .attr("dy", ".5em")
								.attr('stroke', 'black')
                .style("text-anchor", "middle")
								.style("font-size", 40)
                .style("fill", function(d,i){return "white";})
                .text("Value: "+d.data.y)
            })
						.on("mouseout", function(d) {

                g.select("text").remove();
            })
							.style("fill", function(d, i) { return colors[i];});

							var legendRectSize = 18;                                  // NEW
						  var legendSpacing = 4;

						  var legend = svg.selectAll('.legend')                     // NEW
						  .data(binned_data_x)                                   // NEW
						  .enter()                                                // NEW
						  .append('g')                                            // NEW
						  .attr('class', 'legend')                                // NEW
						  .attr('transform', function(d, i) {                     // NEW
						    var height = legendRectSize + legendSpacing;          // NEW
						    var offset =  height * colors.length / 2;     // NEW
						    var horz = 700+legendRectSize;                       // NEW
						    var vert = i * height +90;                       // NEW
						    return 'translate(' + horz + ',' + vert + ')';        // NEW
						  });                                                     // NEW
						legend.append('rect')                                     // NEW
						  .attr('width', legendRectSize)                          // NEW
						  .attr('height', legendRectSize)                         // NEW
						  .style('fill', function(d, i) { return colors[i];})                                   // NEW
						  .style('stroke', 'black');                                // NEW
						legend.append('text')                                     // NEW
						  .attr('x', legendRectSize + legendSpacing)              // NEW
						  .attr('y', legendRectSize - legendSpacing)
							.style("fill", function(d,i){return "black";})          // NEW
						  .text(function(d) { return d; });

				return;
			}

			// Scale the range of the data in the domains
			x.domain(binned_Accept.map(function(d) { return d.x; }));
			y.domain([0, d3.max(binned_Accept, function(d) { return d.y; })]);

			// append the rectangles for the bar chart
			svg.selectAll(".bar")
				.data(binned_Accept)
				.enter().append("rect")
				.attr("class", "bar")
				.on("mouseover", onMouseOver)
				.on("mouseout", onMouseOut)
				.attr("x", function(d) { return x(d.x); })
				.attr("width", x.bandwidth())
				.transition()
				.ease(d3.easeBackIn)
				.duration(400)
				.delay(function (d, i) {
					 return i * 50;
				 })
				.attr("y", function(d) { return y(d.y); })
				.style("fill",function(d,i)
				{
					return colors[i];
				})
				.attr("height", function(d) { return height - y(d.y); });

			// add the x Axis
			svg.append("g")
				.attr("transform", "translate(0," + height + ")")
				.call(d3.axisBottom(x));

			// add the y Axis
			svg.append("g")
				.call(d3.axisLeft(y));

		}


		function transition_bars_density2()
		{
			console.log("hello");

			svg.selectAll("*").remove();

			max=0
			min=100000
			csv_data.forEach(function(d) {
				d.density = +d.density;
				if(d.density>max){
					max=d.density;
				}
				if(d.density<min){
					min=d.density
				}
			});
			console.log(max);
			console.log(min);

			binned_data_x=['0-1', '1-2', '2-3', '3-4', '4-5', '5-6', '6-7', '7-8', '8-9', '9-10'];

			binned_data_y=[0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

			csv_data.forEach(function(d){
				binned_data_y[Math.floor((d.density-min)/1)]++;
			});
			binned_Accept=[{}]
			binned_Accept=binned_Accept.concat([{x:binned_data_x[0], y:binned_data_y[0]}]);
			for(i=1;i<=Math.floor(bin_size*9);++i){
				binned_Accept=binned_Accept.concat([{x:binned_data_x[i], y:binned_data_y[i]}]);
			}
			binned_Accept.shift();
			console.log(binned_Accept);

			if(document.getElementById('pie_button').checked)
			{
				svg.selectAll("*").remove();
								//var width = 300,
							// Think back to 5th grade. Radius is 1/2 of the diameter. What is the limiting factor on the diameter? Width or height, whichever is smaller
							radius = Math.min(width, height) / 2;

							var pie = d3.pie()
							.value(function(d) { return d.y; })(binned_Accept);

							var arc = d3.arc()
							.outerRadius(radius - 10)
							.innerRadius(0);

						var labelArc = d3.arc()
							.outerRadius(radius - 40)
							.innerRadius(radius - 40);

								var g = svg.selectAll("arc")
									.data(pie)
									.enter().append("g")
									.attr("class", "arc")
									.attr('transform', 'translate(' + width/2 +  ',' + height/2 +')');

									g.append("path")
							.attr("d", arc)
							.on("mouseover",function(d,i) {
             g.append("text")
                .attr("dy", ".5em")
								.attr('stroke', 'black')
                .style("text-anchor", "middle")
								.style("font-size", 40)
                .style("fill", function(d,i){return "white";})
                .text("Value: "+d.data.y)
            })
						.on("mouseout", function(d) {

                g.select("text").remove();
            })
							.style("fill", function(d, i) { return colors[i];});

							var legendRectSize = 18;                                  // NEW
						  var legendSpacing = 4;

						  var legend = svg.selectAll('.legend')                     // NEW
						  .data(binned_data_x)                                   // NEW
						  .enter()                                                // NEW
						  .append('g')                                            // NEW
						  .attr('class', 'legend')                                // NEW
						  .attr('transform', function(d, i) {                     // NEW
						    var height = legendRectSize + legendSpacing;          // NEW
						    var offset =  height * colors.length / 2;     // NEW
						    var horz = 700+legendRectSize;                       // NEW
						    var vert = i * height +90;                       // NEW
						    return 'translate(' + horz + ',' + vert + ')';        // NEW
						  });                                                     // NEW
						legend.append('rect')                                     // NEW
						  .attr('width', legendRectSize)                          // NEW
						  .attr('height', legendRectSize)                         // NEW
						  .style('fill', function(d, i) { return colors[i];})                                   // NEW
						  .style('stroke', 'black');                                // NEW
						legend.append('text')                                     // NEW
						  .attr('x', legendRectSize + legendSpacing)              // NEW
						  .attr('y', legendRectSize - legendSpacing)
							.style("fill", function(d,i){return "black";})          // NEW
						  .text(function(d) { return d; });

				return;
			}

			// Scale the range of the data in the domains
			x.domain(binned_Accept.map(function(d) { return d.x; }));
			y.domain([0, d3.max(binned_Accept, function(d) { return d.y; })]);

			// append the rectangles for the bar chart
			svg.selectAll(".bar")
				.data(binned_Accept)
				.enter().append("rect")
				.attr("class", "bar")
				.on("mouseover", onMouseOver)
				.on("mouseout", onMouseOut)
				.attr("x", function(d) { return x(d.x); })
				.attr("width", x.bandwidth())
				.transition()
				.ease(d3.easeBackIn)
				.duration(400)
				.delay(function (d, i) {
					 return i * 50;
				 })
				.attr("y", function(d) { return y(d.y); })
				.style("fill",function(d,i)
				{
					return colors[i];
				})
				.attr("height", function(d) { return height - y(d.y); });

			// add the x Axis
			svg.append("g")
				.attr("transform", "translate(0," + height + ")")
				.call(d3.axisBottom(x));

			// add the y Axis
			svg.append("g")
				.call(d3.axisLeft(y));
		}

		function transition_bars_prbpris2(bin_size)
		{
			console.log("hello");

			svg.selectAll("*").remove();

			max=0
			min=100000
			csv_data.forEach(function(d) {
				d.prbpris = +d.prbpris;
				if(d.prbpris>max){
					max=d.prbpris;
				}
				if(d.prbpris<min){
					min=d.prbpris
				}
			});
			console.log(max);
			console.log(min);

			binned_data_x=['0.00-0.10', '0.10-0.20', '0.20-0.30', '0.30-0.40', '0.40-0.50', '0.50-0.60', '0.60-0.70', '0.70-0.80', '0.80-0.90', '0.90-1.00'];

			binned_data_y=[0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

			csv_data.forEach(function(d){
				binned_data_y[Math.floor((d.prbpris-min)/0.10)]++;
			});
			binned_Accept=[{}]
			binned_Accept=binned_Accept.concat([{x:binned_data_x[0], y:binned_data_y[0]}]);
			for(i=1;i<=Math.floor(bin_size*9);++i){
				binned_Accept=binned_Accept.concat([{x:binned_data_x[i], y:binned_data_y[i]}]);
			}
			binned_Accept.shift();
			console.log(binned_Accept);

			if(document.getElementById('pie_button').checked)
			{
				svg.selectAll("*").remove();
								//var width = 300,
							// Think back to 5th grade. Radius is 1/2 of the diameter. What is the limiting factor on the diameter? Width or height, whichever is smaller
							radius = Math.min(width, height) / 2;

							var pie = d3.pie()
							.value(function(d) { return d.y; })(binned_Accept);

							var arc = d3.arc()
							.outerRadius(radius - 10)
							.innerRadius(0);

						var labelArc = d3.arc()
							.outerRadius(radius - 40)
							.innerRadius(radius - 40);

								var g = svg.selectAll("arc")
									.data(pie)
									.enter().append("g")
									.attr("class", "arc")
									.attr('transform', 'translate(' + width/2 +  ',' + height/2 +')');

									g.append("path")
							.attr("d", arc)
							.on("mouseover",function(d,i) {
             g.append("text")
                .attr("dy", ".5em")
								.attr('stroke', 'black')
                .style("text-anchor", "middle")
								.style("font-size", 40)
                .style("fill", function(d,i){return "white";})
                .text("Value: "+d.data.y)
            })
						.on("mouseout", function(d) {

                g.select("text").remove();
            })
							.style("fill", function(d, i) { return colors[i];});

							var legendRectSize = 18;                                  // NEW
						  var legendSpacing = 4;

						  var legend = svg.selectAll('.legend')                     // NEW
						  .data(binned_data_x)                                   // NEW
						  .enter()                                                // NEW
						  .append('g')                                            // NEW
						  .attr('class', 'legend')                                // NEW
						  .attr('transform', function(d, i) {                     // NEW
						    var height = legendRectSize + legendSpacing;          // NEW
						    var offset =  height * colors.length / 2;     // NEW
						    var horz = 700+legendRectSize;                       // NEW
						    var vert = i * height +90;                       // NEW
						    return 'translate(' + horz + ',' + vert + ')';        // NEW
						  });                                                     // NEW
						legend.append('rect')                                     // NEW
						  .attr('width', legendRectSize)                          // NEW
						  .attr('height', legendRectSize)                         // NEW
						  .style('fill', function(d, i) { return colors[i];})                                   // NEW
						  .style('stroke', 'black');                                // NEW
						legend.append('text')                                     // NEW
						  .attr('x', legendRectSize + legendSpacing)              // NEW
						  .attr('y', legendRectSize - legendSpacing)
							.style("fill", function(d,i){return "black";})          // NEW
						  .text(function(d) { return d; });

				return;
			}


			if(document.getElementById('fdl_button').checked)
			{

				var color = d3.scaleOrdinal(d3.schemeCategory20);

				var simulation = d3.forceSimulation()
						.force("link", d3.forceLink().id(function(d) { return d.id; }))
						.force("charge", d3.forceManyBody())
						.force("center", d3.forceCenter(width / 2, height / 2));
				simulation_global=simulation

				d3.json("prbpris_fdl.json", function(error, graph) {
					if (error)
					{
						console.log(error)
						throw error;
					}

					var link = svg.append("g")
							.attr("class", "links")
						.selectAll("line")
						.data(graph.links)
						.enter().append("line")
							.attr("stroke-width", function(d) { return 1; });

					var node = svg.append("g")
							.attr("class", "nodes")
						.selectAll("g")
						.data(graph.nodes)
						.enter().append("g")

					var circles = node.append("circle")
							.attr("r", 5)
							.attr("fill", function(d) { return color(d.group); })
							.call(d3.drag()
									.on("start", dragstarted)
									.on("drag", dragged)
									.on("end", dragended));


					var lables = node.append("text")
					.style("font-size", "10px")
							.text(function(d) {
								return d.id;
							})
							.attr('x', 6)
							.attr('y', 3);


					node.append("title")
							.text(function(d) { return d.id; });

					simulation
							.nodes(graph.nodes)
							.on("tick", ticked);

					simulation.force("link")
							.links(graph.links);

					function ticked() {
						link
								.attr("x1", function(d) { return d.source.x; })
								.attr("y1", function(d) { return d.source.y; })
								.attr("x2", function(d) { return d.target.x; })
								.attr("y2", function(d) { return d.target.y; });

						node
								.attr("transform", function(d) {
									return "translate(" + d.x + "," + d.y + ")";
								})
					}
				});

				return;
			}


			// Scale the range of the data in the domains
			x.domain(binned_Accept.map(function(d) { return d.x; }));
			y.domain([0, d3.max(binned_Accept, function(d) { return d.y; })]);

			// append the rectangles for the bar chart
			svg.selectAll(".bar")
				.data(binned_Accept)
				.enter().append("rect")
				.attr("class", "bar")
				.on("mouseover", onMouseOver)
				.on("mouseout", onMouseOut)
				.attr("x", function(d) { return x(d.x); })
				.attr("width", x.bandwidth())
				.transition()
				.ease(d3.easeBackIn)
				.duration(400)
				.delay(function (d, i) {
					 return i * 50;
				 })
				.attr("y", function(d) { return y(d.y); })
				.style("fill",function(d,i)
				{
					return colors[i];
				})
				.attr("height", function(d) { return height - y(d.y); });

			// add the x Axis
			svg.append("g")
				.attr("transform", "translate(0," + height + ")")
				.call(d3.axisBottom(x));

			// add the y Axis
			svg.append("g")
				.call(d3.axisLeft(y));
		}

		function transition_bars_pctmin2(bin_size)
		{
			console.log("hello");

			svg.selectAll("*").remove();

			max=0
			min=100000
			csv_data.forEach(function(d) {
				d.pctmin = +d.pctmin;
				if(d.pctmin>max){
					max=d.pctmin;
				}
				if(d.pctmin<min){
					min=d.pctmin
				}
			});
			console.log(max);
			console.log(min);

			binned_data_x=['0-7', '7-14', '14-21', '21-28', '28-35', '35-42', '42-49', '49-56', '56-63', '63-70'];

			binned_data_y=[0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

			csv_data.forEach(function(d){
				binned_data_y[Math.floor((d.pctmin-min)/7)]++;
			});
			binned_Accept=[{}]
			binned_Accept=binned_Accept.concat([{x:binned_data_x[0], y:binned_data_y[0]}]);
			for(i=1;i<=Math.floor(bin_size*9);++i){
				binned_Accept=binned_Accept.concat([{x:binned_data_x[i], y:binned_data_y[i]}]);
			}
			binned_Accept.shift();
			console.log(binned_Accept);

			if(document.getElementById('pie_button').checked)
			{
				svg.selectAll("*").remove();
								//var width = 300,
							// Think back to 5th grade. Radius is 1/2 of the diameter. What is the limiting factor on the diameter? Width or height, whichever is smaller
							radius = Math.min(width, height) / 2;

							var pie = d3.pie()
							.value(function(d) { return d.y; })(binned_Accept);

							var arc = d3.arc()
							.outerRadius(radius - 10)
							.innerRadius(0);

						var labelArc = d3.arc()
							.outerRadius(radius - 40)
							.innerRadius(radius - 40);

								var g = svg.selectAll("arc")
									.data(pie)
									.enter().append("g")
									.attr("class", "arc")
									.attr('transform', 'translate(' + width/2 +  ',' + height/2 +')');

									g.append("path")
							.attr("d", arc)
							.on("mouseover",function(d,i) {
             g.append("text")
                .attr("dy", ".5em")
								.attr('stroke', 'black')
                .style("text-anchor", "middle")
								.style("font-size", 40)
                .style("fill", function(d,i){return "white";})
                .text("Value: "+d.data.y)
            })
						.on("mouseout", function(d) {

                g.select("text").remove();
            })
							.style("fill", function(d, i) { return colors[i];});

							var legendRectSize = 18;                                  // NEW
						  var legendSpacing = 4;

						  var legend = svg.selectAll('.legend')                     // NEW
						  .data(binned_data_x)                                   // NEW
						  .enter()                                                // NEW
						  .append('g')                                            // NEW
						  .attr('class', 'legend')                                // NEW
						  .attr('transform', function(d, i) {                     // NEW
						    var height = legendRectSize + legendSpacing;          // NEW
						    var offset =  height * colors.length / 2;     // NEW
						    var horz = 700+legendRectSize;                       // NEW
						    var vert = i * height +90;                       // NEW
						    return 'translate(' + horz + ',' + vert + ')';        // NEW
						  });                                                     // NEW
						legend.append('rect')                                     // NEW
						  .attr('width', legendRectSize)                          // NEW
						  .attr('height', legendRectSize)                         // NEW
						  .style('fill', function(d, i) { return colors[i];})                                   // NEW
						  .style('stroke', 'black');                                // NEW
						legend.append('text')                                     // NEW
						  .attr('x', legendRectSize + legendSpacing)              // NEW
						  .attr('y', legendRectSize - legendSpacing)
							.style("fill", function(d,i){return "black";})          // NEW
						  .text(function(d) { return d; });

				return;
			}

			// Scale the range of the data in the domains
			x.domain(binned_Accept.map(function(d) { return d.x; }));
			y.domain([0, d3.max(binned_Accept, function(d) { return d.y; })]);

			// append the rectangles for the bar chart
			svg.selectAll(".bar")
				.data(binned_Accept)
				.enter().append("rect")
				.attr("class", "bar")
				.on("mouseover", onMouseOver)
				.on("mouseout", onMouseOut)
				.attr("x", function(d) { return x(d.x); })
				.attr("width", x.bandwidth())
				.transition()
				.ease(d3.easeBackIn)
				.duration(400)
				.delay(function (d, i) {
					 return i * 50;
				 })
				.attr("y", function(d) { return y(d.y); })
				.style("fill",function(d,i)
				{
					return colors[i];
				})
				.attr("height", function(d) { return height - y(d.y); });

			// add the x Axis
			svg.append("g")
				.attr("transform", "translate(0," + height + ")")
				.call(d3.axisBottom(x));

			// add the y Axis
			svg.append("g")
				.call(d3.axisLeft(y));
		}

		function transition_bars_prbarr2(bin_size)
		{
			console.log("hello");

			svg.selectAll("*").remove();

			max=0
			min=100000
			csv_data.forEach(function(d) {
				d.prbarr = +d.prbarr;
				if(d.prbarr>max){
					max=d.prbarr;
				}
				if(d.prbarr<min){
					min=d.prbarr
				}
			});
			console.log(max);
			console.log(min);

			binned_data_x=['0.00-0.10', '0.10-0.20', '0.20-0.30', '0.30-0.40', '0.40-0.50', '0.50-0.60', '0.60-0.70', '0.70-0.80', '0.80-0.90', '0.90-1.00'];

			binned_data_y=[0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

			csv_data.forEach(function(d){
				binned_data_y[Math.floor((d.prbarr-min)/0.10)]++;
			});
			binned_Accept=[{}]
			binned_Accept=binned_Accept.concat([{x:binned_data_x[0], y:binned_data_y[0]}]);
			for(i=1;i<=Math.floor(bin_size*9);++i){
				binned_Accept=binned_Accept.concat([{x:binned_data_x[i], y:binned_data_y[i]}]);
			}
			binned_Accept.shift();
			console.log(binned_Accept);

			if(document.getElementById('pie_button').checked)
			{
				svg.selectAll("*").remove();
								//var width = 300,
							// Think back to 5th grade. Radius is 1/2 of the diameter. What is the limiting factor on the diameter? Width or height, whichever is smaller
							radius = Math.min(width, height) / 2;

							var pie = d3.pie()
							.value(function(d) { return d.y; })(binned_Accept);

							var arc = d3.arc()
							.outerRadius(radius - 10)
							.innerRadius(0);

						var labelArc = d3.arc()
							.outerRadius(radius - 40)
							.innerRadius(radius - 40);

								var g = svg.selectAll("arc")
									.data(pie)
									.enter().append("g")
									.attr("class", "arc")
									.attr('transform', 'translate(' + width/2 +  ',' + height/2 +')');

									g.append("path")
							.attr("d", arc)
							.on("mouseover",function(d,i) {
             g.append("text")
                .attr("dy", ".5em")
								.attr('stroke', 'black')
                .style("text-anchor", "middle")
								.style("font-size", 40)
                .style("fill", function(d,i){return "white";})
                .text("Value: "+d.data.y)
            })
						.on("mouseout", function(d) {

                g.select("text").remove();
            })
							.style("fill", function(d, i) { return colors[i];});

							var legendRectSize = 18;                                  // NEW
						  var legendSpacing = 4;

						  var legend = svg.selectAll('.legend')                     // NEW
						  .data(binned_data_x)                                   // NEW
						  .enter()                                                // NEW
						  .append('g')                                            // NEW
						  .attr('class', 'legend')                                // NEW
						  .attr('transform', function(d, i) {                     // NEW
						    var height = legendRectSize + legendSpacing;          // NEW
						    var offset =  height * colors.length / 2;     // NEW
						    var horz = 700+legendRectSize;                       // NEW
						    var vert = i * height +90;                       // NEW
						    return 'translate(' + horz + ',' + vert + ')';        // NEW
						  });                                                     // NEW
						legend.append('rect')                                     // NEW
						  .attr('width', legendRectSize)                          // NEW
						  .attr('height', legendRectSize)                         // NEW
						  .style('fill', function(d, i) { return colors[i];})                                   // NEW
						  .style('stroke', 'black');                                // NEW
						legend.append('text')                                     // NEW
						  .attr('x', legendRectSize + legendSpacing)              // NEW
						  .attr('y', legendRectSize - legendSpacing)
							.style("fill", function(d,i){return "black";})          // NEW
						  .text(function(d) { return d; });

				return;
			}



			if(document.getElementById('fdl_button').checked)
			{

				var color = d3.scaleOrdinal(d3.schemeCategory20);

				var simulation = d3.forceSimulation()
						.force("link", d3.forceLink().id(function(d) { return d.id; }))
						.force("charge", d3.forceManyBody())
						.force("center", d3.forceCenter(width / 2, height / 2));
				simulation_global=simulation

				d3.json("prbarr_fdl.json", function(error, graph) {
					if (error)
					{
						console.log(error)
						throw error;
					}

					var link = svg.append("g")
							.attr("class", "links")
						.selectAll("line")
						.data(graph.links)
						.enter().append("line")
							.attr("stroke-width", function(d) { return 1; });

					var node = svg.append("g")
							.attr("class", "nodes")
						.selectAll("g")
						.data(graph.nodes)
						.enter().append("g")

					var circles = node.append("circle")
							.attr("r", 5)
							.attr("fill", function(d) { return color(d.group); })
							.call(d3.drag()
									.on("start", dragstarted)
									.on("drag", dragged)
									.on("end", dragended));


					var lables = node.append("text")
					.style("font-size", "10px")
							.text(function(d) {
								return d.id;
							})
							.attr('x', 6)
							.attr('y', 3);


					node.append("title")
							.text(function(d) { return d.id; });

					simulation
							.nodes(graph.nodes)
							.on("tick", ticked);

					simulation.force("link")
							.links(graph.links);

					function ticked() {
						link
								.attr("x1", function(d) { return d.source.x; })
								.attr("y1", function(d) { return d.source.y; })
								.attr("x2", function(d) { return d.target.x; })
								.attr("y2", function(d) { return d.target.y; });

						node
								.attr("transform", function(d) {
									return "translate(" + d.x + "," + d.y + ")";
								})
					}
				});

				return;
			}

			// Scale the range of the data in the domains
			x.domain(binned_Accept.map(function(d) { return d.x; }));
			y.domain([0, d3.max(binned_Accept, function(d) { return d.y; })]);

			// append the rectangles for the bar chart
			svg.selectAll(".bar")
				.data(binned_Accept)
				.enter().append("rect")
				.attr("class", "bar")
				.on("mouseover", onMouseOver)
				.on("mouseout", onMouseOut)
				.attr("x", function(d) { return x(d.x); })
				.attr("width", x.bandwidth())
				.transition()
				.ease(d3.easeBackIn)
				.duration(400)
				.delay(function (d, i) {
					 return i * 50;
				 })
				.attr("y", function(d) { return y(d.y); })
				.style("fill",function(d,i)
				{
					return colors[i];
				})
				.attr("height", function(d) { return height - y(d.y); });

			// add the x Axis
			svg.append("g")
				.attr("transform", "translate(0," + height + ")")
				.call(d3.axisBottom(x));

			// add the y Axis
			svg.append("g")
				.call(d3.axisLeft(y));
		}

		function transition_bars_prbconv2(bin_size)
		{
			console.log("hello");

			svg.selectAll("*").remove();

			max=0
			min=100000
			csv_data.forEach(function(d) {
				d.prbconv = +d.prbconv;
				if(d.prbconv>max){
					max=d.prbconv;
				}
				if(d.prbconv<min){
					min=d.prbconv
				}
			});
			console.log(max);
			console.log(min);

			binned_data_x=['0.00-0.10', '0.10-0.20', '0.20-0.30', '0.30-0.40', '0.40-0.50', '0.50-0.60', '0.60-0.70', '0.70-0.80', '0.80-0.90', '0.90-1.00'];

			binned_data_y=[0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

			csv_data.forEach(function(d){
				binned_data_y[Math.floor((d.prbconv-min)/0.10)]++;
			});
			binned_Accept=[{}]
			binned_Accept=binned_Accept.concat([{x:binned_data_x[0], y:binned_data_y[0]}]);
			for(i=1;i<=Math.floor(bin_size*9);++i){
				binned_Accept=binned_Accept.concat([{x:binned_data_x[i], y:binned_data_y[i]}]);
			}
			binned_Accept.shift();
			console.log(binned_Accept);

			if(document.getElementById('pie_button').checked)
			{
				svg.selectAll("*").remove();
								//var width = 300,
							// Think back to 5th grade. Radius is 1/2 of the diameter. What is the limiting factor on the diameter? Width or height, whichever is smaller
							radius = Math.min(width, height) / 2;

							var pie = d3.pie()
							.value(function(d) { return d.y; })(binned_Accept);

							var arc = d3.arc()
							.outerRadius(radius - 10)
							.innerRadius(0);

						var labelArc = d3.arc()
							.outerRadius(radius - 40)
							.innerRadius(radius - 40);

								var g = svg.selectAll("arc")
									.data(pie)
									.enter().append("g")
									.attr("class", "arc")
									.attr('transform', 'translate(' + width/2 +  ',' + height/2 +')');

									g.append("path")
							.attr("d", arc)
							.on("mouseover",function(d,i) {
             g.append("text")
                .attr("dy", ".5em")
								.attr('stroke', 'black')
                .style("text-anchor", "middle")
								.style("font-size", 40)
                .style("fill", function(d,i){return "white";})
                .text("Value: "+d.data.y)
            })
						.on("mouseout", function(d) {

                g.select("text").remove();
            })
							.style("fill", function(d, i) { return colors[i];});

							var legendRectSize = 18;                                  // NEW
						  var legendSpacing = 4;

						  var legend = svg.selectAll('.legend')                     // NEW
						  .data(binned_data_x)                                   // NEW
						  .enter()                                                // NEW
						  .append('g')                                            // NEW
						  .attr('class', 'legend')                                // NEW
						  .attr('transform', function(d, i) {                     // NEW
						    var height = legendRectSize + legendSpacing;          // NEW
						    var offset =  height * colors.length / 2;     // NEW
						    var horz = 700+legendRectSize;                       // NEW
						    var vert = i * height +90;                       // NEW
						    return 'translate(' + horz + ',' + vert + ')';        // NEW
						  });                                                     // NEW
						legend.append('rect')                                     // NEW
						  .attr('width', legendRectSize)                          // NEW
						  .attr('height', legendRectSize)                         // NEW
						  .style('fill', function(d, i) { return colors[i];})                                   // NEW
						  .style('stroke', 'black');                                // NEW
						legend.append('text')                                     // NEW
						  .attr('x', legendRectSize + legendSpacing)              // NEW
						  .attr('y', legendRectSize - legendSpacing)
							.style("fill", function(d,i){return "black";})          // NEW
						  .text(function(d) { return d; });

				return;
			}

			if(document.getElementById('fdl_button').checked)
			{

				var color = d3.scaleOrdinal(d3.schemeCategory20);

				var simulation = d3.forceSimulation()
						.force("link", d3.forceLink().id(function(d) { return d.id; }))
						.force("charge", d3.forceManyBody())
						.force("center", d3.forceCenter(width / 2, height / 2));
				simulation_global=simulation

				d3.json("prbconv_fdl.json", function(error, graph) {
					if (error)
					{
						console.log(error)
						throw error;
					}

					var link = svg.append("g")
							.attr("class", "links")
						.selectAll("line")
						.data(graph.links)
						.enter().append("line")
							.attr("stroke-width", function(d) { return 1; });

					var node = svg.append("g")
							.attr("class", "nodes")
						.selectAll("g")
						.data(graph.nodes)
						.enter().append("g")

					var circles = node.append("circle")
							.attr("r", 5)
							.attr("fill", function(d) { return color(d.group); })
							.call(d3.drag()
									.on("start", dragstarted)
									.on("drag", dragged)
									.on("end", dragended));


					var lables = node.append("text")
					.style("font-size", "10px")
							.text(function(d) {
								return d.id;
							})
							.attr('x', 6)
							.attr('y', 3);


					node.append("title")
							.text(function(d) { return d.id; });

					simulation
							.nodes(graph.nodes)
							.on("tick", ticked);

					simulation.force("link")
							.links(graph.links);

					function ticked() {
						link
								.attr("x1", function(d) { return d.source.x; })
								.attr("y1", function(d) { return d.source.y; })
								.attr("x2", function(d) { return d.target.x; })
								.attr("y2", function(d) { return d.target.y; });

						node
								.attr("transform", function(d) {
									return "translate(" + d.x + "," + d.y + ")";
								})
					}
				});

				return;
			}

			// Scale the range of the data in the domains
			x.domain(binned_Accept.map(function(d) { return d.x; }));
			y.domain([0, d3.max(binned_Accept, function(d) { return d.y; })]);

			// append the rectangles for the bar chart
			svg.selectAll(".bar")
				.data(binned_Accept)
				.enter().append("rect")
				.attr("class", "bar")
				.on("mouseover", onMouseOver)
				.on("mouseout", onMouseOut)
				.attr("x", function(d) { return x(d.x); })
				.attr("width", x.bandwidth())
				.transition()
				.ease(d3.easeBackIn)
				.duration(400)
				.delay(function (d, i) {
					 return i * 50;
				 })
				.attr("y", function(d) { return y(d.y); })
				.style("fill",function(d,i)
				{
					return colors[i];
				})
				.attr("height", function(d) { return height - y(d.y); });

			// add the x Axis
			svg.append("g")
				.attr("transform", "translate(0," + height + ")")
				.call(d3.axisBottom(x));

			// add the y Axis
			svg.append("g")
				.call(d3.axisLeft(y));
		}


		function transition_bars_polpc2(bin_size)
		{
			console.log("hello");

			svg.selectAll("*").remove();

			max=0
			min=100000
			csv_data.forEach(function(d) {
				d.polpc = +d.polpc;
				if(d.polpc>max){
					max=d.polpc;
				}
				if(d.polpc<min){
					min=d.polpc
				}
			});
			console.log(max);
			console.log(min);

			binned_data_x=['0-0.0036', '0.0036-0.0072', '0.0072-0.0108', '0.0108-0.0144', '0.0144-0.0180', '0.0180-0.0216', '0.0216-0.0252', '0.0252-0.0288', '0.0288-0.0324', '0.0324-0.0360'];

			binned_data_y=[0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

			csv_data.forEach(function(d){
				binned_data_y[Math.floor((d.polpc-min)/0.0036)]++;
			});
			binned_Accept=[{}]
			binned_Accept=binned_Accept.concat([{x:binned_data_x[0], y:binned_data_y[0]}]);
			for(i=1;i<=Math.floor(bin_size*9);++i){
				binned_Accept=binned_Accept.concat([{x:binned_data_x[i], y:binned_data_y[i]}]);
			}
			binned_Accept.shift();
			console.log(binned_Accept);

			if(document.getElementById('pie_button').checked)
			{
				svg.selectAll("*").remove();
								//var width = 300,
							// Think back to 5th grade. Radius is 1/2 of the diameter. What is the limiting factor on the diameter? Width or height, whichever is smaller
							radius = Math.min(width, height) / 2;

							var pie = d3.pie()
							.value(function(d) { return d.y; })(binned_Accept);

							var arc = d3.arc()
							.outerRadius(radius - 10)
							.innerRadius(0);

						var labelArc = d3.arc()
							.outerRadius(radius - 40)
							.innerRadius(radius - 40);

								var g = svg.selectAll("arc")
									.data(pie)
									.enter().append("g")
									.attr("class", "arc")
									.attr('transform', 'translate(' + width/2 +  ',' + height/2 +')');

									g.append("path")
							.attr("d", arc)
							.on("mouseover",function(d,i) {
             g.append("text")
                .attr("dy", ".5em")
								.attr('stroke', 'black')
                .style("text-anchor", "middle")
								.style("font-size", 40)
                .style("fill", function(d,i){return "white";})
                .text("Value: "+d.data.y)
            })
						.on("mouseout", function(d) {

                g.select("text").remove();
            })
							.style("fill", function(d, i) { return colors[i];});

							var legendRectSize = 18;                                  // NEW
						  var legendSpacing = 4;

						  var legend = svg.selectAll('.legend')                     // NEW
						  .data(binned_data_x)                                   // NEW
						  .enter()                                                // NEW
						  .append('g')                                            // NEW
						  .attr('class', 'legend')                                // NEW
						  .attr('transform', function(d, i) {                     // NEW
						    var height = legendRectSize + legendSpacing;          // NEW
						    var offset =  height * colors.length / 2;     // NEW
						    var horz = 700+legendRectSize;                       // NEW
						    var vert = i * height +90;                       // NEW
						    return 'translate(' + horz + ',' + vert + ')';        // NEW
						  });                                                     // NEW
						legend.append('rect')                                     // NEW
						  .attr('width', legendRectSize)                          // NEW
						  .attr('height', legendRectSize)                         // NEW
						  .style('fill', function(d, i) { return colors[i];})                                   // NEW
						  .style('stroke', 'black');                                // NEW
						legend.append('text')                                     // NEW
						  .attr('x', legendRectSize + legendSpacing)              // NEW
						  .attr('y', legendRectSize - legendSpacing)
							.style("fill", function(d,i){return "black";})          // NEW
						  .text(function(d) { return d; });

				return;
			}

			// Scale the range of the data in the domains
			x.domain(binned_Accept.map(function(d) { return d.x; }));
			y.domain([0, d3.max(binned_Accept, function(d) { return d.y; })]);

			// append the rectangles for the bar chart
			svg.selectAll(".bar")
				.data(binned_Accept)
				.enter().append("rect")
				.attr("class", "bar")
				.on("mouseover", onMouseOver)
				.on("mouseout", onMouseOut)
				.attr("x", function(d) { return x(d.x); })
				.attr("width", x.bandwidth())
				.transition()
				.ease(d3.easeBackIn)
				.duration(400)
				.delay(function (d, i) {
					 return i * 50;
				 })
				.attr("y", function(d) { return y(d.y); })
				.style("fill",function(d,i)
				{
					return colors[i];
				})
				.attr("height", function(d) { return height - y(d.y); });

			// add the x Axis
			svg.append("g")
				.attr("transform", "translate(0," + height + ")")
				.call(d3.axisBottom(x));

			// add the y Axis
			svg.append("g")
				.call(d3.axisLeft(y));
		}



				function transition_bars_crmrte2(bin_size)
				{
					console.log("hello");

					svg.selectAll("*").remove();

					max=0
					min=100000
					csv_data.forEach(function(d) {
						d.crmrte = +d.crmrte;
						if(d.crmrte>max){
							max=d.crmrte;
						}
						if(d.crmrte<min){
							min=d.crmrte
						}
					});
					console.log(max);
					console.log(min);

					binned_data_x=['0.000-0.020', '0.021-0.040', '0.041-0.060', '0.061-0.080', '0.081-0.100', '0.101-0.120', '0.121-0.140', '0.141-0.160', '0.161-0.180'];

					binned_data_y=[0, 0, 0, 0, 0, 0, 0, 0, 0];

					csv_data.forEach(function(d){
						binned_data_y[Math.floor((d.crmrte-min)/0.020)]++;
					});
					binned_Accept=[{}]
					binned_Accept=binned_Accept.concat([{x:binned_data_x[0], y:binned_data_y[0]}]);
					for(i=1;i<=Math.floor(bin_size*9);++i){
						binned_Accept=binned_Accept.concat([{x:binned_data_x[i], y:binned_data_y[i]}]);
					}
					binned_Accept.shift();
					console.log(binned_Accept);

					if(document.getElementById('pie_button').checked)
					{
										//var width = 300,
									// Think back to 5th grade. Radius is 1/2 of the diameter. What is the limiting factor on the diameter? Width or height, whichever is smaller
									radius = Math.min(width, height) / 2;

									var pie = d3.pie()
									.value(function(d) { return d.y; })(binned_Accept);

									var arc = d3.arc()
									.outerRadius(radius - 10)
									.innerRadius(0);

								var labelArc = d3.arc()
									.outerRadius(radius - 40)
									.innerRadius(radius - 40);

										var g = svg.selectAll("arc")
											.data(pie)
											.enter().append("g")
											.attr("class", "arc")
											.attr('transform', 'translate(' + width/2 +  ',' + height/2 +')');

											g.append("path")
									.attr("d", arc)
									.on("mouseover",function(d,i) {
		             g.append("text")
		                .attr("dy", ".5em")
										.attr('stroke', 'black')
		                .style("text-anchor", "middle")
										.style("font-size", 40)
		                .style("fill", function(d,i){return "white";})
		                .text("Value: "+d.data.y)
		            })
								.on("mouseout", function(d) {

		                g.select("text").remove();
		            })
									.style("fill", function(d, i) { return colors[i];});

									var legendRectSize = 18;                                  // NEW
								  var legendSpacing = 4;

								  var legend = svg.selectAll('.legend')                     // NEW
								  .data(binned_data_x)                                   // NEW
								  .enter()                                                // NEW
								  .append('g')                                            // NEW
								  .attr('class', 'legend')                                // NEW
								  .attr('transform', function(d, i) {                     // NEW
								    var height = legendRectSize + legendSpacing;          // NEW
								    var offset =  height * colors.length / 2;     // NEW
								    var horz = 700+legendRectSize;                       // NEW
								    var vert = i * height +90;                       // NEW
								    return 'translate(' + horz + ',' + vert + ')';        // NEW
								  });                                                     // NEW
								legend.append('rect')                                     // NEW
								  .attr('width', legendRectSize)                          // NEW
								  .attr('height', legendRectSize)                         // NEW
								  .style('fill', function(d, i) { return colors[i];})                                   // NEW
								  .style('stroke', 'black');                                // NEW
								legend.append('text')                                     // NEW
								  .attr('x', legendRectSize + legendSpacing)              // NEW
								  .attr('y', legendRectSize - legendSpacing)
									.style("fill", function(d,i){return "black";})          // NEW
								  .text(function(d) { return d; });

						return;
					}




					if(document.getElementById('fdl_button').checked)
					{

						var color = d3.scaleOrdinal(d3.schemeCategory20);

						var simulation = d3.forceSimulation()
						    .force("link", d3.forceLink().id(function(d) { return d.id; }))
						    .force("charge", d3.forceManyBody())
						    .force("center", d3.forceCenter(width / 2, height / 2));
						simulation_global=simulation

						d3.json("crmrt_fdl.json", function(error, graph) {
						  if (error)
						  {
						    console.log(error)
						    throw error;
						  }

						  var link = svg.append("g")
						      .attr("class", "links")
						    .selectAll("line")
						    .data(graph.links)
						    .enter().append("line")
						      .attr("stroke-width", function(d) { return 1; });

						  var node = svg.append("g")
						      .attr("class", "nodes")
						    .selectAll("g")
						    .data(graph.nodes)
						    .enter().append("g")

						  var circles = node.append("circle")
						      .attr("r", 5)
						      .attr("fill", function(d) { return color(d.group); })
						      .call(d3.drag()
						          .on("start", dragstarted)
						          .on("drag", dragged)
						          .on("end", dragended));


						  var lables = node.append("text")
									.style("font-size", "10px")
						      .text(function(d) {
						        return d.id;
						      })
						      .attr('x', 6)
						      .attr('y', 3);


						  node.append("title")
						      .text(function(d) { return d.id; });

						  simulation
						      .nodes(graph.nodes)
						      .on("tick", ticked);

						  simulation.force("link")
						      .links(graph.links);

						  function ticked() {
						    link
						        .attr("x1", function(d) { return d.source.x; })
						        .attr("y1", function(d) { return d.source.y; })
						        .attr("x2", function(d) { return d.target.x; })
						        .attr("y2", function(d) { return d.target.y; });

						    node
						        .attr("transform", function(d) {
						          return "translate(" + d.x + "," + d.y + ")";
						        })
						  }
						});




						return;
					}





					// Scale the range of the data in the domains
					x.domain(binned_Accept.map(function(d) { return d.x; }));
					y.domain([0, d3.max(binned_Accept, function(d) { return d.y; })]);

					// append the rectangles for the bar chart
					svg.selectAll(".bar")
						.data(binned_Accept)
						.enter().append("rect")
						.attr("class", "bar")
						.on("mouseover", onMouseOver)
						.on("mouseout", onMouseOut)
						.attr("x", function(d) { return x(d.x); })
						.attr("width", x.bandwidth())
						.transition()
						.ease(d3.easeBackIn)
						.duration(400)
						.delay(function (d, i) {
							 return i * 50;
						 })
						.attr("y", function(d) { return y(d.y); })
						.style("fill",function(d,i)
						{
							return colors[i];
						})
						.attr("height", function(d) { return height - y(d.y); });

					// add the x Axis
					svg.append("g")
						.attr("transform", "translate(0," + height + ")")
						.call(d3.axisBottom(x));

					// add the y Axis
					svg.append("g")
						.call(d3.axisLeft(y));
				}


				function bar_select()
				{

						if(document.getElementById('head').innerText=="Percentage of young males")
						{
								transition_bars_pctymle2(bin_s);
								return;
						}
						if(document.getElementById('head').innerText=="Average sentence days")
						{
								transition_bars_avgsendays2(bin_s);
								return;
						}
						if(document.getElementById('head').innerText=="Per capita tax revenue")
						{
								transition_bars_taxpc2(bin_s);
								return;
						}
						if(document.getElementById('head').innerText=="Population density")
						{
								transition_bars_taxpc2(bin_s);
								return;
						}

						if(document.getElementById('head').innerText=="Probability of prisonment")
						{
								transition_bars_prbpris2(bin_s);
								return;
						}

						if(document.getElementById('head').innerText=="Percent of minorities")
						{
								transition_bars_pctmin2(bin_s);
								return;
						}

						if(document.getElementById('head').innerText=="Probability of arrests")
						{
								transition_bars_prbarr2(bin_s);
								return;
						}

						if(document.getElementById('head').innerText=="Probability of conviction")
						{
								transition_bars_prbconv2(bin_s);
								return;
						}

						if(document.getElementById('head').innerText=="Police per capita")
						{
								transition_bars_polpc2(bin_s);
								return;
						}

						if(document.getElementById('head').innerText=="Crime Rates (North Carolina)")
						{
								transition_bars_crmrte2(bin_s);
								return;
						}

				}
