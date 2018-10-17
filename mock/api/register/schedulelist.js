module.exports = function (req, res, next) {
  var json = {
    code: 0,
    msg: null,
  };

  json.data = {
    'scheduleDate': req.body.scheduleDate,
    "itemList": [
      {
        "scheduleId":"221111",
        "visitPeriod":"1",
        "visitBeginTime":"08:00",
        "visitEndTime":"08:30",
        "registerFee":200,
        "leftSource":20,
        "totalSource":14,
        "status":"1",
        "extFields": {
          "keyEle1":"221111",
          "visitPeriod":"1"
        }
      },
      {
        "scheduleId":"221331",
        "visitPeriod":"3",
        "visitBeginTime":"14:00",
        "visitEndTime":"14:30",
        "registerFee":200,
        "leftSource":20,
        "totalSource":14,
        "status":"2",
        "extFields": {
          "keyEle1":"221111",
          "visitPeriod":"1"
        }
      },
      {
        "scheduleId":"221331",
        "visitPeriod":"3",
        "visitBeginTime":"14:30",
        "visitEndTime":"15:00",
        "registerFee":200,
        "leftSource":0,
        "totalSource":14,
        "status":"2",
        "extFields": {
          "keyEle1":"221111",
          "visitPeriod":"1"
        }
      }
    ]
  };

  setTimeout(function () {
    res.send(json);
  }, Math.random() * 300);
};
