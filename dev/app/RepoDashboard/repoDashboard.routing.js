function RepoDashboardRouteConfig($stateProvider){
    $stateProvider.state('repoDashboard', {
            url: '/dashboard/{repoId}',
            views: {
                main: {
                    templateUrl: 'RepoDashboard/RepoDashboard.tpl.html',
                    controller: 'RepoDashboard',
                    controllerAs: 'repoDashboard'
                }
            },
            resolve: {
                authorize: ['authorization',
                    function(authorization) {
                        return authorization.authorize();
                    }
                ]
            }
        });
}

angular.module('app.views.repoDashboard').config(RepoDashboardRouteConfig);