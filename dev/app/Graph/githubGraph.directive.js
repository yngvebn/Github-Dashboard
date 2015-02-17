function githubGraph($q, configuration, graphLayoutService, colors){
	return {
		restrict: 'E',
		template: '<div class="__github_graph clearfix"></div>',
		replace: true,
		scope: {
            branches: '=',
            commits: '='
        },
		link: function(scope, element){
			var self ={};
			self.svgContainer = null;
            self.element = element;
            scope.$watch('commits', function() {
                graphLayoutService.updatePositions(scope.commits, scope.branches);
            	renderCommits();
            }, true);

          
            function findCommit(sha){
            	return _.find(scope.commits, {sha: sha});
            }

            function getColorForCommit(commit){
                return colors[commit.position.lane];
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
                                y: parent.position.y < d.position.y ? parent.position.y+4 : parent.position.y-4
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
                        x: d.position.x == 0 ? 0 : d.position.x,
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
                    return lineFunction(points);
                }

                selection
                    .attr('d', function(d) {
                        return findLine(d);
                    })
                    .attr('stroke', getColorForCommit);
            }

            function renderPointers() {
                var existing = self.pointerBox.selectAll('path.commit')
                    .data(scope.commits, function(d) {
                        var to = 'initial';
                    	if(d.parents.length > 0){
                    		to = d.parents.join('_');
                    	}
                        return "_"+d.sha + '-to-' + to;
                    });

                existing
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
                    .call(setPosition)
                    .attr('fill', getColorForCommit)
                    .enter()
                    .append('svg:circle')
                    .classed('commit', true)
                    .call(setPosition)
                    .attr('fill', getColorForCommit)
                    .attr('r', 5);
            }
            function findChildren(commit){
                return _.chain(scope.commits)
                    .filter(function(c){
                        return c.parents.indexOf(commit.sha) > -1;
                    }).value();
            }

            function findBranch(name)
            {
                return _.find(scope.branches, { name: name });
            }

            function getTagRelativePosition(commit, branch){
                var branches = _.indexBy(scope.branches, 'name');
                var children = findChildren(commit);
                var relativePosition = 'right';
                //if(commit.sha === 'b1e7681280999bacb5f70497e9e83b7af834e7be') debugger;
                // if none of the branches on children are one the same lane, return 'right' 

                // if one or more on children are one the same lane return 'bottom'

                var hasChildrenInSameLane = _.chain(children)
                                              .pluck('position')
                                              .some(function(pos){
                                                    return pos.lane === commit.position.lane
                                                }).value();

                if(hasChildrenInSameLane) return 'bottom';
                return 'right';

            }


            function branchLabelX(commit, branch){
                var relativePosition = getTagRelativePosition(commit, branch);
                if(relativePosition == 'right'){
                    var thisBranchIndex = commit.branches.indexOf(branch);
                    var offset = 0;
                    if(thisBranchIndex > 0){
                        for (var i = 0; i < thisBranchIndex; i++) {
                            offset+= ((commit.branches[i].length * 8)+5)+2;
                        };
                    }
                    return commit.position.x+10+(offset);
                }
                else{
                    return commit.position.x-((branch.length * 8) + 5) / 2
                }
            }

            function branchLabelY(commit, branch){
                var relativePosition = getTagRelativePosition(commit, branch);
                if(relativePosition == 'right'){
                    return commit.position.y-10;
                }
                else{
                    return commit.position.y+10;
                }

                
            }

            function setBranchLabelPosition(selection){
                selection.
                attr('transform', function(d, i){
                    // put directly to the right if no parents exists or if parent is on different branch

                    // put below if parents exist on same branch

                    // offset if multiple branches have same sha

                    var commit = findCommit(d.sha);

                    if(commit && commit.position){
                        var x = branchLabelX(commit, d.name)
                        var y = branchLabelY(commit, d.name)
                    
                        return "translate("+x+","+y+")";
                    }
                    return "translate(0,0)";
                });
            }

            function renderBranchMarkers(){

                var branches = self.branchMarkersBox.selectAll('.branch-label-container')
                    .data(scope.branches, function(d){
                        return 'branch_head_'+d.name;
                    })
                    .attr('id', function(d){
                        return 'branch_head_'+d.name;
                    }).call(setBranchLabelPosition);
                   

                var branchContainer = branches.enter()
                    .append('svg:g')
                    .call(setBranchLabelPosition)
                    .classed('branch-label-container', true)
                    .attr('id', function(d){
                        return d.name;
                    })
                    .call(setBranchLabelPosition);


                branchContainer.append('svg:rect')
                    .classed('branch-label-background', true)
                    .attr('fill', '#555555')
                    .attr('height', function(){
                        return '1.2em';
                    })
                    .attr('width', function(d){
                        return (d.name.length * 8) + 5;
                    })
                    .attr('y', 0)
                    .attr('x', 0);

               

                 branchContainer.append('svg:text')
                    .classed('branch-label', true)
                    .text(function(d){
                        return d.name
                    })
                    .attr('text-anchor', 'middle')
                    .attr('x', function(d){
                        return ((d.name.length * 8) + 5) / 2;
                    })
                    .attr('y', '0.9em')
                    .attr('dy', '.35em');

            }

            var initial = [0,0];

            function renderCommits(){
            	renderPointers();
                renderCircles();
                renderBranchMarkers();
                var lastCommit = _.last(scope.commits);
                console.log(height(), width());
                if(lastCommit && lastCommit.position && height() && width()){
                    
                    var translateX = (width()/2)-lastCommit.position.x;
                    var translateY = (height()/2)-(_.chain(scope.commits).pluck('position').max('lane').value().lane*configuration.intervals.y)/2;
                    initial = [translateX, translateY];
                    
                }
            }

            var zoom = d3.behavior.zoom().translate(initial).on("zoom", redraw);

            function redraw() {
              reposition(d3.event.translate, d3.event.scale);
            }

            function reposition(translate, scale){
                if(!scale){
                    scale = d3.transform(self.commitContainer.attr('transform')).scale;
                }

                self.commitContainer.attr("transform",
                  "translate(" + translate + ")"
                  + " scale(" + scale + ")");
            }

            function height(){ return self.svgContainer[0][0].clientHeight; };
            function width(){ return self.svgContainer[0][0].clientWidth; };
            function render(containerId) {
            	return $q(function(resolve, reject){
	                var svgContainer, svg;
	                var container = d3.select('.__github_graph');
	                svgContainer = container.append('div')
	                    .classed('svg-container', true);
	                svg = svgContainer.append('svg:svg');

                    
	                svg.attr('id', '__github_graph')
	                    .attr('width', '100%')
	                    .attr('height', '100%')
                        .call(zoom);
           
                       

                    self.commitContainer = svg.append('svg:g').classed('commits-container', true);
                    self.svgContainer = svgContainer;
	                self.commitBox = self.commitContainer.append('svg:g').classed('commits', true);
                    self.branchMarkersBox = self.commitContainer.append('svg:g').classed('labels', true);
	                self.pointerBox = self.commitContainer.append('svg:g').classed('pointers', true);
                    self.svg = svg;
                    

	                resolve();

	            });
            }

            render().then(renderCommits);
		}
	}
}

angular.module('app').directive('githubGraph', githubGraph);