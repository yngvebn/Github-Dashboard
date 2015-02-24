function RepoDashboard($stateParams, commitsService, $scope){
	var vm = this;
    vm.commitData = {
        commits: commitsService.commits,
        branches: commitsService.branches
    };
    vm.selectCommit = function(sha){
    	console.log(sha);
    }
	commitsService.loadRepository($stateParams.repoId, '2015-01-01');
}

angular.module('app.views.repoDashboard').controller('RepoDashboard', RepoDashboard);