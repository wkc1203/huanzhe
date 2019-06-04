module.exports = function (req, res, next) {
	var json = {
		code: 0,
		msgs: 'null',
        data : {
            "isDefault": 1,
            "hisName": "广西区人民医院",
            "idNo": "5115271984****4868",
            "idType":1,
            "idTypeName":'身份证',
            "patCardNo": "75430830_2",
            "patCardType": 21,
            "patientAddress": "长沙",
            "patientId": 277,
            "patientMobile": "158****7980",
            "patientName": "蒋中正",
            "relationName": "他人",
            "patHisNo":1222
        }
	};

	setTimeout(function() {
		res.send(json);
	}, 100);

};
