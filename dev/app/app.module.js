angular.module('Templates', []);
angular.module('app.views', ['app.views.auth', 'app.views.dashboard']);
angular.module('app', ['LocalStorageModule', 'Templates', 'Cacher', 'app.routing', 'app.views']);