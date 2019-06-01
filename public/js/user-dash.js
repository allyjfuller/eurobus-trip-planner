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
			showTravelDiary(userData);
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

// show travel diary
function showTravelDiary(diaryArray) {
	let travelDiary = "";

	$.each(diaryArray, function(diaryArrayKey, diaryArrayValue) {
		travelDiary += `<div class="travelDiaryItem" data-id=${diaryArrayValue._id}>`
		travelDiary += `<p class="travelDiaryDateAndTime">${diaryArrayValue.datePublished}</p>`
		travelDiary += `<div class="travelDiaryInfo" style="display:none">`
		travelDiary += `<p class="travelDiaryContent">${diaryArrayValue.content}</p>`
		travelDiary += `<button type="submit" class="updateTravelDiary homePageButtons">Update</button>`
		travelDiary += `<button type="submit" class="deleteTravelDiary homePageButtons">Delete</button>`
		travelDiary += `</div>`
		travelDiary += `</div>`
	
		$('.travelDiarySection').html(travelDiary);
	})
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

// add diary
function addTravelDiaryEntry(travelDiaryPosts) {
	console.log('Adding travel diary post' + travelDiaryPosts);
	let authToken = localStorage.getItem('authToken');
	$.ajax({
		method: 'POST',
		url: TRAVEL_DIARY_URL,
		headers: {
			Authorization: `Bearer ${authToken}` 
		},
		data: JSON.stringify(travelDiaryPosts),
		success: function(data) {
			console.log(data);
			getTravelDiary(data);
		},
		error: function(err) {
			console.log(err);
		},
		dataType: 'json',
		contentType: 'application/json'
	});
}

// update trip
function updateTripForm(id, element) {
	let authToken = localStorage.getItem('authToken');
	$.ajax({
		method: 'GET',
		url: `${TRIP_URL}/${id}`,
		headers: {
			Authorization: `Bearer ${authToken}`
		},
		contentType: 'application/json',
		success: function(tripData) {
			console.log(tripData);

			let updateTemplate = `
				<form class="row updateTripSection" data-id=${id}>
					<h2>Update trip</h2><br>
					<label for="updateDestinationCity">City:</label>
					<input type="text" name="updateDestinationCity" class="updateDestinationCity" value=${tripData.destinationCity}>
					<label for="updateTravelDate">Travel Date:</label>
					<input type="text" name="updateTravelDate" class="updateTravelDate" value=${tripData.travelDate}>
					<label for="updateTravelDate">Bus Company:</label>
					<input type="text" name="updateBusCompany" class="updateBusCompany" value=${tripData.busCompany}>
					<label for="updateComments">Comments:</label>
					<input type="text" name="updateComments" class="updateComments" value=${tripData.comments}>
					<button type="submit" id="cancel-update-trip" class="homePageButtons">Cancel</button>
					<button type="submit" id="updateTripInfo" class="homePageButtons">Update</button>
				</form>`
			$(element).find(".tripInfo").hide();
			$(element).after(updateTemplate);
		}
	});
}

// update travel diary
function updateTravelDiaryForm(id, element) {
	let authToken = localStorage.getItem('authToken');
	$.ajax({
		method: 'GET',
		url: `${TRAVEL_DIARY_URL}/${id}`,
		headers: {
			Authorization: `Bearer ${authToken}`
		},
		contentType: 'application/json',
		success: function(travelDiaryData) {
			console.log(travelDiaryData);

			let updateTravelDiaryTemplate = `
				<form class="row updateTravelDiarySection" data-id=${id}>
					<label for="newTravelDiaryEntry">Document your favorite travel stories</label>
					<input type="text" name="updateTravelDiaryEntry" class="updateTravelDiaryEntry" placeholder="Write something" required value=${travelDiaryData.content}>
					<button type="submit" id="updateTravelDiaryInfo" class="homePageButtons">Update</button>
				</form>`
			$(element).find(".travelDiaryInfo").hide();
			$(element).after(updateTravelDiaryTemplate);
		}
	});
}

function updateTrip(id, trip) {
	console.log(`Updating trip ${id}`);
	let authToken = localStorage.getItem('authToken');
	$.ajax({
		url: TRIP_URL + '/' + id,
		headers: {
			Authorization: `Bearer ${authToken}`
		},
		method: 'PUT',
		dateType: 'json',
		contentType: 'application/json',
		data: JSON.stringify(trip),
		success: function(data) {
			getTrip(data);
		},
		error: function(err) {
			console.log(err);
		}
	});
}

function updateTravelDiary(id, travelDiaryPosts) {
	console.log(`Updating travel diary entry ${id}`);
	let authToken = localStorage.getItem('authToken');
	$.ajax({
		url: TRAVEL_DIARY_URL + '/' + id,
		headers: {
			Authorization: `Bearer ${authToken}`
		},
		method: 'PUT',
		dataType: 'json',
		contentType: 'application/json',
		data: JSON.stringify(travelDiaryPosts),
		success: function(data) {
			getTravelDiary(data);
		},
		error: function(err) {
			console.log(err);
		}
	});
}

// delete trip
function deleteTrip(id) {
	console.log(`Deleting trip ${id}`);
	let authToken = localStorage.getItem('authToken');
	$.ajax({
		url: TRIP_URL + '/' + id,
		headers: {
			Authorization: `Bearer ${authToken}`
		},
		method: 'DELETE',
		success: function(data) {
			getTrip(data);
		},
		error: function(err) {
			console.log('Hello', err);
		}
	});
}

// delete travel diary entry
function deleteTravelDiaryEntry(id) {
	console.log(`Deleting travel diary entry ${id}`);
	let authToken = localStorage.getItem('authToken');
	$.ajax({
		url: TRAVEL_DIARY_URL + '/' + id,
		headers: {
			Authorization: `Bearer ${authToken}`
		},
		method: 'DELETE',
		success: function(data) {
			getTravelDiary(data);
		},
		error: function(err) {
			console.log(err);
		}
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

function handleTravelDiaryAdd() {
	$("#addTravelDiarySection").submit(function(e) {
		e.preventDefault();
		addTravelDiaryEntry({
			user: user,
			content: $(e.currentTarget).find('#addTravelDiaryEntry').val(),
			datePublished: date.toDateString()
		});
		$("#addTravelDiarySection textarea[type='text']").val('');
		$(".updateTravelDiarySection").hide();
		$("#addTravelDiarySection").hide();
		$("#add-travel-diary-entry").show();
		$("#cancel-travel-diary-entry").hide();
		$(".travelDiarySection").show();
	});
}

function handleTripUpdate() {
	$('#updateTripInfo').on('click', function(e) {
		console.log('you updated your trip');
		e.preventDefault();
		updateTrip({
			user: user,
			destinationCity: $(e.currentTarget).find('.updateDestinationCity').val(),
			travelDate: $(e.currentTarget).find('.updateTravelDate').val(),
			busCompany: $(e.currentTarget).find('.updateBusCompany').val(),
			comments: $(e.currentTarget).find('.updateComments').val(),
		});
		$(".updateTripSection").hide();
		$("#addTripSection").hide();
		$("#tripPlanSection").show();
	});
}

function handleTravelDiaryUpdate() {
	$("#updateTravelDiary").on('click', function(e) {
		alert('you updated your travel diary');
		e.preventDefault();
		updateTravelDiary({
			user: user,
			content: $(e.currentTarget).find('.updateTravelDiaryEntry').val(),
			datePublished: date.toDateString()
		});
		$("updateTravelDiaryForm").hide();
		$("addTravelDiarySection").hide();
		$("travelDiarySection").show();
	})
}

function handleTripDelete() {
	$('.tripPlanSection').on('click', '.deleteTrip', function(e) {
		e.preventDefault();
		deleteTrip(
			$(e.currentTarget).closest('.tripItem').attr('data-id'));
	});
}

function handleTravelDiaryDelete() {
	$(".travelDiarySection").on('click', '.deleteTravelDiary', function(e) {
		e.preventDefault();
		deleteTravelDiaryEntry(
			$(e.currentTarget).closest('.travelDiaryItem').attr('data-id'));
	});
}


$(document).ready(function() {

// when 'Add a trip' button is clicked:
	$("#add-trip").click(function() {
		$(".updateTripSection").hide();
		$("#add-trip").hide();
		$("#cancel-add-trip").show();
		$(".tripPlanSection").show();
		$("#addTripSection").show();
	})

// when 'Cancel' button is clicked:
	$("#cancel-add-trip").click(function() {
		$("#addTripSection").hide();
		$("#cancel-add-plant").hide();
		$("#add-trip").show();
	})

// when 'Add Memory' button is clicked:
	$("#add-travel-diary-entry").click(function() {
		$(".updateTravelDiarySection").hide();
		$("#add-travel-diary-entry").hide();
		$("#cancel-travel-diary-entry").show();
		$(".travelDiarySection").show();
		$("#addTravelDiarySection").show();
	})

// when 'Cancel' button is clicked:
	$("#cancel-add-travel-diary").click(function() {
		$("#addTravelDiarySection").hide();
		$("#cancel-add-travel-diary").hide();
		$("#add-travel-diary-entry").show();
	})

// hide the update form, the new trip form, and shows the trip plans
	$(".updateTripSection").hide();
	$("#addTripSection").hide();
	$(".tripPlanSection").show();

// when you click the name of the city it reveals the whole plan
	$("body").on("click", ".destinationCity", function() {
		console.log("you clicked the destination city");
		event.preventDefault();
		$(this).parent().find(".tripInfo").slideToggle(300);
	});

// when you click the date of the entry it reveals the contents
	$("body").on("click", ".travelDiaryDateAndTime", function() {
		console.log("you clicked the date and time");
		event.preventDefault();
		$(this).parent().find(".travelDiaryInfo").slideToggle(300);
	})

// when you click the update trip button it brings up the update form
	$("body").on("click", ".updateTrip", function() {
		console.log('you clicked update');
		let trip = $(this).parent().parent();
		let id = $(this).parent().parent().attr("data-id");
		console.log(id);
		updateTripForm(id, trip);
	})

// when you click the update diary button it lets you edit your entry
	$("body").on("click", ".updateTravelDiary", function() {
		console.log('you clicked update')
		let travelDiaryEntry = $(this).parent().parent();
		console.log(travelDiaryEntry);
		let id = $(this).parent().parent().attr("data-id");
		console.log(id);
		updateTravelDiaryForm(id, travelDiaryEntry);
	})

// when you submit the trip update
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

// when you submit the diary update
	$("body").on("submit", ".updateTravelDiarySection", function(e) {
		e.preventDefault();
		let id = $(this).attr("data-id")
		console.log(`you submitted updateTravelDiarySection for ${id}`);
		let updatedTravelDiary = {
			id: id,
			content: $('.updateTravelDiaryEntry').val(),
			datePublished: date.toDateString()
		}
		updateTravelDiary(id, updatedTravelDiary);
		console.log("travel diary updated")
	})

	$(function() {
		getTrip();
		getTravelDiary();
		handleTripAdd();
		handleTravelDiaryAdd();
		handleTripUpdate();
		handleTravelDiaryUpdate();
		handleTripDelete();
		handleTravelDiaryDelete();
	})
});
