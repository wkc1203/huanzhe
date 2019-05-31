module.exports = function (req, res, next) {
  var json = {
    code: 0,
    msg: null,
    data: {
      "idTypes": [
        {
          "dictKey": "1",
          "dictValue": "二代身份证"
        },
        {
          "dictKey": "2",
          "dictValue": "港澳居民身份证"
        }
      ],
      "patCards": [
        {
          "dictKey": "21",
          "dictValue": "院内就诊卡"
        },
        {
          "dictKey": "22",
          "dictValue": "市民卡"
        }
      ],
      "patientTypes": [
        {
          "dictKey": "0",
          "dictValue": "成人"
        },
        {
          "dictKey": "1",
          "dictValue": "儿童"
        }
      ],
      "relationTypes": [
        {
          "dictKey": "1",
          "dictValue": "本人"
        },
        {
          "dictKey": "2",
          "dictValue": "配偶"
        }
      ],
      "isNewCard": 1,
    },
  };

  setTimeout(function () {
    res.send(json);
  }, Math.random() * 1000);
};
