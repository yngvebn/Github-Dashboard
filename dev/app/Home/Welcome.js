function Welcome(principal, GitHubSettings, $window){
	var vm = this;
	vm.signin = signin;

	principal.identity();

	function signin(){
		$window.location.href = 'https://github.com/login/oauth/authorize?scope=user,repo&client_id='+GitHubSettings.client_id;
	}
}

angular.module('app').controller('Welcome', Welcome);