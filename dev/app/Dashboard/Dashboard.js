function Dashboard(serverEvents, gitHubService) {
    console.log('Dashboard');
    var vm = this;
    vm.repositoryGroups = [];

    gitHubService.getRepositories().then(function(results) {
        var priv = _.chain(results).filter('private', true).value();
        var pub = _.chain(results).filter('private', false).value();
        vm.repositoryGroups.push({
            name: 'Private',
            repos: priv,
            order: 0
        });
        vm.repositoryGroups.push({
            name: 'Public',
            repos: pub,
            order: 1
        });
    });

    gitHubService.getOrganizations().then(function(results) {
        _.forEach(results, function(org) {
            gitHubService.getRawUrl(org.repos_url).then(function(result) {

                vm.repositoryGroups.push({
                    name: org.login,
                    repos: result.data,
                    order: 2
                });
            });

        });
    });
}

angular.module('app').controller('Dashboard', Dashboard);