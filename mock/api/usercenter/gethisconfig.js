module.exports = function (req, res, next) {
	var json = {
		code: 200,
		msgs: null,
	};

	json.data = {
		relationTypes:[
			{dictKey:1,dictValue:'本人'},
			{dictKey:5,dictValue:'他人'},
		],
		patientTypes:[
			{dictKey:'0',dictValue:'成人'},
			{dictKey:'1',dictValue:'儿童'},
		],
		idTypes:[
			{dictKey:'1',dictValue:'身份证'},
			{dictKey:'2',dictValue:'港澳通行证'},
		],
		patCards:[
			{dictKey:'1',dictValue:'就诊卡'},
		],
		isNewCard : 0
	};
	setTimeout(function() {
		res.send(json);
	}, 100);

};
