module.exports = function (req, res, next) {
  var json = {
    code: 0,
    msgs: 'null',
    data: {
      "inpatientList": [
        {
          "orderId": "1111112222",
          "patientName": "黄二",
          "patCardNo": "02033990",
          "patCardType": 1,
          "status": "S",
          "statusName": "缴费成功",
          "payedTime": "2016-12-2013: 22: 12",
          "totalFee": 120,
          "payStatus": 1,
          "refundStatus": 0,
          "inhospitalNo": 1112333
        },
        {
          "orderId": "1111112222",
          "patientName": "黄二",
          "patCardNo": "02033990",
          "patCardType": 1,
          "status": "S",
          "statusName": "缴费成功",
          "payedTime": "2016-12-2013: 22: 12",
          "totalFee": 120,
          "payStatus": 1,
          "refundStatus": 0,
          "inhospitalNo": 1112333
        }
      ]
    }
  };

  setTimeout(function () {
    res.send(json);
  }, 100);
};


