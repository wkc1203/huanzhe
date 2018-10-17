module.exports = function (req, res, next) {
  var json = {
    code: 0,
    msg: null,
  };

  json.data = {

    "hisName":"广西区人民医院",
    "deptName":"内科",
    "doctorName":"黄二",
    "patientName":"小二",
    "patCardNo":"22222222",
    "date":"2017-01-12",
    "totalFee":300,
    "selfFee":300,
    "medicalFee":0,
    "hisOrderNo":"221344",
    "patientId":"124125",
    "itemList": [
      {
        "itemName":"ccc",
        "itemUnit":"",
        "itemPrice":"",
        "itemNum":"",
        "itemSpces":"",
        "catName":"检验",
        "totalFee":"200",
        "subItemList": [
          {
            "itemName":"血常规",
            "itemUnit":"1",
            "itemPrice":"20",
            "itemNum":"10",
            "itemSpces":"",
            "catName":"",
            "totalFee":"100"
          },
          {
            "itemName":"血小板",
            "itemUnit":"1",
            "itemPrice":"100",
            "itemNum":"1",
            "itemSpces":"",
            "catName":"",
            "totalFee":"100"
          }
        ]
      },
      {
        "itemName":"cc",
        "itemUnit":"",
        "itemPrice":"",
        "itemNum":"",
        "itemSpces":"",
        "catName":"检查",
        "totalFee":"200",
        "subItemList": [
          {
            "itemName":"XX检查",
            "itemUnit":"1",
            "itemPrice":"100",
            "itemNum":"1",
            "itemSpces":"",
            "catName":"",
            "totalFee":"100"
          }
        ]
      }
    ]

  };

  setTimeout(function () {
    res.send(json);
  }, Math.random() * 300);
};
