module.exports = function (req, res, next) {
  var json = {
    code: 0,
    msg: null,
  };

  json.data = {
    "orderId":"2017060151250564564"
  };

  setTimeout(function () {
    res.send(json);
  }, Math.random() * 300);
};
