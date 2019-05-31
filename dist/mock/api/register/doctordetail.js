module.exports = function (req, res, next) {
  var json = {
    code: 0,
    msg: null,
  };

  json.data = {
    "doctorId":"123",
    "doctorName":"黄三",
    "deptId":"2222",
    "deptName":"内科",
    "doctorLevel":"1",
    "doctorSex":"M",
    "doctorTitle":"专家",
    "doctorSkill":"擅长xxxxxxx",
    "doctorSummary":"XXXXXXXXXXXXXXXX",
    "doctorRemark":"暂无备注",
    "favoriteStatus":"0",
    "qrCodeUrl":"www.baidu.com"
  };

  setTimeout(function () {
    res.send(json);
  }, Math.random() * 300);
};
