function gitHubUrls(uri, string){
	var urls = {
		base: 'https://api.github.com',
		repo: '{0}/repositories/{1}',
		commits: '{0}/repositories/{1}/commits',
		branches: '{0}/repositories/{1}/branches'

	};

	return {
		repo: getRepo,
		commits: getCommits,
		branches: getBranches
	};

	function appendQuery(url, query){
		if(query){
			return uri(url).search(query).toString();
		}
		else{
			return uri(url).toString();
		}
	}
	
	function getRepo(repository, filters){
		return string.format(urls.repo, urls.base, repository);
	}

	function getCommits(repository, filters){
		return appendQuery(string.format(urls.commits, urls.base, repository), filters);
	}

	function getBranches(repository, filters){
		return appendQuery(string.format(urls.branches, urls.base, repository), filters);
	}
}

angular.module('app').factory('gitHubUrls', gitHubUrls);