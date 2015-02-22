function RoutingConfig($stateProvider, $urlRouterProvider, $locationProvider){
	$urlRouterProvider.otherwise("/dashboard");

    $stateProvider
        .state('site', {
            'abstract': true,
            resolve: {
                authorize: ['authorization',
                    function(authorization) {
                        return authorization.authroize();
                    }
                ]
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

        });

    $locationProvider.html5Mode(true);
}

angular.module('app.routing').config(RoutingConfig);