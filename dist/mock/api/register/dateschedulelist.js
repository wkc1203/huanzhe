module.exports = function (req, res, next) {
  var json = {
    code: 0,
    msg: null,
  };

  json.data = {
    "scheduleList": [
      {
        "doctorId": "22211",
        "deptId": "32",
        "hisId": 2,
        "scheduleDate": "2017-01-24",
        "weekDate": "二",
        "monthDay": "24",
        "status": "2",
        "statusName": "出诊",
        "selected": "true"
      },
      {
        "doctorId": "22211",
        "deptId": "32",
        "hisId": 2,
        "scheduleDate": "2017-01-25",
        "weekDate": "三",
        "monthDay": "25",
        "status": "2",
        "statusName": "满",
        "selected": "false"
      },
      {
        "doctorId": "22211",
        "deptId": "32",
        "hisId": 2,
        "scheduleDate": "2017-01-26",
        "weekDate": "四",
        "monthDay": "26",
        "status": "1",
        "statusName": "满",
        "selected": "false"
      },
      {
        "doctorId": "22211",
        "deptId": "32",
        "hisId": 2,
        "scheduleDate": "2017-01-27",
        "weekDate": "五",
        "monthDay": "27",
        "status": "1",
        "statusName": "满",
        "selected": "false"
      },
      {
        "doctorId": "22211",
        "deptId": "32",
        "hisId": 2,
        "scheduleDate": "2017-01-28",
        "weekDate": "四",
        "monthDay": "28",
        "status": "2",
        "statusName": "满",
        "selected": "false"
      },
      {
        "doctorId": "22211",
        "deptId": "32",
        "hisId": 2,
        "scheduleDate": "2017-01-29",
        "weekDate": "四",
        "monthDay": '29',
        "status": "1",
        "statusName": "满",
        "selected": "false"
      },
      {
        "doctorId": "22211",
        "deptId": "32",
        "hisId": 2,
        "scheduleDate": "2017-01-30",
        "weekDate": "四",
        "monthDay": "30",
        "status": "2",
        "statusName": "满",
        "selected": "false"
      },
      {
        "doctorId": "22211",
        "deptId": "32",
        "hisId": 2,
        "scheduleDate": "2017-01-31",
        "weekDate": "四",
        "monthDay": "31",
        "status": "2",
        "statusName": "满",
        "selected": "false"
      },
      {
        "doctorId": "22211",
        "deptId": "32",
        "hisId": 2,
        "scheduleDate": "2017-02-01",
        "weekDate": "四",
        "monthDay": "01",
        "status": "1",
        "statusName": "满",
        "selected": "false"
      },
      {
        "doctorId": "22211",
        "deptId": "32",
        "hisId": 2,
        "scheduleDate": "2017-02-02",
        "weekDate": "四",
        "monthDay": "02",
        "status": "2",
        "statusName": "满",
        "selected": "false"
      }
    ]
  };

  setTimeout(function () {
    res.send(json);
  }, Math.random() * 300);
};
