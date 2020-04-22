var express = require('express');
var router = express.Router();
var auth = require('../controllers/middleWare');

// Require controller modules.
var postController = require('../controllers/postController');
var memberController = require('../controllers/memberController');


router.get('/post', auth, postController.post_list);

router.get('/post/create', postController.post_create);

router.post('/member/login', memberController.member_login);

router.post('/member/register',memberController.member_register);

router.get('/member/myself',auth, memberController.myself);

module.exports = router;