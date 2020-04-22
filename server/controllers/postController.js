var Post = require('../models/Post');
var Member = require('../models/Member');
var Genre = require('../models/Genre');
// var util = require("util")
var async = require('async')
// var await = require('asyncawait/await');

// Display list of all Authors.
exports.post_list = async function (req, res) {
	console.log("[route] GET /post");
	try {
		const posts = await Post.find({Date: { $gte: "20200419" }})
			.sort([['Date','ascending']]);

    	if (posts === undefined || posts.length == 0) throw Error('No posts is found');
		if(!posts) throw Error('No posts is found');
		console.log(posts);
		res.status(200).json(posts);
    		
	} catch (e) {
		res.status(404).send(e.message);
	}
}

exports.post_create = async function (req, res) {
	console.log("[route] POST /post/create");
	try{
		console.log(req.body);
		//For debug
		const input_title = "Let's do 3100 Proj";
		const input_category = "Study";
		const input_quota = 5;
		const input_startTime = "1030";
		const input_endTime = "1130";
		const input_date = "20200422";
		const input_venue = "My Home";
		const input_content = "Optional";
		//LineID get by search the current user in DB using token
		//number of parti default to be 0 upon created

		if(!input_title) throw Error('Post Create Failed. [No Title is inputted]');
		if(!input_category) throw Error('Post Create Failed. [No Category is inputted');
		if(!input_quota) throw Error('Post Create Failed. [No Quota is inputted');
		if(!input_startTime) throw Error('Post Create Failed. [No Start Time is inputted');
		if(!input_endTime) throw Error('Post Create Failed. [No End Time is inputted');
		if(!input_date) throw Error('Post Create Failed. [No Date is inputted');
		if(!input_venue) throw Error('Post Create Failed. [No Venue is inputted');

		//For debug
		const currentUser = await Member.findOne({_id: "5e9f2158ab37a91a3d2e9698"})

		//get current user by decoding the token (token should be decoded into req.user)
		// const currentUser = await Member.findOne({_id: req.user.id});
		if(!currentUser) throw Error('Post Create Failed. [Error occurred when converting token]');
		const input_lineID = currentUser.LineID;


		//Normal post create session: Create new post
		const newPost = new Post({
			Title: input_title,
			Category: input_category,
			Quota: input_quota,
			Content: input_content,
			StartTime: input_startTime,
			EndTime: input_endTime,
			Date: input_date,
			Venue: input_venue,
			NumberOfParticipants: 0,
			LineID: input_lineID
		});
		const result = await newPost.save();
		if(!result) throw Error('Post cannot be created');
		//Update currentUser database
		currentUser.CreatedPost = newPost._id;
		const memberResult = await currentUser.save();
		if(!memberResult) throw Error('Unexpected Error when updating current member info');
		//Update Category database
		const newGenre = new Genre({
			Genre: newPost.Category,
			PostID: newPost._id
		})
		const genreResult = await newGenre.save();
		if(!newGenre || !genreResult) throw Error('Unexpected Error when updating genre database');

		res.status(200).json(newPost);
		console.log(newPost);
	} catch (e){
		res.status(404).send(e.message);
	}
}