import React, { Component } from 'react';
import { Link } from 'react-router';

import Connect from '../../../components/connect/Connect';
import { addressMap } from '../../../config/constant/constant';

import * as Api from './complainIndexApi';
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
        <div className="page-complain">
            {/*<div className="hc-toptip" >toptip</div>
            {/*<div className="hc-toptip" hidden="{{!toptip}}">{{toptip}}</div>*/}
            <div className="header">
                <img src="../../..//resources/images/complain-bg.png" />
                <div className="header-title">感谢您为我们服务提供的宝贵意见</div>
            </div>
            <div className="complain-reason">
                <div className="reason-title">
                    请选择原因
                </div>
                <div className="reason-box">
                    <div  className="reason-item">reason</div>

                    {/*<block wx:for="{{reasonList || []}}" wx:for-index="index" wx:for-item="item" wx:key="index">
                     <div @tap="changeStatus" data-id="{{item.id}}" className="reason-item {{item.active ? 'active' : ''}}">{{item.reason}}</div>
                     </block>*/}

                </div>
            </div>
            <div className="complain-suggest">
                <div className="suggest-title">请输入投诉或建议的内容</div>
                <div className="area-box">
                    <textarea   placeholder="请输入" />
                    {/*<textarea cursor-spacing="100" @input='saveContent' placeholder-className="place-box" placeholder="请输入" />*/}
                </div>
            </div>
            <div className="img-box">
                <div className="img-title">请上传图片，最多5张，每张不超过2M</div>
                <div className='img-choose-box'>
                    <div className='img-box'>
                        {/*<div className='img-box' @tap="chooseImg">*/}
                        <div className='img-item'>
                            <div>
                                <img src="../../../resources/images/add-img.png" />
                            </div>
                        </div>
                    </div>
                    <div className='img-box'>
                        <div className='img-add'>
                            <icon  />
                            <div>
                                <img src="../../../resources/images/add-img.png" />
                            </div>
                        </div>
                    </div>
                    {/*<block wx:for="{{imgArr}}" wx:for-index="idx" wx:for-item="item" wx:key="{{idx}}">
                     <div className='img-box'>
                     <div className='img-add' @tap="predivImg" data-preurl="{{item}}" >
                     <icon @tap.stop="deleteImg" data-url="{{item}}" type="clear" size="16" color='red' />
                     <div>
                     <img src="{{item}}" />
                     </div>
                     </div>
                     </div>
                     </block>*/}
            {/*<button @tap="submitData" className="submit-btn">*/}
                </div>
            </div>
            <div className='btn'>
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
