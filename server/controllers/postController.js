var Post = require('../models/Post');
var Member = require('../models/Member');
var Genre = require('../models/Genre');
var Joined = require('../models/Joined');
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
		//For debug
		// const input_title = "Let's do 3100 Proj";
		// const input_category = "Study";
		// const input_quota = 5;
		// const input_startTime = "1030";
		// const input_endTime = "1130";
		// const input_date = "20200422";
		// const input_venue = "My Home";
		// const input_content = "Optional";
		console.log(req.body);
		console.log(req.user.id);

		const input_title = req.body.Title;
		const input_category = req.body.Category;
		const input_quota = req.body.Quota;
		const input_startTime = req.body.StartTime;
		const input_endTime = req.body.EndTime;
		const input_date = req.body.Date;
		const input_venue = req.body.Venue;
		const input_content = req.body.Content;
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
		// const currentUser = await Member.findOne({_id: "5ea00efd05dba00f9a232517"})

		//get current user by decoding the token (token should be decoded into req.user)
		const currentUser = await Member.findOne({_id: req.user.id});
		if(!currentUser) throw Error('Post Create Failed. [Error occurred when converting token]');
		console.log(currentUser);
		//If user already created post
		console.log(currentUser.CreatedPost);
		if(currentUser.CreatedPost) throw Error('Exceed created limit');
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
		console.log(e.message);
	}
}

exports.post_join = async function (req, res){
	console.log("[route] GET /post/join/:postID");
	try{
		//For debug
		const postID = "5ea122e9972f520e9f840a02";
		// const postID = req.param.postID;
		const currentPost = await Post.findOne({_id: postID});
		if(!currentPost) throw Error('Could not find post');
		//For debug
		const currentUser = await Member.findOne({_id: "5ea00efd05dba00f9a232517"});
		// const currentUser = await User.findOne({_id: req.user.id});
		if(!currentUser) throw Error('Could not find current user data');

		//If post full
		if(currentPost.Quota - currentPost.NumberOfParticipants == 0) throw Error('Post Fulled');
		//If user already created that post
		if(currentUser.CreatedPost.toString() === currentPost._id.toString()) throw Error('Already created post');
		//If user already joined that post
		// if(currentUser.JoinedPost.toString() === currentPost._id.toString()) throw Error('Already joined post');
		//If user already joined post
		if(currentUser.JoinedPost) throw Error('Exceed Join Limit');

		currentPost.NumberOfParticipants = currentPost.NumberOfParticipants + 1;
		const postResult = await currentPost.save();
		if(!postResult) throw Error('Could not save post data');

		//For debug
		currentUser.JoinedPost = currentPost._id;
		const userResult = await currentUser.save();
		if(!userResult) throw Error('Could not save user data');

		const newJoined = new Joined({
			MemberID: currentPost._id,
			PostID: currentUser._id
		});
		const joinedResult = await newJoined.save();
		console.log(newJoined);
		if(!joinedResult) throw Error('Could not save joined data');

		res.status(200).send(currentPost);
	} catch (e){
		res.status(404).send(e.message);
	}
}

exports.post_delete = async function (req, res){
	console.log("[route] GET /post/delete/:postID");
	try{
		//For debug
		const currentPost = await Post.findOne({_id: "5ea122e9972f520e9f840a02"});
		const currentUser = await Member.findOne({_id: "5e9f2158ab37a91a3d2e9698"});
		// const currentPost = await Post.findOne({_id: req.body.postID});
		if(!currentPost) throw Error('Could not find post data');
		// const currentUser = await Member.findOne({_id: req.user.id});
		if(!currentUser) throw Error('Could not find user data');

		//If user have not create any post
		if(!currentUser.CreatedPost) throw Error('Have not created any post yet');
		//If user did not create that post
		if(!(currentUser.CreatedPost.toString() === currentPost._id.toString())) throw Error('Not the creator of this post');

		//Remove post from database
	    const postRemove = await currentPost.remove();
	    if (!postRemove) throw Error('Could not remove post');
	    //Remove createdpost from currentUser
	    const userResult = await Member.update( { _id: currentUser._id },{ $unset: {"CreatedPost": ""}});
	    console.log(currentUser.CreatedPost);
	    if(!userResult) throw Error('Could not update user data');

	    console.log(currentUser);
	    res.status(200).send(currentUser);
	} catch (e){
		res.status(404).send(e.message);
	}
}

exports.post_quit = async function (req, res){
	console.log("[route] GET /post/quit/:postID");
	try{
		const currentPost = await Post.findOne({_id: req.body.postID});
		if(!currentPost) throw Error('Could not find post data');
		const currentUser = await Member.findOne({_id: req.user.id});
		if(!currentUser) throw Error('Could not find member data');

		//if user have not joined any post
		if(!currentUser.JoinedPost) throw Error('Have not joined any post yet');
		//If user have not joined that post
		if(currentUser.JoinedPost.toString() !== currentPost._id.toString()) throw Error('Have not joined this post');

		//update number of parti in post
		currentPost.NumberOfParticipants = currentPost.NumberOfParticipants - 1;
		const postResult = await currentPost.save();
		if(!postResult) throw Error('Could not update post data');
		//remove currentuser.joinedpost
	    const userResult = await Member.update( { _id: currentUser._id },{ $unset: {"JoinedPost": ""}});
	    console.log(currentUser.CreatedPost);
	    if(!userResult) throw Error('Could not update user data');

	    console.log(currentUser);
	    res.status(200).send(currentUser);
	} catch (e){
		res.status(404).send(e.message);
	}
}
