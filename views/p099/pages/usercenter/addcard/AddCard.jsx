import React, { Component } from 'react';
import { InfiniteLoader, LoadMore } from 'react-weui';
import { Link } from 'react-router';

import Connect from '../../../components/connect/Connect';
import NoResult from '../../../components/noresult/NoResult';

import * as Api from './addCardApi';
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

        <form bindsubmit="formSubmit">
            <div className="bindcard-list">
                <div className="bindcard-listitem">
                    <div className="listitem-head">
                        <text className="list-title">姓名</text>
                    </div>
                    <div className="listitem-body">
                        <input
                            className="m-content " placeholder="请输入宝宝姓名"

                            id="patientName"
                            />
                        {/*<input
                         className="m-content {{errorElement.patientName ? 'o-error' : ''}}" placeholder="请输入宝宝姓名"
                         cursor-spacing="{{CURSOR_SPACING}}" placeholder-style="color:{{errorElement.patientName ? 'color: #ff613b;' : ''}}"
                         maxlength="8" id="patientName" value="{{patientName}}" @blur="validator" @input="userIO" @focus="resetThisError"
                         />*/}
                    </div>
                </div>




            </div>
            <div className="bindcard-list m-mt-20">
                <div className="bindcard-listitem">
                    <div className="listitem-head">
                        <div className="list-title">身份证号</div>
                    </div>
                    <div className="listitem-body">
                        <input
                            className="m-content " type="text"
                            placeholder="请输入宝宝或监护人证件号"  id="idNo"
                            />
                        {/*<input
                         className="m-content {{errorElement.idNo ? 'o-error' : ''}}" type="text"
                         placeholder="请输入宝宝或监护人证件号" placeholder-style="color:{{errorElement.idNo ? 'color: #ff613b;' : ''}}"
                         value="{{idNo}}" id="idNo" maxlength="18" cursor-spacing="{{CURSOR_SPACING}}" @blur="getBirthday" @input="userIO" @focus="resetThisError"
                         />*/}
                    </div>
                </div>



            </div>
            <div className="bindcard-list is-card m-mt-20">
                <div className="bindcard-listitem">
                    <div className="listitem-head">
                        <text className="list-title">就诊卡</text>
                    </div>
                    <div className="listitem-body">
                        <input className="m-content" type="text" placeholder="请输入就诊卡号"
                               id="patCardNo"/>
                        {/*<input className="m-content {{errorElement.patCardNo ? 'o-error' : ''}}" type="text" placeholder="请输入就诊卡号" cursor-spacing="{{CURSOR_SPACING}}" bindinput="userIO" bindfocus="resetThisError" placeholder-style="color:{{errorElement.patCardNo ? 'color: #ff613b;' : ''}}"
                         id="patCardNo" name="patCardNo" maxlength="15" @blur="validator" value="{{patCardNo}}" />*/}

                    </div>
                </div>

            </div>

            <div className="afterscan-operbtnbox">
                <button className="binduser-btn_line" >确定</button>
                {/*<button className="binduser-btn_line {{hasErr ? 'o-disabled' : ''}}" formType="submit">确定</button>*/}
            </div>

        </form>
        <div  className="tip1">如何申请就诊卡</div>
            {/* <div  className="tip" @tap="showNext">如何申请就诊卡</div>*/}

     </div>
                    );
  }
}

export default Connect()(Widget);
