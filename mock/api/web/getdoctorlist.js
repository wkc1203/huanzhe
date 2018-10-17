module.exports = function (req, res, next) {
  var json = {
    code: 0,
    msg: null,
  };

  json.data = {
    "doctorlist": [
      {
        "doctorId": "1",
        "doctorName": "医生名称",
        "doctorTitle": "医生名称",
        "summary": "医生简介"
      },
      {
        "doctorId": "2",
        "doctorName": "医生名称2",
        "doctorTitle": "医生名称2",
        "summary": "医生简介2"
      }
    ]
  };

  setTimeout(function () {
    res.send(json);
  }, Math.random() * 300);
};
