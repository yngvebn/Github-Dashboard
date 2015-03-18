function gitHubService($http, GitHubSettings, gitHubUrls, CacheLocal, localStorageService, $q){
	return {
		getAccessToken: getAccessToken,
		getBranches: getBranches,
		getCommits: getCommits,
		getCommit: getCommit,
		getRawUrl: getRawUrl,
		setToken: setToken,
		getCurrenttUser: getCurrentUser,
		getRepositories: getRepositories,
		getOrganizations: getOrganizations,
		getRepository: getRepository,
		compare: compare
	};



	function setToken(token){
		localStorageService.set('__github_token', token);
	}


	function getOrganizations(){
		return getCurrentUser().then(function(result){
			return getRawUrl(result.data['organizations_url']).then(function(r){ return r.data; });
		});
	}
	function compare(repo, base, head){
		return getCurrentUser().then(function(){
			return getRawUrl(gitHubUrls.compare(repo, base, head));
		});
	}
	function getRepository(id){
		return getCurrentUser().then(function(){
			return getRawUrl(gitHubUrls.repo(id));
		});
	}

	function getCommit(id, commit){
		return getCurrentUser().then(function(){
			return getRawUrl(gitHubUrls.commit(id, commit));
		});
	}
	function getRepositories(){
			return getRawUrl('https://api.github.com/user/repos?per_page=250').then(function(r){ return r.data; });
	}

	function getCurrentUser(){
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

	function getBranches(id){
		return getCurrentUser().then(function(){
			return getRawUrl(gitHubUrls.branches(id));
		});
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