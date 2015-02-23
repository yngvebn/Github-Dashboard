function RepoDashboard($stateParams, gitHubLoader, gitHubUrls){
	console.log($stateParams.repoId);

	var commitsUrl = gitHubUrls.commits($stateParams.repoId, { per_page: 5 });

	function loadingDone(){
		console.log('done');
	}

	function loadingFailed(){
		console.log('failed');
	}

	function loadingProgress(commits){
	}

	gitHubLoader.load(commitsUrl).then(loadingDone, loadingFailed, loadingProgress);
}

angular.module('app.views.repoDashboard').controller('RepoDashboard', RepoDashboard);