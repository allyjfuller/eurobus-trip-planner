const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const {User} = require('./models');
const router = express.Router();
const jsonParser = bodyParser.json();

router.post('/', jsonParser, (req, res) => {
	console.log('server-side username is: ', req.body.username);
	const requiredFields = ['username', 'password'];
	const missingField = requiredFields.find(field => !(field in req.body));
	if (missingField) {
		return res.status(422).json({
			code: 422,
			reason: 'ValidationError',
			message: 'Missing field',
			location: missingField
		});
	}

	const stringFields = ['firstName', 'lastName', 'username', 'password', 'confirmPass'];
	const nonStringField = stringFields.find(
		field => field in req.body && typeof req.body[field] !== 'string'
	);

	if (nonStringField) {
		return res.status(422).json({
			code: 422, 
			reason: 'ValidationError',
			message: 'Incorrect field type: expected string',
			location: nonStringField
		});
	}
	
	const explicitlyTrimmedFields = ['username', 'password'];
	const nonTrimmedField = explicitlyTrimmedFields.find(
		field => req.body[field].trim() !== req.body[field]
	);

	if (nonTrimmedField) {
		return res.status(422).json({
			code: 422,
			reason: 'ValidationError',
			message: 'Cannot start or end with space',
			location: nonTrimmedField
		});
	}

	const sizedFields = {
		username: {
			min: 1
		},
		password: {
			min: 10,
			max: 72
		}
	};
	const fieldTooSmall = Object.keys(sizedFields).find(
		field =>
			'min' in sizedFields[field] &&
			req.body[field].trim().length < sizedFields[field].min 
	);
	const fieldTooLarge = Object.keys(sizedFields).find(
		field =>
			'max' in sizedFields[field] &&
			req.body[field].trim().length > sizedFields[field].max
	);

	if (fieldTooSmall || fieldTooLarge) {
		return res.status(422).json({
			code: 422,
			reason: 'ValidationError',
			message: fieldTooSmall
				? `Must be at least ${sizedFields[fieldTooSmall].min} characters long`
				: `Must be at most ${sizedFields[fieldTooLarge].max} characters long`,
			location: fieldTooSmall || fieldTooLarge
		});
	}

	let username = req.body.username;
	let password = req.body.password;
	let confirmPass = req.body.confirmPass;
	let firstName = '';
	let lastName = '';

	firstName = firstName.trim();
	lastName = lastName.trim();

	return User.find({username})
		.count()
		.then(count => {
			if (count > 0) {
				return Promise.reject({
					code: 422,
					reason: 'ValidationError',
					message: 'Username is already taken',
					location: 'username'
				});
			}
			return User.hashPassword(password);
		})	

		.then(hash => {
			return User.create({
				username,
				password: hash,
				firstName,
				lastName
			});
		})
		.then(user => {
			return res.status(201).json(user.apiRepr());
		})
		.catch(err => {
			if (err.reason === 'ValidationError') {
				return res.status(err.code).json(err);
			}
			res.status(500).json({code: 500, messaage: 'Internal server error'});
		});
});

router.get('/', (req, res) => {
    return User.find()
        .then(users => res.json(users.map(user => user.apiRepr())))
        .catch(err => res.status(500).json({message: 'Internal server error'}));
});

module.exports = {router};