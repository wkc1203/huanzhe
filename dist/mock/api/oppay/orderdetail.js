module.exports = function (req, res, next) {
  var json = {
    code: 0,
    msg: null,
  };

  json.data = {
    "hisName":"广西区人民医院",
    "bizType":"outpatient",
    "bizName":"门诊缴费",
    "deptName":"内科",
    "doctorName":"黄二",
    "patientName":"小二",
    "patCardNo":"22222222",
    "status":"S",
    "statusName":"成功",
    "date":"2017-01-12",
    "totalRealFee":300,
    "totalFee":300,
    "selfFee":300,
    "medicalFee":0,
    "hisOrderNo":"222222222222222",
    "orderId":"1111111",
    "payStatus":1,
    "payedTime":"2017-01-20 13:22:12",
    "agtOrdNum":"3444444444444444444",
    "refundStatus":"2",
    "errorMsg":"失败信息",
    "chargeType":"自费",
    "prescriptionType":"药品",
    "guideInfo":"门诊1楼2号窗口取药",
    "refundList": [
      {
        "refundStatus":1,
        "refundStatusName":"退款中",
        "refundDesc":"取消挂号退款",
        "fefundFee":100,
        "refundTime":"2017-01-24 14:21:33",
        "refundSuccessTime":"2017-01-24 14:21:33",
        "refundSerialNo":"33333",
        "hisSerialNo":"23335"
      }
    ],
    "itemList": [
      {
        "itemName":"",
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
        "itemName":"",
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
