/****************************************************************
 * Purpose  Get current member's _id from token
 * Author   LAW Hei Yiu, LEUNG Pok Ho
 * Date     2020-05-16
 ***************************************************************/
var jwt  = require ('jsonwebtoken');

const  JWT_SECRET  = {
  	"mongoURI": "mongodb+srv://FriendZone:csci3100@cluster0-si1k7.mongodb.net/test",
  	"jwtSecret": "SecretKey"
};

/****************************************************************
 * Purpose  Get current member's _id from token
 ***************************************************************/
module.exports =  (req, res, next) => {
  	const token = req.body.token;

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
		console.log(e.message);
		res.status(400).json({ msg: 'Invalid Access (INVALID Token)' });
  	}
};
