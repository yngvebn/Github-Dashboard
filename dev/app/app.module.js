angular.module('Templates', []);
angular.module('app.views', ['app.views.auth', 'app.views.dashboard', 'app.views.repoDashboard']);
angular.module('app', ['LocalStorageModule', 'Templates', 'Cacher', 'app.routing', 'app.views']);