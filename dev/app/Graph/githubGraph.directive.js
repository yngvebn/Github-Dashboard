function githubGraph($q, configuration){
	return {
		restrict: 'E',
		template: '<div class="__github_graph"></div>',
		replace: true,
		scope: {
            branches: '=',
            commits: '='
        },
		link: function(scope, element){
			var self ={};
			self.svgContainer = null;
			console.log(configuration);
            scope.$watch('commits', function() {
            	renderCommits();
            }, true);

            function findCommit(sha){
            	return _.find(scope.commits, {sha: sha});
            }

            function setLinePoints(selection) {
                function getLineData(d) {
                    var points = [];
                    var startPoint = {
                        x: d.position.x,
                        y: d.position.y
                    };
                    if (d.parents.length > 0) {
                        var parent = findCommit(d.parents[0]);
                        if(parent){
                            startPoint = {
                                x: parent.position.x,
                                y: parent.position.y
                            };
                        }
                    }
                    points.push(startPoint);
                    if (startPoint.y != d.position.y) {
                        points.push({
                            x: startPoint.x,
                            y: d.position.y
                        });
                        points.push({
                            x: startPoint.x,
                            y: d.position.y
                        });
                    }
                    points.push({
                        x: d.position.x,
                        y: d.position.y
                    });
                    return points;
                }

                function findLine(item) {
                    var lineFunction = d3.svg.line()
                        .x(function(d) {
                            return d.x;
                        })
                        .y(function(d) {
                            return d.y;
                        })
                        .interpolate('basis');

                    var points = getLineData(item);
                    console.log(lineFunction(points), JSON.stringify(points));
                    return lineFunction(points);
                }

                selection
                    .attr('d', function(d) {
                        return findLine(d);
                    })
                    .attr('stroke', 'green')
                    .attr('stroke-width', 4)
                    .attr('fill', 'none');
            }

            function renderPointers() {
                var existing = self.pointerBox.selectAll('path.commit')
                    .data(scope.commits, function(d) {
                        var to = 'initial';
                    	if(d.parents.length > 0){
                    		to = d.parents.join('_');
                    	}
                        return "_"+d.sha + '-to-' + to;
                    }).attr('id', function(d) {
                    	var to = 'initial';
                    	if(d.parents.length > 0){
                    		to = d.parents.join('_');
                    	}
                        return "_"+d.sha + '-to-' + to;
                    });

                existing.transition()
                    .duration(200)
                    .call(setLinePoints);

                var newPointers = existing
                    .enter()
                    .append('svg:path')
                    .call(setLinePoints)
                    .attr('id', function(d) {
                        var to = 'initial';
                    	if(d.parents){
                    		to = d.parents.join('_');
                    	}
                        return "_"+d.sha + '-to-' + to;
                    })
                    .classed('commit', true);


            }

            function setPosition(selection){
            	selection.attr('cx', function(d){
            		if(d.position)
            			return d.position.x;
            		return 0;
            	}).attr('cy', function(d){
            		if(d.position)
						return d.position.y;
					return 0;
            	})
            }

            function renderCircles(){
            	var circles = self.commitBox.selectAll('circle.commit')
                    .data(scope.commits, function(d) {
                        return "_"+d.sha;
                    })
                    .attr('id', function(d){
                    	return "_"+d.sha;
                    })
                    .enter()
                    .append('svg:circle')
                    .classed('commit', true)
                    .call(setPosition)
                    .attr('r', 5);
            }

            function renderCommits(){
            	renderCircles();
            	renderPointers();
            }

            function render(containerId) {
            	return $q(function(resolve, reject){
	                var svgContainer, svg;
	                var container = d3.select('.__github_graph');
	                svgContainer = container.append('div')
	                    .classed('svg-container', true);
	                svg = svgContainer.append('svg:svg');

	                svg.attr('id', '__github_graph')
	                    .attr('width', '1000')
	                    .attr('height', '1000');

	                self.commitBox = svg.append('svg:g').classed('commits', true);

	                self.pointerBox = svg.append('svg:g').classed('pointers', true);
	                self.svgContainer = svgContainer;
	                resolve();
	            });
            }

            render().then(renderCommits);
		}
	}
}

angular.module('app').directive('githubGraph', githubGraph);