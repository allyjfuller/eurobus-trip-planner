let TRIP_URL = 'trips';
let TRAVEL_DIARY_URL = 'travel-diary';
let user = localStorage.getItem('currentUser');
let date = new Date();

function comingSoonAlert() {
	alert("This feature is coming soon!");
}

$(document).ready(function(){

	$("#login-page").hide();
	$("#register-page").hide();
	$(".login-section").show();
	$(".feature-section").show();
	$(".affiliate-section").show();

	// when logo is clicked:

	$("#logo-button").click(function() {
		$("#login-page").hide();
		$("#register-page").hide();
		$(".login-section").show();
		$(".feature-section").show();
		$(".affiliate-section").show();
	})

	// when login button is clicked:

	$("#login-button").click(function() {
		$("#register-page").hide();
		$(".login-section").hide();
		$(".feature-section").hide();
		$(".affiliate-section").hide();
		$("#login-page").show();
	})

	// when register link is clicked:

	$("#register-link").click(function() {
		$("#login-page").hide();
		$(".login-section").hide();
		$(".feature-section").hide();
		$(".affiliate-section").hide();
		$("#register-page").show();
	})

	// when register button is clicked:

	$("#register-button").click(function() {
		$("#login-page").hide();
		$(".login-section").hide();
		$(".feature-section").hide();
		$(".affiliate-section").hide();
		$("#register-page").show();
	})

	// when the register from is submitted:

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
				$(".feature-section").hide();
				$(".affiliate-section").hide();
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

	// when the login from is submitted:

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
				console.log(data);
				window.location.href = "/user-dash.html";
				},
			error: function(err) {
				console.log(err);
			}
		};
		$.ajax(settings);
	})

})
