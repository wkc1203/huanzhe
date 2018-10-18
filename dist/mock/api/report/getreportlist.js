module.exports = function (req, res, next) {
  var json = {
    code: 0,
    msg: null,
  };

  json.data = {
    patientId: 1,
    reportList: [
      {
        reportId: "110",
        reportName: "检查报告",
        reportStatus: '1',
        reportStatusName: "已发布",
        reportTime: "2017-02-07 12:33:55",
        reportType: 1
      },
      {
        reportId: "111",
        reportName: "测试报告3",
        reportStatus: '0',
        reportStatusName: "送检中",
        reportTime: "2017-02-07 12:33:55",
        reportType: 1
      },
      {
        reportId: "111",
        reportName: "测试报告4",
        reportStatus: '1',
        reportStatusName: "已发布",
        reportTime: "2017-02-07 12:33:55",
        reportType: 2
      }
    ]
  };

  setTimeout(function () {
    res.send(json);
  }, Math.random() * 300);
};


