const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');

const {router: usersRouter} = require('./users');
const {router: authRouter, localStrategy, jwtStrategy} = require('./auth');
const {router: tripsRouter} = require('./trips');
const {router: diaryRouter} = require('./travel-diary');

//const {PORT, DATABASE_URL} = require('./config');

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
app.use('/trips/', tripsRouter);
app.use('/travel-diary/', diaryRouter);

// test route

/* 
app.get( '/protected', passport.authenticate('jwt', {session: false}), (req, res) => {
		return res.json({
			data: ''
		})
})
*/

app.use('*', (req, res) => {
	return res.status(404).json({message: 'Not Found'});
});



app.use(express.static('public'));
app.listen(process.env.PORT || 8080);