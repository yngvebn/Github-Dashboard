function Callback(gitHubService, principal, $stateParams, $state){
	console.log($stateParams);

	gitHubService.getAccessToken($stateParams.code)
		.then(function(result){
			principal.authenticate(result.data.access_token);
		})
		.then(function(){
			$state.go('home');
		});
}

angular.module('app').controller('Callback', Callback);