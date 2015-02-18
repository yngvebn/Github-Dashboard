function GitHub(GitHubSettings, gitHubService){
	var vm = this;
	vm.settings = GitHubSettings;
	vm.user = null;

	gitHubService.getCurrenttUser().then(function(result){
		vm.user = result.data;
	})
}

angular.module('app').controller('GitHub', GitHub);