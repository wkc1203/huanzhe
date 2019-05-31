module.exports = function (req, res, next) {
  var json = {
    code: 0,
    msg: null,
  };

  json.data = {
    "floorList": [
      {
        "floorId": "1",
        "floorName": "1F",
        "floorDept": "急诊科、银行、挂号收费处、简易门诊1"
      },
      {
        "floorId": "2",
        "floorName": "2F",
        "floorDept": Math.random() * 300
      }
    ]
  };

  setTimeout(function () {
    res.send(json);
  }, Math.random() * 300);
};
