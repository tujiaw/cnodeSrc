
var ReplyModel = require('../models/reply');

module.exports.addReply = function(req, res) {
	var topicId = req.body.topicId;
	var content = req.body.t_content;
	var username = req.session.user.username;

	ReplyModel.addReply({
		topicId: topicId,
		content: content,
		username: username,
		insertTime: Date.now()
	}, function(err, result) {
		res.redirect('/topic/' + topicId);
	});
};

module.exports.upload = function(req, res) {

};