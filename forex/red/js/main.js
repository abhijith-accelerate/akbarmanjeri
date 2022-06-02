
function renderCountries(){

	var stub_data = [
		{
			"country": "USA",
			"currencyCode": "USD",
			"countryCode": "US",
			"buyingRate": 64.80,
			"sellingRate": 66.00
		},
		{
			"country": "UK",
			"currencyCode": "GBP",
			"countryCode": "UK",
			"buyingRate": 84.50,
			"sellingRate": 0
		},
		{
			"country": "Euro",
			"currencyCode": "EUR",
			"countryCode": "EU",
			"buyingRate": 76.50,
			"sellingRate": 0
		},
		{
			"country": "Australia",
			"currencyCode": "AUD",
			"countryCode": "AUS",
			"buyingRate": 49.30,
			"sellingRate": 0
		},
		{
			"country": "UAE",
			"currencyCode": "AED",
			"countryCode": "UAE",
			"buyingRate": 17.60,
			"sellingRate": 18.00
		},
		{
			"country": "Qatar",
			"currencyCode": "QAR",
			"countryCode": "QA",
			"buyingRate": 0,
			"sellingRate": 17.80
		},
		{
			"country": "Oman",
			"currencyCode": "OMR",
			"countryCode": "OM",
			"buyingRate": 166.70,
			"sellingRate": 171.70
		},
		{
			"country": "Saudi Arabia",
			"currencyCode": "SAR",
			"countryCode": "SA",
			"buyingRate": 17.30,
			"sellingRate": 17.60
		},
		{
			"country": "Kuwait",
			"currencyCode": "KWD",
			"countryCode": "KW",
			"buyingRate": 212.75,
			"sellingRate": 217.75
		},
		{
			"country": "Thailand",
			"currencyCode": "THB",
			"countryCode": "TH",
			"buyingRate": 1.94,
			"sellingRate": 0
		},
		{
			"country": "Singapore",
			"currencyCode": "SGD",
			"countryCode": "SN",
			"buyingRate": 48.70,
			"sellingRate": 0
		},
		{
			"country": "Malaysia",
			"currencyCode": "MYR",
			"countryCode": "MY",
			"buyingRate": 15.30,
			"sellingRate": 0
		},
		{
			"country": "Bahrain",
			"currencyCode": "BHD",
			"countryCode": "BH",
			"buyingRate": 170.25,
			"sellingRate": 175.25
		}
	]


		if(!window.localStorage.currencyData || window.localStorage.currencyData == '') {
			window.localStorage.currencyData = JSON.stringify(stub_data);
	      	showToast('System Error: Currency data not found. Please contact Accelerate Support.', '#e74c3c');
	    } 
	    else {
		   
		    var countryList = window.localStorage.currencyData ? JSON.parse(window.localStorage.currencyData) : [];

		    var renderContent = '';

    	  	var n = 0;
		    while(countryList[n]){	

		        renderContent += '<tr>'+
							        '<td><img src="images/flags/'+countryList[n].countryCode+'.jpg" class="flag"></td>'+
							        '<td class="country-text">'+countryList[n].country+'</td>'+
							        '<td class="country-code">'+countryList[n].currencyCode+'</td>'+
							        '<td class="rate-text" onclick="changeBuyingPrice(\''+countryList[n].countryCode+'\', '+countryList[n].buyingRate+', \''+countryList[n].currencyCode+'\')"><i class="fa fa-inr"></i>' + parseFloat(countryList[n].buyingRate).toFixed(2) +'</td>'+
							        '<td class="rate-text" onclick="changeSellingPrice(\''+countryList[n].countryCode+'\', '+countryList[n].sellingRate+', \''+countryList[n].currencyCode+'\')"><i class="fa fa-inr"></i>' + parseFloat(countryList[n].sellingRate).toFixed(2) +'</td>'+
							      '</tr>';
		        n++;
		    }

		    renderContent = '<col width="10%"><col width="30%"><col width="20%"><col width="20%"><col width="20%">'+
		    	'<thead> <tr class="header-row"> <th></th> <th class="bold" style="font-weight: bold !important;">Country</th> <th class="text-center bold" style="font-weight: bold !important;">Currency</th> <th class="text-center bold" style="font-weight: bold !important;">We Buy</th> <th class="text-center bold" style="font-weight: bold !important;">We Sell</th> </tr> </thead> <tbody>' + renderContent + '</tbody>';

		    document.getElementById("renderTableContent").innerHTML = renderContent;
	   	}	
}	


