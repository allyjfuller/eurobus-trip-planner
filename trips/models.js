const mongoose = require('mongoose');

const tripSchema = mongoose.Schema({
	user: {type: String, required: true},
	destinationCity: {type: String, required: true},
	travelDate: {type: String, required: true},
	busCompany: {type: String, required: true},
	comments: {type: String, required: true}

})

const Trip = mongoose.model('Trip', tripSchema)

module.exports = {Trip};