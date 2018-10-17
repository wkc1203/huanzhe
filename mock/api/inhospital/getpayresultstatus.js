module.exports = function (req, res) {
  var json = {
    code: 0,
    msg: null,
  };

  json.data = {
    'status': 'S',
    'statusName': '成功',
    'createTime': '2012-12-12 12: 12: 12',
    'payedTime': '2012-12-12 12: 12: 12',
    'orderId': '10214322000025',
    'hisName': '广西区人民医院',
    'deptName': '耳鼻喉',
    'patientName': '张志明',
    'admissionNum': '421421321',
    'bizType': '住院押金补缴',
    'payFee': '21421',
    'hisOrderNo': '312321',
    'agtOrdNum': '321312',
    'refundTime': '2012-12-13 12: 12: 12',
    'refundDesc': '预缴成功',
    'refundSerilNo': '42131221312',
    'tips': '您的押金预缴成功，如需要打印发票和押金条，请到住院收费窗口凭此缴费记录打印。'
  };

  setTimeout(function () {
    res.send(json);
  }, Math.random() * 300);
};
