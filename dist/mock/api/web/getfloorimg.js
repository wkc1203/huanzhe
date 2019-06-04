module.exports = function (req, res, next) {
  var json = {
    code: 0,
    msg: null,
  };

  json.data = {
    "floorImgUrl": 'http://f1.yihuimg.com/TFS/upfile/WBJ_WGW/20150811/000599_1439232906560_fullsize.jpg'
  };

  setTimeout(function () {
    res.send(json);
  }, Math.random() * 300);
};
  