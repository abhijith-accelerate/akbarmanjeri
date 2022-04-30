angular.module('SettingsApp', ['ngCookies'])

.config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
}])


  .controller('settingsController', function($scope, $http, $interval, $cookies) {

    //Check if logged in
    if(1 || $cookies.get("akbarTokenManagementAppAdminToken")){
      $scope.isLoggedIn = true;
    }
    else{
      $scope.isLoggedIn = false;
      window.location = "login.html";
    }

    //Logout function
    $scope.logoutNow = function(){
      if($cookies.get("akbarTokenManagementAppAdminToken")){
        $cookies.remove("akbarTokenManagementAppAdminToken");
        window.location = "login.html";
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
        url     : 'https://accelerateengine.app/client-apis/akbar/fetchadmininfo.php',
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
     
     //Local server settings
     $scope.localServerIP = localStorage.getItem("localServerIP") && localStorage.getItem("localServerIP") != "" ? localStorage.getItem("localServerIP") : "127.0.0.1";
     $scope.updateLocalServerIP = function(){
       localStorage.setItem("localServerIP", $scope.localServerIP);
     }
     
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
	        url     : 'https://accelerateengine.app/client-apis/akbar/saveadmininfo.php',
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
     	
     	
     $scope.outletSettings = {};
     $scope.outletSettings.payment = true;
     $scope.outletSettings.reward = true;
     $scope.outletSettings.reservation = true;
     	
     $scope.getOutletSettings = function(){
     
	     	var admin_data = {};
	        admin_data.token = $cookies.get("akbarTokenManagementAppAdminToken");
	        $http({
	          method  : 'POST',
	          url     : 'https://accelerateengine.app/client-apis/akbar/getsettingsadmin.php',
	          data    : admin_data,
	          headers : {'Content-Type': 'application/x-www-form-urlencoded'}
	         })
	         .then(function(response) {		
			$scope.outletSettings = response.data.response;
	         });
	         
	         
     }
     
     $scope.getPercentage = function(val){
     	return Math.round(val*100);
     }
    
     $scope.getOutletSettings();     
     
     
     $scope.setPayment = function(option){
         	
	     	var admin_data = {};
	        admin_data.token = $cookies.get("akbarTokenManagementAppAdminToken");
	        admin_data.status = option;
	        admin_data.type = 'PAYMENT';
	        $http({
	          method  : 'POST',
	          url     : 'https://accelerateengine.app/client-apis/akbar/changesettingsadmin.php',
	          data    : admin_data,
	          headers : {'Content-Type': 'application/x-www-form-urlencoded'}
	         })
	         .then(function(response) {
			if(!response.data.status){
				alert('Error: '+response.data.error);
			}
			else{
				$scope.outletSettings.payment = response.data.action;			     			     				     				
			}
	         });		
     }
     
     $scope.setReservation = function(option){
         	
	     	var admin_data = {};
	        admin_data.token = $cookies.get("akbarTokenManagementAppAdminToken");
	        admin_data.status = option;
	        admin_data.type = 'RESERVATION';
	        $http({
	          method  : 'POST',
	          url     : 'https://accelerateengine.app/client-apis/akbar/changesettingsadmin.php',
	          data    : admin_data,
	          headers : {'Content-Type': 'application/x-www-form-urlencoded'}
	         })
	         .then(function(response) {
			if(!response.data.status){
				alert('Error: '+response.data.error);
			}
			else{
				$scope.outletSettings.reservation = response.data.action;			     			     				     				
			}
	         });		
     }
     
     $scope.setReward = function(option){
         	
	     	var admin_data = {};
	        admin_data.token = $cookies.get("akbarTokenManagementAppAdminToken");
	        admin_data.status = option;
	        admin_data.type = 'REWARD';
	        $http({
	          method  : 'POST',
	          url     : 'https://accelerateengine.app/client-apis/akbar/changesettingsadmin.php',
	          data    : admin_data,
	          headers : {'Content-Type': 'application/x-www-form-urlencoded'}
	         })
	         .then(function(response) {
			if(!response.data.status){
				alert('Error: '+response.data.error);
			}
			else{
				$scope.outletSettings.reward = response.data.action;			     			     				     				
			}
	         });		
     }
     
     
              

        //Refresh Badge Counts
        var admin_data = {};
        admin_data.token = $cookies.get("akbarTokenManagementAppAdminToken");
        $http({
          method  : 'POST',
          url     : 'https://accelerateengine.app/client-apis/akbar/fetchbadgecounts.php',
          data    : admin_data,
          headers : {'Content-Type': 'application/x-www-form-urlencoded'}
         })
         .then(function(response) {
         	if(response.data.status){
              		$scope.reservations_length = response.data.reservationsCount;
              		$scope.pending_orders_length = response.data.ordersCount;
              		$scope.helprequests_length = response.data.helpCount;
              		$scope.smart_orders_length = response.data.smartOrdersCount;
              	}
              	else{
              		$scope.reservations_length = 0;
              		$scope.pending_orders_length = 0;
              		$scope.helprequests_length = 0;
              	}
         });

        $scope.Timer = $interval(function () {
          $http({
            method  : 'POST',
            url     : 'https://accelerateengine.app/client-apis/akbar/fetchbadgecounts.php',
            data    : admin_data,
            headers : {'Content-Type': 'application/x-www-form-urlencoded'}
           })
           .then(function(response) {
                if(response.data.status){
              		$scope.reservations_length = response.data.reservationsCount;
              		$scope.pending_orders_length = response.data.ordersCount;
              		$scope.helprequests_length = response.data.helpCount;
              		$scope.smart_orders_length = response.data.smartOrdersCount;
              	}
              	else{
              		$scope.reservations_length = 0;
              		$scope.pending_orders_length = 0;
              		$scope.helprequests_length = 0;
              	}
           });
        }, 20000);
        
  })
