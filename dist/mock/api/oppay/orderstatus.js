module.exports = function (req, res, next) {
  var json = {
    code: 0,
    msg: null,
  };

  json.data = {
    "status":"S",
    "statusName":"付款完成，调用医院支付接口中"
  };

  setTimeout(function () {
    res.send(json);
  }, Math.random() * 300);
};
