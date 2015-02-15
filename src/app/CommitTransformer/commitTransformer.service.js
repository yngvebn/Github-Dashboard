(function(){
	function commitTransformer(){
		var commitData =[];

		return {
			add: add,
			commits: commitData
		}		

		function add(commits){
			angular.forEach(commits, function(c){ commitData.push(c); });
		}


	}

	angular.module('app').factory('commitTransformer', commitTransformer);
}());