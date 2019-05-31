module.exports = function (req, res) {
  var json = {
    code: 0,
    msg: null,
  };

  json.data = {
    "admissionNum": "214124213123",
    "deptName": "口腔颌面外科住院",
    "hisName": "广西区人民医院",
    "orderId": "1701180000200000011",
    "patientName": "刘廷燕",
    "payFee": 2,
    "bizType": "住院缴费",
    "payData": {
      "appId": "123",
      "bizOrderId": "1",
      "bizType": "inpatient",
      "body": "广东中西医结合耳鼻喉科",
      "hisId": 2,
      "hisOrderNo": "",
      "totalFee": 1
    },
    "sign": "D69D122B783A73AC018FC1559FA50CF0"
  };

  setTimeout(function () {
    res.send(json);
  }, Math.random() * 300);
};
