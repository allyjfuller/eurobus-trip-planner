const express = require('express');
const config = require('../config');
const router = express.Router();
const passport = require('passport');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const {travelDiary} = require('./models');

router.get('/', passport.authenticate('jwt', {session: false}), (req, res) => {
	travelDiary
	.find()
	.then(diaryPosts => {res.status(200).json(diaryPosts)})
	.catch(err => {res.status(500).json({message: 'Server Error'});
	})
});

router.get('/user/:user', passport.authenticate('jwt', {session: false}), (req, res) => {
	travelDiary
	.find({user: `${req.params.user}`})
	.then(diaryPosts => {res.status(200).json(diaryPosts)})
	.catch(err => {res.status(500).json({message: 'Server Error'});
	})
});

router.get('/:id', (req, res) => {
	travelDiary
	.findById(req.params.id)
	.then(diaryPosts => {res.status(200).json(diaryPosts)})
	.catch(err => {res.status(500).json({message: 'Server Error'});
	})
});

router.post('/', jsonParser, (req, res) => {
	const requiredFields = ['content'];
	for (let i=0; i<requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = `Missing ${field} in request body`
			console.error(message);
			return res.status(400).send(message);
		}
	}
	const item = travelDiary.create({
		user: req.body.user,
		content: req.body.content,
		datePublished: req.body.datePublished
	});
	res.status(201).json(item);
});

router.put('/:id', jsonParser, (req, res) => {
	const requiredFields = ['content'];
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
	console.log(`Updating travel diary ${req.params.id}`);
	travelDiary
	.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true})
	.then(diaryPosts => res.status(200).json(diaryPosts))
	.catch(err => {res.status(500).json({message: 'Server Error'});
	})
});

router.delete('/:id', (req, res) => {
	travelDiary
		.findByIdAndRemove(req.params.id)
		.then(() => res.status(204).end())
		.catch(err => {res.status(500).json({message: 'Server Error'});
	})
});

router.use('*', (req, res) => {
	res.status(404).send('URL Not Found');
});

module.exports = {router};

