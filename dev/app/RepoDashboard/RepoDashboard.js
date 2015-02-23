function RepoDashboard($stateParams, commitsService, $scope){
	var vm = this;
    vm.commitData = {
        commits: commitsService.commits,
        branches: commitsService.branches
    };

	commitsService.loadRepository($stateParams.repoId, '2015-01-01');
}

angular.module('app.views.repoDashboard').controller('RepoDashboard', RepoDashboard);