module.exports = function (req, res, next) {
  var json = {
    code: 0,
    msg: null,
  };

  json.data = {
    patientName: '周小小',
    patCardNo: '1345466',
    option: '建议复查',
    checkId: '12304445',
    checkMethod: 'x光',
    checkName: '血糖检测报告',
    checkPart: '腹部',
    checkSituation: '腹部有积液，回声不均匀，呈现各种症状，腹部有积液，回声不均匀，呈现各种症状',
    deptName: '呼吸科',
    doctorName: '周大鹏',
    advice: '医嘱项目',
    reportTime: '2017-02-07 12:33:55',
    patSex: 'F',
    patAge: 18
  };

  setTimeout(function () {
    res.send(json);
  }, Math.random() * 3000);
};



