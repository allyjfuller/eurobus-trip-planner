let TRIP_URL = 'trip';
let TRAVEL_DIARY_URL = 'travelDiary';
let user = localStorage.getItem('currentUser');
let date = new Date();

function getTrip() {
	console.log('Getting trip info')
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

function getTravelDiary() {
	console.log('Getting travel diary info')
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

function showTripResults(tripArray) {
	$('#showTripPlan').html(user);
	let tripPlan = "";

	$.each(cityArray, function (tripArrayKey, tripArrayValue) {
		tripPlan += `<div class="tripItem" data-id=${tripArrayValue._id}>` 
		tripPlan += `<p class="destinationCity">${tripArrayValue.destinationCity}</p>`
		tripPlan += `<div class="cityInfo" style="display:none">` 
		tripPlan += `<p class="travelDate">Started: ${tripArrayValue.travelDate}</p>` 
		tripPlan += `<p class="busCompany">Harvest: ${tripArrayValue.busCompany}</p>` 
		tripPlan += `<p class="tripComments">Comments: ${tripArrayValue.comments}</p>` 
		tripPlan += `<button type="submit" class="updateTrip homePageButtons">Update</button>`
		tripPlan += `<button type="submit" class="deleteTrip homePageButtons">Delete</button>`
		tripPlan += `</div>` 
		tripPlan += `</div>`
		
		$('.tripPlanSection').html(tripPlan);
	});
}

function showTravelDiary(diaryArray) {
	let travelDiary = "";

	$.each(diaryArray, function(diaryArrayKey, diaryArrayValue) {
		travelDiary += `<div class="diaryItem" data-id=${diaryArrayValue._id}>`
		travelDiary += `<p class="diaryDateAndTime">${diaryArrayValue.datePublished}</p>`
		travelDiary += `<div class="diaryInfo" style="display:none">`
		travelDiary += `<p class="diaryContent">${diaryArrayValue.content}</p>`
		travelDiary += `<button type="submit" class="updateDiary homePageButtons">Update</button>`
		travelDiary += `<button type="submit" class="deleteDiary homePageButtons">Delete</button>`
		travelDiary += `</div>`
		travelDiary += `</div>`
	
		$('.travelDiarySection').html(travelDiary);
	})
}

function addDestinationCity(city) {
	console.log('Adding city' + city);
	let authToken = localStorage.getItem('authToken');
	$.ajax({
		method: 'POST',
		url: TRIP_URL,
		headers: {
			Authorization: `Bearer ${authToken}`
		},
		data: JSON.stringify(city),
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

function addTravelDiaryEntry(diaryPosts) {
	console.log('Adding diary post' + diaryPosts);
	let authToken = localStorage.getItem('authToken');
	$.ajax({
		method: 'POST',
		url: TRAVEL_DIARY_URL,
		headers: {
			Authorization: `Bearer ${authToken}` 
		},
		data: JSON.stringify(diaryPosts),
		success: function(data) {
			console.log(data);
			getJournal(data);
		},
		error: function(err) {
			console.log(err);
		},
		dataType: 'json',
		contentType: 'application/json'
	});
}

function updateDestinationCity(id, element) {
	let authToken = localStorage.getItem('authToken');
	$.ajax({
		method: 'GET',
		url: `${TRIP_URL}/${id}`,
		headers: {
			Authorization: `Bearer ${authToken}`
		},
		contentType: 'application/json',
		success: function(cityData) {
			console.log(cityData);

			let updateTemplate = `
				<form class="row updateDestinatoinCitySection" data-id=${id}>
					<h2>Update Destination City</h2><br>
					<label for="updateDestinationCity">City:</label>
					<input type="text" name="updateDestinationCity" class="updateDestinationCity" value=${cityData.destinationCity}>
					<label for="updateTravelDate">Travel Date:</label>
					<input type="text" name="updateTravelDate" class="updateTravelDate" value=${cityData.travelDate}>
					<label for="updateBusCompany">Bus Company:</label>
					<input type="text" name="updateBusCompany" class="updateBusCompany" value=${cityData.busCompany}>
					<label for="updateComments">Comments:</label>
					<input type="text" name="updateComments" class="updateComments" value=${cityData.comments}>
					<button type="submit" id="updateCityInfo" class="homePageButtons">Update</button>
				</form>`
			$(element).find(".cityInfo").hide();
			$(element).after(updateTemplate);
		}
	});
}

function updateTravelDiary(id, element) {
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

			let updateDiaryTemplate = `
				<form class="row updateTravelDiarySection" data-id=${id}>
					<label for="newDiaryEntry">What happened on your trip?</label>
					<input type="text" name="updateDiaryEntry" class="updateDiaryEntry" placeholder="valuable travel memories here" required value=${travelDiaryData.content}>
					<button type="submit" id="updateDiaryInfo" class="homePageButtons">Update</button>
				</form>`
			$(element).find(".diaryInfo").hide();
			$(element).after(updateDiaryTemplate);
		}
	});
}	

function updateCity(id, city) {
	console.log(`Updating city ${id}`);
	let authToken = localStorage.getItem('authToken');
	$.ajax({
		url: TRIP_URL + '/' + id,
		headers: {
			Authorization: `Bearer ${authToken}`
		},
		method: 'PUT',
		dateType: 'json',
		contentType: 'application/json',
		data: JSON.stringify(city),
		success: function(data) {
			getTrip(data);
		},
		error: function(err) {
			console.log(err);
		}
	});
}

function updateDiary(id, diaryPosts) {
	console.log(`Updating travel diary ${id}`);
	let authToken = localStorage.getItem('authToken');
	$.ajax({
		url: TRAVEL_DIARY_URL + '/' + id,
		headers: {
			Authorization: `Bearer ${authToken}`
		},
		method: 'PUT',
		dataType: 'json',
		contentType: 'application/json',
		data: JSON.stringify(diaryPosts),
		success: function(data) {
			getTravelDiary(data);
		},
		error: function(err) {
			console.log(err);
		}
	});
}

function deleteCity(id) {
	console.log(`Deleting city ${id}`);
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
			console.log(err);
		}
	});
}

