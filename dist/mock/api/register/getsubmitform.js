module.exports = function (req, res, next) {
  var json = {
    code: 0,
    msg: null,
  };

  json.data = {
    "hisName":"广妇儿",
    "totalFee":200,
    "bizType":"2",
    "leftPayTime":90,
    "bizName":"当班挂号",
    "deptName":"内科",
    "doctorName":"王二",
    "patientName":"刘某某",
    "patCardNo":"333333",
    "patCardType":1,
    "scheduleDate":"2017-02-10",
    "visitPeriod":1,
    "visitBeginTime":"08:00",
    "visitEndTime":"08:30",
    "sign":"xxxxxx",
    "payData":"xxxxxxxx",
    "visitWeekName":"星期三",
  };

  setTimeout(function () {
    res.send(json);
  }, Math.random() * 300);
};
