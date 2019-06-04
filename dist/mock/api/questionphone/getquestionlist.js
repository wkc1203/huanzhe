module.exports = function (req, res, next) {
  var json = {
    code: 0,
    msg: '错是',
  };

  json.data = {
    patientId: 1,
    questionList: [
      {
        examId: "110",
        examTitle: "问卷标题1",
        beginTime: "2017-02-07",
        endTime: "2017-03-07",
        issTime: "2017-03-07"
      },
      {
        examId: "111",
        examTitle: "问卷标题2",
        beginTime: "2017-02-07",
        endTime: "2017-03-08",
        issTime: "2017-03-07"
      },
    ]
  };

  setTimeout(function () {
    res.send(json);
  }, Math.random() * 300);
};