function deleteDiaryEntry(id) {
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

function handleAddDestinationCity() {
	$('#addDestinationCitySection').submit(function(e) {
	    e.preventDefault();
	    addCity({
	    	user: user,
	    	destinationCity: $(e.currentTarget).find('#addDestinationCity').val(),
	    	travelDate: $(e.currentTarget).find('#addTravelDate').val(),
	    	busCompany: $(e.currentTarget).find('#addBusCompany').val(),
	    	comments: $(e.currentTarget).find('#addComments').val()
	    });
	    $("#addDestinationCitySection input[type='text']").val('');
	    $(".updateDestinationCitySection").hide();
		$("#addDestinationCitySection").hide();
		$("#cancel-add-city").hide();
		$(".tripPlanSection").show();
  });
}

function handleAddTravelDiary() {
	$("#addTravelDiarySection").submit(function(e) {
		e.preventDefault();
		addDiaryEntry({
			user: user,
			content: $(e.currentTarget).find('#newDiaryEntry').val(),
			datePublished: date.toDateString()
		});
		$("#addTravelDiarySection input[type='text']").val('');
		$("#addTravelDiarySection").hide();
		$(".updateTravelDiarySection").hide();
		$("#cancel-diary-entry").hide();
		$(".travelDiarySection").show();
	})
}

function handleCityUpdate() {
	$('#updateCityInfo').on('click', function(e) {
		console.log('you updated destination city!');
		e.preventDefault();
		updateDestinationCity({
			user: user,
			destinationCity: $(e.currentTarget).find('.updateDestinationCity').val(),
			travelDate: $(e.currentTarget).find('.updateTravelDate').val(),
			busCompany: $(e.currentTarget).find('.updateBusCompany').val(),
			comments: $(e.currentTarget).find('.updateComments').val(),
		});
		$(".updateDestinationCitySection").hide();
		$("#addDestinationCitySection").hide();
		$("#tripPlanSection").show();
	});
}

function handleTravelDiaryUpdate() {
	$("#updateTravelDiary").on('click', function(e) {
		alert('Updated travel diary');
		e.preventDefault();
		updateTravelDiary({
			user: user,
			content: $(e.currentTarget).find('.updateTravelDiary').val(),
			datePublished: date.toDateString()
		});
		$("updateTravelDiary").hide();
		$("addDiarySection").hide();
		$("travelDiarySection").show();
	})
}

function handleCityDelete() {
	$('.destinationCitySection').on('click', '.deleteCity', function(e) {
		e.preventDefault();
		deleteCity(
			$(e.currentTarget).closest('.destinationCity').attr('data-id'));
	});
}

function handleTravelDiaryDelete() {
	$(".travelDiarySection").on('click', '.deleteTravelDiary', function(e) {
		e.preventDefault();
		deleteDiaryEntry(
			$(e.currentTarget).closest('.diaryItem').attr('data-id'));
	})
}

$(document).ready(function() {

	$("#login-page").hide();
	$("#register-page").hide();
	$(".login-section").show();
	$(".detail-section").show();

	$("#login-button").click(function() {
		$("#register-page").hide();
		$(".login-section").hide();
		$(".detail-section").hide();
		$("#login-page").show();
	})

	$("#register-link").click(function() {
		$("#login-page").hide();
		$(".login-section").hide();
		$(".detail-section").hide();
		$("#register-page").show();
	}) 

	$("#register-button").click(function() {
		$("#login-page").hide();
		$(".login-section").hide();
		$(".detail-section").hide();
		$("#register-page").show();
	})

	$("#loginForm").submit(function(e) {
		e.preventDefault();
		let username = $("#GET-username").val();
		let password = $("#GET-password").val();
		let userInfo = {username, password};
		let settings = {
			url:"/auth/login",
			type: 'POST',
			contentType: 'application/json',
			data: JSON.stringify(userInfo),
			success: function(data) {
				console.log('successfully logged in');
				localStorage.setItem("authToken", data.authToken);
				localStorage.setItem("currentUser", username);
				user = username;
				$("#login-page").hide();
				$("#register-page").hide();
				$(".login-section").hide();
				$(".detail-section").hide();
				$(".home").show();
				$(".logout").show();
				$(".tripDetails").show();
				console.log(data);
				getTrip(data);
				getTravelDiary(data);
			},
			error: function(err) {
				console.log(err);
			}
		};
		$.ajax(settings);
	})

	$("#registerForm").submit(function(e) {
		e.preventDefault();
		let username = $("#POST-username").val();
		console.log('client-side username is:', username);
		let password = $("#POST-password").val();
		let retypePass = $("#retype-password").val();
		let user = {username, password};
		let settings = {
			url:"/users/",
			type: 'POST',
			contentType: 'application/json',
			data: JSON.stringify(user),
			success: function(data) {
				console.log('successfully registered');
				$("#registerForm input[type='text']").val('');
				$("#register-page").hide();
				$(".login-section").hide();
				$(".detail-section").hide();
				$("#login-page").show();
			},
			error: function(err) {
				console.log(err);
				if (password.length < 10) {
					$("#errorTenChar").html("Password must be at least 10 characters")
				}
				if (password.length !== retypePass.length) {
					$("#errorMatchPass").html("Passwords must match")
				}
				if (password !== retypePass) {
					$("#errorMatchPass").html("Passwords must match")
				}
			}
		};
		$.ajax(settings);
	})

	$(".updateDestinationCitySection").hide();
	$("#addDestinationCitySection").hide();
	$(".destinationCitySection").show();

	$("body").on("click", ".destinationCity", function() {
		console.log("you clicked the destination");
		event.preventDefault();
		$(this).parent().find(".cityInfo").slideToggle(300);
	});

	$("body").on("click", ".travelDiaryDateAndTime", function() {
		console.log("you clicked the date and time");
		event.preventDefault();
		$(this).parent().find(".travelDiaryInfo").slideToggle(300);
	})

	$("body").on("click", ".updateDestinationCity", function() {
		console.log('you clicked update');
		let city = $(this).parent().parent();
		let id = $(this).parent().parent().attr("data-id");
		console.log(id);
		updateDestinationCity(id, city);
	})

	$("body").on("click", ".updateTravelDiary", function() {
		console.log('you clicked update')
		let diaryEntry = $(this).parent().parent();
		console.log(diaryEntry);
		let id = $(this).parent().parent().attr("data-id");
		console.log(id);
		updateTravelDiary(id, travelDiary);
	})

	$("body").on("submit", ".updateDestinationCity", function(e) {
		e.preventDefault();
		let id = $(this).attr("data-id")
		console.log(`you submitted updateDestinationCity for ${id}`);
		let updatedPlant = {
			id: id,
			destinationCity: $('.updateDestinationCity').val(),
			travelDate: $('.updateTravelDate').val(),
			busCompany: $('.updateBusCompany').val(),
			comments: $('.updateComments').val(),
		}
		updateDestinationCity(id, updateDestinationCity);
		console.log("city updated")
	})

	$("body").on("submit", ".updateTravelDiarySection", function(e) {
		e.preventDefault();
		let id = $(this).attr("data-id")
		console.log(`you submitted updateTravelDiarySection for ${id}`);
		let updateDiary = {
			id: id,
			content: $('.updateTravelDiary').val(),
			datePublished: date.toDateString()
		}
		updateTravelDiary(id, updateDiary);
		console.log("travel diary updated")
	})

	$("#cancel-add-city").click(function() {
		$("#addDestinationCitySection input[type='text']").val('');
		$("#addDestinationCitySection").hide();
		$("#cancel-add-city").hide();
	})

	$("#add-city").click(function() {
		$(".updateDestinationCitySection").hide();
		$("#cancel-add-city").show();
		$("#destinationCitySection").show();
		$("#addDestinationCity").show();
	})

	$("#cancel-diary-entry").click(function() {
		$("#addTravelDiarySection input[type='text']").val('');
		$("#addTravelDiarySection").hide();
		$("#cancel-diary-entry").hide();
	})

	$("#add-diary-entry").click(function() {
		$("#cancel-diary-entry").show();
		$("#addTravelDiarySection").show();
	})

	$(".logout").click(function() {
		console.log('you clicked logout');
		localStorage.clear();
		user = null;
		window.location.reload(true);
	});

	$(function() {
		handleAddDestinationCity();
		handleAddTravelDiary();
		handleCityUpdate();
		handleTravelDiaryDelete();
		handleCityDelete();
		handleTravelDiaryDelete();
	});
})
