module.exports = function (req, res, next) {
	var json = {
		code: 0,
		msgs: 'null',
	};

	setTimeout(function() {
		res.send(json);
	}, 2000);

};
