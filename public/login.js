let TRIP_URL = 'trips';
let TRAVEL_DIARY_URL = 'travel-diary';
let user = localStorage.getItem('currentUser');
let date = new Date();

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
				$(".affiliate-section").hide();
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