import React, { Component } from 'react';
import { InfiniteLoader, LoadMore } from 'react-weui';
import { Link } from 'react-router';

import Connect from '../../../components/connect/Connect';
import NoResult from '../../../components/noresult/NoResult';

import * as Api from './newPhoneApi';
import './style/index.scss';

class Widget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      noResult: {
        msg: '暂未获取到相关信息',
        show: false,
      },
      articleTypeList: [],
      articleData: {},
    };
  }

  componentDidMount() {
    //this.getArticleTypeList();
  }

  componentWillUnmount() {
    this.state.Timer && clearTimeout(this.state.Timer);
  }

  /**
   * 根据医院id获取文章类型列表
   */
  getArticleTypeList() {
    const param = this.props.location.query;
    const { noResult } = this.state;
    this.showLoading();
    Api
      .getArticleTypeList(param)
      .then((res) => {
        this.hideLoading();
        const articleTypeList = res.data;
        if (articleTypeList && articleTypeList.length > 0) {
          this.setState({
            articleTypeList,
          });

          const typeId = this.props.location.query.typeId || articleTypeList[0].typeId;
          if (typeId) {
            this.setState({ typeId });
          }
          this.getHospDynamics(typeId);
          this.tabScrollIntoView();
          this.showAnimation();
        } else {
          noResult.show = true;
          this.setState({ noResult });
        }
      }, (e) => {
        this.hideLoading();
        noResult.show = true;
        this.setState({ noResult });
        this.showPopup({ content: e.msg });
      });
  }

  /**
   * 获取文章列表
   * @param type {Number} 文章类型
   * @param currentPage {Number} 要获取的页码数
   * @param resolve {Object} 滚动拉取组件隐藏loading样式的回调
   */
  getHospDynamics(type = 1, currentPage = 1, resolve = () => null) {
    const param = this.props.location.query;
    Object.assign(param, { typeId: type, pageNum: currentPage });
    this.showLoading();
    const { noResult, articleData } = this.state;
    Api
      .getHospDynamics(param)
      .then((res) => {
        this.hideLoading();
        const listData = res.data || {};
        if (listData.recordList && listData.recordList.length > 0) {
          // 合并相同类型数据
          const listName = type;
          const currentArticle = articleData[listName];
          if (currentArticle && currentArticle.currentPage > 0
            && parseFloat(currentArticle.currentPage) + 1 !== parseFloat(listData.currentPage)) {
            // 不是本次要的数据
            return;
          }
          if (!currentArticle) {
            // 无数据 直接赋值
            articleData[listName] = listData;
            this.setState({ articleData }, () => resolve());
          } else {
            // 原来有数据 concat数组内容 其它分页数据(如当前页数，总页数)使用本次获取到的
            let newArticleList = (currentArticle.recordList && currentArticle.recordList.length > 0)
              ? currentArticle.recordList : [];
            newArticleList = newArticleList.concat(listData.recordList);

            articleData[param.typeId] = { ...listData, recordList: newArticleList };
            this.setState({ articleData }, () => resolve());
          }
        } else {
          noResult.show = true;
          this.setState({ noResult }, () => resolve());
        }
      }, (e) => {
        this.hideLoading();
        noResult.show = true;
        this.setState({ noResult }, () => resolve());
        this.showPopup({ content: e.msg });
      });
  }

  /**
   * 改变显示文章的类型
   * @param type {String} 文章类型
   */
  changeType(type) {
    const { articleData, typeId } = this.state;
    if (type === typeId) {
      return;
    }

    this.setState({ typeId: type });
    this.tabScrollIntoView();
    // 判断是否已经查找过该类型
    if (Object.keys(articleData).indexOf(type) < 0) {
      // 没查找过前往查找
      this.getHospDynamics(type);
    }
  }

  tabScrollIntoView() {
    window.setTimeout(() => {
      this.refs.activeTab.scrollIntoView();
    }, 100);
  }

  /**
   * 显示滑动动画
   */
  showAnimation() {
    const tabList = this.refs.tabList;
    if (tabList.scrollWidth > tabList.clientWidth) {
      this.setState({ isSlide: true });
      this.state.Timer = setTimeout(() => {
        this.setState({ isSlide: false });
      }, 2000);
    }
  }

  render() {

    return (
        <div>
            <div className="page-phone">
                <div className="warm-tip" >短信已发送至您phone的手机</div>
                {/*<div className="warm-tip" wx:if="{{isSendValidate}}">短信已发送至您{{phone}}的手机</div>
                 <div className="warm-tip" wx:if="{{!isSendValidate}}">请输入新的手机号，填写验证码</div>*/}

                <div>
                    <div className="register-listitem">
                        <div className="listitem-head">
                            <text className="list-title">手机号</text>
                        </div>
                        <div className="listitem-bd">
                            <input className="m-content " type="number" placeholder="请输入新手机号"
                                   id="phone"
                                />
                            {/*<input className="m-content {{errorElement.phone ? 'o-error' : ''}}" type="number" placeholder="请输入新手机号"
                             cursor-spacing="100" @input="userIO" @focus="resetThisError"
                             placeholder-className="placeholder {{errorElement.phone ? 'o-error' : ''}}"
                             id="phone" maxlength="11" @blur="validator" value="{{phone}}"
                             />*/}

                        </div>
                        <div  className="listitem-ft" >获取验证码</div>
                        {/*<div wx:if="{{!isSendValidate}}" className="listitem-ft" @tap="getValidate">获取验证码</div>
                         <div wx:if="{{isSendValidate}}" className="listitem-ft">{{leftTime}}s 后重试</div>*/}

                    </div>
                    <div className="register-listitem">
                        <div className="listitem-head">
                            <text className="list-title">验证码</text>
                        </div>
                        <div className="listitem-body">
                            <input className="m-content" type="number" placeholder="请输入验证码"
                                   id="validateCode" maxlength="11"
                                />
                            {/*<input className="m-content {{errorElement.validateCode ? 'o-error' : ''}}" type="number" placeholder="请输入验证码"
                             cursor-spacing="100" @input="userIO" @focus="resetThisError"
                             placeholder-className="placeholder {{errorElement.validateCode ? 'o-error' : ''}}"
                             id="validateCode" maxlength="11" @blur="validator" value="{{validateCode}}"
                             />*/}

                        </div>
                    </div>
                </div>
            </div>
      <div className="btn">
            <button className="submit-btn" >提交</button>
            {/*<button className="submit-btn" @tap="submitData">提交</button>*/}
        </div>
          {/* <toptip :toptip.sync="toptip" />*/}
      </div>

     );
  }
}

export default Connect()(Widget);
