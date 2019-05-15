
const express = require('express');

const config = require('../config');

const router = express.Router();
const passport = require('passport');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const {Trip} = require('./models');

router.get('/', passport.authenticate('jwt', {session: false}), (req, res) => {
	Trip
	.find()
	.exec()
	.then(cities => {
		res.status(200).json(cities)
	})
	.catch(err => {res.status(500).json({message: 'Server Error'});
	})
});

router.get('/user/:user', passport.authenticate('jwt', {session: false}), (req, res) => {
	Trip
	.find()
	.exec()
	.then(cities => {
		res.status(200).json(cities)
	})
	.catch(err => {res.status(500).json({message: 'Server Error'});
	})
});

router.get('/:id', (req, res) => {
	Trip
	.findById(req.params.id)
	.exec()
	.then(city => res.status(200).json(city))
	.catch(err => {
		console.error(err);
		res.status(500).json({message: 'Server Error'})
	})
});

router.post('/', jsonParser, (req, res) => {
	const requiredFields = ['user', 'destinationCity', 'travelDate', 'busCompany'];
	for (let i=0; i<requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = `Missing ${field} in request body`
			console.error(message);
			return res.status(400).send(message);
		}
	}
	const item = Trip.create({
		user: req.body.user,
		destinationCity: req.body.destinationCity, 
		travelDate: req.body.travelDate,
		busCompany: req.body.busCompany,
		comments: req.body.comments
	});
	res.status(201).json(item);
});
