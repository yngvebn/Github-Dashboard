angular.module('app').value('configuration', {
	intervals: {
		baseline: 10,
		x: 30,
		y: 30
	}
});

angular.module('app').constant('colors', ["#ffc107","#607d8b","#5677fc","#795548","#00bcd4","#ff5722","#673ab7","#259b24","#9e9e9e","#3f51b5","#03a9f4","#8bc34a","#cddc39","#ff9800","#e91e63","#9c27b0","#e51c23","#009688","#ffeb3b"]);

angular.module('app').run(function($http) {
  	$http.defaults.headers.common['Authorization'] ='token 80332f6cc85918ed100627e323c52752f68ec540';
});