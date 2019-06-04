module.exports = function (req, res, next) {
  var json = {
    code: 0,
    msg: null,
  };

  json.data = {
    "patientName":"刘某某",
    "patCardNo":"333333_2",
    "patCardType":1,
    "parentName":"刘父",
    "hisName":"广妇儿",
    "deptName":"内科",
    "doctorName":"王二",
    "visitDate":"2017-02-12",
    "visitPeriod":1,
    "visitWeekName":"星期三",
    "visitBeginTime":"08:00",
    "visitEndTime":"08:30",
    "hisOrderNo":"22222222",
    "leftPayTime": 900,
    "orderId":"33333333",
    "agtOrdNum":"123242123242123242123242123242123242123242",
    "bizType":"1",
    "bizName":"当班挂号",
    "visitPosition":"三楼",
    "visitQueue":21,
    "waitTime":"08:00",
    "totalFee":200,
    "totalRealFee":200,
    "orderTime":"2017-01-24 14:21:33",
    "payedTime":"2017-01-24 14:21:33",
    "status":"L",
    "statusName":"挂号成功",
    "stopFlag":0,
    "patientHealthStatus":1,
    "canCancelFlag":1,
    "canPayFlag":1,
    "cancelTime":"2017-01-24 14:21:33",
    "errorMsg":"重复挂号",
    "refundStatus":1,
    "refundList": [
      {
        "refundStatus":1,
        "refundStatusName":"退款中",
        "refundDesc":"取消挂号退款",
        "fefundFee":100,
        "refundTime":"2017-01-24 14:21:33",
        "refundSuccessTime":"2017-01-24 14:21:33",
        "refundSerialNo":"33333",
        "hisSerialNo":"23335"
      }
    ]
  };

  setTimeout(function () {
    res.send(json);
  }, Math.random() * 300);
};
