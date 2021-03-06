module.exports = function (req, res) {
  var json = {
    code: 0,
    msg: null,
  };

  json.data = {
    "admissionNum":"38317",
    "balance":0,
    "bedNo":111,
    "channelType":"011",
    "consumeFee":2273331,
    "deptName":"心血管内科",
    "hisId":2,
    "hisName":"广西区人民医院",
    "patientId":1,
    "patientName":"张志明",
    "totalFee":2273331,
    "doctorName":"张三",
    "admissionWard":"在那边",
    "inhospitalRecordId": '170307020000000000001',
    "status":"5"
  };

  setTimeout(function () {
    res.send(json);
  }, Math.random() * 300);
};
