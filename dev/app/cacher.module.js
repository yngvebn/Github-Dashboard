angular.module('Cacher', []).
factory('CacheLocal', function($cacheFactory) {
  var cache = $cacheFactory('someCache', {});
  var PREFIX = 'Cacher::';
  cache.get = function(key) {
    console.log('get', key);
    var lruEntry = localStorage.getItem(PREFIX + key);
    if (!lruEntry) return; // Cache miss
    lruEntry = JSON.parse(lruEntry);
    console.log('hit', lruEntry);
    return lruEntry.data; // Cache hit
  };
  cache.put = function(key, value) {
    if (typeof value.then === 'function') {
      value.then(function(value) {
        localStorage.setItem(PREFIX + key, JSON.stringify(value));
      });
    } else {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    }
  };
  cache.remove = function(key) {
    localStorage.removeItem('Cacher::' + key);
  };
  cache.removeAll = function() {
    localStorage.clear();
  };
  return cache;
});
