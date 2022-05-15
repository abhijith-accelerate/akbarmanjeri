angular.module('TokenApp', ['ngCookies'])

.config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
}])

.controller('tokenGeneratorController', function($scope, $http, $interval, $cookies) {

      //Check if logged in
      if($cookies.get("akbarTokenManagementAppAdminToken")){
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
      $scope.initTokens = function() {
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth()+1;
            var yyyy = today.getFullYear();
            if(dd<10){ dd='0'+dd;}
            if(mm<10){ mm='0'+mm;}
            var today = yyyy+'-'+mm+'-'+dd;

            var data = {};
            data.token = $cookies.get("akbarTokenManagementAppAdminToken");
            data.key = today;
            

            $('#vegaPanelBodyLoader').show(); $("body").css("cursor", "progress");
            $http({
              method  : 'POST',
              url     : 'https://www.accelerateengine.app/client-apis/akbar/filtertokens.php',
              data    : data,
              headers : {'Content-Type': 'application/x-www-form-urlencoded'}
             })
             .then(function(response) {
      	       $('#vegaPanelBodyLoader').hide(); $("body").css("cursor", "default");
               if(response.data.status){
                 $scope.isMoreLeft = false; //Showing all tokens anyways.
                 $scope.isOrdersFound = true;
                 $scope.generatedTokens = response.data.response;
               }
               else{
                 $scope.isOrdersFound = false;
                 $scope.resultMessage = "There are no tokens generated today!";
               }
              });
      }

      $scope.initTokens();

      $scope.searchByDate = function(){    
	    $scope.searchID = "";
	    setTimeout(function(){
		    $('#mySearchBox').datetimepicker({  
			    	format: "yyyy-mm-dd",
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
          url     : 'https://www.accelerateengine.app/client-apis/akbar/filtertokens.php',
          data    : data,
          headers : {'Content-Type': 'application/x-www-form-urlencoded'}
         })
         .then(function(response) {
           $('#vegaPanelBodyLoader').hide(); $("body").css("cursor", "default");
           if(response.data.status){
             $scope.isOrdersFound = true;
             $scope.generatedTokens = response.data.response;
             $scope.filterTitle = response.data.result;

             if($scope.generatedTokens.length%5 == 0){
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
          url     : 'https://www.accelerateengine.app/client-apis/akbar/filtertokens.php',
          data    : data,
          headers : {'Content-Type': 'application/x-www-form-urlencoded'}
         })
         .then(function(response) {
           if(response.data.status){
             $scope.isOrdersFound = true;
             $scope.generatedTokens = $scope.generatedTokens.concat(response.data.response);
             $scope.filterTitle = response.data.result;

             if($scope.generatedTokens.length%5 == 0){
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


     //Add new token
     $scope.nullNewToken = function(){
      $scope.newTokenContent = {};
     }
     $scope.nullNewToken();
     
     
     $scope.openNewToken = function(){
      $scope.nullNewToken();
      $('#tokenModal').modal('show');
     }


     $scope.cancelContent = {};
     $scope.confirmCancel = function(code, name) {
        $scope.cancelContent.code = code;
        $scope.cancelContent.cancelShowName = name;
        $('#cancelModal').modal('show');
     }


     $scope.proceedCancel = function(code) {
        var data = {};
        data.token = $cookies.get("akbarTokenManagementAppAdminToken");
        data.id = code;
        $http({
          method  : 'POST',
          url     : 'https://www.accelerateengine.app/client-apis/akbar/canceltoken.php',
          data    : data,
          headers : {'Content-Type': 'application/x-www-form-urlencoded'}
         })
         .then(function(response) {
            $('#cancelModal').modal('hide');
            if(!response.data.status){
              alert(response.data.error);
            } else {
              $scope.initTokens();
            }
          });
     }




     //Edit Token
     $scope.editTokenContent = {};
    $scope.editToken = function(content){
      $scope.editTokenContent = content;
      $('#tokenEditModal').modal('show');
     }



     //Print Token
     $scope.printToken = function(id) {
       window.open("https://www.accelerateengine.app/client-apis/akbar/tokenpdf.php?id=" + id, "_blank");
     }



      
  $scope.saveNewToken = function(){
    
    $scope.newTokenError = "";
    
    if($scope.newTokenContent.customer_name == "" || !(/^[a-zA-Z ]+$/.test($scope.newTokenContent.customer_name))){
      $scope.newTokenError = "Invalid Customer Name";
    }
    else if($scope.newTokenContent.customer_mobile == "" || !(/^[789]\d{9}$/.test($scope.newTokenContent.customer_mobile))){
      $scope.newTokenError = "Invalid Mobile Number";
    }
    else{

          $scope.newTokenError = "";
      
          var data = $scope.newTokenContent;
          data.flight_status = "OK";
          data.token = $cookies.get("akbarTokenManagementAppAdminToken"); //"\/p0OCBdltetUswGVETvNE6lxNvjFVnZ5dczhZZrTXFBpzdIz6BOndLYl1Kk8YDVbVP3udTQ9UYWCj3lyTiD3FA==";
          
          $http({
              method  : 'POST',
              url     : 'https://www.accelerateengine.app/client-apis/akbar/newtoken.php',
              data    : data,
              headers : {'Content-Type': 'application/x-www-form-urlencoded'}
           })
           .then(function(response) {
            $('#tokenModal').modal('hide');
            if(response.data.status){    
              $scope.initTokens();
            }
            else{
              alert(response.data.error);
            }
           });  
    }
  
  }
  
});
