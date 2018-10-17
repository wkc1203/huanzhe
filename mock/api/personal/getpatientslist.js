module.exports = function (req, res, next) {
  var json = {
    code: 0,
    msgs: 'null',
    data: {
      leftBindNum: 2,
      cardList: [
        {
          "patientId": 1,
          "idNo": "5115271984****4868",
          "patientMobile": "158****7980",
          "idType": 1,
          "bindStatus": 1,
          "relationName": "他人",
          "isDefault": 1,
          "patCardNo": "02033990_1",
          "patCardType": 21,
          "patientName": "张志明",
          "patientSex": "F",
          "relationType": 5
        },
        {
          "patientId": 2,
          "idNo": "5115271984****4868",
          "patientMobile": "158****7980",
          "idType": 1,
          "bindStatus": 1,
          "relationName": "他人",
          "isDefault": 0,
          "patCardNo": "02033990_2",
          "patCardType": 21,
          "patientName": "朱鹏志",
          "patientSex": "M",
          "relationType": 5
        },
	 {
          "patientId": 2,
          "idNo": "5115271984****4868",
          "patientMobile": "158****7980",
          "idType": 1,
          "bindStatus": 1,
          "relationName": "他人",
          "isDefault": 0,
          "patCardNo": "02033990_2",
          "patCardType": 21,
          "patientName": "蒋曼娜",
          "patientSex": "F",
          "relationType": 5
        }
      ]
    }
  };

  setTimeout(function () {
    res.send(json);
  }, 100);

};