function changeBuyingPrice(country_code, current_price, currency_code){
	document.getElementById("changePriceModal").style.display = 'block';
	document.getElementById("changePriceValue").value = current_price;
	document.getElementById("changePriceText").innerHTML = 'Change Buying Rate of <b>'+currency_code+'</b>';
	document.getElementById("changePriceConfirm").innerHTML = '<button class="btn btn-primary changePriceButton" onclick="saveBuyingPrice(\''+country_code+'\')">Save</button>';
}


function changeSellingPrice(country_code, current_price, currency_code){
	document.getElementById("changePriceModal").style.display = 'block';
	document.getElementById("changePriceValue").value = current_price;
	document.getElementById("changePriceText").innerHTML = 'Change Selling Rate of <b>'+currency_code+'</b>';
	document.getElementById("changePriceConfirm").innerHTML = '<button class="btn btn-primary changePriceButton" onclick="saveSellingPrice(\''+country_code+'\')">Save</button>';
}


function hideModal(){
	document.getElementById("changePriceModal").style.display = 'none';
}


function saveBuyingPrice(country_code){
	var new_price = document.getElementById("changePriceValue").value; 

	if(isNaN(new_price)){
		showToast('Value Error: Rate is not number.', '#e74c3c');
		return "";
	}

	if(new_price == ""){
		new_price = 0;
	}	

			
			var countryList = window.localStorage.currencyData ? JSON.parse(window.localStorage.currencyData) : [];
    	  	
    	  	var n = 0;
		    while(countryList[n]){	

		    	if(countryList[n].countryCode == country_code){
		    		countryList[n].buyingRate = new_price;
		    		break;
		    	}

		        n++;
		    }

		    window.localStorage.currencyData = JSON.stringify(countryList);

		    showToast('Buying Rate updated', '#2ecc71');
		    hideModal();
		    renderCountries();

}



function saveSellingPrice(country_code){
	var new_price = document.getElementById("changePriceValue").value; 

	if(isNaN(new_price)){
		showToast('Value Error: Rate is not number.', '#e74c3c');
		return "";
	}

	if(new_price == ""){
		new_price = 0;
	}	

			
			var countryList = window.localStorage.currencyData ? JSON.parse(window.localStorage.currencyData) : [];
    	  	
    	  	var n = 0;
		    while(countryList[n]){	

		    	if(countryList[n].countryCode == country_code){
		    		countryList[n].sellingRate = new_price;
		    		break;
		    	}

		        n++;
		    }

		    window.localStorage.currencyData = JSON.stringify(countryList);

		    showToast('Selling Rate updated', '#2ecc71');
		    hideModal();
		    renderCountries();

}



/* GLOBAL TIME DISPLAY */
function timedUpdate () {
  	document.getElementById('globalTimeDisplay').innerHTML = moment().format('h:mm:ss a');
  	setTimeout(timedUpdate, 1000);
}

timedUpdate();


//Update date
function dateUpdate(){
	document.getElementById('globalDateDisplay').innerHTML = moment().format('Do MMMM, YYYY');
}

dateUpdate();




/*Toast*/
var toastShowingInterval;
function showToast(message, color){

      clearInterval(toastShowingInterval);

      var x = document.getElementById("infobar")
      if(color){
        x.style.background = color;
      }

      x.innerHTML = message;
      x.className = "show";
      toastShowingInterval = setTimeout(function(){ x.className = x.className.replace("show", ""); }, 5000); 

}		