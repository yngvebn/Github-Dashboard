function Signin(principal, GitHubSettings, $window, $timeout, $rootScope, $state, events) {
    var vm = this,
        popup;
    vm.signin = signin;

    principal.identity();
    events.on('gibhub-authenticated').then(function(result) {
	        principal.authenticate(result.data.access_token);
	        if ($rootScope.returnToState) {
	            $state.go($rootScope.returnToState, $rootScope.returnToStateParams);
	        }
    });

    function signin() {
        var url = 'https://github.com/login/oauth/authorize?scope=user,repo&client_id=' + GitHubSettings.client_id;
        popup = $window.open(url, "", "width=1024, height=780");
        $window.sharedEvents = events;
    }
}

angular.module('app.views.auth').controller('Signin', Signin);