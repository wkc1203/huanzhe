import React, { Component } from 'react';
import { Link } from 'react-router';

import Connect from '../../../components/connect/Connect';
import { addressMap } from '../../../config/constant/constant';

import * as Api from './deptDetailApi';
import 'style/index.scss';

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
    Api
      .getHisInfo()
      .then((res) => {
        this.hideLoading();
        this.setState({ hospInfo: res.data });
      }, (e) => {
        this.hideLoading();
        this.showPopup({ content: e.msg });
      });
  }

  render() {

    return (
        <div className="page-dept-detail container">
            <div className='header'>
                <div className='doctor'>
                    {/*<img className="doc-img" src="{{docInfo.img}}" alt="医生头像" />*/}
                    <img className="doc-img" src='../../../resources/images/collect.png' alt="医生头像" />
                    <div className='text-box'>
                        <div>
                            name
                            <div className="status-active">在线</div>
                            <img  src="../../../resources/images/collect.png" />
                        </div>
                        <div>hisName</div>
                        <div>deptName | level</div>
                        {/*<div>
                         {{docInfo.name}}
                         <block wx:for="{{docInfo.inquirys}}" wx:for-index="idx" wx:for-item="item1" wx:key="{{idx}}">
                         <block wx:if="{{item1.type == '1'}}">
                         <div className="status-active" wx:if="{{item1.isOnDuty == '1'}}">在线</div>
                         <div className="status-item" wx:if="{{item1.isOnDuty == '0'}}">离线</div>
                         </block>
                         </block>
                         <img @tap="switchCollect({{isFavorite}})" src="{{isFavorite ? '../../../resources/images/collect-none.png' : '../../../resources/images/collect-active.png'}}" />
                         </div>
                         <div>{{docInfo.hisName}}</div>
                         <div>{{docInfo.deptName}} | {{docInfo.level}}</div>*/}
                    </div>
                </div>
            </div>
            <div className='data'>
                <div className='item'>
                    <div>服务</div>
                    {/*<div>serviceTimes人</div>*/}
                    <div>serviceTimes人</div>
                </div>
                <div className='item'>
                    <div>好评率</div>
                    <div>favoriteRat</div>
                    {/*<div>{{docInfo.favoriteRate}}</div>*/}
                </div>
                <div className='item'>
                    <div>从业年限</div>
                    <div>workingLife年</div>
                    {/*<div>{{docInfo.workingLife}}年</div>*/}
                </div>
            </div>
            <div className='content'>
                <div className='d-tab'>

                    <div className="inquity-item" >
                        <div className='icon'>
                            <img src="../../../resources/images/inquiry-bg.png" />
                        </div>
                        <div className='text'>
                            <div>图文咨询</div>
                            <div>使用图片、文字等咨询医生</div>
                        </div>
                        <div className='des-fee'>￥100<span>/次</span></div>
                    </div>
                    {/*<block wx:for="{{docInfo.inquirys}}" wx:for-index="idx" wx:for-item="item" wx:key="{{idx}}">
                     <block wx:if="{{item.type == '1'}}">
                     <block wx:if="{{item.isOnDuty == '1'}}">
                     <div className="inquity-item" @tap="jumpConfirminfo({{item.remune}}))">

                     <div className='icon'>
                     <img src="../../../resources/images/inquiry-bg.png" />
                     </div>
                     <div className='text'>
                     <div>图文咨询</div>
                     <div>使用图片、文字等咨询医生</div>
                     </div>
                     <div className='des-fee'>￥{{WxsUtils.formatMoney(item.remune,100)}}<span>/次</span></div>
                     </div>
                     </block>
                     <block wx:if="{{item.isOnDuty == '0'}}">
                     <div className="inquity-item">
                     <div className='icon'>
                     <img src="../../../resources/images/inquiry-gray.png" />
                     </div>
                     <div className='text'>
                     <div><text className="f-color-gray">图文咨询</text></div>
                     <div>使用图片、文字等咨询医生</div>
                     </div>
                     <div className='des'>￥{{WxsUtils.formatMoney(item.remune,100)}}<span>/次</span></div>
                     </div>
                     </block>
                     </block>
                     </block>*/}
                    {/*<div className="inquity-item" @tap="switchTip(1)">
                     <div className='icon'>
                     <img src='../../../resources/images/video.png' />
                     </div>
                     <div className='text'>
                     <div>视频咨询</div>
                     <div>一对一视频咨询</div>
                     </div>
                     </div>*/}
                    <div className="inquity-item">
                        <div className='icon'>
                            <img src='../../../resources/images/phone-active.png' />
                        </div>
                        <div className='text'>
                            <div>电话咨询</div>
                            <div>一对一电话咨询</div>
                        </div>

                        {/*<div className="inquity-item" @tap="switchTip(1)">
                         <div className='icon'>
                         <img src='../../../resources/images/phone.png' />
                         </div>
                         <div className='text'>
                         <div>电话咨询</div>
                         <div>一对一电话咨询</div>
                         </div>

                         */}
                    </div>
                </div>
                <div className='doc-intro'>
                    <div>

                        擅长领域
                    </div>
                    <div className="ski-des">
                        暂无描述
                    </div>
                    {/*<div className="ski-des">
                     {{docInfo.specialty || '暂无描述'}}
                     </div>
                     */}
                </div>
                <div className='doc-intro'>
                    <div>

                        医生介绍
                    </div>
                    <div className="ski-des">
                        '暂无介绍'
                    </div>
                    {/*<div className="ski-des">
                     {{docInfo.introduction || '暂无介绍'}}
                     </div>
                     */}
                </div>
            </div>
            <div className='evaluate'>
                <div className='eva-title'>
                    <div>

                    </div>
                    患者评价<span>共0次</span></div>

                <div className='eva-content'>
                    <div>nameStr

                        <img src="../../../resources/images/collect.png"  alt="" />

                        <span>createTimeStr</span></div>
                    <div>appraisal</div>
                    <div className="ping-content" >

                        <div className="showTxt" >item</div>

                    </div>
                </div>



                {/* 患者评价<span>共{{totalCount || '0'}}次</span></div>
                 <block wx:for="{{evaluate || []}}" wx:for-index="index" wx:for-item="item" wx:key="index">
                 <div className='eva-content'>
                 <div>{{item.nameStr}}
                 <block wx:for="{{[1,2,3,4,5]}}" wx:for-index="index1" wx:for-item="item1" wx:key="index1">
                 <img src="../../../resources/images/star-active.png" wx:if="{{index1 < item.score && item.score > 3}}" alt="" />
                 <img src="../../../resources/images/star.png" wx:if="{{index1 >= item.score && item.score > 3}}" alt="" />
                 </block>
                 <span>{{item.createTimeStr}}</span></div>
                 <div>{{item.appraisal}}</div>
                 <div className="ping-content" style="{{item.appraisalLabel?'':'display:none;'}}">
                 <block wx:for="{{item.ping}}" wx:for-index="idx" wx:for-item="item1" wx:key="{{idx}}">
                 <div className=" {{t1.show ? '': 'showTxt' }}" style="margin-right:20rpx;">{{item1}}</div>
                 </block>
                 </div>
                 </div>
                 </block>
                 */}


                <div className="wgt-empty-box" style={{display:'none'}}>
                    <img  className="wgt-empty-img" src="../../../resources/images/nocom.png" alt=""></img>
                    <div className="wgt-empty-txt">暂未查询到相关信息
                    </div>
                </div>

                <div  className='more' >查看更多评价</div>

                {/*<block wx:if="{{evaluate.length <= 0}}">
                 <div className="wgt-empty-box">
                 <img mode="widthFix" className="wgt-empty-img" src="../../../resources/images/no-result.png" alt=""></img>
                 <div className="wgt-empty-txt">暂未查询到相关信息
                 </div>
                 </div>
                 </block>
                 <div @tap="addMore({{currentPage}})" className='more' wx:if="{{currentPage < pageCount}}">查看更多评价</div>
                 */}

            </div>

            <div className='modal' >
                <div className='modal-body-protocol'>
                    <div className='modal-title'>温馨提示：</div>
                    <div className='modal-content-protocol'>
                        <div className="content">
                            <div className="content-item">1、您即将向name医生进行图文咨询，<span className="f-color-red">试运行期间咨询费100元/次，平台正式上线后将调整咨询费</span>，本次咨询有效期48小时，有效期内您可以对咨询问题进行补充；</div>
                            <div className="content-item">2、付款成功后，医生将在24小时内回复您的咨询，<span className="f-color-red">若医生未在24小时内回复您的咨询，系统将自动关闭本次咨询并自动为您退款；</span></div>
                            <div className="content-item">3、咨询过程中您需提供真实、完整、详细的信息，医生将尽可能利用所掌握的医学知识及临床经验给予一定的解惑，<span className="f-color-red">如需获得更详细、全方位和更确切的医疗信息和诊疗服务，请前往医院挂号就诊；</span></div>
                            <div className="content-item">4、因医生回复咨询需一定的时间，<span className="f-color-red">如需急诊的患者，请自行前往医院就诊。</span></div>
                        </div>
                    </div>
                    <div className='modal-footer' >
                        <span>取消</span>
                        <span>确认</span>
                    </div>
                    <div className='modal-footer' >
                        <div className="cutdown-time">请阅读 leftTime s</div>
                    </div>
                </div>
            </div>

            {/*<div className='modal' wx:if="{{isShowProtocol}}">
             <div className='modal-body-protocol'>
             <div className='modal-title'>温馨提示：</div>
             <div className='modal-content-protocol'>
             <div slot="content">
             <div className="content-item">1、您即将向{{docInfo.name}}医生进行图文咨询，<span className="f-color-red">试运行期间咨询费{{WxsUtils.formatMoney(totalFee,100)}}元/次，平台正式上线后将调整咨询费</span>，本次咨询有效期48小时，有效期内您可以对咨询问题进行补充；</div>
             <div className="content-item">2、付款成功后，医生将在24小时内回复您的咨询，<span className="f-color-red">若医生未在24小时内回复您的咨询，系统将自动关闭本次咨询并自动为您退款；</span></div>
             <div className="content-item">3、咨询过程中您需提供真实、完整、详细的信息，医生将尽可能利用所掌握的医学知识及临床经验给予一定的解惑，<span className="f-color-red">如需获得更详细、全方位和更确切的医疗信息和诊疗服务，请前往医院挂号就诊；</span></div>
             <div className="content-item">4、因医生回复咨询需一定的时间，<span className="f-color-red">如需急诊的患者，请自行前往医院就诊。</span></div>
             </div>
             </div>
             <div className='modal-footer' wx:if="{{footShow}}">
             <span bindtap="cancelModal">取消</span>
             <span bindtap="sure('{{docInfo.doctorId}}','{{docInfo.deptId}}')">确认</span>
             </div>
             <div className='modal-footer' wx:if="{{!footShow}}">
             <div className="cutdown-time">请阅读 {{leftTime}}s</div>
             </div>
             </div>
             </div>*/}

            <div className='modal-tip' >
                {/*<div className='modal-tip' wx:if="{{isShowTip}}">*/}

                <div className='modal-body-tip'>
                    <div className='modal-title'>温馨提示</div>
                    <div className='modal-content-tip'>
                        <div className="content">
                            <div className="content-item">该功能正在努力建设中</div>
                        </div>
                    </div>
                    <div className='modal-footer-tip'>
                        <span >我知道了</span>
                        {/*<span bindtap="sure" @tap="switchTip(0)">我知道了</span>*/}
                    </div>
                </div>
            </div>
        </div>

    );
  }
}

export default Connect()(Widget);
