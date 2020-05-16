/****************************************************************
 * Purpose  Schema for marking members joining which post(event)
 *	    For easier to show participants of each post(event)
 * Author   LAW Hei Yiu, LEUNG Pok Ho
 * Date     2020-05-16
 ***************************************************************/
const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const model = mongoose.model;

const JoinedSchema = new Schema({
	MemberID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'members' },
	PostID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'posts' }
});

/****************************************************************
 * Export model
 ***************************************************************/
module.exports = model('joined', JoinedSchema);
