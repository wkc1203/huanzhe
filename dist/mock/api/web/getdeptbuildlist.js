module.exports = function (req, res, next) {
  var json = {
    code: 0,
    msg: null,
  };

  json.data = {
    "buildList": [
      {
        "buildId": "1",
        "buildName": "1号楼"
      },
      {
        "buildId": "2",
        "buildName": "2号楼"
      },
      {
        "buildId": "3",
        "buildName": "3号楼"
      },
      {
        "buildId": "4",
        "buildName": "4号楼"
      },
      {
        "buildId": "4",
        "buildName": "4号楼"
      },
      {
        "buildId": "5",
        "buildName": "5号楼"
      },
      {
        "buildId": "6",
        "buildName": "6号楼"
      },
      {
        "buildId": "7",
        "buildName": "7号楼"
      },
      {
        "buildId": "8",
        "buildName": "8号楼"
      }
    ]
  };

  setTimeout(function () {
    res.send(json);
  }, Math.random() * 300);
};
