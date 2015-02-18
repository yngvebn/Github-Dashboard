function gitHubService($http, GitHubSettings, CacheLocal){
	return {
		getAccessToken: getAccessToken,
		getBranches: getBranches,
		getCommits: getCommits,
		getRawUrl: getRawUrl
	};


	function getRawUrl(rawUrl){
		return $http.get(rawUrl, {cache: CacheLocal});
	}
	function getCommits(repo, branch){
		return getRawUrl('https://api.github.com/repos/NorskRikstoto/'+repo+'/commits?sha='+branch);
	}

	function getBranches(repo){
		return getRawUrl('https://api.github.com/repos/NorskRikstoto/'+repo+'/branches');
	}

	function getAccessToken(code){
		var options = {
			code: code 
		};
		angular.extend(options, GitHubSettings);
		return $http.post('http://localhost:3334/api/github/accesstoken', options);
	}
}

angular.module('app').factory('gitHubService', gitHubService);