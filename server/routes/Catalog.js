var express = require('express');
var router = express.Router();
var auth = require('../controllers/middleWare');

// Require controller modules.
var postController = require('../controllers/postController');
var memberController = require('../controllers/memberController');


router.get('/post', postController.post_list);

router.post('/post/create', auth, postController.post_create);

router.post('/post/join', auth, postController.post_join);

router.post('/post/delete', auth, postController.post_delete);

router.post('/post/quit', auth, postController.post_quit);

router.post('/member/login', memberController.member_login);

router.post('/member/register',memberController.member_register);

router.post('/member/myself',auth, memberController.myself);

module.exports = router;
