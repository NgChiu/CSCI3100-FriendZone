var express = require("express");
var http = require("http");
var app = express();

app.get("/",function(req,res,next){
	res.send('Login Page');
});
app.get("/loginfail",function(req,res,next){
	res.send('WrongPW ah seven head');
});
app.get("/member/registration",function(req,res,next){
	res.send('Member Registration Page');
});
app.get("/category",function(req,res,next){
	res.send('All Category Page');
});
app.get("cateogry/sports",function(req,res,next){
	res.send('Sports Category Page');
});
app.get("/category/study",function(req,res,next){
	res.send('Study Category Page');
});
app.get("/cateogry/leisure",function(req,res,next){
	res.send('Leisure Category Page');
});
app.get("/category/ballgame",function(req,res,next){
	res.send('Ball Game Category Page');
});
app.get("/post/create",function(req,res,next){
	res.send('Create Post Page');
});
app.get("/post/manage",function(req,res,next){
	res.send('Manage Post Page');
});
app.get('^/post/:postID([0-9]{4})',function(req,res,next){
	res.send('Show Post Page. Post ID: ' + req.params.postID);
});
app.get('^/member/:memberID([0-9]{6})',function(req,res,next){
	res.send('Show Member Info Page(Own Info). Member ID: ' + req.params.memberID);
});
app.get("/member/report",function(req,res,next){
	res.send('Report Seven Head Page');
});

http.createServer(app).listen(8000);
