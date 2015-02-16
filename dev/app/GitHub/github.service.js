function gitHubService($http, GitHubSettings){
	return {
		getAccessToken: getAccessToken,
		getBranches: getBranches,
		getCommits: getCommits,
		getRawUrl: getRawUrl
	};


	function getRawUrl(rawUrl){
		return $http.get(rawUrl);
	}
	function getCommits(repo, branch){
		return $http.get('https://api.github.com/repos/yngvebn/'+repo+'/commits?sha='+branch);
	}

	function getBranches(repo){
		return $http.get('https://api.github.com/repos/yngvebn/'+repo+'/branches');
	}

	function getAccessToken(code){
		var options = {
			code: code 
		};
		angular.extend(options, GitHubSettings);
		return $http.post('https://github.com/login/oauth/access_token', options);
	}
}

angular.module('app').factory('gitHubService', gitHubService);