module.exports = function (req, res, next) {
  var json = {
    code: 0,
    msg: null,
  };

  json.data = {

  };

  setTimeout(function () {
    res.send(json);
  }, Math.random() * 300);
};
