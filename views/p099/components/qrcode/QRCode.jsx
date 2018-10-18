import React, { Component } from 'react';

import './index.scss';
{
  /** *
   * 例子：<QRCode show={true} doctorName="张三" doctorTitle="主任医圣" deptName="急诊科" codeId="65856545"/>
   *
   */
}
export default class Widget extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { show, doctorName, doctorTitle, deptName, codeId, onClick } = this.props;
    return (
      <div className={`${!!show ? '' : 'f-none'}`}>
        <div className="qrcode-win">
          <div className="qrcode-box">
            <div className="qrcode">
              <p className="qrcode-doc">
                {doctorName}
                {
                  doctorTitle &&
                  <span className="qrcode-title">
                    {doctorTitle}
                  </span>
                }
              </p>
              {
                deptName &&
                <p className="qrcode-dept">{deptName}</p>
              }
              <p className="qrcode-img-box"><img className="qrcode-img" src={codeId} /></p>
              <p className="qrcode-user-tip">长按二维码保存</p>
              <p className="qrcode-btn-box">
                <span className="qrcode-btn"
                      onClick={
                        ()=> {
                          onClick && onClick();
                        }
                      }
                >
                  关闭
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}