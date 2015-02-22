function gitHubService($http, GitHubSettings, CacheLocal, localStorageService, $q){
	return {
		getAccessToken: getAccessToken,
		getBranches: getBranches,
		getCommits: getCommits,
		getRawUrl: getRawUrl,
		setToken: setToken,
		getCurrenttUser: getCurrenttUser,
		getRepositories: getRepositories,
		getOrganizations: getOrganizations
	};

	function setToken(token){
		localStorageService.set('__github_token', token);
	}


	function getOrganizations(){
		return getCurrenttUser().then(function(result){
			return getRawUrl(result.data['organizations_url']).then(function(r){ return r.data; });
		});
	}

	function getRepositories(){
		return getCurrenttUser().then(function(result){
			return getRawUrl(result.data['repos_url']).then(function(r){ return r.data; });
		});
	}

	function getCurrenttUser(){
		return $q(function(resolve, reject){
			var token = getToken();
			if(!token) reject('not authenticated');

			getRawUrl('https://api.github.com/user').then(resolve, reject);
		});
	}

	function getToken(){
		return localStorageService.get('__github_token');
	}

	function getRawUrl(rawUrl){
		return $http({ url: rawUrl,/* cache: CacheLocal,*/ headers: { Authorization: 'token '+getToken() }, method: 'GET'});
	}
	function getCommits(repo, branch){
		return getRawUrl('https://api.github.com/repos/yngvebn/'+repo+'/commits?per_page=250&sha='+branch);
	}

	function getBranches(repo){
		return getRawUrl('https://api.github.com/repos/yngvebn/'+repo+'/branches');
	}

	function getAccessToken(code){
		var options = {
			code: code,
			scope: 'user, repo'
		};
		angular.extend(options, GitHubSettings);
		return $http.post('http://localhost:3334/api/github/accesstoken', options);
	}
}

angular.module('app').factory('gitHubService', gitHubService);