module.exports = function (req, res, next) {
  var json = {
    code: 0,
    msg: null,
  };

  json.data = {

    "leftBindNum":3,
      "cardList": [
      {
        "patientId":1,
        "idNo":"5115271984****4868",
        "patientMobile":"158****7980",
        "idType":1,
        "relationName":"他人",
        "isDefault":1,
        "patCardNo":"02033990",
        "patCardType":21,
        "patientName":"张志明",
        "patientSex":"F",
        "relationType":5
      },
      {
        "patientId":2,
        "idNo":"5115271984****4868",
        "patientMobile":"158****7980",
        "idType":1,
        "relationName":"他人",
        "default":1,
        "patCardNo":"02033990",
        "patCardType":21,
        "patientName":"张志明2",
        "patientSex":"F",
        "relationType":5
      }
    ]
  };

  setTimeout(function () {
    res.send(json);
  }, Math.random() * 300);
};
