module.exports = function (req, res, next) {
  var json = {
    code: 0,
    msg: null,
  };

  json.data = [
    {
      id: ~~(Math.random() * 100000),
      courseName: '�γ����ֻ�����ͶӰ���ֻ�����ͶӰ����',
      imageUrl: '',
      personSum: 10,
      canPersonSum: 15,
      classTime: '2017-01-20',
      status: 5,
    },
    {
      id: ~~(Math.random() * 100000),
      courseName: '�γ����ֻ�����ͶӰ���ֻ�����ͶӰ����2',
      imageUrl: '',
      personSum: 10,
      canPersonSum: 15,
      classTime: '2017-01-22',
      status: 5,
    },
    {
      id: ~~(Math.random() * 100000),
      courseName: '�γ����ֻ�����ͶӰ���ֻ�����ͶӰ����3',
      imageUrl: '',
      personSum: 15,
      canPersonSum: 15,
      classTime: '2017-01-25',
      status: 3,
    },
    {
      id: ~~(Math.random() * 100000),
      courseName: '�γ����ֻ�����ͶӰ���ֻ�����ͶӰ����3',
      imageUrl: '',
      personSum: 15,
      canPersonSum: 15,
      classTime: '2017-01-25',
      status: 5,
    },
    {
      id: ~~(Math.random() * 100000),
      courseName: '�γ����ֻ�����ͶӰ���ֻ�����ͶӰ����3',
      imageUrl: '',
      personSum: 15,
      canPersonSum: 15,
      classTime: '2017-01-25',
      status: 5,
    },
  ];

  setTimeout(function () {
    res.send(json);
  }, Math.random() * 3000);
};
