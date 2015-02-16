angular.module('app').value('configuration', {
	intervals: {
		baseline: 10,
		x: 30,
		y: 30
	}
});

angular.module('app').run(function($http) {
  	$http.defaults.headers.common['Authorization'] ='token 80332f6cc85918ed100627e323c52752f68ec540';
});