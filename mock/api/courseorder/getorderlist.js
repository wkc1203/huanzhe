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
				status: 1,
				orderId: '1234567891',
			},
			{
				id: ~~(Math.random() * 100000),
				courseName: '�γ����ֻ�����ͶӰ���ֻ�����ͶӰ����2',
				imageUrl: '',
				personSum: 10,
				canPersonSum: 15,
				classTime: '2017-01-22',
				status: 2,
				orderId: '1234567892',
			},
			{
				id: ~~(Math.random() * 100000),
				courseName: '�γ����ֻ�����ͶӰ���ֻ�����ͶӰ����3',
				imageUrl: '',
				personSum: 15,
				canPersonSum: 15,
				classTime: '2017-01-25',
				status: 3,
				orderId: '1234567893',
			},
			{
				id: ~~(Math.random() * 100000),
				courseName: '�γ����ֻ�����ͶӰ���ֻ�����ͶӰ����3',
				imageUrl: '',
				personSum: 15,
				canPersonSum: 15,
				classTime: '2017-01-25',
				status: 4,
				orderId: '1234567894',
			},
			{
				id: ~~(Math.random() * 100000),
				courseName: '�γ����ֻ�����ͶӰ���ֻ�����ͶӰ����3',
				imageUrl: '',
				personSum: 15,
				canPersonSum: 15,
				classTime: '2017-01-25',
				status: 5,
				orderId: '1234567895',
			},
		];

	setTimeout(function () {
		res.send(json);
	}, Math.random() * 3000);
};
