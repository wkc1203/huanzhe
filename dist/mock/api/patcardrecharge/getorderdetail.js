module.exports = function (req, res) {
  var json = {
    code: 0,
    msg: null,
  };

  json.data = {
    'agtOrdNum': '4000073766665554544444',
    'createTime': '2017-02-07 19:18:04',
    'hisOrderNo': '1702060000201',
    'hisRecepitNo': 'x2343560p',
    'hisName': 'x2343560p',
    'hisSerialNo': '623999999663',
    'orderId': '1702060000200000039',
    'patCardNo': '123345345',
    'patCardType': '21',
    'patientName': '张三',
    'payStatus': 1,
    'payedTime': '2017-02-07 19:18:04',
    'refundStatus': 0,
    'secId': '65',
    'status': 'F',
    'statusName': '充值失败',
    'totalFee': 1000,
    'totalRealFee': 1000
  };

  setTimeout(function () {
    res.send(json);
  }, Math.random() * 300);
};
