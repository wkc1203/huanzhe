module.exports = function (req, res, next) {
  var json = {
    code: 0,
    msg: null,
  };

  json.data = {
    "doctorList": [
      {
        "hisId":"111",
        "doctorId":"123",
        "doctorName":"黄三" + req.body.inputData,
        "deptId":"2222",
        "deptName":"内科",
        "doctorSex":"M",
        "doctorImg":"xxxxx",
        "doctorTitle":"专家"
      },
      {
        "hisId":"111",
        "doctorId":"124",
        "doctorName":"黄二",
        "deptId":"2222",
        "deptName":"内科",
        "doctorSex":"F",
        "doctorImg":"xxxxx",
        "doctorTitle":"普通"
      }
    ],
    "deptList": [
      {
        "hisId":"111",
        "deptId":"2222",
        "deptName":"内科" + req.body.inputData
      },
      {
        "hisId":"111",
        "deptId":"2223",
        "deptName":"内科一"
      }
    ]
  };

  setTimeout(function () {
    res.send(json);
  }, Math.random() * 300);
};
