module.exports = function (req, res) {
  var json = {
    code: 0,
    msg: null,
  };

  json.data = {
    "channelType":"011",
    "inDate": '2017-04-11',
    "isDefalut":0,
    "items": Math.random() > 0.5 ? [] : [
      {
        "itemName":"静脉注射(或静脉采血)",
        "itemNumber":"1",
        "itemPrice":"400",
        "itemSpec":"",
        "itemTotalFee":"400",
        "itemUnit":"次",
        "extFields":{},
        "childItem":[
          {
            "itemName":"子项目1",
            "itemNumber":"1",
            "itemPrice":"400",
            "itemSpec":"",
            "itemTotalFee":"400",
            "itemUnit":"次",
            "extFields":{},
            "childItem":[]
          },
          {
            "itemName":"子项目2",
            "itemNumber":"2",
            "itemPrice":"200",
            "itemSpec":"",
            "itemTotalFee":"400",
            "itemUnit":"次",
            "extFields":{},
            "childItem":[]
          }
        ]
      },
      {
        "itemName":"血细胞分析或血常规(机器法五类)",
        "itemNumber":"1",
        "itemPrice":"2000",
        "itemSpec":"",
        "itemTotalFee":"2000",
        "itemUnit":"项"
      }
    ],
    "patientId":101,
    "patientName":"伊泽",
    "relationType":1,
    "totalFee": parseInt(Math.random()*200000) + ''
  };

  setTimeout(function () {
    res.send(json);
  }, Math.random() * 300);
};
