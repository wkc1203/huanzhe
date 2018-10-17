module.exports = function (req, res, next) {
  var json = {
    code: 0,
    msg: null,
  };

  json.data = {
    "doctorList": [
      {
        "doctorId":"123",
        "doctorName":"黄三22221",
        "deptId":"2222",
        "deptName":"内科",
        "doctorLevel":"1",
        "doctorSex":"M",
        "doctorTitle":"专家",
        "doctorImg":"xxxxx",
        "doctorSkill":"擅长xxxxxxx"
      },
      {
        "doctorId":"124",
        "doctorName":"黄二",
        "deptId":"2222",
        "deptName":"内科",
        "doctorLevel":"2",
        "doctorSex":"F",
        "doctorTitle":"普通",
        "doctorImg":"xxxxx",
        "doctorSkill":"擅长xxxxxxx"
      }
    ]
  };

  setTimeout(function () {
    res.send(json);
  }, Math.random() * 300);
};
