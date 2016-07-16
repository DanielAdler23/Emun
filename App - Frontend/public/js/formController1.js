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
var businessNAME;
var user_Name;
var complaintId;
var busChosen = 0;
var complaintsArray = [];
if(getCookie("currentUserName") === ""){
	setCookie("currentUserName", "אורח", 1);
}


function updateBusId(busElement){
	if(busChosen === 0){
		busElement.style.backgroundColor = "#E6E6E6";
		businessID = busElement.getElementsByTagName('p')[2].innerHTML;
		businessNAME = busElement.getElementsByTagName('p')[0].innerHTML;
		busChosen = 1;
		setCookie("businessName", busElement.getElementsByTagName('p')[0].innerHTML, 0);
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
		businessNAME = busElement.getElementsByTagName('p')[0].innerHTML;
		setCookie("businessName", busElement.getElementsByTagName('p')[0].innerHTML, 0);
	}
}


var emun = angular.module('emun', []);

emun.controller('loginCtrl', ['$scope', 
	function($scope){
		$scope.user_name = getCookie("currentUserName");
		$scope.submit = function(guest){
			console.log(guest);
			$.ajax({
				type: "POST",
				url: "https://emun2.herokuapp.com/login-user",
				data: guest,
				cache: false,
				async: false,
				success: function(user) {
					console.log("Form Data Sent successfully");
					var sessionUser = JSON.parse(user);
					setCookie("currentUserName", sessionUser.user_name, 1);
					setCookie("currentUserId", sessionUser._id, 1);
					window.location='index.html';
				}
			});
			$scope.user_name = getCookie("currentUserName");
		};


		$scope.logout = function(){

			$.ajax({
				type: "POST",
				url: "https://emun2.herokuapp.com/logoutUser",
				cache: false,
				async: false,
				success: function(user) {
					console.log("logged out...");
					setCookie("currentUserName", "אורח", 1);
					setCookie("currentUserId", "", 1);
					window.location='index.html';
				}
			});
		};
	}]);



emun.controller('formController', ['$scope', 
	function($scope){

		$scope.submit = function(business){
			console.log(business);
			$.ajax({
				type: "POST",
				url: "https://emun2.herokuapp.com/new-business",
				data: business,
				cache: false,
				success: function() {
					console.log("Form Data Sent successfully");
					window.location='index.html';
				}
			});
		};


		
		$scope.login = function(guest){
			console.log(guest);
			$.ajax({
				type: "POST",
				url: "https://emun2.herokuapp.com/login-business",
				data: guest,
				cache: false,
				async: false,
				success: function(user) {
					console.log("Form Data Sent successfully");
					var sessionBusiness = JSON.parse(user);
					setCookie("currentUserName", sessionBusiness.name, 1);
					setCookie("currentBusinessId", sessionBusiness._id, 1);
					window.location='index.html';
				}
			});
		};


		$scope.logout = function(){

			$.ajax({
				type: "POST",
				url: "https://emun2.herokuapp.com/logoutBusiness",
				cache: false,
				async: false,
				success: function(user) {
					console.log("logged out...");
					setCookie("currentUserName", "אורח", 1);
					setCookie("currentBusinessId", "", 1);
					window.location='index.html';
				}
			});
		};
	}]);


emun.controller('userCtrl', ['$scope',
	function($scope){

		$scope.submit = function(user){
			console.log(user);
			$.ajax({
				type: "POST",
				url: "https://emun2.herokuapp.com/new-user",
				data: user,
				cache: false,
				success: function() {
					console.log("Form Data Sent successfully");
					window.location='index.html';
				}
			});
		};
	}]);



emun.controller('compCtrl', ['$scope', 
	function($scope){

		$scope.search = function(business){

			$.ajax({
				type: "POST",
				url: "https://emun2.herokuapp.com/search-business",
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
			if(getCookie("currentUserId") === ""){
				alert("עליך להרשם על מנת להגיש תלונה");
				return;
			}
			$.ajax({
				type: "POST",
				url: "https://emun2.herokuapp.com/new-complaint",
				data: {
						complaint: complaint,
						userID: getCookie("currentUserId"),
						busID: businessID,
						busNAME: businessNAME,
						userNAME: getCookie("currentUserName")
					},
				cache: false,
				success: function(data) {
					var result = JSON.parse(data);
					console.log(result);
					setCookie("complaintID", result.Id, 0);
					console.log("Form Data Sent successfully");
					window.location='confirmation.html';
				}
			});
		};
	}]);



emun.controller('business-form', ['$scope', 
	function($scope){

		$scope.submit = function(business){

		$('#bus-dev').empty();
		console.log(business);
			$.ajax({
				type: "POST",
				url: "https://emun2.herokuapp.com/search-business",
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





emun.controller('confirCtrl', ['$scope',
	function($scope){

		$scope.userName = getCookie("currentUserName");/////////////////////////////////////////////////////////////////

		$scope.targetBusiness = getCookie("businessName");/////////////////////////////////////////////

		$scope.complaintId = getCookie("complaintID");/////////////////////////////////////////////////////////////////
		
	}]);


emun.controller('userPortal', ['$scope',
	function($scope){
		$scope.init = function(){
			$.ajax({
			type: "POST",
			url: "https://emun2.herokuapp.com/user-portal",
			cache: false,
			async: false,
			success: function(complaints) {
				console.log(complaints);
				var json = JSON.parse(complaints);
			 complaintsArray = json;
			}
		});
		$scope.complaints = complaintsArray;
	};
}
]);


// emun.controller('businessPortal', ['$scope',
// 	function($scope){
// 		$scope.init = function(){
// 			$.ajax({
// 			type: "POST",
// 			url: "https://emun.herokuapp.com/business-portal",
// 			cache: false,
// 			async: false,
// 			success: function(complaints) {
// 				console.log(complaints);
// 				var json = JSON.parse(complaints);
// 			 complaintsArray = json;
// 			}
// 		});
// 		$scope.records = complaintsArray;
// 	};
// }
// ]);


function setCookie(cname, cvalue, session) {
	if(session == 1){
		document.cookie = cname + "=" + cvalue;
		return;
	}
    var d = new Date();
    d.setTime(d.getTime() + (120*1000));
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