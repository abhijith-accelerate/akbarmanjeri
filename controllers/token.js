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
        window.location = "index.html";
      }

      //Logout function
      $scope.logoutNow = function(){
        if($cookies.get("akbarTokenManagementAppAdminToken")){
          $cookies.remove("akbarTokenManagementAppAdminToken");
          window.location = "index.html";
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
      
      $scope.searchKey = '';
      $scope.searchType = 'SLIP_DATE';

      $scope.clearSearchFields = function(optionalField){
        $scope.searchKey_SlipNumber = "";
        if(optionalField != 'CUSTOMER_MOBILE')
          $scope.searchKey_Mobile = "";
        $scope.searchKey_TravelDate = "";
        $scope.searchKey_SlipDate = "";
      }


      $scope.isOrdersFound = false;
      $scope.resultMessage = '';
      $scope.filterTitle = 'Today\'s Generated Tokens';
      $scope.isMoreLeft = true;


      //Default Results : Generated tokens of the day
      $scope.initTokens = function() {

            $scope.searchType = 'SLIP_DATE';

            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth()+1;
            var yyyy = today.getFullYear();
            if(dd<10){ dd='0'+dd;}
            if(mm<10){ mm='0'+mm;}
            var today = dd+'-'+mm+'-'+yyyy;

            var data = {};
            data.token = $cookies.get("akbarTokenManagementAppAdminToken");
            data.key = today;
            data.type = "SLIP_DATE";
            

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

      $scope.searchByTravelDate = function(){    
  	    $scope.searchKey_TravelDate = "";
  	    setTimeout(function(){
  		    $('#searchByTravelDatePicker').datetimepicker({  
  			    	format: "dd-mm-yyyy",
  			    	weekStart: 1,
  		        	todayBtn:  1,
  				autoclose: 1,
  				todayHighlight: 1,
  				startView: 2,
  				minView: 2,
  				forceParse: 1
  		    }).on('changeDate', function(ev) {
  			    $scope.searchKey_TravelDate = $("#searchByTravelDatePicker").val();
  			    $scope.search("TRAVEL_DATE", $scope.searchKey_TravelDate);
  		    }).on('hide', function(ev) { 
  			    $('#searchByTravelDatePicker').datetimepicker('remove');
  		    });
  			
  		    $("#searchByTravelDatePicker").datetimepicker().focus();
  	    
  	    }, 200);	     
      }
      

      $scope.searchBySlipDate = function(){    
        $scope.searchKey_SlipDate = "";
        setTimeout(function(){
          $('#searchBySlipDatePicker').datetimepicker({  
              format: "dd-mm-yyyy",
              weekStart: 1,
                todayBtn:  1,
          autoclose: 1,
          todayHighlight: 1,
          startView: 2,
          minView: 2,
          forceParse: 1
          }).on('changeDate', function(ev) {
            $scope.searchKey_SlipDate = $("#searchBySlipDatePicker").val();
            $scope.search("SLIP_DATE", $scope.searchKey_SlipDate);
          }).on('hide', function(ev) { 
            $('#searchBySlipDatePicker').datetimepicker('remove');
          });
        
          $("#searchBySlipDatePicker").datetimepicker().focus();
        
        }, 200);       
      }




      $scope.selectTravelDate = function() {
        setTimeout(function(){
          $('#travelDatePicker').datetimepicker({  
              format: "dd-mm-yyyy",
              weekStart: 1,
                todayBtn:  1,
          autoclose: 1,
          todayHighlight: 1,
          startView: 2,
          minView: 2,
          forceParse: 1
          }).on('changeDate', function(ev) {
            $scope.newTokenContent.travel_date = $("#travelDatePicker").val();
          }).on('hide', function(ev) { 
            $('#travelDatePicker').datetimepicker('remove');
          });
        
          $("#travelDatePicker").datetimepicker().focus();
        
        }, 200);
      }


      $scope.limiter = 0;

      $scope.search = function(type, keyValue) {
        //Switch to list view in case not
        $scope.isViewingOrder = false;

        //For loadMore only
        $scope.searchKey = keyValue;
        $scope.searchType = type;

        var data = {};
        data.token = $cookies.get("akbarTokenManagementAppAdminToken");
        data.key = keyValue;
        data.type = type;
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
        data.key = $scope.searchKey;
        data.type = $scope.searchType;
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
        $scope.isWhatsappLocked = false;
        $scope.newTokenContent = {};
        $scope.newTokenContent.customer_mobile = "";
        $scope.newTokenContent.customer_mobile_wa = "";
        $scope.newTokenContent.customer_name = "";
        $scope.newTokenContent.customer_dob = "";
        $scope.newTokenContent.passport_number = "";
        $scope.newTokenContent.passport_expiry = "";
        $scope.newTokenContent.travel_from = "";
        $scope.newTokenContent.travel_to = "";
        $scope.newTokenContent.travel_date = "";
        $scope.newTokenContent.flight_name = "";
        $scope.newTokenContent.flight_departure = "";
        $scope.newTokenContent.flight_arrival = "";
        $scope.newTokenContent.flight_status = "OK";
        $scope.newTokenContent.customer_address = "";
        $scope.newTokenContent.remarks = "";

        $scope.isGenerateTokenPressed = false;
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
    $scope.editRemarksOriginal = "";
    $scope.editToken = function(content){
      $scope.editRemarksOriginal = content.remarks;
      $scope.editTokenContent = content;
      $('#tokenEditModal').modal('show');
     }



     //Print Token
     $scope.printToken = function(id) {
       window.open("https://www.accelerateengine.app/client-apis/akbar/tokenpdf.php?id=" + id, "_blank");
     }


     $scope.isWhatsappLocked = false;
     $scope.copyWhatsappNumber = function() {
        if(!$scope.isWhatsappLocked)
          $scope.newTokenContent.customer_mobile_wa = $scope.newTokenContent.customer_mobile;
     }

     $scope.lockWhatsappNumber = function(){
        $scope.isWhatsappLocked = true;
     }




  $scope.isGenerateTokenPressed = false;


  $scope.getGenerateTokenButton = function(){
    return $scope.isGenerateTokenPressed ? "Generating Token..." : "Generate Token";
  }



  $scope.updateRemarks = function(editContent) {
    var data = {
      "id" : editContent.id,
      "remarks" : editContent.remarks,
      "token" : $cookies.get("akbarTokenManagementAppAdminToken")
    }

    $http({
        method  : 'POST',
        url     : 'https://www.accelerateengine.app/client-apis/akbar/updatetokenremarks.php',
        data    : data,
        headers : {'Content-Type': 'application/x-www-form-urlencoded'}
     })
     .then(function(response) {
      $('#tokenEditModal').modal('hide');
      if(response.data.status){    
        $scope.initTokens();
      }
      else{
        alert(response.data.error);
      }

     });  
  }


      
  $scope.saveNewToken = function(){

    if($scope.isGenerateTokenPressed)
      return;
    
    $scope.isGenerateTokenPressed = true;
    $scope.newTokenError = "";

    if($scope.newTokenContent.customer_name == "" || !(/^[a-zA-Z ]+$/.test($scope.newTokenContent.customer_name))){
      $scope.newTokenError = "Please enter valid Customer Name";
    }
    else if($scope.newTokenContent.customer_mobile == "" || !(/^[6789]\d{9}$/.test($scope.newTokenContent.customer_mobile))){
      $scope.newTokenError = "Please enter valid Mobile Number";
    } else if($scope.newTokenContent.customer_dob == ""){
      $scope.newTokenError = "Date of Birth not added";
    } else if($scope.newTokenContent.passport_number == ""){
      $scope.newTokenError = "Passport Number not added";
    } else if($scope.newTokenContent.travel_from == "" || $scope.newTokenContent.travel_to == ""){
      $scope.newTokenError = "Travel From/To is not added";
    } else if($scope.newTokenContent.travel_date == ""){
      $scope.newTokenError = "Travel date not mentioned";
    } else if($scope.newTokenContent.flight_departure == "" || $scope.newTokenContent.flight_arrival == ""){
      $scope.newTokenError = "Flight departure / arrival not added";
    } else if($scope.newTokenContent.flight_status == ""){
      $scope.newTokenError = "Flight status not added";
    } else if($scope.newTokenContent.amount == ""){
      $scope.newTokenError = "Amount not added";
    }
    else{
          $scope.newTokenError = "";
      
          var data = $scope.newTokenContent;
          data.token = $cookies.get("akbarTokenManagementAppAdminToken");
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

    if($scope.newTokenError != ""){
      $scope.isGenerateTokenPressed = false;
    }
  
  }
  
});
