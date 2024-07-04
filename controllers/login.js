angular.module('AdminLoginApp', ['ngCookies'])

.config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
}])

.controller('adminloginController', function($scope, $http, $cookies) {

    //Check if logged in
    if($cookies.get("akbarTokenManagementAppAdminToken")){
      window.location = "token.html";
    }

    $scope.username = "";
    $scope.password = "";

    $scope.isLoginError = false;
    $scope.warnMsg = "";

    $scope.loginadmin = function(){
        var data = {};
        data.mobile = $scope.username;
        data.password = $scope.password;
        $http({
          method  : 'POST',
          url     : 'http://www.akbarmanjeri.in/akbar-apis/adminlogin.php',
          data    : data,
          headers : {'Content-Type': 'application/x-www-form-urlencoded'}
         })
         .then(function(response) {
          $scope.token = response.data.response;
          if(response.data.status == true){
            //Set cookies
            var now = new Date();
            now.setDate(now.getDate() + 7);
            $cookies.put("akbarTokenManagementAppAdminToken", $scope.token, {
                expires: now
            });

            window.location = "token.html";
          }else{
            $scope.isLoginError = true;
            $scope.warnMsg = response.data.error;
          }
        });
    }

});
