import React, { Component } from 'react';
import { Link } from 'react-router';
import Connect from '../../../components/connect/Connect';
import './style/index.scss';
import hashHistory from 'react-router/lib/hashHistory';
class Widget extends Component {
    static contextTypes = {
        router: React.PropTypes.object,
    };
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
        //隐藏分享等按钮
      Utils.getJsByHide();
  }
  componentWillUnmount() {
  }
 /*返回上一页*/
  goPrev1(){
    this.context.router.push({
      pathname:'/usercenter/addcard'
    })
  }
  render() {
    return (
        <div className="tip5">
            <div className="home"><span className="jian"
                                        onClick={()=>{
                                      this.context.router.push({
                                       pathname:'usercenter/addcard'
                                      })
                                      }}
                ></span>如何绑卡
            </div>
            <img className="bindTip" src="../../../resources/images/bindTip.png"></img>
            <img   className="know"
                    onClick={
                    ()=>{
                   this.goPrev1()
                    }}
                   src="../../../resources/images/know.png"></img>
             </div>
                    );
  }
}
export default Connect()(Widget);
