module.exports = function (req, res, next) {
  var json = {
    code: 0,
    msg: null,
  };

  json.data = {
    "outpatientList": [
      {
        "name":"XXX项目",
        "deptName":"内科",
        "doctorName":"黄阶",
        "orderId":"1111112222",
        "status":"S",
        "statusName":"缴费成功",
        "refundStatus":1,
        "patientName":"黄二",
        "patCardNo":"02033990",
        "createTime":"2016-12-20 13:22:12",
        "totalFee":120
      },
      {
        "name":"XXX项目",
        "deptName":"内科",
        "doctorName":"黄阶",
        "orderId":"333333333333",
        "status":"S",
        "statusName":"缴费成功",
        "refundStatus":0,
        "patientName":"黄二",
        "patCardNo":"02033990",
        "createTime":"2016-12-10 13:22:12",
        "totalFee":420
      }
    ]
  };

  setTimeout(function () {
    res.send(json);
  }, Math.random() * 300);
};
