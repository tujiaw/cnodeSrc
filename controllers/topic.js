var validator = require('validator');
var TopicModel = require('../models/topic');
var timerHelp = require('../timer_help');
var ReplyModel = require('../models/reply');

module.exports.showCreate = function(req, res) {
	res.render('topic/create');
};

module.exports.create = function(req, res) {
	var title = validator.trim(req.body.title);
	var tab = validator.trim(req.body.tab);
	var content = validator.trim(req.body.t_content);

	var hasEmptyInfo = [title, tab, content].some(function(item) {
		return item === '';
	});
	if (hasEmptyInfo) {
		res.status(422);
		return res.render('topic/create', {error: '您填写的信息不完整'});
	}
	var topicData = {
		title: title, 
		content: content,
		tab: tab,
		username: req.session.user.username,
		insertTime: Date.now()
	};
	TopicModel.addTopic(topicData, function(err, result) {
		return res.render('topic/create', {success: '发表话题成功'});
	});
};

module.exports.detail = function(req, res) {
	var topicId = req.params.tid;
	var getTopic = function() {
		return new Promise(function(resolve, reject) {
			TopicModel.getTopic(topicId, function(err, topic) {
				if (err) {
					reject(err);
				} else {
					topic.timeStr = timerHelp.formatTime(topic.insertTime);
					resolve(topic);
				}
			});
		});
	};

	var getCount = function() {
		return new Promise(function(resolve, reject) {
			ReplyModel.count({topicId: topicId}, function(err, count) {
				if (err) {
					reject(err);
				} else {
					resolve(count);
				}
			});
		});
	};

	var getReplys = function() {
		return new Promise(function(resolve, reject) {
			ReplyModel.getReplys(topicId, function(err, replys) {
				if (err) {
					reject(err);
				} else {
					var newReplys = replys.map(function(reply) {
						console.log('11111:' + typeof(reply.insertTime));
						console.log('22222:' + reply.insertTime);
						reply.timeStr = timerHelp.formatTime(reply.insertTime);
						return reply;
					});
					resolve(newReplys);
				}
			});
		});
	};

	Promise.all([getTopic(), getCount(), getReplys()]).then(function(datas) {
		res.render('topic/detail', {topic: datas[0], count: datas[1], replys: datas[2]});
	}).catch(function(err) {
		console.log(err);
	});
}