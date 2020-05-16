/****************************************************************
 * Purpose  Schema for marking post(event) with their category
 *			For easier to display posts(events) by category
 * Author   LAW Hei Yiu, LEUNG Pok Ho
 * Date     2020-05-16
 ***************************************************************/
const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const model = mongoose.model;

const GenreSchema = new Schema({
	Genre: { type: String, required: true },
	PostID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'posts' }
});

/****************************************************************
 * Export model
 ***************************************************************/
module.exports = model('genre', GenreSchema);
