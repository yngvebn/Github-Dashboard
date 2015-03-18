function RepoDashboard($stateParams, gitHubService, $scope, repository, branches, $http){
	var vm = this,
	mainBranches = ['q-plus','master', 'develop',  'TeamGame', 'F201501', 'RegProsess', 'Spillbokser'];
    vm.model = {
        repository: repository.data,
        branches: [],
        branchStatistics: []
    };

    loadBranches();

    function isPartOfBranch(child, compare){
    	if(compare.status == 'ahead' && compare.ahead_by < child.ahead) return true;
    	if(compare.status == 'behind' && compare.behind_by < child.behind) return true;
    	
    	if(compare.status == 'diverged' && (compare.behind_by < child.behind && compare.ahead_by < child.ahead)) {
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


	function loadBranches(){
		_.chain(branches.data)
		  .reject(function(b){ return mainBranches.indexOf(b.name) > -1; })		
		  .pluck('name')
		  .value()
		  .forEach(function(b){
		  		vm.model.branches.push({
		  			name: b,
		  			parent: {
		  				name: 'analyzing...',
		  			},
	  				status: 'unknown',
	  				ahead: '0',
	  				behind: '0'
		  		});
		  });

		updateBranchStatistics();

	}

}

angular.module('app.views.repoDashboard').controller('RepoDashboard', RepoDashboard);