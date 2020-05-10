var Member = require('../models/Member');
var Post = require('../models/Post');
var async = require('async');
var jwt  = require ('jsonwebtoken');
// var config = require ('../config');

const  JWT_SECRET  = {
  "mongoURI": "mongodb+srv://FriendZone:csci3100@cluster0-si1k7.mongodb.net/test",
  "jwtSecret": "SecretKey"
};

exports.member_login = async function (req, res) {
	console.log("[route] POST /member/login");
	const input_UserID = req.body.loginUserID;
	const input_Password = req.body.loginPassword;
	//For debug
	// const input_UserID = "abd123";
	// // const input_Password = "123456";
	// console.log(input_UserID);
	// console.log(input_Password);
	if(!input_UserID) return res.status(400).json("No UserID is inputted");
	if(!input_Password) return res.status(400).json("No Password is inputted");
	try{
		const currentUser = await Member.findOne({ UserID: input_UserID });
		if(!currentUser) throw Error('Invalid UserID');

		const Valid = (currentUser.Password === input_Password);
		if(!Valid) throw Error('Wrong Password');

		const Token = jwt.sign({ id: currentUser._id }, JWT_SECRET.jwtSecret, { expiresIn: 360000 });
		if(!Token) throw Error('No Valid Token is created');

		res.status(200).json({Token, currentUser});
		console.log({Token,currentUser});
	} catch (e) {
		res.status(404).send(e.message);
	}
}

exports.member_register = async function (req, res) {
	try{
		console.log("[route] POST /member/register");
		const input_Username = req.body.regUsername;
		const input_UserID = req.body.regUserID;
		const input_Password = req.body.regPassword;
		const input_LineID = req.body.regLineID;

		//For debug
		// const input_Username = "Chiu";
		// const input_UserID = "Chiugor1";
		// const input_Password = "456";
		// const input_LineID = "chiugorline";

		//Error Handling
		if(!input_Username) throw Error('Register Failed. [No Username is inputted]');
		if(!input_UserID) throw Error('Register Failed. [No UserID is inputted]');
		if(!input_Password) throw Error('Register Failed. [No Password is inputted]');
		if(!input_LineID) throw Error('Register Failed. [No LineID is inputted]');

		const UserID_conflict = await Member.findOne({ UserID: input_UserID });
		if(UserID_conflict) throw Error('Register Failed. [UserID is used]');

		//Normal Register session: Creating new user
		const newMember = new Member({
			Username: input_Username,
			UserID: input_UserID,
			Password: input_Password,
			RPmark: 100,
			LineID: input_LineID
		});
		const result = await newMember.save();
		if(!result) throw Error('Member cannot be created');

		const Token = jwt.sign({ id: newMember._id }, JWT_SECRET.jwtSecret, { expiresIn: 360000 });
		if(!Token) throw Error('No Valid Token is created');

		res.status(200).json({Token, newMember});
		console.log(newMember);
	} catch (e) {
		res.status(404).send(e.message);
	}
}

exports.myself = async function (req, res){
	console.log("[route] GET /member/myself");
	try{
		//For debug
		// const currentUser = await Member.findOne({_id: "5e9f2158ab37a91a3d2e9698"});
		// console.log("req.user");
		// console.log(req.user);
		const currentUser = await Member.findOne({_id: req.user.id});
		var joinedTitle;
		var createdTitle;
		var created;
		var joined;
		if(!currentUser) throw Error('Fail to find member in database');
		if (currentUser.CreatedPost){
			created = await Post.findOne({_id: currentUser.CreatedPost});
			if(!created) throw Error('Could not find created post in database');
			createdTitle = created.Title;
		}
		if (currentUser.JoinedPost){
			joined = await Post.findOne({_id: currentUser.JoinedPost});
			if(!joined) throw Error('Could not find joined post in database');
			joinedTitle = joined.Title;
		}
		console.log(joinedTitle);
		// if(!created && !joined) res.status(200).json(currentUser);
		// else{
		// 	if (!created) res.status(200).json({currentUser, joinedTitle});
		// 	else {
		// 		if (!joined) res.status(200).json({currentUser, createdTitle});
		// 		else res.status(200).json({currentUser, createdTitle, joinedTitle});
		// 	}
		// }
		res.status(200).json({currentUser, createdTitle, joinedTitle});
		console.log(currentUser);
	} catch (e){
		res.status(404).send(e.message);
		console.log(e.message);
	}
}

exports.report_user = async function (req, res){
	console.log("[route] GET /member/report");
	console.log(req.body.reportUserid);
	try{
		const badMember = await Member.findOne({UserID: req.body.reportUserid});
		if(!badMember) throw Error('No member with this UserID');
		const currentMember = await Member.findOne({_id: req.user.id});
		if(!currentMember) throw Error('Could not find current user');
		if(badMember.UserID.toString() === currentMember.UserID.toString())
			throw Error('Could not report yourself')

		badMember.RPmark = badMember.RPmark - 5;
		const memberResult = await badMember.save();
		res.status(200).json(memberResult);
		console.log(memberResult);
	} catch (e){
		res.status(404).send(e.message);
		console.log(e.message);
	}
}

exports.change_pw = async function(req, res){
	console.log("[route] POST /member/edit");
	try{
		const currentMember = await Member.findOne({_id: req.user.id});
		if(!currentMember) throw Error('Could not find current member');
		console.log(req.body.oldPassword.toString());
		if(req.body.oldPassword.toString() !== currentMember.Password)
			throw Error('Current password incorrect');
		currentMember.Password = req.body.newPassword;
		const memberResult = await currentMember.save();
		if(!memberResult) throw Error('Could not update password to database');
		res.status(200).json(memberResult);
		console.log(memberResult);
	} catch (e){
		res.status(404).send(e.message);
		console.log(e.message);
	}
}
