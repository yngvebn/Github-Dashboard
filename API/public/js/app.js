(function(){
"use strict";
angular.module('Templates', []);
angular.module('app', ['LocalStorageModule', 'ui.router', 'Templates', 'Cacher']);
angular.module('Cacher', []).
factory('CacheLocal', ["$cacheFactory", function($cacheFactory) {
  var cache = $cacheFactory('someCache', {});
  var PREFIX = 'Cacher::';
  cache.get = function(key) {
    var lruEntry = localStorage.getItem(PREFIX + key);
    if (!lruEntry) return; // Cache miss
    lruEntry = JSON.parse(lruEntry);
    return lruEntry.data; // Cache hit
  };
  cache.put = function(key, value) {
    if (typeof value.then === 'function') {
      value.then(function(value) {
        localStorage.setItem(PREFIX + key, JSON.stringify(value));
      });
    } else {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    }
  };
  cache.remove = function(key) {
    localStorage.removeItem('Cacher::' + key);
  };
  cache.removeAll = function() {
    localStorage.clear();
  };
  return cache;
}]);

angular.module('app').value('configuration', {
	intervals: {
		baseline: 10,
		x: 30,
		y: 30
	}
});

angular.module('app').constant('colors', ["#ffc107","#607d8b","#5677fc","#795548","#00bcd4","#ff5722","#673ab7","#259b24","#9e9e9e","#3f51b5","#03a9f4","#8bc34a","#cddc39","#ff9800","#e91e63","#9c27b0","#e51c23","#009688","#ffeb3b"]);

angular.module('app').run(["$http", function($http) {
  	$http.defaults.headers.common.Authorization ='token f942ef5547959fd01dec56df6bbfe4a1d9692efc';
}]);
function RouteConfig($stateProvider, $urlRouterProvider, $locationProvider){
	$urlRouterProvider.otherwise("/");
	$stateProvider
		.state('home', {
			url: '/',
			views: {
				main: {
					templateUrl: 'Commits/Commits.tpl.html',
					controller: 'Commits',
					controllerAs: 'commits'		
				},
				header: {
					templateUrl: 'Auth/GitHub.tpl.html',
					controller: 'GitHub',
					controllerAs: 'github'
				}			
			}

		})
		.state('github', {
			url: '/git/login',
			templateUrl: 'Auth/GitHub.tpl.html',
			controllerAs: 'github',
			controller: 'GitHub'
		})
		.state('githubCallback', {
			url: '/git/callback?code',
			views: { 
				main: {
					templateUrl: 'Auth/Callback.tpl.html',
					controllerAs: 'callback',
					controller: 'Callback'		
				}
			}
			
		});

	$locationProvider.html5Mode(true);
}
RouteConfig.$inject = ["$stateProvider", "$urlRouterProvider", "$locationProvider"];

angular.module('app').config(RouteConfig);
function commitsService(Commit, Branch) {
    var data = {
        branches: [],
        commits: []
    };

    return {
        add: add,
        commits: data.commits,
        branches: data.branches,
        findCommit: findCommit,
        addBranch: addBranch
    };

    function addBranch(branch) {
        if (!findBranch(branch.name)) {
            data.branches.push(new Branch({
                name: branch.name,
                sha: branch.commit.sha
            }));
        }
    }

    function findBranch(name) {
        return _.find(data.branches, {
            name: name
        });
    }

    function getHeadsForCommit(sha) {
        return _(data.branches).filter({
            sha: sha
        }).pluck('name').value();
    }

    function findCommit(sha) {
        return _.find(data.commits, {
            sha: sha
        });
    }

    function isNewCommit(commit) {
        return !findCommit(commit.sha);
    }

    function add(commits, branch) {
        _.chain(commits)
            .map(function(c) {
                return new Commit({
                    sha: c.sha,
                    date: new Date(c.commit.committer.date),
                    branches: [branch],
                    heads: getHeadsForCommit(c.sha),
                    parents: _.pluck(c.parents, 'sha'),
                    message: c.commit.message
                });
            })
            .value()
            .forEach(function(item) {
                if (isNewCommit(item)) {
                    var insertAtIndex = _.sortedLastIndex(data.commits, item, 'date');
                    data.commits.splice(insertAtIndex, 0, item);
                } else {
                    findCommit(item.sha).addToBranch(branch);
                }
                findBranch.lastCommit = item.date;
            });

    }


}
commitsService.$inject = ["Commit", "Branch"];

angular.module('app').factory('commitsService', commitsService);
function Commits(gitHubService, commitsService) {
    var vm = this;
    vm.commitData = {
        commits: commitsService.commits,
        branches: commitsService.branches
    };
    var maxPages = 20;
    function addBranches(branches){
		_.forEach(branches, function(b){ commitsService.addBranch(b);});
    }

    function addCommits(commits, branch){
    	commitsService.add(commits, branch);
        
    }

    function loadCommits(branches, repo){
    	_.forEach(branches, function(b){
    		gitHubService.getCommits(repo, b.name)
    			.then(function(result){
   					addCommits(result.data, b.name);
   					var nextLink = getNextLink(result.headers('Link'));
   					if(nextLink && getPageNumber(nextLink) <= maxPages) loadMoreCommits(nextLink, b.name);
    			});
    	});
    	
    }

    function loadMoreCommits(nextLink, branch){
    	gitHubService.getRawUrl(nextLink)
    		.then(function(result){
    			addCommits(result.data, branch);
    			var nextLink = getNextLink(result.headers('Link'));
   				if(nextLink) loadMoreCommits(nextLink, branch);
    		});
    }

    function getNextLink(linkHeader){
    	return  (/<(.*)>; rel="next"/.exec(linkHeader) || {1: undefined })[1];
    }

    function getPageNumber(link){
        return (/page=(\d)/.exec(link) || { 1: 0})[1];
    }

    function loadRepo(repo) {
    	gitHubService.getBranches(repo).then(function(result){
    		addBranches(result.data);
    		return commitsService.branches;
    	}).then(function(result){
    		loadCommits(result, repo);
    	});
	}

    loadRepo('Rebase_Test');
}
Commits.$inject = ["gitHubService", "commitsService"];

angular.module('app').controller('Commits', Commits);
function Callback(gitHubService, $stateParams, $state){
	console.log($stateParams);

	gitHubService.getAccessToken($stateParams.code)
		.then(function(result){
			console.log(result);
			gitHubService.setToken(result.data.access_token);
		})
		.then(function(){
			$state.go('home');
		});
}
Callback.$inject = ["gitHubService", "$stateParams", "$state"];

angular.module('app').controller('Callback', Callback);
function GitHub(GitHubSettings, gitHubService){
	var vm = this;
	vm.settings = GitHubSettings;
	vm.user = null;

	gitHubService.getCurrenttUser().then(function(result){
		vm.user = result.data;
	})
}
GitHub.$inject = ["GitHubSettings", "gitHubService"];

angular.module('app').controller('GitHub', GitHub);
function gitHubService($http, GitHubSettings, CacheLocal, localStorageService, $q){
	return {
		getAccessToken: getAccessToken,
		getBranches: getBranches,
		getCommits: getCommits,
		getRawUrl: getRawUrl,
		setToken: setToken,
		getCurrenttUser: getCurrenttUser
	};

	function setToken(token){
		localStorageService.set('__github_token', token);
	}

	function getCurrenttUser(){
		return $q(function(resolve, reject){
			var token = getToken();
			if(!token) reject('not authenticated');

			getRawUrl('https://api.github.com/user').then(resolve, reject);
		})
	}

	function getToken(){
		return localStorageService.get('__github_token');
	}

	function getRawUrl(rawUrl){
		return $http({ url: rawUrl,/* cache: CacheLocal,*/ headers: { Authorization: 'token '+getToken() }, method: 'GET'});
	}
	function getCommits(repo, branch){
		return getRawUrl('https://api.github.com/repos/yngvebn/'+repo+'/commits?per_page=250&sha='+branch);
	}

	function getBranches(repo){
		return getRawUrl('https://api.github.com/repos/yngvebn/'+repo+'/branches');
	}

	function getAccessToken(code){
		var options = {
			code: code 
		};
		angular.extend(options, GitHubSettings);
		return $http.post('http://localhost:3334/api/github/accesstoken', options);
	}
}
gitHubService.$inject = ["$http", "GitHubSettings", "CacheLocal", "localStorageService", "$q"];

angular.module('app').factory('gitHubService', gitHubService);
var gitHubSettings = {
		client_id: '031c715238c99ef0a655',
		client_secret: '536a86d002591a4a0ea7deb939c3324a62b85751'
};

angular.module('app').constant('GitHubSettings', gitHubSettings);
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
            scope.$watch('commits', _.debounce(function(commits) {
                    console.log('redrawing');
                    scope.$apply(function(){
                    graphLayoutService.updatePositions(scope.commits, scope.branches).then(renderCommits);
                });
            }, 2000), true);

          
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
                        x: d.position.x === 0 ? 0 : d.position.x,
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
            	});
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
                                                    return pos.lane === commit.position.lane;
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
                        }
                    }
                    return commit.position.x+10+(offset);
                }
                else{
                    return commit.position.x-((branch.length * 8) + 5) / 2;
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
                        var x = branchLabelX(commit, d.name);
                        var y = branchLabelY(commit, d.name);
                    
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
                        return d.name;
                    })
                    .attr('text-anchor', 'middle')
                    .attr('x', function(d){
                        return ((d.name.length * 8) + 5) / 2;
                    })
                    .attr('y', '0.9em')
                    .attr('dy', '.35em');

            }

            var initial = [0,0];
             var zoom = d3.behavior.zoom().translate(initial).on("zoom", redraw);

            function renderCommits(){

            	renderPointers();
                renderCircles();
                renderBranchMarkers();
                var lastCommit = _.last(scope.commits);
                if(lastCommit && lastCommit.position && height() && width()){
                    
                    var translateX = (width()/2)-lastCommit.position.x;
                    var translateY = (height()/2)-(_.chain(scope.commits).pluck('position').max('lane').value().lane*configuration.intervals.y)/2;
                    zoom.translate([translateX, translateY]);
                    reposition([translateX, translateY]);   
                }
            }

           
            function redraw() {
              reposition(d3.event.translate, d3.event.scale);
            }

            function reposition(translate, scale){
                if(!scale){
                    scale = d3.transform(self.commitContainer.attr('transform')).scale;
                }

                self.commitContainer.attr("transform", "translate(" + translate + ")" + " scale(" + scale + ")");
            }

            function height(){ return self.svgContainer[0][0].clientHeight; }
            function width(){ return self.svgContainer[0][0].clientWidth; }
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
	};
}
githubGraph.$inject = ["$q", "configuration", "graphLayoutService", "colors"];

