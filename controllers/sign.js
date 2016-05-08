

var UserModel = require('../models/user');

module.exports.showSignup = function(req, res) {
	res.render('sign/signup');
};

module.exports.signup = function(req, res) {
	console.log('signup 111');
	var username = req.body.loginname;
	var pass = req.body.pass;
	var rePass = req.body.re_pass;
	var email = req.body.email;

	var infoError = function(msg) {
		res.status(422);
		res.render('sign/signup', {error: msg});
		console.log('error:' + msg);
	};

	var hasEmptyInfo = [username, pass, rePass, email].some(function(item) {
		return item === '';
	});
	var isPassDiff = pass !== rePass;
	if (hasEmptyInfo || isPassDiff) {
		infoError('注册信息错误!')
		return;
	}

	UserModel.getUserBySignupInfo(username, email, function(err, users) {
		if (err) {
			infoError('获取用户数据失败!');
			return;
		} 
		if (users.length > 0) {
			infoError('用户名或者邮箱被占用!');
			return;
		}
		UserModel.addUser({username: username, pass: pass, email: email}, function(err, result) {
			if (result) {
				res.render('sign/signup', {success: '恭喜您，注册成功'});
			} else {
				infoError('注册失败!');
			}
		});
	});
};

module.exports.showSignin = function(req, res) {
	res.render('sign/signin');
};

module.exports.signin = function(req, res) {
	console.log('signin 222');
	var username = req.body.loginname;
	var pass = req.body.pass;

	var infoError = function(msg) {
		res.status(422);
		res.render('sign/signin', {error: msg});
		console.log(msg);
	};

	if (!username || !pass) {
		infoError('您填写的信息不完整');
		return;
	}
	UserModel.getUser(username, pass, function(err, user) {
		if (user) {
			console.log('login success');
			req.session.user = user;
			res.render('sign/signin', {success: '登录成功'});
		} else {
			infoError('用户名或者密码错误!');
		}
	});
};

module.exports.signout = function(req, res) {
	req.session.destroy();
	res.redirect('/');
};
