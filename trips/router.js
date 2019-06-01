
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
	.then(cities => {
		res.status(200).json(cities)
	})
	.catch(err => {res.status(500).json({message: 'Server Error'});
	})
});

router.get('/user/:user', passport.authenticate('jwt', {session: false}), (req, res) => {
	Trip
	.find()
	.then(cities => {
		res.status(200).json(cities)
	})
	.catch(err => {res.status(500).json({message: 'Server Error'});
	})
});

router.get('/:id', (req, res) => {
	Trip
	.findById(req.params.id)
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

router.put('/:id', jsonParser, (req, res) => {
	const requiredFields = ['destinationCity', 'travelDate', 'busCompany'];
	for (let i=0; i<requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = `Missing ${field} in request body`
			console.error(message);
			return res.status(400).send(message);
		}
	}
	if (req.params.id !== req.body.id) {
		const message = `Request path id ${req.params.id} and request body id ${req.body.id} must match`;
		console.error(message);
		return res.status(400).send(message);
	}
	console.log(`Updating trip ${req.params.id}`);
	Trip
	.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true})
	.then(city => res.status(200).json(city))
	.catch(err => {res.status(500).json({message: 'Server Error'});	
	});
});

router.delete(':/id', (req, res) => {
	Trip
	.findByIdAndRemove(req.params.id)
	.then(() => res.status(204).end())
	.catch(err => {res.status(500).json({message: 'Server Error'});
	});
});

router.use('*', (req, res) => {
	res.status(404).send('URL Not Found');
});


module.exports = {router};
