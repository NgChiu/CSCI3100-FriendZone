const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const model = mongoose.model;

const CategorySchema = new Schema({
	MemberID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'members' },
	PostID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'posts' }
});

//Export model
module.exports = model('category', CategorySchema);