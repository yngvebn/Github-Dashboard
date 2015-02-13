angular.module('app', []);


function CommitsController($scope) {
    var vm = this;
    vm.commitData = [];

    var nextCommitId = 'commit-N'
    function generateNextCommitId(){
        nextCommitId = 'd'+(Math.ceil(Math.random()*100000)).toString();
    }
    setInterval(function() {
        $scope.$apply(function() {


            var lastCommit = vm.commitData[vm.commitData.length - 1];
            var randomLevel = Math.ceil(Math.random() * 3);
            if (Math.ceil(Math.random() * 4) == 2) {
                var randomIndex = Math.floor(Math.random() * vm.commitData.length);
                console.log('existing parent', randomIndex);
                lastCommit = vm.commitData[randomIndex];

            }
            var commit = {
                id: nextCommitId,
                level: randomLevel
            }

            generateNextCommitId();
            commit.parent = nextCommitId;

            vm.commitData.push(commit);
        });
    }, 5000);

    /*setInterval(function(){
        $scope.$apply(function(){
            var randomIndex = Math.floor(Math.random()*vm.commitData.length);
            var randomCommit = vm.commitData[randomIndex];
            var randomLevel = Math.ceil(Math.random()*3);
            randomCommit.level = randomLevel;
            //console.log(vm.commitData[randomIndex])
        });
    }, 1000);*/
}

angular.module('app').controller('Commits', CommitsController);


function PositionService(){
    var service = {
        updatePositions: updatePositions
    }

    var struct = {
        commits: {
            id: 'abc',
            parents: ['', ''],
            heads: ['', ''],
            belongsTo: ['master', 'develop']
            time: '20150101T080000Z'
        },
        branches: {
            master: {
                sha: 'abc',
                color: 'black',
                lane: 1
            },
            develop: {
                sha: 'cde',
                color: 'blue',
                lane: 2
            }
        }
    }

    function updatePositions(commitData){
        // start by assigning a lane to all branches
        // set orphan commit-position for branch commit at x: initialX, y: initialY+(lane*laneHeight)
        // set next orphan commit-position for branch at x: getPositionBasedOnTimeStamp(commits.time??), y: initialY+(lane*laneHeight)
        // start calculating commit-positions for the branches - Each commit should now either be the branch HEAD or the parent of HEAD
        // if the commit is actually the sha of a branch, put the branch name in [heads]
        // 

    }
}

angular.module('app').factory('PositionService', PositionService);

