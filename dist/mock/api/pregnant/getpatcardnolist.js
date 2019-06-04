module.exports = function (req, res, next) {
  var json = {
    code: 0,
    msg: null,
  };

  json.data = {
    levNum: 1,
    cardList: [
      {
        patCardNo: '1234567890',
        name: '张三',
        imageUrl: null,
        patCardType: 1,
      },
      {
        patCardNo: '1234567891',
        name: '李四',
        imageUrl: null,
        patCardType: 1,
      },
      {
        patCardNo: '1234567892',
        name: '王五1',
        imageUrl: null,
        patCardType: 1,
      },
    ]
  };

  setTimeout(function () {
    res.send(json);
  }, Math.random() * 1000);
};
