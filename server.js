const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');

const {router: usersRouter} = require('./users');
const {router: authRouter, localStrategy, jwtStrategy} = require('./auth');
const {router: tripRouter} = require('./trips');
const {router: diaryRouter} = require('./travel-diary');

const {PORT, DATABASE_URL} = require('./config');

app.use(morgan('common'));

//CORS
app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
	res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
	if (req.method === 'OPTIONS') {
		return res.send(204);
	}
	next();
});

app.use(passport.initialize());
passport.use(localStrategy);
passport.use(jwtStrategy);

app.use('/users/', usersRouter);
app.use('/auth/', authRouter);
app.use('/trips/', tripRouter);
app.use('/travel-diary/', diaryRouter);

// tests

app.get( '/protected', passport.authenticate('jwt', {session: false}), (req, res) => {
		return res.json({
			data: ''
		})
})

app.use('*', (req, res) => {
	return res.status(404).json({message: 'Not Found'});
});

let server;

function runServer() {
	return new Promise((resolve, reject) => {
		mongoose.connect(DATABASE_URL, { useNewUrlParser: true }, err => {
			if (err) {
				return reject(err);
			}
			server = app.listen(PORT, () => {
				console.log(`Your app is listening on port ${PORT}`);
				resolve();
			})
			.on('error', err => {
				mongoose.disconnect();
				reject(err);
			});
		});
	});
}

function closeServer() {
	return mongoose.disconnect().then(() => {
		return new Promise((resolve, reject) => {
			console.log('Server Closing');
			server.close(err => {
				if (err) {
					return reject(err);
				}
				resolve();
			});
		});
	});
}

if (require.main === module) {
	runServer().catch(err => console.error(err));
}

module.exports = {app, runServer, closeServer};

//app.use(express.static('public'));
//app.listen(process.env.PORT || 8080);