function GitGraphDirective() {
    return {
        restrict: 'E',
        template: '<div></div>',
        scope: {
            data: '='
        },
        link: function(scope, element) {
            var self = this;
            console.log(element[0].parentNode.clientWidth);
            var options = {
                initialX: (element[0].parentNode.clientWidth) / 2,
                initialY: 200
            }

            self.renderCircles = renderCircles;
            self.findCommit = findCommit;
            self.render = render;
            self.renderPointers = renderPointers;
            self.renderCommits = renderCommits;
            self.updatePositionData = updatePositionData;
            self.fixCollisions = fixCollisions;



            element.attr('id', (element.attr('id') || '__container'));

            self.render(element.attr('id'));

            scope.$watch('data', function() {
                self.renderCommits();
            }, true);

            function findCommit(ref) {
                return _.find(scope.data, {
                    id: ref
                });
            }

            function setLinePoints(selection) {
                function getLineData(d) {
                    var points = [];
                    var startPoint = {
                        x: options.initialX,
                        y: options.initialY
                    };
                    if (d.parent) {
                        var parent = findCommit(d.parent);
                        if(parent){
                            startPoint = {
                                x: parent.cx,
                                y: parent.cy
                            };
                        }

                    }
                    points.push(startPoint);
                    if (startPoint.y != d.cy) {
                        points.push({
                            x: startPoint.x,
                            y: d.cy
                        });
                        points.push({
                            x: startPoint.x,
                            y: d.cy
                        });
                    }
                    points.push({
                        x: d.cx,
                        y: d.cy
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
                    .attr('stroke', 'green')
                    .attr('stroke-width', 4)
                    .attr('fill', 'none');
            }

            function renderPointers() {
                var existing = this.pointerBox.selectAll('path.commit')
                    .data(scope.data, function(d) {
                        return d.id
                    }).attr('id', function(d) {
                        return d.id + '-to-' + d.parent;
                    });

                existing.transition()
                    .duration(200)
                    .call(setLinePoints);

                newPointers = existing
                    .enter()
                    .append('svg:path')
                    .call(setLinePoints)
                    .attr('id', function(d) {
                        return d.id + '-to-' + d.parent;
                    })
                    .classed('commit', true);


            }


            function fixCollisions(point, data, id) {
                var elementAtPoint = _.chain(data).filter(function(i) {
                    return i.id !== id
                }).find(point).value();
                if (!elementAtPoint) return point;
                // find y-positions in same X-position
                var yPositionsAtX = _.chain(data).filter(function(i) {
                    return i.id !== id
                }).filter({
                    cx: point.cx
                }).pluck('cy').value();
                var interval = 30;
                var currentTest = options.initialY + interval;
                var switcher = -1;
                while (yPositionsAtX.indexOf(currentTest) > -1) {
                    interval = (interval + 30) * switcher;
                    currentTest = options.initialY + interval;
                    switcher = switcher * -1;
                }
                point.cy = currentTest;
                return point;

            }

            function updatePositionData() {
                angular.forEach(scope.data, function(item) {
                    var original = angular.copy(item);
                    var parent = self.findCommit(item.parent);
                    if (!parent) {
                        item.cx = options.initialX;
                        item.cy = options.initialY;
                    } else {
                        var projectedPoint = {
                            cx: parent.cx - 30,
                            cy: parent.cy
                        };
                        projectedPoint = self.fixCollisions(projectedPoint, scope.data, item.id);
                        item.cy = projectedPoint.cy;
                        item.cx = projectedPoint.cx;
                    }
                    if(!angular.equals(item, original)){
                        console.log(item, original, parent);
                    }
                });
            }

            function renderCircles() {
                var existing, newCircles;

                existing = this.commitBox.selectAll('circle.commit')
                    .data(scope.data, function(d) {
                        return d.id;
                    });

                existing.transition()
                    .duration(200)
                    .call(setPosition);


                newCircles = existing
                    .enter()
                    .append('svg:circle')
                    .classed('commit', true)
                    .call(setPosition)
                    .attr('r', 4);
            }

            function setPosition(selection) {

                selection
                    .attr('cx', function(item) {
                        return item.cx;
                    }).attr('cy', function(item) {
                        return item.cy;
                    });

            }

            function renderCommits() {
                self.updatePositionData();
                self.renderCircles();
                self.renderPointers();
            }

            function render(containerId) {
                var svgContainer, svg;
                var container = d3.select('body');
                svgContainer = container.append('div')
                    .classed('svg-container', true)
                    .classed('remote-container', this.isRemote);
                svg = svgContainer.append('svg:svg')

                  

                svg.attr('id', this.name)
                    .attr('width', '100%')
                    .attr('height', '100%');



                self.commitBox = svg.append('svg:g').classed('commits', true);
                self.pointerBox = svg.append('svg:g').classed('pointers', true);
                self.svgContainer = svgContainer;

                self.renderCommits();
            }


            var zoom = d3.behavior.zoom()
                .scaleExtent([1, 10])
                .on("zoom", zoomed);

            var drag = d3.behavior.drag()
                .origin(function(d) {
                    return d;
                })
                .on("dragstart", dragstarted)
                .on("drag", dragged)
                .on("dragend", dragended);

            function zoomed() {
                container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
            }

            function dragstarted(d) {
                d3.event.sourceEvent.stopPropagation();
                d3.select(this).classed("dragging", true);
            }

            function dragged(d) {
                d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
            }

            function dragended(d) {
                d3.select(this).classed("dragging", false);
            }
        }


    }
}

angular.module('app').directive('gitGraph', GitGraphDirective);