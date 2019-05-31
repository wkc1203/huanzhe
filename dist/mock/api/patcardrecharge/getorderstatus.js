module.exports = function (req, res) {
  var json = {
    code: 0,
    msg: null,
  };

  json.data = {
    'orderId': 1702060000200000000,
    'status': 'F',
    'statusName': '充值失败'
  };

  setTimeout(function () {
    res.send(json);
  }, Math.random() * 300);
};
