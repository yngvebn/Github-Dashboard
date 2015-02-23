function gitHubLoader($q, gitHubService){
	return {
		load: load
	}

   function getNextLink(linkHeader){
    	return  (/<(.*)>; rel="next"/.exec(linkHeader) || {1: undefined })[1];
    }

    function getPageNumber(link){
        return (/page=(\d)/.exec(link) || { 1: 0})[1];
    }


	function load(url){
		var deferred = $q.defer();

		function loadPage(url){
			gitHubService.getRawUrl(url).then(function(result){
				deferred.notify(result.data);
				var nextLink = getNextLink(result.headers('Link'));
   					if(nextLink){
   						loadPage(nextLink);
   					}
   					else{
   						deferred.resolve();
   					}
			})
		}
		loadPage(url);
		return deferred.promise;
	}
}

angular.module('app.github').factory('gitHubLoader', gitHubLoader);

