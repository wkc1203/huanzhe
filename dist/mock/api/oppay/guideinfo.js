module.exports = function (req, res, next) {
  var json = {
    code: 0,
    msg: null,
  };

  json.data = {
    "patCardNo":"02033990",
    "patientName":"张志明",
    "items": [
      {
        "name":"化验",
        "executeDept":"检验科",
        "executePlace":"二楼"
      },
      {
        "name":"检验",
        "executeDept":"检验科",
        "executePlace":"二楼"
      }
    ]
  };

  setTimeout(function () {
    res.send(json);
  }, Math.random() * 300);
};
