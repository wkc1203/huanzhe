import React, { Component } from 'react';

import './index.scss';


/** *
 * show:显示状态
 * type:warn | fail
 * title:'系统提示', //支持html
 * content:'请求出错' //支持html
 * button:{label:'查看详情',onClick:()=>{}}
 * 例子：<PopUp type="warn" show={true} title="系统提示" button={{label:'查看详情',onClick:()=>{alert(1)}}}>真的错了</PopUp>
 *
 */

export default class Widget extends Component {
  constructor(props) {
    super(props);

    this.state = {
      __type: ['warn', 'fail'],
    };
  }

  render() {
    const { type, show, title, button } = this.props;

    const { __type } = this.state;

    if (__type.indexOf(type) < 0) {
      return null;
    } else {
      return (
        <div className={`${show ? '' : 'com-popup-none'} com-popup-dialog com-popup-mask`}>
          <div className="com-popup-status">
            <div className={`com-popup-header com-popup-${type}`}>
              <div className="com-popup-icon"></div>
              <div className="com-popup-title" dangerouslySetInnerHTML={{ __html: title || '系统消息' }}></div>
            </div>
            <div className="com-popup-content">
              {
                React.Children.map(this.props.children, (element, index) => {
                  return (
                    <div key={index}>{element}</div>
                  );
                })
              }
            </div>
            <div className="com-popup-fn">
              <div className="com-popup-item" onClick={() => button.onClick()}>{button.label}</div>
            </div>
          </div>
        </div>
      );
    }
  }
}
