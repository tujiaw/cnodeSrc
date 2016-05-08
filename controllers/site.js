
var topicModel = require('../models/topic');
var timerHelp = require('../timer_help');

module.exports.index = function(req, res) {
	var page = parseInt(req.query.page) || 1;
	page = Math.max(page, 1);
	var tab = req.query.tab || 'all';
	var query = {};
	if (tab !== 'all') {
		query.tab = tab;
	}

	var count = 10;
	var option = {skip: (page - 1) * count, limit: count, sort: '-insertTime'};

	var getTopics = function() {
		return new Promise(function(resolve, reject) {
			topicModel.getTopics(query, option, function(err, topics) {
				if (err) {
					reject(err);
				} else {
					var newTopics = topics.map(function(topic) {
						topic.timeStr = timerHelp.formatTime(topic.insertTime);
						return topic;
					});
					resolve(newTopics);
				}
			});
		});
	};
	var getPageCount = function() {
		return new Promise(function(resolve, reject) {
			topicModel.count(query, function(err, allCount) {
				if (err) {
					reject(err);
				} else {
					var pageCount = Math.ceil(allCount / count);
					resolve(pageCount);
				}
			});
		});
	};
	Promise.all([getTopics(), getPageCount()]).then(function(datas) {
		res.render('index', {topics: datas[0], tab: tab, page: page, pageCount: datas[1]});
	}).catch(function(err) {
		console.log(err);
	});
}