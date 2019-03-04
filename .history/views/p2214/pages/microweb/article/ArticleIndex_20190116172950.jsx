import React, { Component } from 'react';
import { Button, Toptips } from 'react-weui';
import Connect from '../../../components/connect/Connect';
import Link from 'react-router/lib/Link';
import * as Api from './articleIndexApi';
import './style/index.scss';
import hashHistory from 'react-router/lib/hashHistory';
class Widget extends Component {
  static contextTypes = {
    router: React.PropTypes.object,
  };
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  componentDidMount() {
     this.getJs();
  }
  getJs(){
    Api
        .getJsApiConfig({url:window.location.href.substring(0,window.location.href.indexOf("#"))})
        .then((res) => {
          if(res.code==0){
            //写入b字段
            console.log("str",res.data);
            wx.config({
              debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
              appId:res.data.appId, // 必填，公众号的唯一标识
              timestamp:res.data.timestamp, // 必填，生成签名的时间戳
              nonceStr:res.data.noncestr, // 必填，生成签名的随机串
              signature:res.data.signature,// 必填，签名
              jsApiList: ['hideMenuItems','showMenuItems'] // 必填，需要使用的JS接口列表
            });
            wx.ready(function(){
              // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
              wx.showMenuItems({
                menuList: ["menuItem:copyUrl","menuItem:openWithQQBrowser","menuItem:share:appMessage", "menuItem:share:timeline"
                  ,"menuItem:share:qq","menuItem:share:weiboApp","menuItem:favorite","menuItem:share:QZone",
                  "menuItem:openWithSafari"] // 要显示的菜单项，所有menu项见附录3
              });
            });

          }
        }, (e) => {
        });
  }
  componentWillUnmount() {
    // 离开页面时结束所有可能异步逻辑

  }

