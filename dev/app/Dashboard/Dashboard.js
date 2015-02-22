function Dashboard(serverEvents, gitHubService){
	console.log('Dashboard');
	var vm = this;
	vm.messages = [];
	var server = serverEvents.connect('');
	server.on('news', function(data){
		console.log(data);
		vm.messages.push(data.text);
	});

	gitHubService.getRepositories().then(function(results){
		console.log(results);
	});

	gitHubService.getOrganizations().then(function(results){
		console.log(results);
	});
}

angular.module('app').controller('Dashboard', Dashboard);