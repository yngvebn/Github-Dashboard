function GitHub(GitHubSettings){
	var vm = this;
	vm.settings = GitHubSettings;
}

angular.module('app').controller('GitHub', GitHub);