angular.module('app', []);


function CommitsController($scope) {
    var vm = this;
    vm.commitData = [{
        id: 'abc',
        parent: null
    }, {
        id: 'cde',
        parent: 'abc'
    }];

    setInterval(function() {
        $scope.$apply(function() {


            var lastCommit = vm.commitData[vm.commitData.length - 1];
            vm.commitData.push({
                id: 'blabla' + (vm.commitData.length - 1).toString(),
                parent: lastCommit.id
            });
        });
    }, 5000);
}

angular.module('app').controller('Commits', CommitsController);


function GitGraphDirective() {
    return {
        restrict: 'E',
        template: '<div></div>',
        scope: {
            data: '='
        },
        link: function(scope, element) {
            var self = this;
            console.log(element[0]);
            var options = {
                initialX: 40
            }
            self.renderCircles = renderCircles;
            self.findCommit = findCommit;
            self.render = render;
            element.attr('id', (element.attr('id') || '__container'));

            self.render(element.attr('id'));

            scope.$watch('data', function() {
            	self.renderCircles();
            }, true);

            function findCommit(ref) {
                return _.find(scope.data, {
                    id: ref
                });
            }


            function renderCircles() {
                var circles = this.commitBox.selectAll('circle.commit')
                    .data(scope.data, function(d) {
                        return d.id;
                    })
                    .enter()
                    .append('svg:circle')
                    .classed('commit', true)
                    .call(setPosition)
                    .attr('r', 10);
            }

            function setPosition(selection) {

                selection
                    .attr('cx', function(item) {
                        if (!item.parent) {
                            item.cx = options.initialX;
                            return options.initialX;
                        } else {
                            var parent = self.findCommit(item.parent);
                            console.log(parent);
                            item.cx = parent.cx + 50;
                            return item.cx;
                        }
                    }).attr('cy', function(item) {
                        return 100;
                    });

            }

            function render(containerId) {
                var svgContainer, svg;
                var container = d3.select('body');
                svgContainer = container.append('div')
                    .classed('svg-container', true)
                    .classed('remote-container', this.isRemote);
                svg = svgContainer.append('svg:svg');

                svg.attr('id', this.name)
                    .attr('width', '100%')
                    .attr('height', '100%');

                /*                var lineFunction = d3.svg.line()
                    .x(function(d) {
                        return d.x;
                    })
                    .y(function(d) {
                        return d.y;
                    })
                    .interpolate('basis');

                svg.append("svg:g").append("path")
                    .attr('d', lineFunction(lineData))
                    .attr('stroke', 'blue')
                    .attr('stroke-width', 2)
                    .attr('fill', 'none');
*/
                self.commitBox = svg.append('svg:g').classed('commits', true);
                self.svgContainer = svgContainer;

                self.renderCircles();
            }

        }
    }
}
angular.module('app').directive('gitGraph', GitGraphDirective);