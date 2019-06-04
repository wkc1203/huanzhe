module.exports = function (req, res, next) {
  var json = {
    code: 0,
    msg: null,
  };

  json.data = [
    {
      "deptId":"1",
      "deptName":"神经内科",
      "doctorId":"1",
      "doctorName":"谭祥干",
      "hisId":1,
      "imgUrl":"www.baidu.com",
      "doctorTitle":"主任医师",
      "doctorSex":"F"
    }
  ];

  setTimeout(function () {
    res.send(json);
  }, Math.random() * 3000);
};
