module.exports = function (req, res, next) {
	var json = {
		code: 200,
		msgs: null,
	};

	json.vo = {
		id: ~~(Math.random() * 100000),
		userName: req.body.userName,
		userCode: '0000001',
		ownerRole: '',
		isLock: false,
	};


	setTimeout(function () {
		res.send(json);
	}, Math.random() * 3000);
};
