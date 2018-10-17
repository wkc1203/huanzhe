module.exports = function (req, res, next) {
  var json = {
    code: 0,
    msg: "ddd",
  };

  json.data = {
    "orderId":"12222222",
  };

  setTimeout(function () {
    res.send(json);
  }, Math.random() * 100);
};
