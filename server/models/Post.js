const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const model = mongoose.model;

//del jor warning and tags
//StartTime, EndTime in format HHMM, e.g. "2130", "2030"
//Date in format YYYYMMDD, e.g. "20200418"
const PostSchema = new Schema({
	Title: { type: String, required: true },
	Category: { type: String, required: true },
	Quota: { type: Number, required: true },
	Content: { type: String },
	StartTime: { type: String, required: true },
	EndTime: { type: String, required: true },
	Date: { type: String, required: true },
	Venue: { type: String, required: true },
	//JoinedUsername: { type: String },
	NumberOfParticipants: { type: Number, required: true },
	LineID: { type: String, required: true }
});

//Export model
module.exports = model('post', PostSchema);
