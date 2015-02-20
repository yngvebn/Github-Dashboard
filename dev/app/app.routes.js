function RouteConfig($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider.otherwise("/dashboard");

    $stateProvider
        
        .state('signin', {
            url: '/signin',
            views: {
                main: {
                    templateUrl: 'Auth/Signin.tpl.html',
                    controller: 'Signin',
                    controllerAs: 'signin'
                }
            }
        })
        .state('site', {
            'abstract': true,
            resolve: {
                authorize: ['authorization',
                    function(authorization) {
                        return authorization.authorize();
                    }
                ]
            }
        })
        .state('dashboard', {
            url: '/dashboard',
            views: {
                main: {
                    templateUrl: 'Dashboard/Dashboard.tpl.html',
                    controller: 'Dashboard',
                    controllerAs: 'dashboard'
                }
            },
            resolve: {
                authorize: ['authorization',
                    function(authorization) {
                        return authorization.authorize();
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

function Authorize($rootScope, $state, $stateParams, authorization, principal) {
    $rootScope.$on('$stateChangeStart', function(event, toState, toStateParams) {

        // track the state the user wants to go to; authorization service needs this
        $rootScope.toState = toState;
        $rootScope.toStateParams = toStateParams;
        
        // if the principal is resolved, do an authorization check immediately. otherwise,
        // it'll be done when the state it resolved.
        if (principal.isIdentityResolved()) {
            authorization.authorize();
        }
    });
}

angular.module('app').config(RouteConfig).run(Authorize);