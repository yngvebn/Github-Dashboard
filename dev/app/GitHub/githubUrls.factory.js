function gitHubUrls(uri, string){
	var urls = {
		base: 'https://api.github.com',
		repo: '{0}/repositories/{1}',
		commits: '{0}/repositories/{1}/commits',
		commit: '{0}/repositories/{1}/commits/{2}',
		branches: '{0}/repositories/{1}/branches',
		compare: '{0}/repositories/{1}/compare/{2}...{3}',
		hooks: '{0}/repositories/{1}/hooks'
	};

	return {
		repo: getRepo,
		commits: getCommits,
		commit: getCommit,
		branches: getBranches,
		compare: getCompare,
		hooks: getHooks
	};

	function appendQuery(url, query){
		if(query){
			return uri(url).search(query).toString();
		}
		else{
			return uri(url).toString();
		}
	}

	function getHooks(repository){
		return string.format(urls.hooks, urls.base, repository);
	}
	
	function getCompare(repository, base, branch){
		return string.format(urls.compare, urls.base, repository, base, branch);
	}

	function getRepo(repository, filters){
		return string.format(urls.repo, urls.base, repository);
	}

	function getCommits(repository, filters){
		return appendQuery(string.format(urls.commits, urls.base, repository), filters);
	}

	function getCommit(repository, commit){
		return string.format(urls.commit, urls.base, repository, commit);
	}

	function getBranches(repository, filters){
		return appendQuery(string.format(urls.branches, urls.base, repository), filters);
	}
}

angular.module('app').factory('gitHubUrls', gitHubUrls);