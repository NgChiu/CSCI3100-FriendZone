const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const model = mongoose.model;

// const EventSchema = new Schema({
//   eventId: { type: Number, required: true, unique: true },
//   name: { type: String, required: true },
//   loc: { type: mongoose.Schema.Types.ObjectId, ref: 'locations' },
//   quota: { type: Number }
// });

const MemberSchema = new Schema({
	Username: { type: String, required: true },
	UserID: { type: String, required: true },
	Password: { type: String, required: true },
	RPmark: { type: Number, required: true },
	LineID: { type: String,required: true },
	JoinedPost: { type: mongoose.Schema.Types.ObjectId, ref: 'posts' },
	CreatedPost: { type: mongoose.Schema.Types.ObjectId, ref: 'posts' }
});

//const Event = model('event', EventSchema);

//Export model
module.exports = model('member', MemberSchema);