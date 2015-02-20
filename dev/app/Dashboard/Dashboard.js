function Dashboard(serverEvents){
	console.log('Dashboard');
	var vm = this;
	vm.messages = [];
	var server = serverEvents.connect('');
	server.on('news', function(data){
		console.log(data);
		vm.messages.push(data.text);
	});
}

angular.module('app').controller('Dashboard', Dashboard);