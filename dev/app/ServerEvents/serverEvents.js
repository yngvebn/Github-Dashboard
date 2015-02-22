function serverEvents($rootScope){
	function connect(ns){
		var socket = io.connect('http://localhost:3334/'+ns); 
		return {
			on: on
		};

		function on(ev, callback){			
			socket.on(ev,function(data){
				$rootScope.$apply(function(){
					callback(data);
				});
			});	
		}
	}

	return {
		connect: connect
	};
}

angular.module('app').factory('serverEvents', serverEvents);