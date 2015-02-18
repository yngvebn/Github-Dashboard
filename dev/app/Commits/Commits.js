function Commits(gitHubService, commitsService) {
    var vm = this;
    vm.commitData = {
        commits: commitsService.commits,
        branches: commitsService.branches
    };
    var maxPages = 5;
    function addBranches(branches){
		_.forEach(branches, function(b){ commitsService.addBranch(b);});
    }

    function addCommits(commits, branch){
    	commitsService.add(commits, branch);
        
    }

    function loadCommits(branches, repo){
    	_.forEach(branches, function(b){
    		gitHubService.getCommits(repo, b.name)
    			.then(function(result){
   					addCommits(result.data, b.name);
   					var nextLink = getNextLink(result.headers('Link'));
   					if(nextLink && getPageNumber(nextLink) <= maxPages) loadMoreCommits(nextLink, b.name);
    			});
    	});
    	
    }

    function loadMoreCommits(nextLink, branch){
    	gitHubService.getRawUrl(nextLink)
    		.then(function(result){
    			addCommits(result.data, branch);
    			var nextLink = getNextLink(result.headers('Link'));
   				if(nextLink) loadMoreCommits(nextLink, branch);
    		});
    }

    function getNextLink(linkHeader){
    	return  (/<(.*)>; rel="next"/.exec(linkHeader) || {1: undefined })[1];
    }

    function getPageNumber(link){
        return (/page=(\d)/.exec(link) || { 1: 0})[1];
    }

    function loadRepo(repo) {
    	gitHubService.getBranches(repo).then(function(result){
    		addBranches(result.data);
    		return commitsService.branches;
    	}).then(function(result){
    		loadCommits(result, repo);
    	});
	}

    loadRepo('Etoto');
}

angular.module('app').controller('Commits', Commits);