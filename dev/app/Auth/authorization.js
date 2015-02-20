function authorization($rootScope, $state, principal) {
    return {
        authorize: function() {
            return principal.identity()
                .then(function() {
                    var isAuthenticated = principal.isAuthenticated();
                    if (!isAuthenticated && $rootScope.toState.name !== 'signin') {
                       // user is not authenticated. stow the state they wanted before you
                        // send them to the signin state, so you can return them when you're done
                        $rootScope.returnToState = $rootScope.toState;
                        $rootScope.returnToStateParams = $rootScope.toStateParams;

                        // now, send them to the signin state so they can log in

                      
                        $state.go('signin');
                    }
                });
        }
    };
}

angular.module('app').factory('authorization', authorization);