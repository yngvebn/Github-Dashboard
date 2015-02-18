function Callback(gitHubService, $stateParams){
	console.log($stateParams);

	gitHubService.getAccessToken($stateParams.code)
		.then(function(result){
			console.log(result);
		});
}

angular.module('app').controller('Callback', Callback);