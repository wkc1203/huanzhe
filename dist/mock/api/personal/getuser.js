module.exports = function (req, res, next) {
  var json = {
    code: 0,
    msg: 'null',
    data: {
      realName: '罗*',
      idNumber: '4***********2',
      idType: 1,
    },
  };

  setTimeout(() => {
    res.send(json);
  }, 100);

};
