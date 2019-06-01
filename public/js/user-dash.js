let TRIP_URL = 'trips';
let TRAVEL_DIARY_URL = 'travel-diary';
let user = localStorage.getItem('currentUser');
let date = new Date();

$('#showName').html(user);

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
			showTrip(userData);
		}
	});
}

// show trip
function showTrip(tripArray) {
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

// retrieve user's travel diary info
function getTravelDiary() {
	console.log('Retrieving travel diary information')
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
			//showTravelDiaryResults(userData);
		}
	});
}

// add trip
function addTrip(trip) {
	console.log('Adding trip' + trip);
	let authToken = localStorage.getItem('authToken');
	$.ajax({
		method: 'POST',
		url: TRIP_URL,
		headers: {
			Authorization: `Bearer ${authToken}`
		},
		data: JSON.stringify(trip),
		success: function(data) {
			getTrip(data);
		},
		error: function(err) {
			console.log(err);
		},
		dataType: 'json',
		contentType: 'application/json'
	});
}

function handleTripAdd() {
	$('#addTripSection').submit(function(e) {
	    e.preventDefault();
	    addTrip({
	    	user: user,
	    	destinationCity: $(e.currentTarget).find('#addDestinationCity').val(),
	    	travelDate: $(e.currentTarget).find('#addTravelDate').val(),
	    	busCompany: $(e.currentTarget).find('#addBusCompany').val(),
	    	comments: $(e.currentTarget).find('#addComments').val()
	    });
	    $("#addTripSection input[type='text']").val('');
	    $(".updateTripSection").hide();
		$("#addTripSection").hide();
		$("#add-trip").show();
		$("#cancel-add-trip").hide();
		$(".tripPlanSection").show();
  });
}


$(document).ready(function() {

// when 'Add a trip' button is clicked:
	$("#add-trip").click(function() {
		$(".updateTripSection").hide();
		$("#add-trip").hide();
		$("#cancel-add-trip").show();
		$("#tripPlanSection").show();
		$("#addTripSection").show();
	})

// when 'Cancel' button is clicked:
	$("#cancel-add-trip").click(function() {
		$("#addTripSection input[type='text']").val('');
		$("#addTripSection").show();
		$("#addTripSection").hide();
		$("#cancel-add-plant").hide();
		$("#tripPlanSection").hide();
		$("#add-trip").show();
	})
})

	$(".updateTripSection").hide();
	$("#addTripSection").hide();
	$(".tripPlanSection").show();

$("body").on("click", ".destinationCity", function() {
		console.log("you clicked the destination city");
		event.preventDefault();
		$(this).parent().find(".tripInfo").slideToggle(300);
	});

$("body").on("click", ".diaryDateAndTime", function() {
		console.log("you clicked the date and time");
		event.preventDefault();
		$(this).parent().find(".diaryInfo").slideToggle(300);
	})

$("body").on("click", ".updateTrip", function() {
		console.log('you clicked update');
		let trip = $(this).parent().parent();
		let id = $(this).parent().parent().attr("data-id");
		console.log(id);
		updateTripForm(id, trip);
	})

$("body").on("click", ".updateTravelDiary", function() {
		console.log('you clicked update')
		let travelDiaryEntry = $(this).parent().parent();
		console.log(travelDiaryEntry);
		let id = $(this).parent().parent().attr("data-id");
		console.log(id);
		updateTravelDiaryForm(id, travelDiaryEntry);
	})

$("body").on("submit", ".updateTripSection", function(e) {
		e.preventDefault();
		let id = $(this).attr("data-id")
		console.log(`you submitted updateTripSection for ${id}`);
		let updatedTrip = {
			id: id,
			destinationCity: $('.updateDestinationCity').val(),
			travelDate: $('.updateTravelDate').val(),
			busCompany: $('.updateBusCompany').val(),
			comments: $('.updateComments').val(),
		}
		updateTrip(id, updatedTrip);
		console.log("trip updated")
	})

$("body").on("submit", ".updateTravelDiarySection", function(e) {
		e.preventDefault();
		let id = $(this).attr("data-id")
		console.log(`you submitted updateTravelDiarySection for ${id}`);
		let updatedTravelDiary = {
			id: id,
			content: $('.updateJournalEntry').val(),
			datePublished: date.toDateString()
		}
		updateJournal(id, updatedTravelDiary);
		console.log("travel diary updated")
	})

$(function() {
		getTrip();
		getTravelDiary();
		handleTripAdd();
		//handleJournalAdd();
		//handlePlantUpdate();
		//handleJournalUpdate();
		//handlePlantDelete();
		//handleJournalDelete();
});
