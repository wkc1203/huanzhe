module.exports = function (req, res, next) {
  var json = {
    code: 0,
    msg: null,
  };

  json.data = {
    "orderId":"1704100200700000005",
    "createTime":"2017-04-10 09:18:13",
    "deptId":"51406",
    "deptName":"骨科",
    "doctorId":"20018",
    "doctorName":"刘俊",
    "hisId":2007,
    "hisName":"如皋博爱医院",
    "isAutoRefund":0,
    "medicalFee":0,
    "parentHisId":2007,
    "patCardNo":"1234567",
    "patCardType":"21",
    "patHisNo":"",
    "patientId":350,
    "patientMobile":"15348312566",
    "patientName":"xx",
    "platformId":2007,
    "platformSource":1,
    "refundStatus":1,
    "selfFee":1000,
    "status":"P",
    "totalFee":1000,
    "totalRealFee":1000,
    "userId":986,
    "version":0,
    "visitDate":"2017-04-01",
    "visitPeriod":1,
    "payStatus":0,
    "payedTime":"2017-01-20 13:22:12",
    "agtOrdNum":"3444444444444444444",
    "hisOrderNo":"222222222222222",
    "hisSerialNo":"222222222222222",
    "hisRecepitNo":"222222222222222",
    "refundList": [
      {
        "refundStatus":1,
        "refundStatusName":"退款中",
        "refundDesc":"取号失败退款",
        "fefundFee":100,
        "refundTime":"2017-01-24 14:21:33",
        "refundSuccessTime":"2017-01-24 14:21:33",
        "refundSerialNo":"33333",
        "hisSerialNo":"23335"
      }
    ]
  };

  setTimeout(function () {
    res.send(json);
  }, Math.random() * 300);
};
