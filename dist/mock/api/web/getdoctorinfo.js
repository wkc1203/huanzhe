module.exports = function (req, res, next) {
  var json = {
    code: 0,
    msg: null,
  };

  json.data = {
    "doctorId": "1",
    "doctorName": "医生名称",
    "doctorTitle": "医生头衔",
    "doctorImg": "http://xx.com/2.jpg",
    "qrcodeUrl": "http://www.baidu.com/1.jpg",
    "isFavorites": "0",
    "desc": "描述，描述",
    "summary": "描述"
  };

  setTimeout(function () {
    res.send(json);
  }, Math.random() * 300);
};
