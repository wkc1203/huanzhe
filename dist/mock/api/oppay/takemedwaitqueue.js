module.exports = function (req, res, next) {
  var json = {
    code: 0,
    msg: null,
  };

  json.data = {
    patientId: 2,
    patientName: '王泽天',
    patCardNo: '0232343',
    waitList:[
      {
        queueId: '111',
        pharmacyName: '西药房',
        pharmacyAddress: '门诊大厅一楼',
        windowNo: '取药窗口',
        waitTime: '15分钟',
        frontWaitNum: 10
      },
      {
        queueId: '3',
        pharmacyName: '中药房',
        pharmacyAddress: '门诊大厅二楼',
        windowNo: '取药窗口',
        waitTime: '20分钟',
        frontWaitNum: 10
      }
    ]
  };

  setTimeout(function () {
    res.send(json);
  }, Math.random() * 3000);
};