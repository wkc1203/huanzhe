import React, { Component } from 'react';

import Connect from '../../../components/connect/Connect';
import { addressMap } from '../../../config/constant/constant';
import { Link } from 'react-router';

import * as Api from './chatIndexApi';
import './style/index.scss';

class Widget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hospInfo: {},
    };
  }

  componentDidMount() {

  }

  getHospIntro() {
    this.showLoading();
    Api.getHisInfo()
      .then((res) => {
        this.hideLoading();
        if (res.data) {
          this.setState({ hospInfo: res.data });
        }
      }, (e) => {
        this.hideLoading();
        this.showPopup({ content: e.msg });
      });
  }

  render() {

    return (
    <div>
        <div className="container"  >
          {/*<div className="container" @tap="hidden" >*/}
              <div className='header' >
                {/*<div className='header' wx:if="{{!isEnd}}">*/}

                <div>
                  <div className="time">剩余时间： <span>timeShow</span></div>
                  {/*<div className="time">剩余时间： <span>{{timeShow}}</span></div>*/}
                  <div className="num">剩余条数： <span>numEnd</span> 条</div>
                  {/*<div className="num">剩余条数： <span>{{numEnd}}</span> 条</div>*/}
                </div>
                <div>
                  <span >结束咨询</span>
                  {/* <span @tap='openModal'>结束咨询</span>*/}
                </div>
              </div>
             <div className="header1 showTxt">咨询已结束</div>
          {/* <div className="header1 {{isEnd ? '': 'showTxt'}}">咨询已结束</div>*/}
              <div className='content'>

                  <div id="id-{{item.id}}" className="msg">
                    {/* <wxparser rich-text="{{item.content}}" />*/}
                  </div>


                <div className='date' >createTime</div>
                <div  className='left'>
                  <div className='img'>

                    <text > name</text>
                  </div>
                  <div className='text' ><i/>content</div>
                  <div  className='img'  >
                    <i/><img src='../../../resources/images/doc.png'  />
                  </div>

                  <div className='flex' ></div>
                </div>
              </div>
              {/* <scroll-div scroll-with-animation scroll-into-div="id-{{list[list.length-1].id}}" scroll-y style="margin-top:45rpx; {{isEnd&&isEvaluate&&payBack ? 'height: calc(100% - 560rpx) !important;':''}} {{isEnd&&!isEvaluate&&payBack ? 'height: calc(100% - 700rpx);' : showPlus ? 'height: calc(100% - 280rpx);' : 'height: calc(100% - 90rpx);'}}" @tap='hidePlus'>
               <div className='content'>
               <block wx:for="{{list}}" wx:key="{{index}}">
               <block wx:if="{{item.type == 'SYSTEM' && item.userIsShow == '1'}}">
               <div id="id-{{item.id}}" className="msg">
               <wxparser rich-text="{{item.content}}" />
               </div>
               </block>
               <block wx:if="{{item.type == 'BIZ'}}">
               <div className='date' wx:if="{{item.userIsShow == '1'}}">{{item.createTime}}</div>
               <div id="id-{{item.id}}" wx:if="{{item.direction == 'TO_USER' && item.userIsShow == '1'&&item.voiceTime==0}}" className='left'>
               <div className='img'>
               <!-- <img src='../../../resources/images/doc.png' /> -->
               <text style="font-size:20rpx;"> {{name}}</text>
               </div>
               <div className='text' wx:if="{{item.content}}"><i/>{{item.content}}</div>
               <div @tap="predivImg" data-preurl="{{item.url}}" className='img' wx:if="{{item.url&&item.action!=='add'}}" style="{{item.action=='add'?'width:447rpx;height:173rpx;':''}}">
               <i/><img src='{{item.url}}' />
               </div>
               <div @tap="into({{item.actionTrigger}})" data-preurl="{{item.url}}" className='img' wx:if="{{item.url&&item.action=='add'}}" style="{{item.action=='add'?'width:447rpx;height:173rpx;':''}}">
               <i/><img src='{{item.url}}' />
               </div>
               <div className='flex' wx:if="{{item.url}}"></div>
               </div>
               <div id="id-{{item.id}}" wx:if="{{item.voiceTime>0}}" className='left slide' >
               <div className='img'>
               <!-- <img src='../../../resources/images/doc.png' /> -->
               <text style="font-size:20rpx;"> {{name}}</text>
               </div>
               <div className='text radio' wx:if="{{item.voiceTime}}" @tap="play({{index}})" data-id="{{item.id}}" style="width:{{item.voiceTime*5+25}}rpx">
               <i/><img className="rd"  src="../../../resources/images/rd.png" />
               <span className="{{isDuration?'duration':'dura'}}">{{item.voiceTime}}"</span>
               </div>

               <div className='flex' wx:if="{{item.url}}"></div>

               <audio  src="{{item.url}}" id="myAudio{{index}}" ></audio>
               <!--<span className=" {{transShow?'transH':'trans'}}" @tap="showTrans">文</span>-->
               </div>
               <!--<div className="translate" wx:if="{{item.voiceContent}}">
               <text>傻大个萨卡复活萨芬消费基础不好大傻大个萨卡复活萨傻大个萨卡复活萨芬消费基础不好大芬消费基础不好大。</text>
               <img className="tran"  src="../../../resources/images/rans.png" />
               </div>-->
               <div id="id-{{item.id}}" wx:if="{{item.direction == 'TO_DOCTOR' && item.userIsShow == '1'}}" className='right'>
               <div className='flex'></div>
               <div className='img' wx:if="{{item.url&&item.action!=='add'}}" @tap="predivImg" data-preurl="{{item.url}}" @longpress="longtap({{item.id}})" style="{{item.action=='add'?'width:447rpx;height:173rpx;':''}}">
               <i/><img src='{{item.url}}' />
               <div className="tip no {{chatWxs.isRevoke(item.createTime) ? '' : 'nocopy'}}" wx:if="{{chatWxs.isShow(item.id, showId)}}">
               <i/>
               <span @tap.stop="delOrRe({{item.id}}, 'del')">删除</span>
               <span @tap.stop="delOrRe({{item.id}}, 'revoke')" wx:if="{{chatWxs.isRevoke(item.createTime)}}">撤销</span>
               </div>
               </div>
               <div className='img' wx:if="{{item.url&&item.action=='add'}}" @tap="into({{item.actionTrigger}})"  data-preurl="{{item.url}}" @longpress="longtap({{item.id}})" style="{{item.action=='add'?'width:447rpx;height:173rpx;':''}}">
               <i/><img src='{{item.url}}'   />
               <div className="tip no {{chatWxs.isRevoke(item.createTime) ? '' : 'nocopy'}}" wx:if="{{chatWxs.isShow(item.id, showId)}}">
               <i/>
               <span @tap.stop="delOrRe({{item.id}}, 'del')">删除</span>
               <span @tap.stop="delOrRe({{item.id}}, 'revoke')" wx:if="{{chatWxs.isRevoke(item.createTime)}}">撤销</span>
               </div>
               </div>
               <div className='text' wx:if="{{item.content}}" @longpress="longtap({{item.id}})">
               <i/>{{item.content}}
               <div className="tip {{chatWxs.isRevoke(item.createTime) ? '' : 'no'}}" wx:if="{{chatWxs.isShow(item.id, showId)}}">
               <i/>
               <span @tap="copy({{item.content}})">复制</span>
               <span @tap="delOrRe({{item.id}}, 'del')">删除</span>
               <span @tap="delOrRe({{item.id}}, 'revoke')" wx:if="{{chatWxs.isRevoke(item.createTime)}}">撤销</span>
               </div>
               </div>
               <div className='img'><open-data type="userAvatarUrl" /></div>
               </div>
               </block>
               </block>
               </div>

               </scroll-div>*/}
              <div className='operation-box'>
                <div className='top'>
                  <textarea     />
                  <img src='../../../resources/images/plus.png'  />
                  <span  >发送</span>
                </div>
                <div className='bottom' >
                  <div >
                    <img src='../../../resources/images/tp.png' />
                  </div>
                </div>
              </div>
              {/*<div className='operation-box' wx:if="{{!isEnd}}">
               <div className='top'>
               <textarea  style="{{detail?'':'padding:13rpx 20rpx;'}}" auto-height fixed="true" maxlength="-1" @input="input" show-confirm-bar='' adjust-position cursor-spacing="15" value='{{msgText}}'  confirm-type="send" @focus="btnShow" @confirm='sendMsg' @blur="btnHide" />
               <img src='../../../resources/images/plus.png' @tap='showPlus' style="{{!isBtn?'':'display:none'}}"/>
               <span  style="{{isBtn?'':'display:none'}}" @tap="sendMsg1">发送</span>
               </div>
               <div className='bottom' wx:if="{{showPlus}}">
               <div @tap='picture'>
               <img src='../../../resources/images/tp.png' />
               </div>
               </div>
               </div>*/}
              <div className='modal' >
                {/*<div className='modal' wx:if="{{isOk}}">*/}
                <div className='modal-body'>
                  <div className='modal-title'>提示</div>
                  <div className='modal-content'>您本次咨询条数已用完，如需再次咨询请重新选择咨询</div>
                  <div className='modal-footer'>
                    <span >确定</span>
                    {/* <span @tap="sureNo">确定</span>*/}
                  </div>
                </div>
              </div>

              <div className='modal' >
                <div className='modal-body'>
                  <div className='modal-title'>是否结束咨询会话？</div>
                  <div className='modal-content'>结束咨询会话后您可以对本次咨询进行评分</div>
                  <div className='modal-footer'>
                    <span >继续咨询</span>
                    <span >结束</span>
                  </div>
                </div>
              </div>
              {/*<div className='modal' wx:if="{{isShow}}">
               <div className='modal-body'>
               <div className='modal-title'>是否结束咨询会话？</div>
               <div className='modal-content'>结束咨询会话后您可以对本次咨询进行评分</div>
               <div className='modal-footer'>
               <span @tap="cancel">继续咨询</span>
               <span @tap="sure">结束</span>
               </div>
               </div>
               </div>*/}
        </div>
          <div className="pingJia2 " >
            <div className="title">患者评价</div>
                  <div className="ping">
                      <div className="xing">星级：
                          <div  className="star">
                            <img src="../../../resources/images/starS.png" />
                          </div>
                          <div  className="star">
                          <img src="../../../resources/images/starS.png" />
                          </div>
                          <div  className="star">
                              <img src="../../../resources/images/starS.png" />
                          </div>
                          <div  className="star">
                          <img src="../../../resources/images/starS.png" />
                          </div>
                          <div  className="star">
                              <img src="../../../resources/images/starS.png" />
                          </div>
                      </div>
                  </div>
                  <div className="ping-content" >
                    <div className="active ">t1.text</div>
                    <div className="active">t2.text</div>
                    <div className="active ">t3.text</div>
                    <div className="active">text</div>
                    <div className="active">text</div>
                  </div>
                  <div className="ping-info">
                    <span className="text1">评价详情：</span>
                    <span className="text2">无</span>
                  </div>
                  <div className="ping-time">
                    <span className="text1">评价时间：</span>
                    <span className="text2">newTime</span>
                  </div>
                  <div className="consult-again">
                    <Link   className="again">再次咨询</Link>
                  </div>

          </div>
          <div className="pingJia">
                 <div className="title">请对本次咨询进行评价</div>
                  <div className="ping">
                    <div className="xing">星级：
                      <div  className="star">
                        <img src="../../../resources/images/starS.png" />
                      </div>
                    </div>
                    <div className="xing-dian">点击星星评分</div>
                  </div>
                  <div className="ping-content">
                    <div  className="">text</div>
                  </div>
                  <div className="ping-area">
                  <textarea   placeholder="请输入您需要咨询的内容">
                    </textarea>
                    <div><span>txtNum</span><span>/140</span></div>
                  </div>
                  <div className="ping-btn">
                    <button className="btn1" > 确定评价 </button>
                    <Link   className="btn2 again">再次咨询</Link>
                  </div>
          </div>
      {/*<div className="pingJia2  {{isEnd &&isEvaluate&&payBack ? '': 'showTxt' }}" wx:if='{{isEvaluate}}'>
       <div className="title">患者评价</div>
       <div className="ping">
       <div className="xing">星级：
       <div  className="star">
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
       <div className="ping-content" style="{{itemList<=3&&itemList>=1?'height:80rpx;':'height:162rpx;'}} {{itemList!=0&&itemList>=4?'height:162rpx;':''}} {{itemList==0?'height:0rpx !important;':''}}">
       <div className="active {{t1.show ? '': 'showTxt' }}">{{t1.text}}</div>
       <div className="active {{t2.show ? '': 'showTxt' }}">{{t2.text}}</div>
       <div className="active {{t3.show ? '': 'showTxt' }}">{{t3.text}}</div>
       <div className="active {{t4.show ? '': 'showTxt' }}">{{t4.text}}</div>
       <div className="active {{t5.show ? '': 'showTxt' }}">{{t5.text}}</div>
       </div>
       <div className="ping-info">
       <span className="text1">评价详情：</span>
       <span className="text2">{{!!newText?newText:'无'}}</span>
       </div>
       <div className="ping-time">
       <span className="text1">评价时间：</span>
       <span className="text2">{{newTime}}</span>
       </div>
       <div className="consult-again">
       <navigator url="/pages/consult/deptdetail/deptdetail?doctorId={{doctorid}}&deptId={{deptid}}"  className="again">再次咨询</navigator> </div>

       </div>
       </div>
       <div className="pingJia {{isEnd&&!isEvaluate&&!end&&payBack ? '': 'showTxt'}}" wx:if='{{!isEvaluate}}'>
       <div className="title">请对本次咨询进行评价</div>
       <div className="ping">
       <div className="xing">星级：
       <div @tap="setScore(1)" className="star">
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
       <div className="xing-dian">点击星星评分</div>
       </div>
       <div className="ping-content">
       <div @tap="setAppraisal(1)" className=" {{t1.show ? 'active' : ''}}">{{t1.text}}</div>
       <div @tap="setAppraisal(2)" className=" {{t2.show ? 'active' : ''}}">{{t2.text}}</div>
       <div @tap="setAppraisal(3)" className=" {{t3.show ? 'active' : ''}}">{{t3.text}}</div>
       <div @tap="setAppraisal(4)" className=" {{t4.show ? 'active' : ''}}">{{t4.text}}</div>
       <div @tap="setAppraisal(5)" className=" {{t5.show ? 'active' : ''}}">{{t5.text}}</div>
       </div>
       <div className="ping-area">
       <textarea fixed="true" @input="saveContent" placeholder="请输入您需要咨询的内容" placeholder-style="color:#999;font-size:24rpx;">
       </textarea>
       <div><span>{{txtNum}}</span><span>/140</span></div>
       </div>
       <div className="ping-btn">

       <button className="btn1" type="primary" size="{{primarySize}}" loading="{{loading}}" plain="{{plain}}"
       disabled="{{disabled}}" bindtap="primary" @tap="submitEvaluate"> 确定评价 </button>
       <navigator url="/pages/consult/deptdetail/deptdetail?doctorId={{doctorid}}&deptId={{deptid}}"  className="btn2 again">再次咨询</navigator> </div>
       </div>
       </div>*/}
    </div>

          );
  }
}

export default Connect()(Widget);
