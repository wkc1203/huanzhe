module.exports = function (req, res, next) {
  var json = {
    code: 0,
    msg: null,
  };

  json.data = {
    "levelDept":3,
    "deptList": [
      {
        "deptId":"1",
        "deptName":"内科1",
        "hasChild":"0",
        "deptList": [
          {
            "deptId":"11",
            "deptName":"心内科11",
            "hasChild":"1"
          },
          {
            "deptId":"12",
            "deptName":"心内科12",
            "hasChild":"0",
            "deptList": [
              {
                "deptId":"121",
                "deptName":"心内科121",
                "hasChild":"1"
              },
              {
                "deptId":"122",
                "deptName":"心内科122",
                "hasChild":"1"
              },
              {
                "deptId": "123",
                "deptName": "心内科123",
                "hasChild": "1"
              },
            ]
          },
          {
            "deptId":"13",
            "deptName":"心内科13",
            "hasChild":"1"
          },
          {
            "deptId":"14",
            "deptName":"心内科14",
            "hasChild":"1"
          }
        ]
      },
      {
        "deptId":"2",
        "deptName":"外科2",
        "hasChild":"0",
        "deptList": [
          {
            "deptId":"21",
            "deptName":"心内科21",
            "hasChild":"1"
          },
          {
            "deptId":"23",
            "deptName":"心内科23",
            "hasChild":"1"
          },
          {
            "deptId":"24",
            "deptName":"心内科24",
            "hasChild":"1"
          }
        ]
      },
      {
        "deptId":"3",
        "deptName":"外科3",
        "hasChild":"1",
      }
    ]
  };

  setTimeout(function () {
    res.send(json);
  }, Math.random() * 300);
};
