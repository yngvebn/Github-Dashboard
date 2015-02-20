
function events($rootScope, $q){
	return {
		publish: publish,
		on: subscribe
	};

	function subscribe(event){
		return $q(function(resolve, reject){
			$rootScope.$on(event, function(ev, data){ resolve(data); });	
		});
		
	}

	function publish(event, data){
		return $q(function(resolve, reject){
			$rootScope.$emit(event, data);
			resolve();
		});
	}
}


angular.module('app').factory('events', events);