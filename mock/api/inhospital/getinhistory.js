module.exports = function (req, res) {
  var json = {
    code: 0,
    msg: null,
  };

  json.data = {
    "inHistoryList": [
      {
        "admissionNum":"4124232144124",
        "patientName":"张三"
      },
      {
        "admissionNum":"4124232144124",
        "patientName":"李大拿"
      }
    ]
  };

  setTimeout(function () {
    res.send(json);
  }, Math.random() * 300);
};
