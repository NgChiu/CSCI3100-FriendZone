/****************************************************************
 * Purpose  Backend function related to events
 * Author   LAW Hei Yiu, LEUNG Pok Ho
 * Date     2020-05-16
 ***************************************************************/
var Post = require('../models/Post');
var Member = require('../models/Member');
var Genre = require('../models/Genre');
var Joined = require('../models/Joined');
var async = require('async')

/****************************************************************
 * Route    GET /post
 * Purpose  Return all events from post database that is not expired
 ***************************************************************/
exports.post_list = async function (req, res) {
	console.log("[route] GET /post");
	try {
		//Get today's date and find post gte to today
		let day = new Date();
		let Y = day.getFullYear();
		let M = day.getMonth() + 1;
		let D = day.getDate();
		let today = Y * 10000 + M * 100 + D;
		const posts = await Post.find({Date: { $gte: today.toString() }})
			.sort([['Date','ascending']]);

		//Get Host & Parti Info to get ready for return
		let HostIDList = [];
		let HostMarkList = [];
		let PartiIDList = [];
		let PartiMarkList = [];
		for(let tempPost of posts){
			//Get Host Info to get ready for return
			const tempHost = await Member.findOne({CreatedPost: tempPost._id});
			if(!tempHost) throw Error('Could not find host data');
			HostIDList = await HostIDList.concat(tempHost.UserID);
			HostMarkList = await HostMarkList.concat(tempHost.RPmark);

			//Get Participants Info to get ready for return
			const currentJoined = await Joined.find({PostID: tempPost._id});
	    		if(!currentJoined) throw Error('Could not find post data in joined database');
			for(let tempJoined of currentJoined){
				const tempParti = await Member.findOne({_id: tempJoined.MemberID});
				if(!tempParti) throw Error('Could not find participant(s) data');
				PartiIDList = await PartiIDList.concat(tempParti.UserID);
				PartiMarkList = await PartiMarkList.concat(tempParti.RPmark);
			}
		}
		console.log(posts);
		console.log(HostIDList);
		console.log(HostMarkList);
		console.log(PartiIDList);
		console.log(PartiMarkList);
		res.status(200).json({posts, HostIDList, HostMarkList, PartiIDList, PartiMarkList});
    		
	} catch (e) {
		console.log(e.message);
		res.status(404).send(e.message);
	}
}

/****************************************************************
 * Route    POST /post/create
 * Purpose  Create new event in post database according to user input
 ***************************************************************/
exports.post_create = async function (req, res) {
	console.log("[route] POST /post/create");
	try{
		//Getting inputs from req.body
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

		//Exception cases to be handled
		if(!input_title) throw Error('Post Create Failed. [No Title is inputted]');
		if(!input_category) throw Error('Post Create Failed. [No Category is inputted');
		if(!input_quota) throw Error('Post Create Failed. [No Quota is inputted');
		if(!input_startTime) throw Error('Post Create Failed. [No Start Time is inputted');
		if(!input_endTime) throw Error('Post Create Failed. [No End Time is inputted');
		if(!input_date) throw Error('Post Create Failed. [No Date is inputted');
		if(!input_venue) throw Error('Post Create Failed. [No Venue is inputted');

		//To get today's date and handle exceptional cases related to time & date
		let day = new Date();
		let Y = day.getFullYear();
		let M = day.getMonth() + 1;
		let D = day.getDate();
		let today = Y * 10000 + M * 100 + D;
		if(input_date < today.toString()) throw Error('Wrong Date!');
		if(input_endTime < input_startTime) throw Error('End time cannot be earilier than start time');

		//get current user by decoding the token (token should be decoded into req.user)
		//Check whether user exceeds the event creating limit
		const currentUser = await Member.findOne({_id: req.user.id});
		if(!currentUser) throw Error('Post Create Failed. [Error occurred when converting token]');
		if(currentUser.CreatedPost) throw Error('Exceed event creating limit');
		//get current user's LineID to create event
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
		console.log(e.message);
		res.status(404).send(e.message);
	}
}

/****************************************************************
 * Route    POST /post/join
 * Purpose  Update databases when the user joins an event
 ***************************************************************/
