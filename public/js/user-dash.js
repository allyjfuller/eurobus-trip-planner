let TRIP_URL = 'trips';
let TRAVEL_DIARY_URL = 'travel-diary';
let user = localStorage.getItem('currentUser');
let date = new Date();

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