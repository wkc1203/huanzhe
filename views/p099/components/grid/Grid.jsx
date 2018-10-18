/**
 * 九宫格组件说明：
 *  hospInfo： 接口返回数据，内容为九宫格顶部图片
 * GridDate 九宫格内容的数据，数据建议以配售文件的方式，可以参考pages/navigation/文件夹下的navigationConstant，
 * 其中 name 为九宫格每个内容名称 ，pathname 为改内容要跳转的路由地址，
 * 其中pathname可以为链接地址（需要新添加一个type字段来表明pathname是属于外联还是内连，等于0是外联，），
 * iconfont为uncode编码，iconClassName为改内容图标样式
 */
import React, { Component } from 'react';
import Link from 'react-router/lib/Link';

// import { Toast } from 'react-weui';

// import PopUp from '../popup/PopUp';

export default class Grid extends Component {

  render() {
    const {
      hospInfo,
      GridDate,
    } = this.props;
    let patiengHtml;
    if (GridDate.length > 0) {
      patiengHtml = GridDate.map((item, key) => {
        const type = item.type;
        if (type === '0') {
          return (<a key={key} href={item.pathname} className="weui-grid">
            <div className="unit-icon weui-grid__icon">
              <i className={`iconfont ${item.iconClassName}`}>{item.iconfont}</i>
            </div>
            <p className="unit-label weui-grid__label">{item.name}</p>
          </a>);
        } else {
          return (<Link
            key={key} className="weui-grid"
            to={{ pathname: item.pathname }}
          >
            <div className="unit-icon weui-grid__icon">
              <i className={`iconfont ${item.iconClassName}`}>{item.iconfont}</i>
            </div>
            <p className="unit-label weui-grid__label">{item.name}</p>
          </Link>);
        }
      });
    }
    return (
      <div className="m-layout-abs">
        {
          hospInfo.logImgUrl ?
            <div className="m-banner">
              <img src={hospInfo.logImgUrl} width="100%" />
            </div> : ''
        }
        <div className="weui-grids">
          {patiengHtml}
        </div>
        {/* <Toast {...toastConfig}>{toastText}</Toast>
         <PopUp {...popupConfig}>{popupText}</PopUp>*/}
      </div >
    );
  }
}
