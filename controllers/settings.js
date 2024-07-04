angular.module('SettingsApp', ['ngCookies'])

.config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
}])


  .controller('settingsController', function($scope, $http, $interval, $cookies) {

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

      $scope.outletCode = localStorage.getItem("branch");
    
      $scope.admin = {};
      $scope.changePassFlag = false;
      
      $scope.changePassword = function(){
      	$scope.changePassFlag = !$scope.changePassFlag;
      }
      
      $scope.isNotFound = false;
      //Fetch Admin Details
      var data = {};
      data.token = $cookies.get("akbarTokenManagementAppAdminToken");

      $http({
        method  : 'POST',
        url     : 'http://www.akbarmanjeri.in/akbar-apis/fetchadmininfo.php',
        data    : data,
        headers : {'Content-Type': 'application/x-www-form-urlencoded'}
       })
       .then(function(response) {
            if(response.data.status){
              $scope.isNotFound = false;
              $scope.admin = response.data.response;              
            }
            else{
              $scope.isNotFound = true;
            }
        });
     

     $scope.pass = {};
     $scope.pass.current = "";
     $scope.pass.new = "";
     $scope.pass.confirm = ""; 
     
     $scope.saveChanges = function(){
     	var pass_regex = /^[a-zA-Z0-9]+$/;
     	var name_regex = /^[a-zA-Z_ ]*$/;
     	$scope.isSaved = false;
     	if(!name_regex.test($scope.admin.name)){
     		$scope.saveMsg = "Name can contain only letters.";
     	}
     	else if($scope.pass.new != $scope.pass.confirm && $scope.changePassFlag){
     		$scope.saveMsg = "Passwords do not match.";
     	}
     	else if(!pass_regex.test($scope.pass.new) && $scope.pass.new != "" && $scope.changePassFlag){
     		$scope.saveMsg = "Password can contain only letters and number.";
     	}
     	else{
     		$scope.saveMsg = "";
     		
     		var mydata = {};
      		mydata.token = $cookies.get("akbarTokenManagementAppAdminToken");
      		mydata.name = $scope.admin.name;
      		
      		if($scope.changePassFlag){
      			mydata.newpass = $scope.pass.new;
      			mydata.oldpass = $scope.pass.current;
      		}
      		else{
      			mydata.newpass = "";
      		}
      		
     		$http({
	        method  : 'POST',
	        url     : 'http://www.akbarmanjeri.in/akbar-apis/updateadmin.php',
	        data    : mydata,
	        headers : {'Content-Type': 'application/x-www-form-urlencoded'}
	       })
	       .then(function(response) {
	            if(response.data.status){
	              $scope.saveMsg = "Saved Successfully!";    
	              $scope.isSaved = true;          
	                     $scope.pass.current = "";
			     $scope.pass.new = "";
			     $scope.pass.confirm = ""; 
	            }
	            else{
	              $scope.saveMsg = response.data.error;
	              $scope.isSaved = false;
	            }
	        });
	        
     	}		
     }   	
     	
  })
