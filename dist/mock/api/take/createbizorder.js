module.exports = function (req, res, next) {
  var json = {
    code: 0,
    msg: null,
  };

  json.data = {
    "orderId":"201421111",
    "hisName":"如皋博爱医院",
    "patCardNo":"1234567",
    "patCardType":"21",
    "patientName":"xx",
    "bizType":"take_register",
    "bizTypeName":"取号",
    "deptName":"骨科",
    "doctorName":"刘俊",
    "visitDateWeek":"星期五",
    "visitDate":"2014-11-12",
    "visitPeriod":1,
    "visitBeginTime":"8:00",
    "visitEndTime":"8:30",
    "totalFee":0.01,
    "medicalFee":100,
    "selfFee":400,
    "patHisNo":"2014445",
    "extFields":"",
    "sign":"xxxxxx",
    "payData":"xxxxxxxx"
  };

  setTimeout(function () {
    res.send(json);
  }, Math.random() * 300);
};
