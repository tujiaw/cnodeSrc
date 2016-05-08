

var fs = require('fs');

var r1 = function() {
	return new Promise(function(resolve, reject) {
		fs.readFile('./test.js', 'utf8', function(err, data) {
			console.log('1111111');
			if (err) {
				reject('read1 error');
			}
			resolve(data);
		});
	});
};

var r2 = function() {
	return new Promise(function(resolve, reject) {
		fs.readFile('./config.js', 'utf8', function(err, data) {
			if (err) {
				return reject('read2 error');
			}
			//return resolve(data);
			return reject('r222222');
		});
	});
};

Promise.all([r1(), r2()]).then(function(datas) {
	console.log(datas);
}).catch(function(err) {
	console.log(err);
});