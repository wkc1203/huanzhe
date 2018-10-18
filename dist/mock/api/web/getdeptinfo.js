module.exports = function (req, res, next) {
  var json = {
    code: 0,
    msg: null,
  };

  json.data = {

    "deptName": "科室",
    "address": "地址",
    "tel": "1332552525",
    "summary": "栗震亚，男，1981年华西医科大学口腔医学院研究生毕业，硕士。国际牙医师学院院士，甘肃省优秀专家。主任医师，教授，兰州大学硕士研究生导师，中华医学会甘肃省分会副会长，中华口腔医学会理事，甘肃省口腔分会主任委员，全国政协委员，甘肃省政协副主席，农工党甘肃省委员会主任委员。"
  };

  setTimeout(function () {
    res.send(json);
  }, Math.random() * 300);
};
