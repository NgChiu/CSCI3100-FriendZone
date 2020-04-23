var Member = require('../models/Member');
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
		console.log("req.user");
		console.log(req.user);
		const currentUser = await Member.findOne({_id: req.user.id});
		if(!currentUser) throw Error('Fail to find member in database');
		res.status(200).json(currentUser);
		console.log(currentUser);
	} catch (e){
		res.status(404).send(e.message);
	}
}
