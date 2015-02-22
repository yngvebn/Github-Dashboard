function Callback(gitHubService, principal, $stateParams, $state, $window){
	console.log($stateParams);

	if($stateParams.code){
		gitHubService.getAccessToken($stateParams.code)
		.then(function(result){
			$window.opener.sharedEvents.publish('gibhub-authenticated', result)
			.then(function(){
				$window.close();
			});
		});
	}
}

angular.module('app.views.auth').controller('Callback', Callback);