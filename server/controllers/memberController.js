/****************************************************************
 * Purpose  Backend function related to members
 * Author   LAW Hei Yiu, LEUNG Pok Ho
 * Date     2020-05-16
 ***************************************************************/
var Member = require('../models/Member');
var Post = require('../models/Post');
var async = require('async');
var jwt  = require ('jsonwebtoken');

const  JWT_SECRET  = {
  "mongoURI": "mongodb+srv://FriendZone:csci3100@cluster0-si1k7.mongodb.net/test",
  "jwtSecret": "SecretKey"
};

/****************************************************************
 * Route    POST /member/login
 * Purpose  Use when member tries to login
 ***************************************************************/
exports.member_login = async function (req, res) {
	console.log("[route] POST /member/login");
	try{
		//Get UserID and PW from req.body
		const input_UserID = req.body.loginUserID;
		const input_Password = req.body.loginPassword;
		if(!input_UserID) return res.status(400).json("No UserID is inputted");
		if(!input_Password) return res.status(400).json("No Password is inputted");

		//Find currentUser by UserID inputted
		const currentUser = await Member.findOne({ UserID: input_UserID });
		if(!currentUser) throw Error('Invalid UserID');

		//Check whether PW matches
		const Valid = (currentUser.Password === input_Password);
		if(!Valid) throw Error('Wrong Password');

		//Create token
		const Token = jwt.sign({ id: currentUser._id }, JWT_SECRET.jwtSecret, { expiresIn: 360000 });
		if(!Token) throw Error('No Valid Token is created');

		console.log({Token,currentUser});
		res.status(200).json({Token, currentUser});
	} catch (e) {
		console.log(e.message);
		res.status(404).send(e.message);
	}
}

/****************************************************************
 * Route    POST /member/register
 * Purpose  Create new member in member database according to member inputs
 ***************************************************************/
exports.member_register = async function (req, res) {
	console.log("[route] POST /member/register");
	try{
		//Get input from req.body
		const input_Username = req.body.regUsername;
		const input_UserID = req.body.regUserID;
		const input_Password = req.body.regPassword;
		const input_LineID = req.body.regLineID;

		//Error Handling
		if(!input_Username) throw Error('Register Failed. [No Username is inputted]');
		if(!input_UserID) throw Error('Register Failed. [No UserID is inputted]');
		if(!input_Password) throw Error('Register Failed. [No Password is inputted]');
		if(!input_LineID) throw Error('Register Failed. [No LineID is inputted]');
		//If the UserID is used by other user
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

		//Create token
		const Token = jwt.sign({ id: newMember._id }, JWT_SECRET.jwtSecret, { expiresIn: 360000 });
		if(!Token) throw Error('No Valid Token is created');

		console.log(newMember);
		res.status(200).json({Token, newMember});
	} catch (e) {
		console.log(e.message);
		res.status(404).send(e.message);
	}
}

/****************************************************************
 * Route    POST /member/myself
 * Purpose  Return user information of current user
 ***************************************************************/
exports.myself = async function (req, res){
	console.log("[route] POST /member/myself");
	try{
		//Find current user from token
		const currentUser = await Member.findOne({_id: req.user.id});
		if(!currentUser) throw Error('Fail to find member in database');

		//Set variable for later use
		var joinedTitle;
		var createdTitle;
		var created;
		var joined;

		//If the user have created event, find title of that event
		if (currentUser.CreatedPost){
			created = await Post.findOne({_id: currentUser.CreatedPost});
			if(!created) throw Error('Could not find created post in database');
			createdTitle = created.Title;
		}
		//If the user have joined event, find title of that event
		if (currentUser.JoinedPost){
			joined = await Post.findOne({_id: currentUser.JoinedPost});
			if(!joined) throw Error('Could not find joined post in database');
			joinedTitle = joined.Title;
		}
		console.log(currentUser);
		res.status(200).json({currentUser, createdTitle, joinedTitle});
	} catch (e){
		console.log(e.message);
		res.status(404).send(e.message);
	}
}

/****************************************************************
 * Route    POST /member/report
 * Purpose  Update RPmark of member when the member is being reported
 ***************************************************************/
exports.report_user = async function (req, res){
	console.log("[route] POST /member/report");
	try{
		//Find the member being reported
		const badMember = await Member.findOne({UserID: req.body.reportUserid});
		if(!badMember) throw Error('No member with this UserID');

		//Find the member who want to report others
		const currentMember = await Member.findOne({_id: req.user.id});
		if(!currentMember) throw Error('Could not find current user');

		//Handle exceptional cases
		//If the member reports themself
		if(badMember.UserID.toString() === currentMember.UserID.toString())
			throw Error('Could not report yourself')

		//Minus RPmark of the member being reported & update member database
		badMember.RPmark = badMember.RPmark - 5;
		const memberResult = await badMember.save();

		console.log(memberResult);
		res.status(200).json(memberResult);
	} catch (e){
		console.log(e.message);
		res.status(404).send(e.message);
	}
}

/****************************************************************
 * Route    POST /member/edit
 * Purpose  Update password of member when user attempts to change password
 ***************************************************************/
exports.change_pw = async function(req, res){
	console.log("[route] POST /member/edit");
	try{
		//Find the current user from token
		const currentMember = await Member.findOne({_id: req.user.id});
		if(!currentMember) throw Error('Could not find current member');

		//Handle exceptional cases
		//If the user enters a wrong old password
		if(req.body.oldPassword.toString() !== currentMember.Password)
			throw Error('Current password incorrect');

		//Set new password
		currentMember.Password = req.body.newPassword;
		const memberResult = await currentMember.save();
		if(!memberResult) throw Error('Could not update password to database');

		console.log(memberResult);
		res.status(200).json(memberResult);
	} catch (e){
		console.log(e.message);
		res.status(404).send(e.message);
	}
}
