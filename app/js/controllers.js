var wcControllers = angular.module('wcControllers', []);

wcControllers.controller('ProductListCtrl', ['$scope', 'Product',
  function ($scope, Product) {
    $scope.products = Product.query();
    $scope.orderProp = 'name';
  }]);

wcControllers.controller('ProductDetailsCtrl', ['$scope', '$routeParams', 'Product', 'Comment',
  function($scope, $routeParams, Product, Comment) {
    var productId = parseInt($routeParams.productId, 10);
    $scope.product = Product.get({productId:productId});
    $scope.comments = Comment.query({productId:productId});

    $scope.btnAddComment = function(){
      if ($scope.commentBody && $scope.commentBody.length > 0) {
        var comment = new Comment({
          productId: productId,
          user: $scope.commentUser||"Anonymous",
          body:$scope.commentBody
        });
        $scope.comments.push(comment);
        comment.$save();

        $scope.commentBody = "";
      }
    }
  }]);

wcControllers.controller('ProductCreateCtrl', ['$scope', '$location', '$routeParams', 'Product',
  function($scope, $location, $routeParams, Product) {

    $scope.btnCreateProduct = function(){
      if (!$scope.productName || $scope.productName==='') {
        $scope.productNameError = true;
        return;
      }
      if (!$scope.productPrice || parseFloat($scope.productPrice)===NaN) {
        $scope.productPriceError = true;
        return;
      }
      var product = new Product({
        name: $scope.productName,
        price: parseFloat($scope.productPrice)||null,
        snippet:$scope.productSnippet
      });
      product.$save(function(){
        $location.path("/products");
      });
    }
  }]);
