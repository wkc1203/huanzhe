/**
 * @todo 使用 node 代理时, 有两个问题需要验证下
 * 1. 使用『测试环境』ip 地址时, 无法代理【已修复】
 * 2. 当请求头的 content-type: application/json 时, 失败
 */
// 测试服务器地址
var PROXY_DOMAIN = {
	host: 'ssmp.med.gzhc365.com', // api域名或者ip地址
	port: '443'	//端口号
};

var http;
var querystring = require('querystring');
if(PROXY_DOMAIN.port == '443'){
	http = require('https');
}else{
	http = require('http');
}

module.exports = function (req, res, next) {
	var body = req.body;
	var query = req.query;
	var method = req.method;
	var originUrl = req.originalUrl;
	var cookies = req.get('Cookie') || '';

	// res.send({
	// 	url: originUrl,
	// 	method: method,
	// 	query: query,
	// 	data: body,
	// 	cookies: cookies,
	// });
	// return;
	reqwest({
		url: originUrl,
		method: method,
		query: query,
		data: body,
		cookies: cookies,
		onSuccess: function (json) {
			var cookies = json.header['set-cookie'] || [];

			cookies.forEach(function (val) {
				var cookie = val.split(';')[0].split('=');
				res.cookie(cookie[0], cookie[1]);
			});

			res.send(json.statusCode, json.body);
		},
		onError: function (err) {
			res.send(err);
		}
	});
};

function reqwest(options) {
	var data;

	data = querystring.stringify(options.data || {});

	var req = http.request({
		hostname: PROXY_DOMAIN.host,
		port: PROXY_DOMAIN.port,
		path: options.url,
		method: options.method,
		rejectUnauthorized: false,
		headers: {
			"Content-Type": options['contentType'] || 'application/x-www-form-urlencoded',
			"Content-Length": data.length || 0,
			"Cookie": options.cookies || ''
		}
	}, function (res) {
		var resData = '';

		res.on('data', function (chunk) {
			resData += chunk;
		});

		res.on('end', function () {
			options.onSuccess({
				statusCode: res.statusCode,
				header: res.headers,
				body: res.statusCode == '200' ? JSON.parse(resData) : ""
			});
		});
	});

	req.on('error', function (e) {
		options.onError(e.message);
	});

	req.write(data);

	req.end();
}

