var orig = window.URI;
delete window.URI;

angular.module('app.externals').value('uri', orig);