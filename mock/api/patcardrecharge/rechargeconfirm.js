module.exports = function (req, res) {
  var json = {
    code: 0,
    msg: null,
  };

  json.data = {
    'hisName': '广西区人民医院',
    'patientName': '张三',
    'patCardNo': '23776666666',
    'patCardType': 21,
    'totalFee': 800,
    'secId': 46
  };

  setTimeout(function () {
    res.send(json);
  }, Math.random() * 300);
};
