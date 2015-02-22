angular.module('Templates', []);
angular.module('app.views', ['app.views.auth']);
angular.module('app', ['LocalStorageModule', 'Templates', 'Cacher', 'app.routing', 'app.views']);