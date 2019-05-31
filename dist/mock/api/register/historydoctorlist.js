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
        "doctorName":"黄三1",
        "deptId":"2222",
        "deptName":"内科1",
        "doctorSex":"M",
        "doctorImg":"xxxxx",
        "doctorTitle":"专家"
      },
      {
        "hisId":"111",
        "doctorId":"124",
        "doctorName":"黄二1",
        "deptId":"2222",
        "deptName":"内科2",
        "doctorSex":"F",
        "doctorImg":"xxxxx",
        "doctorTitle":"普通"
      },
      {
        "hisId":"111",
        "doctorId":"124",
        "doctorName":"黄二1",
        "deptId":"2222",
        "deptName":"内科2",
        "doctorSex":"F",
        "doctorImg":"xxxxx",
        "doctorTitle":"普通"
      },
      {
        "hisId":"111",
        "doctorId":"124",
        "doctorName":"黄二1",
        "deptId":"2222",
        "deptName":"内科2",
        "doctorSex":"F",
        "doctorImg":"xxxxx",
        "doctorTitle":"普通"
      },
      {
        "hisId":"111",
        "doctorId":"124",
        "doctorName":"黄二1",
        "deptId":"2222",
        "deptName":"内科2",
        "doctorSex":"F",
        "doctorImg":"xxxxx",
        "doctorTitle":"普通"
      }
    ]
  };

  setTimeout(function () {
    res.send(json);
  }, Math.random() * 3000);
};
