var express = require('express');
var router = express.Router();
var signController = require('../controllers/sign');
var topicController = require('../controllers/topic');
var siteController = require('../controllers/site');
var replyController = require('../controllers/reply');
var auth = require('../middlewares/auth');

router.get('/signup', signController.showSignup);

router.post('/signup', signController.signup);

router.get('/signin', signController.showSignin);

router.post('/signin', signController.signin);

router.get('/signout', signController.signout);

router.get('/topic/create', auth.requireLogin, topicController.showCreate);

router.post('/topic/create', auth.requireLogin, topicController.create);

router.get('/', siteController.index);

router.get('/topic/:tid', topicController.detail);

router.post('/reply/reply', auth.requireLogin, replyController.addReply);

router.post('/reply/upload', auth.requireLogin, function(req, res) {

});

module.exports = router; 