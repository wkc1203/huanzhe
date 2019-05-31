module.exports = function (req, res, next) {
  var json = {
    code: 0,
    msg: null,
  };

  json.data = {
    "orderId":"12222222",
    "bizType":"xxx",
    "bizName":"门诊缴费",
    "hisName":"广西区人民医院",
    "patientName":"旺热",
    "patCardNo":"12344333",
    "totalFee":12344,
    "deptName":"内科",
    "doctorName":"黄医生",
    "date":"2017-01-23",
    "sign":"xxxxxxxxxx",
    "payData":"XXXXXXXXXXXXXXXXXxX"
  };

  setTimeout(function () {
    res.send(json);
  }, Math.random() * 300);
};
