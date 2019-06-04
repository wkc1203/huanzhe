module.exports = function (req, res, next) {
  var json = {
    code: 0,
    msg: null,
  };

  json.data = {
    "levelDept":3,
    "deptList": [
      {
        "deptId":"123",
        "deptName":"内科",
        "hasChild":"1",
      },
      {
        "deptId":"123",
        "deptName":"内科",
        "hasChild":"0",
        "deptList": [
          {
            "deptId":"12424",
            "deptName":"心内科",
            "hasChild":"0",
            "deptList": [
              {
                "deptId":"3333322222",
                "deptName":"心内科一",
                "hasChild":"1"
              }
            ]
          }
        ]
      }
    ]
  };

  setTimeout(function () {
    res.send(json);
  }, Math.random() * 300);
};
