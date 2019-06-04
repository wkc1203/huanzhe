module.exports = function (req, res, next) {
  var json = {
    code: 0,
    msg: null,
  };

  json.data = {
    "waitOpList": [
      {
        "patientId":"12222222",
        "date":"2017-01-12",
        "deptName":"内科",
        "doctorName":"黄二",
        "hisOrderNo":"11111111111",
        "totalFee":300,
        "selfFee":300,
        "medicalFee":0
      },
      {
        "patientId":"12222222",
        "date":"2017-01-12",
        "deptName":"内科",
        "doctorName":"黄二",
        "hisOrderNo":"333333333333",
        "totalFee":500,
        "selfFee":500,
        "medicalFee":0
      },
      {
        "patientId":"12222222",
        "date":"2017-01-12",
        "deptName":"内科",
        "doctorName":"王二小",
        "hisOrderNo":"333333333666",
        "totalFee":200,
        "selfFee":200,
        "medicalFee":0
      },
      {
        "patientId":"12222222",
        "date":"2017-01-12",
        "deptName":"内科",
        "doctorName":"王二小",
        "hisOrderNo":"333333333444",
        "totalFee":600,
        "selfFee":600,
        "medicalFee":0
      }
    ]
  };

  setTimeout(function () {
    res.send(json);
  }, Math.random() * 300);
};
