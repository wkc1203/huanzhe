module.exports = function (req, res, next) {
  var json = {
    code: 0,
    msg: null,
  };

  setTimeout(function () {
    res.send(json);
  }, Math.random() * 3000);
};
