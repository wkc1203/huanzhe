module.exports = function (req, res, next) {
  var json = {
    code: 0,
    msg: null,
  };

  json.data = {
    list: [
      {
        key: '姓名',
        value: '张三',
      },{
        key: '年龄',
        value: '18',
      },{
        key: '爱好',
        value: '吹牛逼',
      },
    ]
  };

  setTimeout(function () {
    res.send(json);
  }, Math.random() * 300);
};
