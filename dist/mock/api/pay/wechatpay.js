module.exports = function (req, res, next) {
  var json = {
    code: 0,
    msg: null,
  };

  json.data = {
    "appId":"wx2342345123254675",
    "nonceStr":"5K8264ILTKCH16CQ2502SI8ZNMTM67VS",
    "packages":"prepay_id=123456789",
    "paySign":"5K8264ILTKCH16CQ2502SI8ZNMTM67VS",
    "resultCode":"SUCCESS",
    "signType":"MD5",
    "timeStamp":"1414561699"
  };

  setTimeout(function () {
    res.send(json);
  }, Math.random() * 300);
};
