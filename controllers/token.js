angular.module('TokenApp', ['ngCookies'])

.config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
}])

.controller('tokenGeneratorController', function($scope, $http, $interval, $cookies) {

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


      //Search or Order View?
      $scope.isViewingOrder = false;

      //Type of Search
      $scope.searchDate = false;
      $scope.searchMobile = false;
      $scope.searchOrder = false;

      //Search Key
      $scope.isSearched = false;
      $scope.searchID = '';
      $scope.isOrdersFound = false;
      $scope.resultMessage = '';
      $scope.filterTitle = 'Today\'s Generated Tokens';
      $scope.isMoreLeft = true;

      //Default Results : Generated tokens of the day
      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth()+1;
      var yyyy = today.getFullYear();
      if(dd<10){ dd='0'+dd;}
      if(mm<10){ mm='0'+mm;}
      var today = dd+'-'+mm+'-'+yyyy;

      var data = {};
      data.token = $cookies.get("akbarTokenManagementAppAdminToken");
      data.status = 2;
      data.key = today;
      

      $('#vegaPanelBodyLoader').show(); $("body").css("cursor", "progress");
      $http({
        method  : 'POST',
        url     : 'https://accelerateengine.app/client-apis/akbar/filtertokens.php',
        data    : data,
        headers : {'Content-Type': 'application/x-www-form-urlencoded'}
       })
       .then(function(response) {
	       $('#vegaPanelBodyLoader').hide(); $("body").css("cursor", "default");
         if(response.data.status){
           $scope.isMoreLeft = false; //Showing all tokens anyways.
           $scope.isOrdersFound = true;
           $scope.completed_orders = response.data.response;
         }
         else{
           $scope.isOrdersFound = false;
           $scope.resultMessage = "There are no tokens generated today!";
         }
        });

      $scope.searchByDate = function(){    
	    $scope.searchID = "";
	    setTimeout(function(){
		    $('#mySearchBox').datetimepicker({  
			    	format: "dd-mm-yyyy",
			    	weekStart: 1,
		        	todayBtn:  1,
				autoclose: 1,
				todayHighlight: 1,
				startView: 2,
				minView: 2,
				forceParse: 0
		    }).on('changeDate', function(ev) {
			    $scope.searchID = $("#mySearchBox").val();
			    $scope.search();
		    }).on('hide', function(ev) { 
			    $('#mySearchBox').datetimepicker('remove');
		    });
			
		    $("#mySearchBox").datetimepicker().focus();
	    
	    }, 200);	     
      }
      


      $scope.limiter = 0;

      $scope.search = function() {
        //Switch to list view in case not
        $scope.isViewingOrder = false;


        var data = {};
        data.token = $cookies.get("akbarTokenManagementAppAdminToken");
        data.key = $scope.searchID;
        data.id = 0;
        $('#vegaPanelBodyLoader').show(); $("body").css("cursor", "progress");
        $http({
          method  : 'POST',
          url     : 'https://accelerateengine.app/client-apis/akbar/filtertokens.php',
          data    : data,
          headers : {'Content-Type': 'application/x-www-form-urlencoded'}
         })
         .then(function(response) {
           $('#vegaPanelBodyLoader').hide(); $("body").css("cursor", "default");
           if(response.data.status){
             $scope.isOrdersFound = true;
             $scope.completed_orders = response.data.response;
             $scope.filterTitle = response.data.result;

             if($scope.completed_orders.length%5 == 0){
                  $scope.isMoreLeft = true;
             }else{
                  $scope.isMoreLeft = false;
             }
           }
           else{
             $scope.isOrdersFound = false;
             $scope.filterTitle = "No Results";
             $scope.resultMessage = "There are no matching results.";
           }
          });
      }

      //Load More Orders
      $scope.loadMore = function(){
        $scope.limiter = $scope.limiter + 10;
        var data = {};
        data.token = $cookies.get("akbarTokenManagementAppAdminToken");
        data.key = $scope.searchID;
        data.id = $scope.limiter;

        $http({
          method  : 'POST',
          url     : 'https://accelerateengine.app/client-apis/akbar/filtertokens.php',
          data    : data,
          headers : {'Content-Type': 'application/x-www-form-urlencoded'}
         })
         .then(function(response) {
           if(response.data.status){
             $scope.isOrdersFound = true;
             $scope.completed_orders = $scope.completed_orders.concat(response.data.response);
             $scope.filterTitle = response.data.result;

             if($scope.completed_orders.length%5 == 0){
                  $scope.isMoreLeft = true;
             }else{
                  $scope.isMoreLeft = false;
             }
           }
           else{
             $scope.isOrdersFound = false;
           }
          });
      }

      //To display token details
      $scope.displayOrder = function(order){
        $scope.displayOrderID = order.orderID;
        $scope.displayOrderContent = order;
        $scope.user_contact = order.address;
        $scope.displayOrderType = order.isTakeaway;

        $scope.isViewingOrder = true;
      }

      $scope.cancelDisplay = function(){
        $scope.isViewingOrder = false;
      }

});