angular.module('app').directive('githubGraph', githubGraph);
function graphLayoutService(configuration, $q) {
    var timePositions;
    return {
        updatePositions: updatePositions
    };

    function updateXPosition(commit, index) {
        return $q(function(resolve, reject){
            var xPosition = index * configuration.intervals.x;
            if (timePositions[commit.date]) {
                xPosition = timePositions[commit.date];
            } else {
                timePositions[commit.date] = xPosition;
            }
            commit.setX(xPosition);
            return resolve(xPosition);
        });
    }

    function updateYPosition(commit, n, branches) {
        return $q(function(resolve, reject){
            var masterLane = _(branches).find({
                name: 'master'
            }).lane;
            var yPosition =masterLane +configuration.intervals.baseline;
            commit.setLane(masterLane);
            if (!commit.isOnMaster()) {
                var matchingBranches = _.filter(branches, function(b) {
                    return commit.branches.indexOf(b.name) > -1;
                });
                var lowestLanePosition = _.chain(matchingBranches)
                    .pluck('lane')
                    .min()
                    .value();
                commit.setLane(lowestLanePosition);
                yPosition =(lowestLanePosition*configuration.intervals.y)+configuration.intervals.baseline;
            }
            
            commit.setY(yPosition);
            resolve(yPosition);
        });
    }

    function updateBranchLanes(branches) {
    	var index = 1;
	    _.forEach(branches, function(branch, n) {
	    	if(branch.isMaster()){
	    		branch.setLane(0);
	    	}
	    	else{
	    		branch.setLane(index);	
	    		index++;
	    	}            
        });

    }

    function updatePositions(commits, branches) {
        return $q(function(resolve, reject){
            var currentMaxX = 0;
            function updateMaxXPosition(x){
               currentMaxX = x > currentMaxX ? x : currentMaxX;
            }

            updateBranchLanes(branches);
            timePositions = {};
            _.forEach(commits, function(commit, n) {
                updateXPosition(commit, n).then(updateMaxXPosition);
                updateYPosition(commit, n, branches);
            });
            resolve(currentMaxX);
        });
    }
}
graphLayoutService.$inject = ["configuration", "$q"];

