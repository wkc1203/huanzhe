module.exports = function (req, res, next) {
  var json = {
    code: 0,
    msg: null,
  };

  json.data = {
    "hisName":"广妇儿",
    "deptName":"内科",
    "doctorTitle": "专家",
    "doctorName":"小二",
    "scheduleDate":"2017-02-10",
    "visitWeekName":"星期三",
    "visitPeriod":1,
    "visitBeginTime":"08:00",
    "visitEndTime":"08:30",
    "registerFee": 100,
    "extFields": {
      "keyEle1":"221111",
      "visitPeriod":"1"
    },
    "leftBindNum":3,
    "patientList": [
      {
        "patientId":1,
        "idNo":"5115271984****4868",
        "patientMobile":"158****7980",
        "idType":1,
        "relationName":"本人",
        "isDefault":0,
        "patCardNo":"02033990_1",
        "patCardType":21,
        "patientName":"张志明",
        "patientSex":"F",
        "relationType":1,
        "patientImg":"www.baidu.com"
      },
      {
        "patientId":2,
        "idNo":"5115271984****4868",
        "patientMobile":"158****7980",
        "idType":1,
        "relationName":"他人",
        "isDefault":1,
        "patCardNo":"020339901_2",
        "patCardType":21,
        "patientName":"张小明",
        "patientSex":"F",
        "relationType":5
      },
      {
        "patientId":3,
        "idNo":"5115271984****4868",
        "patientMobile":"158****7980",
        "idType":1,
        "relationName":"他人",
        "isDefault":0,
        "patCardNo":"1156464_3",
        "patCardType":21,
        "patientName":"王小二",
        "patientSex":"F",
        "relationType":5
      }
    ]
  };

  setTimeout(function () {
    res.send(json);
  }, Math.random() * 300);
};
