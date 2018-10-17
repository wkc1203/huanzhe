module.exports = function (req, res, next) {
  var json = {
    code: 0,
    msg: null,
  };

  json.data = {
    "takeList": [
      {
        "orderId":"1245454",
        "userId":"24554",
        "totalFee":"10.00",
        "status":"S",
        "patCardNo":"123456",
        "refundStatus":1,
        "patientName":"黄二",
        "visitDate":"2014-11-12",
        "visitPeriod":1,
        "visitBeginTime":"8:00",
        "visitEndTime":"8:30",
        "doctorName":"刘俊",
        "deptName":"骨科"
      },
      {
        "orderId":"1245454",
        "userId":"24554",
        "totalFee":"10.00",
        "status":"P",
        "patCardNo":"123456",
        "refundStatus":0,
        "patientName":"黄二",
        "visitDate":"2014-11-12",
        "visitPeriod":1,
        "visitBeginTime":"8:00",
        "visitEndTime":"8:30",
        "doctorName":"刘俊",
        "deptName":"骨科"
      }
    ]
  };

  setTimeout(function () {
    res.send(json);
  }, Math.random() * 300);
};
