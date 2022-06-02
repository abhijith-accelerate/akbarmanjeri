angular.module('StaffApp', ['ngCookies'])

.config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
}])


  .controller('StaffController', function($scope, $http, $interval, $cookies) {

    //Check if logged in
    if($cookies.get("akbarTokenManagementAppAdminToken")){
      $scope.isLoggedIn = true;
    }
    else{
      $scope.isLoggedIn = false;
      window.location = "index.html";
    }

    //Logout function
    $scope.logoutNow = function(){
      if($cookies.get("akbarTokenManagementAppAdminToken")){
        $cookies.remove("akbarTokenManagementAppAdminToken");
        window.location = "index.html";
      }
    }


    $scope.initAgents = function(){
          var data = {};
          data.token = $cookies.get("akbarTokenManagementAppAdminToken");

          $http({
            method  : 'POST',
            url     : 'https://www.accelerateengine.app/client-apis/akbar/fetchagents.php',
            data    : data,
            headers : {'Content-Type': 'application/x-www-form-urlencoded'}
           })
           .then(function(data) {
              $scope.staffList = data.data.response;

              if(!response.data.status){
                alert(data.data.error);
              }

                $scope.agentcode = '';
                $scope.agentname = '';

            }); 
      }
      
      $scope.initAgents();
	
      $scope.errorflag =  false;
      $scope.agentcode = '';
      $scope.agentname = '';
      $scope.addAgent = function(){
        var data = {};
        data.token = $cookies.get("akbarTokenManagementAppAdminToken");
        data.code = $scope.agentcode ;
        data.name = $scope.agentname ;
        if(data.code == "" || data.name == "" || !isValidPhone(data.code)){
          $scope.errorflag = true;
        }
        else{
          $scope.errorflag = false;
          $http({
            method  : 'POST',
            url     : 'https://www.accelerateengine.app/client-apis/akbar/addagent.php',
            data    : data,
            headers : {'Content-Type': 'application/x-www-form-urlencoded'}
           })
           .then(function(response) {
              
              if(!response.data.status){
                alert(response.data.error);
              }

              $scope.initAgents();
            });
        }
      }
      
      $scope.askForDelete = function(con){
      	$scope.askContent = con;
      	$('#confirmationModal').modal('show');
      }

      function isValidPhone(phoneno){
        var pattern = /^[6789]\d{9}$/;
        if(pattern.test(phoneno)){
          return true;
        }
        return false;
      }

      $scope.removeAgent = function(code){
        var data = {};
        data.token = $cookies.get("akbarTokenManagementAppAdminToken");
        data.code = code;
        $http({
          method  : 'POST',
          url     : 'https://www.accelerateengine.app/client-apis/akbar/removeagent.php',
          data    : data,
          headers : {'Content-Type': 'application/x-www-form-urlencoded'}
         })
         .then(function(response) {
          $('#confirmationModal').modal('hide');
          $scope.initAgents();

            if(!response.data.status){
              alert(response.data.error);
            }

         });

      }

});
