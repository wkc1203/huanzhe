module.exports = function (req, res, next) {
  var json = {
    code: 0,
    msg: null,
  };

  json.data = {
    "outpatientlist": [
      {
        "outpatientId": "1",
        "outpatientName": "门诊名称"
      },
      {
        "outpatientId": "2",
        "outpatientName": "门诊名称2"
      }
    ]
  };

  setTimeout(function () {
    res.send(json);
  }, Math.random() * 300);
};
