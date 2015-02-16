angular.module('app').value('configuration', {
	intervals: {
		baseline: 100,
		x: 30,
		y: 30
	}
});

angular.module('app').run(function($http) {
  	$http.defaults.headers.common['Authorization'] ='token efd6c0e7276faf30f541e0d05d8acb7ea2ffc7cf';
});