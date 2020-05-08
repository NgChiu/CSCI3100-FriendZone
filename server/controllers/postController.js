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
		const posts = await Post.find({Date: { $gte: "20200424" }})
			.sort([['Date','ascending']]);

		//If there is no posts
    		if (posts === undefined || posts.length == 0) throw Error('No posts is found');
		if(!posts) throw Error('No posts is found');

		//Get Host Info to get ready for return
		let HostIDList = [];
		let HostMarkList = [];
		for(let tempPost of posts){
			const tempMember = await Member.findOne({CreatedPost: tempPost._id});
			if(!tempMember) throw Error('Could not find host data');
			HostIDList = await [HostIDList, tempMember.UserID];
			HostMarkList = await [HostMarkList, tempMember.RPmark];
		}

		//Get Participants Info to get ready for return
		let PartiIDList = [];
		let PartiMarkList = [];
		let PartiNoList = [];
		for(let tempPost of posts){
			const currentJoined = await Joined.find({PostID: tempPost._id});
			if(!currentJoined) throw Error('Could not find post data in joined database');
			for(let tempJoined of currentJoined){
				const tempMember = await Member.findOne({_id: tempJoined.MemberID});
				if(!tempMember) throw Error('Could not find participant(s) data');
				PartiIDList = await [PartiIDList, tempMember.UserID];
				PartiMarkList = await [PartiMarkList, tempMember.RPmark];
			}
			PartiNoList = await [PartiNoList, tempPost.NumberOfParticipants];
		}
		console.log(posts);
		console.log(HostIDList);
		console.log(HostMarkList);
		console.log(PartiIDList);
		console.log(PartiMarkList);
		console.log(PartiNoList);
		res.status(200).json(posts);
    		
	} catch (e) {
		res.status(404).send(e.message);
		console.log(e.message);
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
		// console.log(req.body);
		// console.log(req.user.id);

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

		if(input_date < "20200424") throw Error('Wrong Date!');
		if(input_endTime < input_startTime) throw Error('End time cannot be earilier than start time');

		//For debug
		// const currentUser = await Member.findOne({_id: "5ea00efd05dba00f9a232517"})

		//get current user by decoding the token (token should be decoded into req.user)
		const currentUser = await Member.findOne({_id: req.user.id});
		if(!currentUser) throw Error('Post Create Failed. [Error occurred when converting token]');
		// console.log(currentUser);
		//If user already created post
		// console.log(currentUser.CreatedPost);
		if(currentUser.CreatedPost) throw Error('Exceed created limit');
		const input_lineID = currentUser.LineID;


		//Normal post create session: Create new post
		const newPost = await new Post({
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
		currentUser.CreatedPost = result._id;
		const memberResult = await currentUser.save();
		if(!memberResult) throw Error('Unexpected Error when updating current member info');
		//Update Category database
		const newGenre = await new Genre({
			Genre: result.Category,
			PostID: result._id
		})
		const genreResult = await newGenre.save();
		if(!newGenre || !genreResult) throw Error('Unexpected Error when updating genre database');

		console.log(result);
		res.status(200).json(result);
	} catch (e){
		res.status(404).send(e.message);
		console.log(e.message);
	}
}

exports.post_join = async function (req, res){
	console.log("[route] GET /post/join/:postID");
	try{
		//For debug
		// const postID = "5ea122e9972f520e9f840a02";
		const postID = req.body.postID;
		const currentPost = await Post.findOne({_id: postID});
		if(!currentPost) throw Error('Could not find post');
		// console.log(currentPost);
		//For debug
		// const currentUser = await Member.findOne({_id: "5ea00efd05dba00f9a232517"});
		const currentUser = await Member.findOne({_id: req.user.id});
		if(!currentUser) throw Error('Could not find current user data');
		// console.log(currentUser);

		//If post full
		// console.log(currentPost.Quota);
		// console.log(currentPost.NumberOfParticipants);
		if(currentPost.Quota - currentPost.NumberOfParticipants === 0) throw Error('Post Fulled');
		//If user already created that post
		if(currentUser.CreatedPost) {
			if(currentUser.CreatedPost.toString() === currentPost._id.toString()) throw Error('Already created post');
		}
		//If user already joined that post
		// if(currentUser.JoinedPost.toString() === currentPost._id.toString()) throw Error('Already joined post');
		//If user already joined post
		if(currentUser.JoinedPost) throw Error('Exceed Join Limit');

		currentPost.NumberOfParticipants = currentPost.NumberOfParticipants + 1;
		const postResult = await currentPost.save();
		if(!postResult) throw Error('Could not save post data');

		//For debug
		currentUser.JoinedPost = currentPost._id;
		// console.log(currentUser.JoinedPost);
		const userResult = await currentUser.save();
		if(!userResult) throw Error('Could not save user data');

		const newJoined = new Joined({
			MemberID: currentUser._id,
			PostID: currentPost._id
		});
		const joinedResult = await newJoined.save();
		console.log(newJoined);
		if(!joinedResult) throw Error('Could not save joined data');

		res.status(200).send(currentPost);
	} catch (e){
		res.status(404).send(e.message);
		console.log(e.message);
	}
}

exports.post_delete = async function (req, res){
	console.log("[route] GET /post/delete/:postID");
	try{
		//For debug
		// const currentPost = await Post.findOne({_id: "5ea122e9972f520e9f840a02"});
		// const currentUser = await Member.findOne({_id: "5e9f2158ab37a91a3d2e9698"});
		// const currentPost = await Post.findOne({_id: req.body.postID});
		// if(!currentPost) throw Error('Could not find post data');
		const currentUser = await Member.findOne({_id: req.user.id});
		if(!currentUser) throw Error('Could not find user data');

		//If user have not create any post
		if(!currentUser.CreatedPost) throw Error('Have not created any post yet');
		//If user did not create that post
		// if(!(currentUser.CreatedPost.toString() === currentPost._id.toString())) throw Error('Not the creator of this post');
		const currentPostID = currentUser.CreatedPost;
		//Remove post from database
		const currentPost = await Post.findOne({_id: currentUser.CreatedPost});
		if (!currentPost) throw Error('Could not find post data');
		const postRemove = await currentPost.remove();
		if (!postRemove) throw Error('Could not remove post');
		//Remove createdpost from currentUser
		const userResult = await Member.updateOne( { _id: currentUser._id },{ $unset: {"CreatedPost": ""}});
		console.log(currentUser.CreatedPost);
		if(!userResult) throw Error('Could not update user data');
		//Remove all related post from Joined database and joined member database
		var currentJoined = await Joined.find({PostID: currentPostID});
		console.log(currentJoined);
		for(let tempJoined of currentJoined){
			const tempUser = await Member.findOne({_id: tempJoined.MemberID});
			console.log(tempUser);
			const userResult = await Member.updateOne( { _id: tempUser._id },{ $unset: {"JoinedPost": ""}});
			if(!tempUser || !userResult) throw Error('Could not delete joined member data');
			const joinedRemove = await tempJoined.remove();
			if (!joinedRemove) throw Error('Could not delete joined member data');
		};
		//Remove the post from genre database
		var currentGenre = await Genre.findOne({PostID: currentPostID});
		const genreRemoved = await currentGenre.remove();
		if (!currentGenre || !genreRemoved) throw Error('Could not remove genre data');

		console.log(currentUser);
		res.status(200).send(currentUser);
	} catch (e){
		console.log(e.message);
		res.status(404).send(e.message);
	}
}

exports.post_quit = async function (req, res){
	console.log("[route] GET /post/quit/:postID");
	try{
		// const currentPost = await Post.findOne({_id: req.body.postID});
		// if(!currentPost) throw Error('Could not find post data');
		const currentUser = await Member.findOne({_id: req.user.id});
		if(!currentUser) throw Error('Could not find member data');
		console.log(currentUser);

		//if user have not joined any post
		if(!currentUser.JoinedPost) throw Error('Have not joined any post yet');
		//If user have not joined that post
		// if(currentUser.JoinedPost.toString() !== currentPost._id.toString()) throw Error('Have not joined this post');

		//update number of parti in post
		const currentPost = await Post.findOne({_id: currentUser.JoinedPost});
		if(!currentPost) throw Error('Could not find post data');
		console.log(currentPost);
		currentPost.NumberOfParticipants = currentPost.NumberOfParticipants - 1;
		const postResult = await currentPost.save();
		if(!postResult) throw Error('Could not update post data');
		//remove currentuser.joinedpost
		const userResult = await Member.updateOne( { _id: currentUser._id },{ $unset: {"JoinedPost": ""}});
		console.log(currentUser.CreatedPost);
		if(!userResult) throw Error('Could not update user data');
		//Remove from Joined database
		const currentJoined = await Joined.findOne({PostID: currentPost._id, MemberID: currentUser._id});
		const joinedRemoved = await currentJoined.remove();
		if (!currentJoined||!joinedRemoved) throw Error('Could not update joined database');

	    console.log(currentUser);
	    res.status(200).send(currentUser);
	} catch (e){
		console.log(e.message);
		res.status(404).send(e.message);
	}
}

exports.show_category = async function (req, res){
	console.log("[route] GET /post/"+req.params.catID);
	try{
		// console.log(req.params.catID);
		if (req.params.catID !== "sports" && req.params.catID !== "meal" && req.params.catID !== "study" && req.params.catID !== "gaming" && req.params.catID !== "others")
			throw Error('Category not found');
		const showList = await Genre.find({Genre: req.params.catID});
		// res.writeHead(200, {'Content-Type': 'application/json'});
		// await showList.forEach(async function(tempGenre){
	 //    	// console.log(tempGenre);
	 //    	const tempPost = await Post.findOne({_id: tempGenre.PostID});
	 //    	if (!tempPost) throw Error('Could not find post in post database');
	 //    	console.log(tempPost);
	 //    	// res.write(JSON.stringify(tempPost));
	 //    });
	 	let postList = [];
		for(let tempGenre of showList){
			const tempPost = await Post.findOne({_id: tempGenre.PostID});
			if (!tempPost) throw Error('Could not find post in post database');
			console.log(tempPost);
			postList = await [postList,tempPost];
			// res.write(JSON.stringify(tempPost));
		}
		// if(!postList) throw Error('Could not find post in post database');
		// console.log(postList);
		// res.status(200).json(showList);
		// res.end();
		console.log(postList);
		res.status(200).json(postList);
	} catch (e){
		console.log(e.message);
		res.status(404).send(e.message);
	}
}
