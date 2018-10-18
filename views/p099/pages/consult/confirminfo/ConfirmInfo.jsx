import React, { Component } from 'react';
import { Link } from 'react-router';

import Connect from '../../../components/connect/Connect';
import { addressMap } from '../../../config/constant/constant';

import * as Api from './confirmInfoApi';
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
        <div className="page-confirm-info">
            {/*<div className="hc-toptip" >toptip</div>
            {/*<div className="hc-toptip" hidden="{{!toptip}}">{{toptip}}</div>*/}


            {/*<img className="doc-img" src="{{docInfo.img || '../../../resources/images/doc.png'}}" alt="医生头像" />
             <div className="text-box">
             <div className='doc-name'>{{docInfo.name}}</div>
             <div className='doc-des'>{{docInfo.hisName}}</div>
             <div className='doc-des'>{{docInfo.deptName }} | {{docInfo.level}}</div>
             </div>*/}
            <div className="doc-item">
                <div className="doc-info">
                    <img className="doc-img" src='../../../resources/images/doc.png' alt="医生头像" />
                    <div className="text-box">
                        <div className="doc-name">name</div>
                        <div className="doc-des">hisName</div>
                        <div className="doc-des">deptName | level</div>
                    </div>
                </div>
            </div>
            <div className="pat-box">
                <div className="pat-title">请选择就诊人
                    <span >（selectName | selectSex | selectBirthday）</span>
                </div>
                  {/*<span wx:if="{{cardList.length > 0}}">（{{selectName}} | {{selectSex}} | {{selectBirthday}}）</span></div>*/}

                    {/*<block wx:for="{{cardList || []}}" wx:for-index="index" wx:for-item="item" wx:key="index">
                     <div @tap="changePat" data-patientid="{{item.patientId}}" className="pat-item {{item.active ? 'active' : ''}}"><text style="font-size:20rpx;"> {{item.patientName}}</text></div>
                     </block>
                     <div className="pat-img" @tap="isRegister" wx:if="{{leftBindNum > 0}}">
                     <img src="../../../resources/images/plus.png" />
                     */}
                <div className="item-box">
                    <div  className="pat-item">patientName</div>
                    <div className="pat-img" >
                        <img src="../../../resources/images/plus.png" />
                    </div>
                </div>
            </div>
            {/*<block wx:for="{{consultList || []}}" wx:for-index="index" wx:for-item="item" wx:key="index">
             <div @tap="changeStatus" data-id="{{item.id}}" className="reason-item {{item.active ? 'active' : ''}}">{{item.reason}}</div>
             </block>*/}
            <div className="reason">
                <div className="reason-title">本次咨询目的</div>
                <div className="item-box">
                    <div  className="reason-item">reason</div>

                    <div className="reason-item f-bg-gray">预约手术</div>
                    <div className="reason-item f-bg-gray">预约检查</div>
                    <div className="reason-item f-bg-gray">在线开处方</div>
                </div>
            </div>

            <div className="describe">
                <div className="edit-title">病情描述</div>
                <div className="edit-area">
                    <textarea   className="placeholder-box" placeholder="请详细描述就诊人的性别、年龄、症状、持续时间和用药情况，或已经确诊的疾病以及看诊医生的意见，我们会确保您的隐私安全。（最少10个字）">
                    </textarea>
                        {/*<textarea @input='saveContent' cursor-spacing="100" placeholder-className="placeholder-box" placeholder="请详细描述就诊人的性别、年龄、症状、持续时间和用药情况，或已经确诊的疾病以及看诊医生的意见，我们会确保您的隐私安全。（最少10个字）">
                         </textarea>*/}
                        {/*<div className='img-box' @tap="chooseImg">*/}

                        {/*<block wx:for="{{imgArr}}" wx:for-index="idx" wx:for-item="item" wx:key="{{idx}}">
                         <div className='img-box'>
                         <div className='img-add' @tap="predivImg" data-preurl="{{item}}" >
                         <icon catchtap="deleteImg" data-url="{{item}}" type="clear" size="20" color='red' />
                         <div>
                         <img src="{{item}}" />
                         </div>
                         </div>
                         </div>
                         </block>
                         <block wx:if="{{imgArr.length <= 0}}">
                         <div className="explain">
                         <div>添加图片</div>
                         <div>病症部位、检查报告或其他病情资料(最多可上传4张)</div>
                         </div>
                         </block>*/}

                    {/*<button @tap="submitData" className="submit-btn">*/}
                        <div className='img-choose-box'>

                            <div className='img-box'>
                                <div className='img-add'>
                                    <icon type="clear" size="20" color='red'/>
                                    <div>
                                        <img src="../../../resources/images/add-img.png"/>
                                    </div>
                                </div>
                            </div>
                            <div className="explain">
                                <div>添加图片</div>
                                <div>病症部位、检查报告或其他病情资料(最多可上传4张)</div>
                            </div>
                        </div>
                </div>
            </div>
            <div className="btn">
                <button  className="submit-btn">

                    提交
                </button>
            </div>
            <div className="empty-box"></div>
        </div>

    );
  }
}

export default Connect()(Widget);
