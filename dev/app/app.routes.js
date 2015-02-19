function RouteConfig($stateProvider, $urlRouterProvider, $locationProvider){
	$urlRouterProvider.otherwise("/");
	$stateProvider
		.state('home', {
			url: '/',
			views: {
				main: {
					templateUrl: 'Home/Welcome.tpl.html',
					controller: 'Welcome',
					controllerAs: 'welcome'
				}
			}
		})
		.state('commits', {
			url: '/commits',
			views: {
				main: {
					templateUrl: 'Commits/Commits.tpl.html',
					controller: 'Commits',
					controllerAs: 'commits'		
				},
				header: {
					templateUrl: 'Auth/GitHub.tpl.html',
					controller: 'GitHub',
					controllerAs: 'github'
				}			
			}

		})
		.state('github', {
			url: '/git/login',
			views: {
				main: {
					templateUrl: 'Auth/GitHub.tpl.html',
					controllerAs: 'github',
					controller: 'GitHub'					
				}
			}
		})
		.state('githubCallback', {
			url: '/git/callback?code',
			views: { 
				main: {
					templateUrl: 'Auth/Callback.tpl.html',
					controllerAs: 'callback',
					controller: 'Callback'		
				}
			}
			
		});

	$locationProvider.html5Mode(true);
}

angular.module('app').config(RouteConfig);