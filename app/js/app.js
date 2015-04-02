var wcApp = angular.module('wcApp', [
  'ngRoute',
  'ngMockE2E',
  'wcControllers',
  'wcServices'
]);

wcApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/products', {
        templateUrl: 'partials/product-list.html',
        controller: 'ProductListCtrl'
      }).
      when('/products/create', {
        templateUrl: 'partials/product-create.html',
        controller: 'ProductCreateCtrl'
      }).
      when('/products/:productId', {
        templateUrl: 'partials/product-details.html',
        controller: 'ProductDetailsCtrl'
      }).
      otherwise({
        redirectTo: '/products'
      });
  }]);

wcApp.run(function($httpBackend) {
  var products = [
    {id: 1, name: 'Product A', price: 3.00,
      snippet: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.'},
    {id: 2, name: 'Product B', price: 2.40,
      snippet: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.'}
  ];

  var comments = [
    {productId: 1, user: 'Test User', body: 'Test comment for Product A'}
  ];

  // returns the current list of products
  $httpBackend.whenGET('products/products.json').respond(products);

  // gets a single product
  $httpBackend.whenGET(/^products\/([0-9]+?)\.json$/).respond(function(method, url){
    var id = parseInt(url.match(/products\/([0-9]+?)\.json/)[1], 10);
    var product = products.filter(function(p){return p.id===id;})[0];
    return [200, product, {}];
  });

  // gets comments associated with a product
  $httpBackend.whenGET(/^products\/([0-9]+?)\/comments\.json$/).respond(function(method, url){
    var productId = parseInt(url.match(/products\/([0-9]+?)\/comments\.json/)[1], 10);
    var productComments = comments.filter(function(c){
      return c.productId===productId;
    });
    return [200, productComments, {}];
  });

  // adds a new comment to a product
  $httpBackend.whenPOST(/^products\/comments.json$/).respond(function(method, url, data) {
    var comment = angular.fromJson(data);
    comments.push(comment);
    return [200, comment, {}];
  });

  // adds a new product
  $httpBackend.whenPOST(/^products.json$/).respond(function(method, url, data) {
    var product = angular.fromJson(data);
    product.id = products.length+1;
    products.push(product);
    return [200, product, {}];
  });

  $httpBackend.whenGET(/^partials\/.*/).passThrough();
});