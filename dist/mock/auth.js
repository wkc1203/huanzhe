module.exports = function (req, res, next) {
	var body = req.body;
	var query = req.query;
	var method = req.method;
	var originUrl = req.originalUrl;
	var cookies = req.get('Cookie') || '';

	if(query.cookieKey && query.cookieVal){
		res.cookie(query.cookieKey,query.cookieVal);
		res.send({
			msg: 'cookie生成成功'
		});
	}else{
		res.send({
			msg: '授权链接错误，cookie生成失败'
		});
	}
};

