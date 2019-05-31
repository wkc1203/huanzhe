module.exports = function (req, res, next) {
  var json = {
    code: 0,
    msg: null,
  };

  json.data = {
    "branchhislist": [
      {
        "branchhisId": "1",
        "branchhisName": "分院名称1"
      },
      {
        "branchhisId": "1",
        "branchhisName": "分院名称2"
      }
    ]
  };

  setTimeout(function () {
    res.send(json);
  }, Math.random() * 300);
};
