module.exports = function (req, res, next) {
  var json = {
    code: 0,
    msg: '错了',
  };

  json.data = {
    examDesc:'本次问卷调查针对广大病人及速度吃的试试看的看错了我翻了翻疯了疯了看看书的可多可少',
    examTitle: '问卷调查嗯了',
   doctorName:'秦始皇',
   deptName:'内分泌失调科',
    beginTime: '2017-03-04',
    endTime: '2017-03-07',
    releaseCompany: '海鹚',
    status: '1',
    flag: true,
    titleList: [
      {
        required: "1",
        questionsType: "0",
        questionsTitle: "我美吗？",
        maxAnswer:'2',
        titleId:1,
        optionList:[
          {
            optionContent: '美',
            optionNum: '0',
            imageUrl: './hs.jpg'
          },
          {
            optionContent: '很美',
            optionNum: '1',
            imageUrl: './hs.jpg'
          },
          {
            optionContent: '唯美',
            optionNum: '2',
            imageUrl: './hs.jpg'
          }
        ]
      },
      {
        required: "0",
        questionsType: "0",
        questionsTitle: "我帅吗？",
        titleId:2,
        optionList:[
          {
            optionContent: '帅',
            optionNum: '0',
          },
          {
            optionContent: '不帅',
            optionNum: '1',
          },
          {
            optionContent: '土包子',
            optionNum: '2',
          }
        ]
      },
      {
        required: "1",
        questionsType: "1",
        questionsTitle: "我漂亮吗？",
        maxAnswer:'2',
        titleId:3,
        optionList:[
          {
            optionContent: '漂亮',
            optionNum: '1',
            imageUrl: './hs.jpg'
          },
          {
            optionContent: '人妖级别',
            optionNum: '2',
            imageUrl: './hs.jpg'
          },
          {
            optionContent: '酷似外星人',
            optionNum: '3',
            imageUrl: './hs.jpg'
          }
        ]
      },
      {
        required: "1",
        questionsType: "2",
        questionsTitle: "我美吗？",
        maxAnswer:'2',
        titleId:4,
      },
      {
        required: "1",
        questionsType: "3",
        questionsTitle: "我美吗？",
        maxAnswer:'2',
        titleId:5,
        optionList:[
          {
            optionContent: '美',
            optionNum: '0',
          },
          {
            optionContent: '很美',
            optionNum: '1',
          },
          {
            optionContent: '另类',
            optionNum: '2',
          },
          {
            optionContent: '超凡',
            optionNum: '3',
          },
          {
            optionContent: '杀手级别',
            optionNum: '4',
          }
        ]
      }
    ]
  };

  setTimeout(function () {
    res.send(json);
  }, Math.random() * 300);
};


