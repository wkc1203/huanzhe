module.exports = function (req, res, next) {
  var json = {
    code: 0,
    msg: null,
  };

  json.data = {
    patientName: '周小小',
    patCardNo: '1345466',
    inspectId: '12304445',
    inspectName: '血常规',
    deptName: '检验科',
    doctorName: '周大斌',
    reportTime: '2017-02-07 12:33:55',
    patSex: 'F',
    patAge: 18,
    items:[
      {
        itemNumber: '1',
        itemName: '红细胞',
        itemEngName: 'red-cell',
        itemUnit: '%',
        itemInstrument: '血压计',
        remark: '偏高',
        result: '0.9',
        status: '阳',
        refRange: '0.1-0.8',
        abnormal: 1,
      },
      {
        itemNumber: '2',
        itemName: '白细胞',
        itemEngName: 'white-cell',
        itemUnit: '%',
        itemInstrument: '血压计',
        remark: '偏低',
        result: '0.8',
        status: '阳',
        refRange: '0.8-1.0',
        abnormal: 2,
      },
      {
        itemNumber: '3',
        itemName: '血红蛋白',
        itemEngName: 'white-cell',
        itemUnit: '%',
        itemInstrument: '血压计',
        remark: '偏低',
        result: '0.8',
        status: '阳',
        refRange: '0.8-1.0',
        abnormal: 3,
      }
    ]
  };

  setTimeout(function () {
    res.send(json);
  }, Math.random() * 3000);
};
