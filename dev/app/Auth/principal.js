function Principal($q, $http, localStorageService){
 var _identity,
      _authenticated = false;

    return {
      isIdentityResolved: function() {
        return angular.isDefined(_identity);
      },
      isAuthenticated: function() {
        return _authenticated;
      },
      authenticate: function(identity) {
        _identity = identity;
        _authenticated = identity !== null;
        localStorageService.set('__github_token', identity);
      },
      identity: function(force) {
        var deferred = $q.defer();

        if (force === true) _identity = undefined;

        // check and see if we have retrieved the identity data from the server. if we have, reuse it by immediately resolving
        if (angular.isDefined(_identity)) {
          deferred.resolve(_identity);

          return deferred.promise;
        }
        var storedUser = localStorageService.get('__github_token');
        if(!storedUser){
          _identity = null;
          _authenticated = false;
          deferred.resolve(_identity);
        }
        else{

          $http({ url: 'https://api.github.com/user', headers: { Authorization: 'token '+storedUser}, method: 'GET', ignoreErrors: true })
          	.then(function(result) {
          		if(result.status == 200){
          			_identity = storedUser;
          			_authenticated = true;
          			deferred.resolve(_identity);
          		} else {
                localStorageService.remove('__github_token');
          			_identity = null;
          			_authenticated = false;
          			deferred.resolve(_identity);
          		}
          	}, function(result){
          		  localStorageService.remove('__github_token');
          			_identity = null;
          			_authenticated = false;
          			deferred.resolve(_identity);
          	});
        }
        return deferred.promise;
      }
    };
}


angular.module('app').factory('principal', Principal);