  render() {
    return (
        <div>   <div className="home"><span className="jian"
                                            onClick={()=>{
                                      this.context.router.push({
                                       pathname:'microweb/news'
                                      })
                                      }}
            ></span>新闻公告
        </div>
        <div className="page-artical">

          <div className="artical-title">2018年“两江国际儿科论坛”在重庆隆重举行！</div>
          <div className="artical-time">时间：2018-07-03</div>
          <div className="artical-content">
            <div className="content-item">2018年6月22日上午8点，由重庆医科大学附属儿童医院、儿科药学杂志、中华医学会儿科学分会、西部儿科发展联盟联合主办的“2018两江国际儿科论坛”在重庆渝州国宾馆隆重开幕。</div>
            <div className="content-item">论坛汇集国内外顶尖专家，来自中国科学院徐涛院士、美国、英国等国内外的14名知名院士专家，以及儿童医院院长，1000多名儿科代表参加会议，围绕“儿童健康——新时代，新问题，新思路”的主题展开讨论，共同交流儿科领域研究的最新成果。</div>
            <div className="content-item">国家卫生健康委科教司规划处刘桂生处长、重庆市卫计委副主任傅仲学、上海交通大学医学院附属新华医院孙锟教授、重庆医科大学校长黄爱龙教授等出席会议。</div>
            <div className="content-item">开幕式由重医儿童医院党委书记董志主持。</div>
            <div className="content-item">大会主席、重医儿童医院李秋院长发表热情洋溢的致辞，她代表儿童医院对各位领导、专家、学者等表示热烈欢迎。她概述医院的简介，重医儿童医院在全国最佳医院排行榜中位居全国儿童医院第三位，在中国医院科技影响力排行榜中居儿科学第三位，科研产出居全国儿童医院前列。</div>
            <div className="content-item">本次论坛旨在搭建儿科重要疾病病因、病理机制和精准医疗交流的平台，邀请到国内外知名院士专家作精彩报告。大会还将关注儿童肾脏、儿童神经、青春期、儿童感染、儿外科疾病和儿科护理等相关问题，并同时召开城际儿科会。为国内外儿科同行提供相互学习、共同提高的一次盛会，必将促进我国儿科、尤其西部儿科事业的发展。</div>
            <div className="content-item">国家卫生健康委科教司规划处刘桂生处长讲话，他指出儿童健康是全民健康的基础，是经济社会可持续发展的重要保障。党中央、国务院和国家卫健委高度重视儿童健康事业，十九大报告中，提出健康中国的战略。习近平总书记再次强调，儿童健康事关家庭幸福和民族的未来，要加强儿童医疗卫生服务改革与发展，加强儿科医务人员培养和队伍建设，对卫生健康领域做出新的部署。</div>
            <div className="content-item">重医儿童医院为西部地区乃至全国的儿童健康事业的发展做出了重要贡献，希望专家们在本次论坛交流中，发现科技创新、人才培养中的问题，探讨分析原因，为破解问题提出真知灼见，共同推动儿童健康事业的发展，推动健康中国目标的实现。</div>
            <div className="content-item">中国医师协会儿科分会会长、上海交通大学医学院附属新华医院孙锟教授发言，他代表中国医师协会儿科分会向大会召开表示热烈祝贺。重医儿童医院一直立足重庆，服务西部，面向全国，为西部儿科事业作出杰出贡献。</div>
            <div className="content-item">重医儿童医院重视继续教育工作、规范化培训工作，是全国儿科唯一的住院医师规范化培训示范基地，为全国儿科医生的培养作出积极贡献。同时，长期坚持不懈抓学术研究和学术交流，众多专家活跃在全国学术讲台上。重医儿童医院的两江国际儿科论坛，已成为国内儿科届非常响亮的品牌，每年都会吸引国内外知名专家参会，加强交流，提升学术共识，共同为中国的儿科事业做出贡献。</div>
            <div className="content-item">重庆市卫计委傅仲学副主任讲话，重庆市紧紧围绕习近平总书记为重庆提出的“两点定位”和“两地”“两高”的目标，“四个扎实”要求，把人民健康放在优先发展的战略地位，扎实推动“健康中国”战略重庆实践。为促进儿童安全和健康全面发展，市卫计委着力完善儿童健康体系，加强儿科队伍建设，全力推动儿科事业发展。</div>
            <div className="content-item">重医儿童医院作为综合性儿童医疗机构排头兵，极大促进了西部儿科事业的发展与繁荣。希望专家多分享儿科前沿知识，希望重庆儿科医务人员虚心学习，紧跟国际儿科发展潮流，共同为促进我国儿科事业发展做出贡献。</div>
            <div className="content-item">重庆医科大学黄爱龙校长讲话，他代表重庆医科大学，对各位来宾表示诚挚欢迎，向论坛的召开表示热烈祝贺！学校一直将儿科学人才培养放在显要位置。学校对儿科学的高度重视，以及一代代儿院人的不懈奋斗，儿童医院的医教研工作一直走在全国前列，人才培养规模全国第一，培养质量全国领先。</div>
            <div className="content-item">今年的论坛，汇集国内外顶尖的专家学者，交流前沿研究成果、分享先进诊疗技术，促进国际交流与合作，提高临床研究水平和科研创新能力，希望国内外专家学者共同努力，将“两江国际儿科论坛”办成国内外有影响力的学术活动品牌和特色的学术交流平台。</div>
            <div className="content-item">论坛上，国家卫生健康委科教司规划处刘桂生处长，中国科学院徐涛院士、英国伦敦大学学院阮雄中教授、上海交通大学医学院附属新华医院孙锟教授、重庆医科大学附属儿童医院赵晓东教授等国内知名教授，以及美国Robot Mak教授、英国Kjell Tullus、、新加坡Yap Hui Kim教授等，聚焦国内外前沿最新医学科研成果，紧跟国际儿科医学研究方向和潮流，带来了精彩演讲。</div>
            <div className="content-item">本次论坛设一个主旨论坛及7个分论坛（儿科城际学术会议暨西部儿科论坛、儿童肾脏疾病分论坛、儿童神经疾病分论坛、青春期疾病分论坛、儿童感染性疾病分论坛、小儿外科疾病分论坛、儿童护理分论坛）。</div>
            <div className="content-item">“两江国际儿科论坛”是由重医儿童医院创建的一个定期、开放性的国际学术会议交流平台，以平等合作、互利共赢、共同发展为主旨，推动中国儿科与世界一流大学、研究机构和医院的交流、协同与合作，不断提高儿科临床研究和科技创新的能力，全面推动儿科医学的发展，已经成为中国儿科极具影响力的学术论坛之一。</div>
            <div className="content-item">为适应新形势下医疗改革的需要，弥补和解决当前中西部儿科医学发展中的短板和问题，共同推进中西部儿童健康的全面发展，重医儿童医院举办2018两江国际儿科论坛，将携手国内外儿科同道，为推进儿科医学科学的发展做出新的更大的贡献。</div>
          </div>
        </div>
        </div>
    );
  }
}
export default Connect()(Widget);