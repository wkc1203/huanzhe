module.exports = function (req, res, next) {
  var json = {
    code: 0,
    msg: 'null',
    data: {}
  };

  setTimeout(function () {
    res.send(json);
  }, 100);

};
