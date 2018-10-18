import React, { Component } from 'react';
import { Button, Toptips } from 'react-weui';
import Connect from '../../../components/connect/Connect';
import Link from 'react-router/lib/Link';

import * as Api from './evaluateApi';
import './style/index.scss';
class Widget extends Component {
  static contextTypes = {
    router: React.PropTypes.object,
  };
  constructor(props) {
    super(props);
    this.state = {
      config: {},
      sexOption: [
        {
          dictKey: 'M',
          dictValue: '男',
        },
        {
          dictKey: 'F',
          dictValue: '女',
        },
      ],
      viewData: {
        onSubmit: false,
        showToptips: false,
        toptips: '',
        isNewCard: '0',
        noresult: {
          msg: '暂未获取到医院配置信息',
          show: false,
        },
        isloading: 0,
      },
    };
  }
  componentDidMount() {
   
  }
  componentWillUnmount() {
    // 离开页面时结束所有可能异步逻辑

  }
  getUser() { // 获取实名制
    Api
      .getUser()
      .then((res) => {
        console.log(res);
        this.setState({ user: res.data });
      }, e=> {
        console.log(e);
      });
  }
  getHisConfig() {
    const { viewData } = this.state;
    viewData.isloading = 1;
    this.setState({ viewData });
    this.showLoading();
    Api
      .getHisConfig()
      .then((res) => {
        this.hideLoading();
        viewData.isloading = 0;
        // 添加身份证的验证规则
        res.data.idTypes = res.data.idTypes.map((v) => {
          if (v.dictKey === '1') {
            v.validator = `[{'required':'',tip:'${v.dictValue}不能为空'},{'idcard':'',tip:'${v.dictValue}格式错误'}]`;
            v.maxLength = 18;
          } else {
            v.validator = `[{'required':'',tip:'${v.dictValue}不能为空'}]`;
            v.maxLength = 30;
          }
          return v;
        });
        this.setState({ viewData, config: res.data });
      }, (e) => {
        this.hideLoading();
        this.showPopup({ content: e.msg });
        viewData.isloading = 2;
        viewData.noresult.show = true;
        this.setState({ viewData });
      });
  }
  isZfb() {
    const { platformSource } = window.CONSTANT_CONFIG;
    return platformSource == 2;
  }
  switchPatientType(v) {
    this.setState({
      patientType: v,
    });
  }
  submitData(onSubmit) {
    if (onSubmit) {
      return false;
    }
    const ret = Validator(this.refs.dataForm);
    if (ret.result.length > 0) {
      this.setState({
        showToptips: true,
        toptips: ret.result[0].tip,
      });
      this.state.errorTimer = setTimeout(() => {
        this.setState({
          showToptips: false,
        });
      }, 2000);
      return false;
    }
    const { viewData } = this.state;
    viewData.onSubmit = true;
    this.setState({ viewData });
    this.showLoading();
    Api
      .addPatients(ret.data)
      .then(() => {
        viewData.onSubmit = false;
        this.setState({ viewData });
        this.showSuccess({
          title: '绑定成功',
          duration: 1500,
          complete: ()=>{
            this.context.router.goBack();
          }
        });
      }, (e) => {
        this.hideLoading();
        this.showPopup({ content: e.msg });
        viewData.onSubmit = false;
        this.setState({ viewData });
      });
  }
  isNewCard(e) {
    const { viewData } = this.state;
    viewData.isNewCard = e.target.value;
    this.setState({ viewData });
  }
  isSelf(relationType) {
    this.setState({
      isSelf: relationType.toString() === '1',
    });
  }
  isZfbSelf() {
    const { isSelf } = this.state;
    return this.isZfb() && isSelf;
  }
  filterChildWhenSelf() {
    const { config, isSelf } = this.state;
    const { patientTypes = [] } = config;
    if (isSelf) {
      return patientTypes.filter((v) => {
        return v && v.dictKey && v.dictKey.toString() !== '1';
      });
    } else {
      return patientTypes;
    }
  }
  render() {
 
    return (
        <div className='container page-evaluate'>
          {/*<div className="hc-toptip" >toptip</div>
          {/*<div className="hc-toptip" hidden="{{!toptip}}">{{toptip}}</div>*/}

          {/*<div className="doc-info">
           <img className="doc-img" src="{{docInfo.doctor.img ? docInfo.doctor.img : '../../../resources/images/doc.png'}}" alt="医生头像" />
           <div className="text-box">
           <div className='doc-name'>{{docInfo.doctorName}}</div>
           <div className='doc-des'>{{docInfo.deptName}} {{docInfo.doctor.level ? '|' : ''}} {{docInfo.doctor.level}}</div>
           <div className='doc-des'>{{docInfo.hisName}}</div>
           </div>
           </div>*/}
          <div className='doc-item'>

            <div className="doc-info">
              <img className="doc-img" src="../../../resources/images/doc.png" alt="医生头像" />
              <div className="text-box">
                <div className='doc-name'>doctorName</div>
                <div className='doc-des'>deptName | level</div>
                <div className='doc-des'>hisName</div>
              </div>
            </div>

          </div>
          {/*<div className="pingJia  {{pingShow ? 'showTxt': '' }}">*/}
          {/* <div @tap="setScore(1)" className="star">
           <block wx:if="{{score < 1}}"><img src="../../../resources/images/starH.png" /></block>
           <block wx:else><img src="../../../resources/images/starS.png" /></block>
           </div>
           <div @tap="setScore(2)" className="star">
           <block wx:if="{{score < 2}}"><img src="../../../resources/images/starH.png" /></block>
           <block wx:else><img src="../../../resources/images/starS.png" /></block>
           </div>
           <div @tap="setScore(3)" className="star">
           <block wx:if="{{score < 3}}"><img src="../../../resources/images/starH.png" /></block>
           <block wx:else><img src="../../../resources/images/starS.png" /></block>
           </div>
           <div @tap="setScore(4)" className="star">
           <block wx:if="{{score < 4}}"><img src="../../../resources/images/starH.png" /></block>
           <block wx:else><img src="../../../resources/images/starS.png" /></block>
           </div>
           <div @tap="setScore(5)" className="star">
           <block wx:if="{{score < 5}}"><img src="../../../resources/images/starH.png" /></block>
           <block wx:else><img src="../../../resources/images/starS.png" /></block>
           </div>

           </div>
           */}
          {/*<div @tap="setAppraisal(1)" className=" {{t1.show ? 'active' : ''}}">{{t1.text}}</div>
           <div @tap="setAppraisal(2)" className=" {{t2.show ? 'active' : ''}}">{{t2.text}}</div>
           <div @tap="setAppraisal(3)" className=" {{t3.show ? 'active' : ''}}">{{t3.text}}</div>
           <div @tap="setAppraisal(4)" className=" {{t4.show ? 'active' : ''}}">{{t4.text}}</div>
           <div @tap="setAppraisal(5)" className=" {{t5.show ? 'active' : ''}}">{{t5.text}}</div>*/}

          {/*<textarea @input="saveContent" placeholder="请输入您需要咨询的内容" placeholder-style="color:#999;font-size:24rpx;">
           </textarea>
           <div><span>{{txtNum}}</span><span>/140</span></div>*/}

          {/*<button className="btn1" type="primary" size="{{primarySize}}" loading="{{loading}}" plain="{{plain}}"
           disabled="{{disabled}}" bindtap="primary" @tap="submitEvaluate"> 确定评价 </button>
           <navigator url="/pages/consult/deptlist/deptlist"  className="btn2 again">再次问诊</navigator> </div>*/}

          {/*<div className="pingJia2  {{pingShow ? '': 'showTxt' }}">*/}
          {/*<div  className="star">
           <block wx:if="{{newScore <1}}"><img src="../../../resources/images/starH.png" /></block>
           <block wx:else><img src="../../../resources/images/starS.png" /></block>
           </div>
           <div  className="star">
           <block wx:if="{{newScore <2}}"><img src="../../../resources/images/starH.png" /></block>
           <block wx:else><img src="../../../resources/images/starS.png" /></block>
           </div>
           <div  className="star">
           <block wx:if="{{newScore <3}}"><img src="../../../resources/images/starH.png" /></block>
           <block wx:else><img src="../../../resources/images/starS.png" /></block>
           </div>
           <div  className="star">
           <block wx:if="{{newScore <4}}"><img src="../../../resources/images/starH.png" /></block>
           <block wx:else><img src="../../../resources/images/starS.png" /></block>
           </div>
           <div  className="star">
           <block wx:if="{{newScore < 5}}"><img src="../../../resources/images/starH.png" /></block>
           <block wx:else><img src="../../../resources/images/starS.png" /></block>
           </div>

           </div>
           </div>
           <div className="ping-content" style="{{itemList<=3?'height:80rpx;':'height:160rpx;'}}">
           <div className="active {{t1.show ? '': 'showTxt' }}">{{t1.text}}</div>
           <div className="active {{t2.show ? '': 'showTxt' }}">{{t2.text}}</div>
           <div className="active {{t3.show ? '': 'showTxt' }}">{{t3.text}}</div>
           <div className="active {{t4.show ? '': 'showTxt' }}">{{t4.text}}</div>
           <div className="active {{t5.show ? '': 'showTxt' }}">{{t5.text}}</div>
           </div>
           <div className="ping-info">
           <span className="text1">评价详情：</span>
           <span className="text2">{{newText}}</span>
           </div>
           <div className="ping-time">
           <span className="text1">评价时间：</span>
           <span className="text2">{{newTime}}</span>
           </div>
           <div className="consult-again">
           <button type="primary" size="{{primarySize}}" loading="{{loading}}" plain="{{plain}}"
           disabled="{{disabled}}" bindtap="primary">再次咨询</button>
           </div>
           </div>
           </div>*/}
          <div className='evaluate'>
            <div className='evaluate-item'>

              <div className="pingJia1">

                <div className="title">请对本次咨询进行评价</div>
                <div className="ping">
                  <div className="xing">星级：
                    <div className="star">
                      <img src="../../../resources/images/starS.png" />
                  </div>

                </div>

                <div className="xing-dian">点击星星评分</div>
              </div>
              <div className="ping-content">
                <div  className=" ">text</div>

              </div>
              <div className="ping-area">
				   <textarea  placeholder="请输入您需要咨询的内容" >
                         </textarea>
                <div><span>txtNum</span><span>/140</span></div>




              </div>

              <div className="ping-btn">
                <button className="btn1" > 确定评价 </button>
                <Link  className="btn2 again">再次问诊</Link> </div>


            </div>

            <div className="pingJia2" style={{display:'none'}}>

              <div className="title">患者评价</div>
              <div className="ping">
                <div className="xing">星级：
                  <div  className="star">
                    <img src="../../../resources/images/starS.png" />
                  </div>
                </div>
              </div>
              <div className="ping-content">
                <div className="active">text</div>

              </div>
              <div className="ping-info">
                <span className="text1">评价详情：</span>
                <span className="text2">newText</span>
              </div>
              <div className="ping-time">
                <span className="text1">评价时间：</span>
                <span className="text2">newTime</span>
              </div>
              <div className="consult-again">
                <button >再次咨询</button>
              </div>
            </div>
          </div>

        </div>


       

        </div>

    );
  }
}
export default Connect()(Widget);