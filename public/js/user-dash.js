let TRIP_URL = 'trips';
let TRAVEL_DIARY_URL = 'travel-diary';
let user = localStorage.getItem('currentUser');
let date = new Date();

// tab nav
function openTab(evt, tabName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
}

// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();

// retrieve user's trip info
function getTrip() {
	console.log('Retrieving trip information')
	let authToken = localStorage.getItem('authToken');
	$.ajax({
		method: 'GET',
		url: `${TRIP_URL}/user/${user}`,
		headers: {
			Authorization: `Bearer ${authToken}`
		},
		contentType: 'application/json',
		success: function(userData) {
			console.log(userData);
			showTripResults(userData);
		}
	});
}

// retrieve user's travel diary info
function getTravelDiary() {
	console.log('Getting travel diary information')
	let authToken = localStorage.getItem('authToken');
	$.ajax({
		method: 'GET',
		url: `${TRAVEL_DIARY_URL}/user/${user}`,
		headers: {
			Authorization: `Bearer ${authToken}`
		},
		contentType: 'application/json',
		success: function(userData) {
			console.log(userData);
			showTravelDiaryResults(userData);
		}
	});
}

// show trip
function showTrip(tripArray) {
	$('#showName').html(user);
	let tripPlan = "";

	$.each(tripArray, function (tripArrayKey, tripArrayValue) {
		tripPlan += `<div class="tripItem" data-id=${tripArrayValue._id}>` 
		tripPlan += `<p class="destinationCity">${tripArrayValue.destinationCity}</p>`
		tripPlan += `<div class="tripInfo" style="display:none">` 
		tripPlan += `<p class="travelDate">Depart: ${tripArrayValue.travelDate}</p>` 
		tripPlan += `<p class="busCompany">Bus Company: ${tripArrayValue.busCompany}</p>` 
		tripPlan += `<p class="tripComments">Comments: ${tripArrayValue.comments}</p>` 
		tripPlan += `<button type="submit" class="updateTrip homePageButtons">Update</button>`
		tripPlan += `<button type="submit" class="deleteTrip homePageButtons">Delete</button>`
		tripPlan += `</div>` 
		tripPlan += `</div>`
		
		$('.tripPlanSection').html(tripPlan);
	});
}

$(document).ready(function() {

// when 'Add a trip' button is clicked:
	$("#add-trip").click(function() {
		//$(".updateTripSection").hide();
		$("#add-trip").hide();
		$("#cancel-add-trip").show();
		$("#tripPlanSection").show();
		//$("#addTripSection").show();
	})
})
