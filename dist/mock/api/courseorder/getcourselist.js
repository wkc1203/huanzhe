module.exports = function (req, res, next) {
	var json = {
		code: 0,
		msg: null,
		currentPage: 1,
		totalPage: 5,
	};

	json.data = [
			{
				id: ~~(Math.random() * 100000),
				courseName: '课程名字会议室投影室咧会议室投影室咧',
				imageUrl: '',
				personSum: 10,
				canPersonSum: 15,
				classTime: '2017-01-20',
				status: 1,
			},
			{
				id: ~~(Math.random() * 100000),
				courseName: '课程名字会议室投影室咧会议室投影室咧2',
				imageUrl: '',
				personSum: 10,
				canPersonSum: 15,
				classTime: '2017-01-22',
				status: 2,
			},
			{
				id: ~~(Math.random() * 100000),
				courseName: '课程名字会议室投影室咧会议室投影室咧3',
				imageUrl: '',
				personSum: 15,
				canPersonSum: 15,
				classTime: '2017-01-25',
				status: 3,
			},
			{
				id: ~~(Math.random() * 100000),
				courseName: '课程名字会议室投影室咧会议室投影室咧3',
				imageUrl: '',
				personSum: 15,
				canPersonSum: 15,
				classTime: '2017-01-25',
				status: 4,
			},
			{
				id: ~~(Math.random() * 100000),
				courseName: '课程名字会议室投影室咧会议室投影室咧3',
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
