module.exports = function (req, res, next) {
  var json = {
    code: 0,
    msg: null,
  };

  json.data = {
    "hisList": [
      {
        "hisId":"2",
        "hisName":"妇儿院区",
        "hisTag":"XXX",
        "levelName":"三级甲等",
        "logImgUrl":"xxxxxxxxxxxxx"
      },
      {
        "hisId":"2",
        "hisName":"妇儿院区",
        "hisTag":"XXX",
        "levelName":"三级甲等",
        "logImgUrl":"xxxxxxxxxxxxx"
      }
    ]
  };

  setTimeout(function () {
    res.send(json);
  }, Math.random() * 300);
};
