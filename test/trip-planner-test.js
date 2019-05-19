const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const {Trip} = require('../trips/models');
const {tripDiary} = require('../travel-diary/models');
const {app, runServer, closeServer} = require('../server');
const {JWT_EXPIRY, JWT_SECRET, TEST_DATABASE_URL} = require('../config');

const should = chai.should();
const expect = chai.expect();

chai.use(chaiHttp);

let loginDetails = {
	'username': 'test',
	'password': 'test12345'
}

let testUsername = 'test';

let testPassword = 'test12345'

let authToken;

function seedTripData() {
	console.info('seeding trip data');
	const seedData = [];

	for (let i=1; i<10; i++) {
		seedData.push(generateTripData());
	}
	return Trip.insertMany(seedData);
}

// generate destination city for database
function generateCity() {
	const cities = [
	'London', 'Amsterdam', 'Berlin', 'Dublin', 'Paris'];
	return cities[Math.floor(Math.random() * cities.length)];
}

// generate travel date 
function generateTravelDate() {
	const travelDates = [
	'07/04/2019', '07/10/2019', '07/13/2019', '07/17/2019', '07/22/2019'];
	return travelDates[Math.floor(Math.random() * travelDates.length)];
}

// generate bus company
function generateBusCompany() {
	const busCompanies = [
	'OUIBUS', 'FlixBus', 'Eurolines', 'RegioJet', 'Starshipper'];
	return busCompanies[Math.floor(Math.random() * busCompanies.length)];
}

// generate comments
function generateComments() {
	const comments = [
	'Bus is located behind train station', 'Long trip, pack snacks!', 'Scenic route!', 'Makes only one bathroom stop', 'Print tickets beforehand!' ];
	return comments[Math.floor(Math.random() * comments.length)];
}

function generateTripData() {
	return {
		user: testUsername,
		destinationCity: generateCity(),
		travelDate: generateTravelDate(),
		busCompany: generateBusCompany(),
		comments: generateComments()
	}
}

// tear down database
function tearDownDb() {
	return new Promise((resolve, reject) => {
		console.warn("deleting test database");
		mongoose.connection
			.dropDatabase()
			.then(result => resolve(result))
			.catch(err => reject(err));
	});
}

// TESTS
describe('EuroBus Trip-planner API resourse', function() {

	before(function() {
		return runServer(TEST_DATABASE_URL);
	});
	
	after(function() {
		return closeServer();
	});

	describe('/POST Register', function() {
		it('should Register, and check token', function(done) {
			chai.request(app)
				.post('/users/')
				.send(loginDetails)
				.then(function(err, res) {
					res.should.have.status(201);
					chai.request(app)
				})
			done();
		})
	})

	describe('/POST Login', function() {
		it('should Login, and check token', function(done) {
			chai.request(app)
				.post('/auth/login')
				.send(loginDetails)
				.then(function(err, res) {
					res.should.have.status(200);
					authToken = res.body.authToken;
					console.log("authToken at login =" + authToken);
					// login
					chai.request(app)
				})
			done();
		})
	})

	describe('Test all endpoints', function() {
		beforeEach(function() {
			return seedTripData();
		});
		afterEach(function() {
			return tearDownDb();
		});

		it('GET/trip should return all existing destination cities', function(done) {
			let res;
			console.log("authToken=" + authToken);
			chai.request(app)
				.get('/trip')
				.set('Authorization', `Bearer ${authToken}`)
				.then(function(_res) {
					res = _res;
					res.should.have.status(200);
					res.body.should.have.length.of.at.least(1);
					return Trip.count();
				})
				.then(function(count) {
					res.body.should.have.length.of(count);
				});
			done();
		});
	})
})