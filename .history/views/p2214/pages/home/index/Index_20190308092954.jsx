import React, { Component } from 'react';
import { Link } from 'react-router';
import { Button, Toptips,Switch,Dialog,Toast } from 'react-weui';
import Connect from '../../../components/connect/Connect';
import { addressMap } from '../../../config/constant/constant';
import * as Api from './indexApi';
import './style/index.scss';
import hashHistory from 'react-router/lib/hashHistory';
class Widget extends Component {
    static contextTypes = {
        router: React.PropTypes.object,
    };
  constructor(props) {
    super(props);
    this.state = {
      hospInfo: {},
      isOpen:false,
      doc:false,
        msgList:[],
      docList:[],
        showToast: false,
        showLoading: false,
        toastTimer: null,
        loadingTimer: null,
        showIOS1: false,
        showIOS2: false,
        showAndroid1: false,
        showAndroid2: false,
        style1: {
            buttons: [
                {
                    label: '确定',
                    onClick: this.hideDialog.bind(this)
                }
            ]
        },
        style2: {
            title: '提示',   
            buttons: [
                {
                    type: 'default',
                    label: '取消',
                    onClick: this.hideDialog.bind(this)
                },
                {
                    type: 'primary',
                    label: '确定',
                    onClick: this.hideDialog.bind(this)
                }
            ]
        },
        msg:'',
        allShow:false,
        show:false,
        img:'',
    };
  }
  componentDidMount() {
 
    console.log("yy",window.localStorage.systemOauthRedirect);
    if (window.localStorage.systemOauthRedirect === '1') {
        console.log("reload")
        window.localStorage.removeItem('systemOauthRedirect');
        location.reload();
    }
     // window.location.reload();
      window.localStorage.back='0';
      
      this.sum('index',1);
      this.sum('index_inquiry_img',1);
      this.sum('index_good_more',1);

         this.selectDept('全部科室','');
         this.getJs();
        this.getMsg();
  }
    componentWillUnmount() {
        // 离开页面时结束所有可能异步逻辑
    }
    sum(code,type){
        Api
        .getSum({
            hisId:'2214',
            code:code,
            type:type
        })
        .then((res) => {

          
        }, (e) => {

        });
    }
   
    showToast() {
        this.setState({showToast: true});

        this.state.toastTimer = setTimeout(()=> {
            this.setState({showToast: false});
        }, 2000);
    }
    showLoading() {
        this.setState({showLoading: true});

        this.state.loadingTimer = setTimeout(()=> {
            this.setState({showLoading: false});
        }, 2000);
    }

