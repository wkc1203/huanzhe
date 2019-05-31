module.exports = function (req, res, next) {
  var json = {
    code: 0,
    msg: null,
  };

  json.data = {
    leftBindNum: 2,
    cardList: [
      {
        patientId: 1,
        idNo: '5115271984****4868',
        patientMobile: '187****1234',
        idType: 1,
        bindStatus: 1,
        relationName: '他人',
        isDefault: 1,
        patCardNo: '02333111',
        patCardType: 21,
        patientName: '张志明',
        patientSex: 'F',
        isSelf: 1
      },
      {
        patientId: 2,
        idNo: '5115271984****4868',
        patientMobile: '187****1234',
        idType: 1,
        bindStatus: 1,
        relationName: '他人',
        isDefault: 0,
        patCardNo: '00000001',
        patCardType: 21,
        patientName: '测试2',
        patientSex: 'F',
        isSelf: 1
      }
    ]
  };

  setTimeout(function () {
    res.send(json);
  }, Math.random() * 300);
};


