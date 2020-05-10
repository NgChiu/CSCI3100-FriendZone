//var async = require('async');

var jwt  = require ('jsonwebtoken');
// var config = require ('../config');

const  JWT_SECRET  = {
  "mongoURI": "mongodb+srv://FriendZone:csci3100@cluster0-si1k7.mongodb.net/test",
  "jwtSecret": "SecretKey"
};

module.exports =  (req, res, next) => {
  const token = req.body.token;  
  // console.log(token);

  //If no token
  if (!token){
  	console.log("NO token");
    return res.status(401).json({ msg: 'Invalid Access (NO Token)' });
}

  try {
    //Check if token valid
    const decoded = jwt.verify(token, JWT_SECRET.jwtSecret);
    if(!decoded) throw Error('could not decode token');
    //return user
    req.user = decoded;
    next();
  } catch (e) {
    res.status(400).json({ msg: 'Invalid Access (INVALID Token)' });
    console.log(e.message);
  }
};