    hideDialog() {
        this.setState({
            showIOS1: false,
            showIOS2: false,
            showAndroid1: false,
            showAndroid2: false,
        });
    }
    /*获取未读条数*/
     getMsg() {
         Api
             .getMsg()
             .then((res) => {

                 if(res.code==0&&res.data!=null){
                        var s=[];
                       for(var i=0;i<res.data.length;i++){
                           if(i<2){
                               s.push(res.data[i])
                           }
                       }
                       this.setState({
                           msgList:s || []
                       })
                 }
             }, (e) => {

             });

    }
    getStatus() {     
        Api
            .getStatus()
            .then((res) => {

                if(res==1){
                    this.setState({
                        allShow:true
                    })
                }
                
            }, (e) => {

            });

   }
    getJs(){
        Api
            .getJsApiConfig({url:window.location.href.substring(0,window.location.href.indexOf("#"))})
            .then((res) => {
                if(res.code==0){
                    //写入b字段
                    wx.config({
                        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                        appId:res.data.appId, // 必填，公众号的唯一标识
                        timestamp:res.data.timestamp, // 必填，生成签名的时间戳
                        nonceStr:res.data.noncestr, // 必填，生成签名的随机串
                        signature:res.data.signature,// 必填，签名
                        jsApiList: ['getLocalImgData','previewImage','hideMenuItems','showMenuItems','chooseImage','getLocalImgData','hideMenuItems', 'showMenuItems','previewImage','uploadImage','downloadImage'] // 必填，需要使用的JS接口列表
                    });
                    wx.ready(function(){
                        // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
                        wx.showMenuItems({
                            menuList: ["menuItem:copyUrl","menuItem:openWithQQBrowser","menuItem:share:appMessage", "menuItem:share:timeline"
                            ,"menuItem:share:qq","menuItem:share:weiboApp","menuItem:favorite","menuItem:share:QZone",
                                "menuItem:openWithSafari"] // 要显示的菜单项，所有menu项见附录3
                        });
                    });

                }
            }, (e) => {
            });
    }
    choose(){
        var that =this;
        
            wx.chooseImage({
                count: 9, // 默认9
                sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                success: function (res) {
                    alert(JSON.stringify(res))
                
                    var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                    alert(res.localIds[0])
                    var m=localIds[0];
                    
                    
                        that.setState({
                            img:m
                        })
                        wx.getLocalImgData({
                            localId: that.state.img, // 图片的localID
                            success: function (res) {
                                var localData = res.localData;
                                wx.previewImage({
                                    current: localData, // 当前显示图片的http链接
                                    urls: [localData] // 需要预览的图片http链接列表
                                    });
                            }
                        })
                        
                    
    
    
                },
                error:(res)=>{
                  alert(JSON.stringify(res))
                }
    
    
            });
    
    
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
    /*查询推荐医生*/
    selectDept(deptName,deptId){
        this.setState({
            deptName:deptName
        })
        this.getDocList(deptId);
    }
     getDocList(deptId = '') {
        Api
            .getInfo({numPerPage: 10, deptId, vagueName: '',pageNum:1 })
            .then((res) => {
                this.setState({
                    show:true,
                })
                 if(res.code==0&&res.data!=null){
                     
                     var docList=[];
                     for(var i=0;i<5;i++){
                         docList.push(res.data.doctors[i]);
                     }
                     this.setState({
                         docList:docList,
                         doc:true,
                     });
                 }
            }, (e) => {
                this.setState({
                    msg:e.msg,
                    doc:true,
                    showIOS1:true
                })
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
    /*跳转到咨询列表*/
    switchInquiry() {

        //var replaceUrl=window.location.origin+"/views/p2214/#/inquiry/inquirylist";
        //top.window.location.replace(replaceUrl);
        this.context.router.push({
            pathname:'/inquiry/inquirylist',
           
        })

    }
    /*查看更多医生*/
    goDoctor(){
        this.sum('index_good_more',2);
               // var replaceUrl=window.location.origin+"/views/p2214/#/consult/deptlist?type=1&source=0";
        //top.window.location.replace(replaceUrl);
        this.context.router.push({
            pathname:'/consult/deptlist',
            query:{type:1,source:0}
        })

    }
  render() {
     const {
          isOpen,
         show,
         msgList,
         docList,
         doc,
         img,
         msg,
         }=this.state;
    return (
        /*首页*/
      <div className="page-home ">
      {img&&<img
      src={img}
    
      />}
          <Dialog type="ios" title={this.state.style1.title} buttons={this.state.style1.buttons} show={this.state.showIOS1}>
              {msg}
          </Dialog>
         
          {<div className="header" >
           <img
           src="../../../resources/images/head-img.png"
               alt=""
               />
         </div>}
          {<div className="content">
           <div className="head-des">  
              <div className="f-pa">
              <div className="d-tab"
              onClick={()=>{
                  this.sum('index_inquiry_img',2);
                
                  this.context.router.push({
                      pathname: '/consult/alldeptlist'
                  })
              }}
                  >
                  <div>
                     <div className="icon">
                       <img
                           src="../../../resources/images/inquiry-bg.png"
                           alt=""
                           />
                     </div>
                     <div className="text">
                       <div>图文咨询 <span style={{color:'grey',fontSize:'13px'}}>(试运行)</span></div>
                       <div>医生将在24小时内回复</div>
                     </div>
                  </div>
                </div>
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
               {msgList.length>0&&<div >
                   <div className='o-tab'
                       onClick={()=>{
                       this.switchInquiry()

                       }}>
                       <div className="msg-item">
                           <img src="../../../resources/images/msg.png" />
                       </div>
                       <i/>
                       <div>
                          { msgList&&msgList.map((item,index)=>{
                              return(
                                  <div key={index}>
                                      <span>{item.doctorName}医生回复了您。</span>
                                  </div>
                              )

                          })}
                       </div>
                   </div>
               </div>}
           </div>
             <div className='title1 rightTab'>专家推荐<div  onClick={()=>{
             this.goDoctor()
             }}>更多</div></div>
             <div className='doctor'>
                 <div  style={{height:'100%',width:'100%'}}>
                     <div className='content1' >
                         {!doc&&
                             <div style={{textAlign:'center',paddingTop:'57px'}}>
                               推荐医生加载中...
                             </div>
                         }
                         {
                             doc&&docList.length==0&&<div style={{textAlign:'center',paddingTop:'57px'}}>
                            {msg}
                           </div>
                         }
                         {
                             doc&&docList.map((item, index) => {
                                 return (
                                     <div key={index} style={{paddingTop:'15px'}}>
                                         <Link  to={{
                                         pathname:'consult/deptdetail',
                                         query:{doctorId:item.doctorId,deptId:item.deptId,resource:1}

                                         }}>
                                             <img src={item.image&&item.image.indexOf("ihoss")=='-1'?item.image:item.image+"?x-oss-process=image/resize,w_105"}></img>
                                             <div className="txt1">{item.name}</div>
                                             <div className="txt2">{item.deptName} {item.level}</div>
                                         </Link>
                                     </div>
                                 );
                             })
                         }
                     </div>
                 </div>
             </div>
           <div className='titleh'>常用服务</div>
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
                 window.location.href='https://mp.weixin.qq.com/s/9x0x4bFJpKYeQUXY5ZC3Lw'
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
         </div>}
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
