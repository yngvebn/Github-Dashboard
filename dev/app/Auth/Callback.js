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

angular.module('app').controller('Callback', Callback);