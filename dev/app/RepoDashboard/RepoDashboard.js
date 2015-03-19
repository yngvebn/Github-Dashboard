function RepoDashboard($stateParams, gitHubService, $scope, repository, branches, $http, serverEvents){
	var vm = this,
	mainBranches = ['master', 'develop']; //['q-plus','master', 'develop',  'TeamGame', 'F201501', /*'RegProsess', */'Spillbokser'];
    vm.model = {
        repository: repository.data,
        branches: [],
        branchStatistics: [],
        realTimeOptions: {
            available: null,
            paused: null
        }
    };

    loadBranches();

    loadRealtimeInfo();

    serverEvents.connect(vm.model.repository.id).on('hook', function(data){
        console.log(data);
    });

    function loadRealtimeInfo(){
        gitHubService.isRealtimeEnabled(vm.model.repository.id).then(function(isIt){
            console.log(isIt);
            vm.model.realTimeOptions.available = isIt;
            vm.model.realTimeOptions.paused = isIt;
        });
    }

    function isPartOfBranch(child, compare){

        if(compare.status == 'ahead' && compare.ahead_by < child.ahead) return true;
    	if(compare.status == 'behind' && compare.behind_by < child.behind) return true;
    	
    	if((child.status != 'ahead' && child.status != 'behind') && compare.status == 'diverged' && ((compare.behind_by < child.behind) && (compare.ahead_by < child.ahead))) {
    		return true;
    	}

    	return false;
    }

    function findLeastDivergedParent(child){
    	var index = 0;

    	_.forEach(mainBranches, function(parent){
    		gitHubService.compare(vm.model.repository.id, parent, child.name).then(function(result){
    			var totalAhead = result.data.ahead_by;
    			var totalBehind = result.data.behind_by;
    			if((child.status == 'unknown') || isPartOfBranch(child, result.data)){
    				child.parent.name = parent;
    				child.ahead = totalAhead;
    				child.behind = totalBehind;
    				child.status = result.data.status;
    			}
    			//console.log(child, parent, totalAhead, totalBehind);
    		});
    	
    	});
    	
    }

    function updateBranchStatistics(){
    	_.forEach(vm.model.branches, function(child){
    			findLeastDivergedParent(child);
    		});
    }

    function updateBranchActivity(){
        _.forEach(vm.model.branches, function(branch){
            gitHubService.getCommit(vm.model.repository.id, branch.name)
                .then(function(res){
                    var commit = res.data;

                        branch.lastactivity = {
                            author: commit.commit.author.name,
                            avatar: (commit.author || { avatar_url: 'http://placehold.it/30x30'}).avatar_url,
                            when: commit.commit.author.date,
                            message: commit.commit.message
                        };
                });
        });
    }


	function loadBranches(){
		_.chain(branches.data)
		  .reject(function(b){ return mainBranches.indexOf(b.name) > -1; })		
		  .value()
		  .forEach(function(b){
            	vm.model.branches.push({
		  			name: b.name,
		  			parent: {
		  				name: 'analyzing...',
		  			},
	  				status: 'unknown',
	  				ahead: '0',
	  				behind: '0',
                    lastactivity: null
		  		});
		  });
          updateBranchActivity();
		updateBranchStatistics();

	}

}
function HumanizeFilter(){
    return function(key){
        return moment.duration(moment().diff(moment(key))).humanize()+ ' ago';
    };
}
angular.module('app.views.repoDashboard').filter('humanize', HumanizeFilter);

angular.module('app.views.repoDashboard').controller('RepoDashboard', RepoDashboard);