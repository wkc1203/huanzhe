import React, { Component } from 'react';
import { Link } from 'react-router';
import hashHistory from 'react-router/lib/hashHistory';

import Connect from '../../../components/connect/Connect';
import { addressMap } from '../../../config/constant/constant';

import * as Api from './indexApi';
import './style/index.scss';

class Widget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hospInfo: {},
      isOpen:false,
      docList:[],
    };
  }

  componentDidMount() {
         this.selectDept('全部科室','');
  }
    //底部跳转
    toNext(type){
        if(type==2){

            hashHistory.replace({
                pathname: '/inquiry/inquirylist'
            });
        }
        if(type==3){
            hashHistory.replace({
                pathname: '/usercenter/home'
            });
        }


    }
    selectDept(deptName,deptId){
        this.setState({
            deptName:deptName
        })
        this.getDocList(deptId);
    }
    async getDocList(deptId = '') {
        Api
            .getDocList({numPerPage: 100, deptId, name: '' })
            .then((res) => {
                 if(res.code==0&&res.data!=null){
                     var docList=[];
                     for(var i=0;i<5;i++){
                         docList.push(res.data.doctors[i]);
                     }
                     this.setState({
                         docList:docList
                     });
                 }
                console.log(this.state.docList);

            }, (e) => {
                this.showPopup({ content: e.msg });
            });
    }
     //显示/隐藏正在建设中
    switchOpen(type){
        if(type==1){
            this.setState({
                isOpen:true
            })
        }else{
            this.setState({
                isOpen:false
            })
        }
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
     const {
          isOpen,
         docList,
         }=this.state;
    return (
        /*首页*/
      <div className="page-home ">
         <div className="header">
           <img
               src="../../../resources/images/head-img.png"
               alt=""
               />
         </div>
         <div className="content">
           <div className="head-des">
              <div className="f-pa">
                <Link className="d-tab"
                      to={{ pathname: '/consult/deptlist' }}
                    >
                  <div>
                     <div className="icon">
                       <img
                           src="../../../resources/images/inquiry-bg.png"
                           alt=""
                           />
                     </div>
                     <div className="text">
                       <div>图文咨询</div>
                       <div>医生将在24小时内回复</div>
                     </div>
                  </div>
                </Link>
                <div className="d-tab" onClick={()=>{
                this.switchOpen(1)

                }}>
                  <div>
                    <div className="icon">
                      <img
                          src="../../../resources/images/video.png"
                          alt=""
                          />
                    </div>
                    <div className='text'>
                      <div>视频咨询</div>
                      <div>一对一视频咨询</div>
                    </div>
                  </div>
                </div>
                <div className="d-tab" onClick={()=>{
                this.switchOpen(1)

                }}>
                  <div>
                    <div className="icon">
                      <img
                          src="../../../resources/images/phone.png"
                          alt=""
                          />
                    </div>
                    <div className='text'>
                      <div>电话咨询</div>
                      <div>一对一电话咨询</div>
                    </div>
                  </div>
                </div>
              </div>
           </div>
             <div className='title1 rightTab'>专家推荐<div >更多</div></div>
             <div className='doctor'>
                 <div  style={{height:'100%',width:'100%'}}>
                     <div className='content1' >
                         {
                             docList.map((item, index) => {
                                 return (
                                     <div key={index} style={{paddingTop:'15px'}}>
                                         <Link >
                                             <img src={item.image}></img>
                                             <div className="txt1">{item.name}</div>
                                             <div className="txt2">{item.deptName} {item.level}</div>
                                         </Link>
                                     </div>
                                 );
                             })
                         }
                         {/*<div wx:for="{{docList || []}}" wx:for-index="idx" wx:for-item="item" wx:key="{{idx}}">
                          <navigator url="/pages/consult/deptdetail/deptdetail?doctorId={{item.doctorId}}&deptId={{item.deptId}}" >
                          <image src="{{item.image || (isDefaultImg && '/resources/images/doc.png')}}"></image>
                          <text class="txt1">{{item.name}}</text>
                          <text class="txt2">{{item.deptName}} {{item.level}}</text>
                          </navigator>
                          </div>*/}

                     </div>
                 </div>
             </div>
           <div className='title1'>常用服务</div>
           <div className='b-tab'>
             <Link
                 to={{ pathname: '/microweb/deptlist' }}
                 >
               <div className='text'>
                 <div>科室介绍</div>
                 <div>了解医院科室</div>
               </div>
               <div className='icon'>
                 <img
                     src="../../../resources/images/dept-info.png"
                     alt=""
                     />

               </div>
             </Link>
             <Link
                 to={{ pathname: '/microweb/deptlistfordoc' }}
                 >
               <div className='text'>
                 <div>专家介绍</div>
                 <div>了解专家信息</div>
               </div>
               <div className='icon'>
                 <img
                     src="../../../resources/images/master.png"
                     alt=""
                     />
               </div>
             </Link>
             <Link
                 to={{ pathname: '/microweb/news' }}
                 >
               <div className='text'>
                 <div>健康宣教</div>
                 <div>儿童护理知识</div>
               </div>
               <div className='icon'>
                 <img
                     src="../../../resources/images/conduct.png"
                     alt=""
                     />
               </div>
             </Link>
             <Link

                 onClick={
                ()=> {
                 window.location.href='https://mp.weixin.qq.com/s/oK59jdRPtnoS686p3ci4TQ'
             }}
                 >
               <div className='text'>
                 <div>咨询公告</div>
                 <div>查看最新公告</div>
               </div>
               <div className='icon'>
                 <img
                     src="../../../resources/images/news.png"
                     alt=""
                     />
               </div>
             </Link>
           </div>
         </div>
          {isOpen&&<div className='modal-tip'>
              <div className='modal-body-tip'>
                  <div className='modal-title'>温馨提示</div>
                  <div className='modal-content-tip'>

                          <div className="content-item">该功能正在努力建设中</div>

                  </div>
                  <div className='modal-footer-tip' onClick={
                  ()=>{
                  this.switchOpen(2)
                  }
                  }>
                      <span >我知道了</span>
                  </div>
              </div>
          </div>
          }
          <div className="tarbar">
              <div  >
                  <img
                      src="../../../resources/images/index-active.png"
                      />
                  <div style={{color:'#4FABCA'}}>首页</div>
              </div>
              <div onClick={
                 ()=>{
                this.toNext(2)

                 }
              }>
                  <img
                      src="../../../resources/images/inquiry.png"/>
                  <div>咨询会话</div>
              </div>
              <div onClick={
                 ()=>{
                this.toNext(3)

                 }
              }>
                  <img
                      src="../../../resources/images/my.png"/>
                  <div>我的</div>
              </div>
          </div>
      </div>

    );
  }
}

export default Connect()(Widget);
