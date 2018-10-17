module.exports = function (req, res, next) {
  var json = {
    code: 0,
    msg: null,
  };

  json.data = {
    "takeList": [
      {
        "resourceId":"201421111",
        "hisOrderStatus":0,
        "hisOrderNo":"210344444",
        "hisSerialNo":"20134555",
        "visitDate":"2014-11-12",
        "visitPeriod":1,
        "visitBeginTime":"8:00",
        "visitEndTime":"8:30",
        "totalFee":0.01,
        "selfFee":500,
        "medicalFee":0,
        "deptName":"骨科",
        "doctorName":"刘俊",
        "extFields":""
      },
      {
        "resourceId":"30222",
        "hisOrderStatus":0,
        "hisOrderNo":"3012324",
        "hisSerialNo":"344555",
        "visitDate":"2016-03-21",
        "visitPeriod":1,
        "visitBeginTime":"8:00",
        "visitEndTime":"8:30",
        "totalFee":500,
        "selfFee":500,
        "medicalFee":0,
        "deptName":"骨科",
        "doctorName":"刘俊",
        "extFields":""
      }
    ]
  };

  setTimeout(function () {
    res.send(json);
  }, Math.random() * 300);
};