exports.post_join = async function (req, res){
	console.log("[route] POST /post/join");
	try{
		//Find post by the postID returned from frontend
		const postID = req.body.postID;
		const currentPost = await Post.findOne({_id: postID});
		if(!currentPost) throw Error('Could not find post');
		//Find current user by token
		const currentUser = await Member.findOne({_id: req.user.id});
		if(!currentUser) throw Error('Could not find current user data');

		//Handle exceptional cases
		//If post full
		if(currentPost.Quota - currentPost.NumberOfParticipants === 0) throw Error('Post Fulled');
		//If user is the host of that post
		if(currentUser.CreatedPost) {
			if(currentUser.CreatedPost.toString() === currentPost._id.toString()) throw Error('You are the host of this event');
		}
		//If user exceeds event joining limit
		if(currentUser.JoinedPost) throw Error('Exceed Join Limit');

		//Edit post database
		currentPost.NumberOfParticipants = currentPost.NumberOfParticipants + 1;
		const postResult = await currentPost.save();
		if(!postResult) throw Error('Could not save post data');

		//Edit member database
		currentUser.JoinedPost = currentPost._id;
		const userResult = await currentUser.save();
		if(!userResult) throw Error('Could not save user data');

		//Add to Joined database
		const newJoined = new Joined({
			MemberID: currentUser._id,
			PostID: currentPost._id
		});
		const joinedResult = await newJoined.save();
		if(!joinedResult) throw Error('Could not save joined data');

		console.log(currentPost);
		res.status(200).send(currentPost);
	} catch (e){
		console.log(e.message);
		res.status(404).send(e.message);
	}
}

/****************************************************************
 * Route    POST /post/delete
 * Purpose  Remove data from databases when the user deletes an event
 ***************************************************************/
exports.post_delete = async function (req, res){
	console.log("[route] POST /post/delete");
	try{
		//Get current user from token
		const currentUser = await Member.findOne({_id: req.user.id});
		if(!currentUser) throw Error('Could not find user data');

		//Handle exceptional cases
		//If user have not create any post
		if(!currentUser.CreatedPost) throw Error('Have not created any post yet');

		//Set currentPostID
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

		//Remove data for all participants of that event
		//Remove all related post from Joined database and Member database
		var currentJoined = await Joined.find({PostID: currentPostID});
		for(let tempJoined of currentJoined){
			const tempUser = await Member.findOne({_id: tempJoined.MemberID});
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

/****************************************************************
 * Route    POST /post/quit
 * Purpose  Remove data from databases when the user quits an event
 ***************************************************************/
exports.post_quit = async function (req, res){
	console.log("[route] POST /post/quit");
	try{
		//Get current user from token
		const currentUser = await Member.findOne({_id: req.user.id});
		if(!currentUser) throw Error('Could not find member data');
		console.log(currentUser);

		//Handle exceptional cases
		//if user have not joined any post
		if(!currentUser.JoinedPost) throw Error('Have not joined any post yet');

		//update number of parti of that post in post database
		const currentPost = await Post.findOne({_id: currentUser.JoinedPost});
		if(!currentPost) throw Error('Could not find post data');
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

/****************************************************************
 * Route    GET /post/:catID
 * Purpose  Return all events from post database that is not expired and is from the target category
 ***************************************************************/
exports.show_category = async function (req, res){
	console.log("[route] GET /post/"+req.params.catID);
	try{
		//Handle cases where category is illegal
		if (req.params.catID !== "sports" && req.params.catID !== "meal" && req.params.catID !== "study" && req.params.catID !== "gaming" && req.params.catID !== "others")
			throw Error('Category not found');

		//Find the all the postID with that genre
		const showList = await Genre.find({Genre: req.params.catID});
		
		//Find all the post in that genre by PostID and date > today
		let day = new Date();
		let Y = day.getFullYear();
		let M = day.getMonth() + 1;
		let D = day.getDate();
		let today = Y * 10000 + M * 100 + D;
	 	let postList = [];
		for(let tempGenre of showList){
			const tempPost = await Post.findOne({_id: tempGenre.PostID, Date: { $gte: today.toString() }});
			if(tempPost) postList = await postList.concat(tempPost);
		}

		//Get Host & Parti Info to get ready for return
		let HostIDList = [];
		let HostMarkList = [];
		let PartiIDList = [];
		let PartiMarkList = [];
		var i = 0;
		for (let tempPost of postList){
			//To get host data ready
			const tempHost = await Member.findOne({CreatedPost: tempPost._id});
			if(!tempHost) throw Error('Could not find host data');
			HostIDList = await HostIDList.concat(tempHost.UserID);
			HostMarkList = await HostMarkList.concat(tempHost.RPmark);

			//To get participants data ready
			const currentJoined = await Joined.find({PostID: tempPost._id});
			if(!currentJoined) throw Error('Could not find post data in joined database');
			for(let tempJoined of currentJoined){
				const tempParti = await Member.findOne({_id: tempJoined.MemberID});
				if(!tempParti) throw Error('Could not find participant(s) data');
				PartiIDList = await PartiIDList.concat(tempParti.UserID);
				PartiMarkList = await PartiMarkList.concat(tempParti.RPmark);
			}
		}
		
		console.log(postList);
		console.log(HostIDList);
		console.log(HostMarkList);
		console.log(PartiIDList);
		console.log(PartiMarkList);
		res.status(200).json({postList, HostIDList, HostMarkList, PartiIDList, PartiMarkList});
	} catch (e){
		console.log(e.message);
		res.status(404).send(e.message);
	}
}
