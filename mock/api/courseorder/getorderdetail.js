module.exports = function (req, res, next) {
  var json = {
    code: 0,
    msg: null,
  };

  json.data = {
    orderId: ~~(Math.random() * 100000),
    orderStatus: 'S',
    courseName: '�γ����ֻ�����ͶӰ���ֻ�����ͶӰ����',
    imageUrl: '',
    teacher: 'XXX',
    canPersonSum: 15,
    personSum: 10,
    classAddress: 'XXXXXXX',
    canPersonSum: 15,
    courseType: 1,
    classTime: '2017-01-20',
    courseContent: '�γ����ֻ�����ͶӰ���ֻ�����ͶӰ���ֿγ����ֻ�����ͶӰ���ֻ�����ͶӰ���ֿγ����ֻ�����ͶӰ���ֻ�����ͶӰ���ֿγ����ֻ�����ͶӰ���ֻ�����ͶӰ����',
  };

  setTimeout(function () {
    res.send(json);
  }, Math.random() * 3000);
};
