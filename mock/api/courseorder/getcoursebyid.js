module.exports = function (req, res, next) {
  var json = {
    code: 0,
    msg: null,
  };

  json.data = {
    id: ~~(Math.random() * 100000),
    courseName: '课程名字会议室投影室咧会议室投影室咧',
    imageUrl: '',
    teacher: 'XXX',
    canPersonSum: 15,
    personSum: 10,
    classAddress: 'XXXXXXX',
    canPersonSum: 15,
    courseType: 1,
    classTime: '2017-01-20',
    courseContent: '课程名字会议室投影室咧会议室投影室咧课程名字会议室投影室咧会议室投影室咧课程名字会议室投影室咧会议室投影室咧课程名字会议室投影室咧会议室投影室咧',
  };

  setTimeout(function () {
    res.send(json);
  }, Math.random() * 3000);
};