angular.module('app').factory('graphLayoutService', graphLayoutService);
function Authentication(){

}

angular.module('app').controller('Authentication', Authentication);

(function(){
	function Branch(data){
		this.name = '';
		this.sha = '';

		angular.extend(this, data);
	}

	Branch.prototype = {
		setLane: function(lane){
			this.lane = lane;
		},
		isMaster: function(){
			return this.name === 'master';
		}
	};

	angular.module('app').value('Branch', Branch);
}());
(function(){

	function Commit(options){
		this.sha = null;
		this.date = null;
		this.branches = [];
		this.heads = [];
		this.message = '';
		angular.extend(this, options);
	}

	Commit.prototype = {
		addToBranch: function(branch){
			if (this.isOnMaster()) return;
			if (branch === 'master') {
                this.branches = [branch];
            } else {
                this.branches.push(branch);
            }
		},
		isOnMaster: function(){
			return this.branches.indexOf('master') > -1;
		},
		setX: function(x){

			this.position = this.position || {x: 0, y: 0, lane: 0};
			this.position.x = x;
		},
		setY: function(y){
			//console.log("Setting Y:"+y+" for commit "+this.sha+" on "+this.branches.join())
			this.position = this.position || {x: 0, y: 0, lane: 0};
			this.position.y = y;	
		},
		setLane: function(lane){
			this.position = this.position || {x: 0, y: 0, lane: 0};
			this.position.lane = lane;
		}

	};



	angular.module('app').value('Commit', Commit);

}());
angular.module("Templates").run(["$templateCache", function($templateCache) {$templateCache.put("Commits/Commits.tpl.html","<github-graph commits=\"commits.commitData.commits\" branches=\"commits.commitData.branches\"><ul><li ng-repeat=\"branch in commits.commitData.branches\">{{branch.name}}</li></ul><ul><li ng-repeat=\"commit in commits.commitData.commits\">{{commit.date}} - {{commit.sha}} - {{commit.branches}}</li></ul></github-graph>");
$templateCache.put("Auth/Callback.tpl.html","");
$templateCache.put("Auth/GitHub.tpl.html","<div ng-if=\"!github.user\">We\'re going to now talk to the GitHub API. Ready? <a ng-href=\"https://github.com/login/oauth/authorize?scope=user:email&client_id={{github.settings.client_id}}\">Click here</a> to begin!</div><div ng-if=\"github.user\"><div class=\"github-avatar\"><img ng-src=\"{{github.user.avatar_url}}\"></div><div class=\"github-name\">{{github.user.name}}&nbsp;-&nbsp;</div><div class=\"github-logout\"><a href=\"\" ng-click=\"github.signout()\">Sign out</a></div></div>");
$templateCache.put("Header/Authentication.tpl.html","");}]);
})();