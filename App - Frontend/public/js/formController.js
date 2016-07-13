// Get the modal
var modal = document.getElementById('myModal');

// Get the button that opens the modal
var btn = document.getElementById("modalBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
btn.onclick = function() {
    modal.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

var businessID;
var user_Name;
var complaintId;
var busChosen = 0;

function updateBusId(busElement){
	if(busChosen === 0){
		busElement.style.backgroundColor = "#E6E6E6";
		businessID = busElement.getElementsByTagName('p')[2].innerHTML;
		busChosen = 1;
		setCookie("businessName", busElement.getElementsByTagName('p')[0].innerHTML);
	}
	else{
		var x = document.getElementById("searchResults");
		var y = x.getElementsByTagName("a");
		var i;
		for (i = 0; i < y.length; i++) {
		    y[i].style.backgroundColor = "#fff";
		}
		busElement.style.backgroundColor = "#E6E6E6";
		businessID = busElement.getElementsByTagName('p')[2].innerHTML;
		setCookie("businessName", busElement.getElementsByTagName('p')[0].innerHTML);
	}
}






var addBus = angular.module('addBus', []);

addBus.controller('formController', ['$scope', 
	function($scope){

		$scope.submit = function(business){
			console.log(business);
			$.ajax({
				type: "POST",
				url: "https://emun.herokuapp.com/new-business",
				data: business,
				cache: false,
				success: function() {
					console.log("Form Data Sent successfully");
					window.location='index.html';
				}
			});
		};
	}]);

///////////////////////////////////////////////////////////////////////////////////////////////
var addUser = angular.module('addUser', []);

addUser.controller('userCtrl', ['$scope',
	function($scope){

		$scope.submit = function(user){
			console.log(user);
			$.ajax({
				type: "POST",
				url: "https://emun.herokuapp.com/new-user",
				data: user,
				cache: false,
				success: function() {
					console.log("Form Data Sent successfully");
					window.location='index.html';
				}
			});
		};
	}]);


//////////////////////////////////////////////////////////////////////////////////////////////

var addComplaint = angular.module('addComplaint', []);

addComplaint.controller('compCtrl', ['$scope', 
	function($scope){

		$scope.search = function(business){

			$.ajax({
				type: "POST",
				url: "https://emun.herokuapp.com/search-business",
				data: business,
				cache: false,
				dataType: 'json',
				success: function(data) {

					console.log(data);
					for (var i=0;i<data.length;++i)
					      {
					          $('#searchResults').append('<a href="#" id="businessResults" onclick="updateBusId(this);">' + '<label>שם:</label>' + '<p>' + data[i].name + '</p>' + " " + '<label>כתובת:</label>' + '<p>' + data[i].address + '</p>' + '<p>' + data[i]._id + '</p>' + '</a>' + '<br>');									  
					      }
				}
			});
		};

		$scope.submit = function(complaint){
			console.log(complaint);

			$.ajax({
				type: "POST",
				url: "https://emun.herokuapp.com/new-complaint",
				data: {
						complaint: complaint,
						userID: '576146a52f22f7d8429dc6c6',
						busID: businessID
					},
				cache: false,
				success: function(data) {
					console.log(data);
					console.log("Form Data Sent successfully");
					window.location='confirmation.html';
				}
			});
		};
	}]);



//////////////////////////////////////////////////////////////////////////////////////////////



var searchBus = angular.module('search-business', []);


searchBus.controller('business-form', ['$scope', 
	function($scope){

		$scope.submit = function(business){

		$('#bus-dev').empty();
		console.log(business);
			$.ajax({
				type: "POST",
				url: "https://emun.herokuapp.com/search-business",
				data: business,
				cache: false,
				dataType: 'json',
				success: function(data) {

					console.log(data);
					var json = JSON.parse(JSON.stringify(data));

					      for (var i=0;i<json.length;++i)
					      {
					          $('#bus-dev').append('<div id="result-bus" class="busRes">'+ '<span class="busLogo"></span>' + '<h3>'+json[i].name+'</h3>'+
				          											   '<span class="sector"><label>'+'ענפים:</label>' + json[i].sector + '</span>'+	
				          											   '<span class="phone"><label>'+'טלפון:</label>' + json[i].phone + '</span>'+	
				          											   '<hr>'+'<p></p>'+
				          											   '</div>');
					      }
					  }
			});
		};
	}]);

//////////////////////////////////////////////////////////////////////////////////////////////


var confirmation = angular.module('confirmation', []);

confirmation.controller('confirCtrl', ['$scope',
	function($scope){

		$scope.userName = "ישראל ישראלי";/////////////////////////////////////////////////////////////////

		$scope.targetBusiness = getCookie("businessName");/////////////////////////////////////////////

		$scope.complaintId = "654843";/////////////////////////////////////////////////////////////////
		
	}]);


function setCookie(cname, cvalue) {
    var d = new Date();
    d.setTime(d.getTime() + (60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length,c.length);
        }
    }
    return "";
}