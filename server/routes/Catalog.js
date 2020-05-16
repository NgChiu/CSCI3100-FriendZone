/****************************************************************
 * Purpose  Set routes for different function in controllers folder
 * Author   LAW Hei Yiu, LEUNG Pok Ho
 * Date     2020-05-16
 ***************************************************************/
var express = require('express');
var router = express.Router();
var auth = require('../controllers/middleWare');

// Require controller modules.
var postController = require('../controllers/postController');
var memberController = require('../controllers/memberController');

/****************************************************************
 * Routes related to post(event)
 ***************************************************************/
router.get('/post', postController.post_list);

router.post('/post/create', auth, postController.post_create);

router.post('/post/join', auth, postController.post_join);

router.post('/post/delete', auth, postController.post_delete);

router.post('/post/quit', auth, postController.post_quit);

router.get('/post/:catID', postController.show_category);
/****************************************************************
 * Routes related to member
 ***************************************************************/
router.post('/member/login', memberController.member_login);

router.post('/member/register',memberController.member_register);

router.post('/member/myself',auth, memberController.myself);

router.post('/member/report', auth, memberController.report_user);

router.post('/member/edit', auth, memberController.change_pw);

/****************************************************************
 * Export
 ***************************************************************/
module.exports = router;
