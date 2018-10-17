module.exports = function (req, res) {
  var json = {
    code: 0,
    msg: null,
  };

  json.data = {
    'availFee': 99999,
    'freezeFee': 1000,
    'idNo': '5115271984****4868',
    'idType': 1,
    'patCardNo': '123345345',
    'patCardType': 21,
    'patHisNo': '35456-X',
    'patientAddress': '长沙',
    'patientId': 135,
    'patientMobile': '15801507980',
    'patientName': '张三',
    'sumFee': 1000
  };

  setTimeout(function () {
    res.send(json);
  }, Math.random() * 300);
};
