module.exports = function (req, res) {
  var json = {
    code: 0,
    msg: null,
  };

  json.data = {
    'status': 'S',
    'statusName': '成功'
  };

  setTimeout(function () {
    res.send(json);
  }, Math.random() * 300);
};
