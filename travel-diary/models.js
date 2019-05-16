const mongoose = require('mongoose');

const diarySchema = mongoose.Schema({
	user: {type: String, required: true},
	content: {type: String, required: true},
	datePublished: {type: String, required:true}
})

const travelDiary = mongoose.model('travelDiary', diarySchema)

module.exports = {travelDiary};