function RepoDashboardRouteConfig($stateProvider){
    $stateProvider.state('repoDashboard', {
            url: '/dashboard/{repoId}',
            views: {
                main: {
                    templateUrl: 'RepoDashboard/RepoDashboard.tpl.html',
                    controller: 'RepoDashboard',
                    controllerAs: 'repoDashboard',
                    resolve: {
                        repository: ['gitHubService', '$stateParams', function(gitHubService, $stateParams){
                            return gitHubService.getRepository($stateParams.repoId);
                        }],
                        branches: ['gitHubService', '$stateParams', function(gitHubService, $stateParams){
                            return gitHubService.getBranches($stateParams.repoId);
                        }]
                    }
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