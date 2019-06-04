module.exports = function (req, res, next) {
  var json = {
    code: 0,
    msg: null,
  };

  json.data = {
    text: 'server返回数据成功！'
  };

  setTimeout(function () {
    res.send(json);
  }, Math.random() * 300);
};
