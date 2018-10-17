module.exports = function (req, res, next) {
  var json = {
    code: 0,
    msg: null,
  };

  json.data = {
    "visitNum":2,
    "registerNum":2,
    'scheduleDate': req.body.scheduleDate,
    "doctorList": [
      {
        "doctorId":"123",
        "doctorName":"黄三"+ req.body.scheduleDate,
        "deptId":"2222",
        "deptName":"内科",
        "doctorLevel":"1",
        "doctorSex":"M",
        "doctorTitle":"专家",
        "doctorImg":"xxxxx",
        "doctorSkill":"擅长xxxxxxx",
        "leftSource":10,
        "totalSource":14,
        "status":1,
        "registerFee":100
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
        "doctorSkill":"擅长xxxxxxx",
        "leftSource":20,
        "totalSource":30,
        "status":1,
        "registerFee":100
      },
      {
        "doctorId":"124",
        "doctorName":"黄二1111",
        "deptId":"2222",
        "deptName":"内科",
        "doctorLevel":"2",
        "doctorSex":"F",
        "doctorTitle":"普通",
        "doctorImg":"xxxxx",
        "doctorSkill":"擅长xxxxxxx",
        "leftSource":0,
        "totalSource":30,
        "status":1,
        "registerFee":100
      }
    ]
  };

  setTimeout(function () {
    res.send(json);
  }, Math.random() * 300);
};

