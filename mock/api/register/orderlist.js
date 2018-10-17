module.exports = function (req, res, next) {
  var json = {
    code: 0,
    msg: null,
  };

  json.data = {
    "orderList": [
      {
        "orderId":"1111112222",
        "deptName":"内科",
        "doctorName":"黄阶",
        "status":"S",
        "statusName":"挂号成功",
        "patientName":"黄二",
        "patCardNo":"02033990",
        "orderTime":"2016-12-20 13:22:12",
        "totalFee":120,
        "visitDate":"2017-02-11",
        "visitPeriod":"1",
        "visitBeginTime":"08:10",
        "visitEndTime":"08:30",
        "bizType": 1,
        "refundStatus":1
      },
      {
        "orderId":"333333333",
        "deptName":"内科",
        "doctorName":"黄阶",
        "status":"F",
        "statusName":"挂号失败",
        "patientName":"黄二",
        "patCardNo":"02033990",
        "orderTime":"2016-12-30 13:22:12",
        "totalFee":120,
        "visitDate":"2017-02-15",
        "visitPeriod":"1",
        "visitBeginTime":"08:10",
        "visitEndTime":"08:30",
        "bizType": 1,
        "refundStatus":0
      },
      {
        "orderId":"333333333",
        "deptName":"内科",
        "doctorName":"黄阶111",
        "status":"H",
        "statusName":"挂号异常",
        "patientName":"黄二",
        "patCardNo":"02033990",
        "orderTime":"2016-12-30 13:22:12",
        "totalFee":120,
        "visitDate":"2017-02-15",
        "visitPeriod":"1",
        "visitBeginTime":"08:10",
        "visitEndTime":"08:30",
        "bizType": 1,
        "refundStatus":0
      }
    ]
  };

  setTimeout(function () {
    res.send(json);
  }, Math.random() * 300);
};
