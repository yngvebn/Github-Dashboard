function DashboardRouteConfig($stateProvider){
    $stateProvider.state('dashboard', {
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
        });
}

angular.module('app.views.dashboard').config(DashboardRouteConfig);