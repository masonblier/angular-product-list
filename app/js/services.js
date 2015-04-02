var wcServices = angular.module('wcServices', ['ngResource']);

wcServices.factory('Product', ['$resource',
  function($resource){
    return $resource('products/:productId.json', {}, {
      query: {method:'GET', params:{productId:'products'}, isArray:true}
    });
  }]);

wcServices.factory('Comment', ['$resource',
  function($resource){
    return $resource('products/:productId/comments.json');
  }]);
