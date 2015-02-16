function RouteConfig($stateProvider, $urlRouterProvider, $locationProvider){
	$urlRouterProvider.otherwise("/");
	$stateProvider
		.state('home', {
			url: '/',
			templateUrl: 'Commits/Commits.tpl.html',
			controller: 'Commits',
			controllerAs: 'commits'
		})
		.state('github', {
			url: '/git/login',
			templateUrl: 'Auth/GitHub.tpl.html',
			controllerAs: 'github',
			controller: 'GitHub'
		})
		.state('githubCallback', {
			url: '/git/callback?code',
			templateUrl: 'Auth/Callback.tpl.html',
			controllerAs: 'callback',
			controller: 'Callback'
		});

	$locationProvider.html5Mode(true);
}

angular.module('app').config(RouteConfig);