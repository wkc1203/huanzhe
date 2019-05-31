module.exports = function (req, res, next) {
  var json = {
    code: 0,
    msgs: 'null',
    data: {
      "rechargeList": [
        {
          "createTime": "2017-02-06 15:37:10",
          "orderId": "1801090000200000004",
          "patCardNo": "95430830",
          "patientName": "李焱",
          "payedTime": "2017-02-06 15:37:10",
          "status": "S",
          "statusName": "充值成功",
          "payStatus": "1",
          "refundStatus": "0",
          "totalFee": 5000
        },
        {
          "createTime": "2017-02-06 15:37:10",
          "orderId": "1801090000200000004",
          "patCardNo": "95430830",
          "patientName": "李焱",
          "payedTime": "2017-02-06 15:37:10",
          "status": "S",
          "statusName": "充值成功",
          "totalFee": 5000
        }
      ]
    }
  };

  setTimeout(function () {
    res.send(json);
  }, 100);
};


