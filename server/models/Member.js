/****************************************************************
 * Purpose  Schema for members
 * Author   LAW Hei Yiu, LEUNG Pok Ho
 * Date     2020-05-16
 ***************************************************************/
const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const model = mongoose.model;

const MemberSchema = new Schema({
	Username: { type: String, required: true },
	UserID: { type: String, required: true },
	Password: { type: String, required: true },
	RPmark: { type: Number, required: true },
	LineID: { type: String,required: true },
	JoinedPost: { type: mongoose.Schema.Types.ObjectId, ref: 'posts' },
	CreatedPost: { type: mongoose.Schema.Types.ObjectId, ref: 'posts' }
});

/****************************************************************
 * Export model
 ***************************************************************/
module.exports = model('member', MemberSchema);
