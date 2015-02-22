function AuthRouteConfig($stateProvider){
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
        });

        $stateProvider.state('githubCallback', {
            url: '/git/callback?code',
            views: {
                main: {
                    templateUrl: 'Auth/Callback.tpl.html',
                    controllerAs: 'callback',
                    controller: 'Callback'
                }
            }
        });
}

angular.module('app.views.auth').config(AuthRouteConfig);