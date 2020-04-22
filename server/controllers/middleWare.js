//var async = require('async');

var jwt  = require ('jsonwebtoken');
// var config = require ('../config');

const { JWT_SECRET } = {
  "mongoURI": "mongodb+srv://FriendZone:csci3100@cluster0-si1k7.mongodb.net/test",
  "jwtSecret": "SecretKey"
};

module.exports =  (req, res, next) => {
  console.log("Middleware");
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlOWMwYzRhZTk5MmM1MGRiYjgzMDQwOSIsImlhdCI6MTU4NzU2OTI3OSwiZXhwIjoxNTg3OTI5Mjc5fQ.AL-yADdkyAaWkKHqtElAzkrVDa5jqYDWY4D0aGrX4Ug";
  // const token = req.header('x-auth-token');
  // console.log(req.localStorage.getItem('token'));
  // var token = JSON.parse(localStorage.getItem('token'));
  console.log(req.header);

  //If no token
  if (!token){
  	console.log("NO token");
    return res.status(401).json({ msg: 'Invalid Access (NO Token)' });
}

  try {
    //Check if token valid
    console.log("Before verify");
    const decoded = jwt.verify(token, JWT_SECRET.jwtSecret);
    //return user
    req.user = decoded;
    console.log("After verify");
    next();
  } catch (e) {
    res.status(400).json({ msg: 'Invalid Access (INVALID Token)' });
  }
};