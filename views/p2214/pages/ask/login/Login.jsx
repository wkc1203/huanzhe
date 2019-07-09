import React, { Component } from 'react';
import { Link } from 'react-router';
import {Carousel} from 'antd-mobile';
import { Button, Toptips,Switch,Dialog,Toast } from 'react-weui';
import Connect from '../../../components/connect/Connect';
import { addressMap } from '../../../config/constant/constant';
import * as Api from './loginApi';
import './style/index.scss'; 
import * as Utils from '../../../utils/utils';

import { ImagePicker } from 'antd-mobile';
import hashHistory from 'react-router/lib/hashHistory';
import { _resetWarned } from 'react-router/lib/routerWarning';
var files = new Array();
class Widget extends Component {
    static contextTypes = {
        router: React.PropTypes.object,
    };
  constructor(props) { 
    super(props);
    this.state = {
        choose:false,
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
        success:false,
        hasCard:true,
        register:{},
        patList:[],
        registerList:{},
    };
  }
  componentDidMount() {
    Utils.getJsByHide(); 
    if(!!window.localStorage.openId){
        this.getPatientList();
     }else{
         var code='';
        if(window.location.origin=='https://tih.cqkqinfo.com'){
            code='ff8080816b4bfb65016bb08126130000';
      
          }else{
            code='ff8080816b4bfb65016bb08186d70001';
          }
          var storage=window.localStorage;
          //加入缓存
          storage.isOpenId=1;
           
          window.location.href = "https://wx.cqkqinfo.com/wx/wechat/authorize/"+code+"?scope=snsapi_base";
          // return false;
             var storage=window.localStorage;
             //加入缓存
             storage.url=window.location.href;
         
     }
  }
       
  
    componentWillUnmount() {
        // 离开页面时结束所有可能异步逻辑
    }
    getPatientList(){
        this.showLoading();
        Api
        .getHis({
            businessCode:'308',
            Company_code:'nt_hospital',
            Userid:window.localStorage.openId
        })
        .then((res) => {
            this.hideLoading();
            if(res.Issucess=='1'&&res.data.length>0){
                var list=res.data;
                  for(var i=0;i<list.length;i++){
                      if(i==0){
                          list[i].active=true;
                      }else{
                          list[i].active=false;
                      }
                  }
                  this.registerList(list[i].Patient_id);
            }else{
                if(res.Message=='没有数据'){
                    this.setState({
                        showIOS1:true,
                        msg:'您暂未绑定就诊人',
                    })
                    setTimeout(()=> {
                      this.setState({showIOS1: false});
                    window.location.href='https://wx.cqkqinfo.com/wx3/p/03/p/card_choose.cgi';
                  }, 2000);
                }
              

            } 
          
        }, (e) => {
            this.hideLoading();
              if(e.Issucess=='1'&&e.data.length>0){
                  var list=e.data;
                  for(var i=0;i<list.length;i++){
                      if(i==0){
                          list[i].active=true;
                          this.registerList(list[i].Patient_id);
                      }else{
                          list[i].active=false;
                      }
                  }
                
                  this.setState({
                      patList:list
                  })
              }else{
                  if(e.Message=='没有数据'){
                    this.setState({
                        showIOS1:true,
                        msg:'您暂未绑定就诊人',
                    })
                    setTimeout(()=> {
                        this.setState({showIOS1: false});
                        window.location.href='https://wx.cqkqinfo.com/wx3/p/03/p/card_choose.cgi';
                    }, 2000);
                  }
                  }
                
            console.log(list);
        });
    }
    registerList(id){
        Api
        .getHis({
            businessCode:'1301',
            Company_code:'nt_hospital',
            Patient_id:id
        })
        .then((res) => {
            if(res.Issucess=='1'&&res.data.length>0){
                var re=res.data;
                  for(var i=0;i<re.length;i++){
                      re[i].choose=false;
                  }
                var list=[];
                for(var i=0;i<re.length;i++){
                    if(i<3){
                        list.push(re[i])
                    }
                    if(i==0){
                       list[i].choose=true;
                       this.setState({
                           register:list[i]
                       })
                    }else{
                      
                    }
                   
                 }
                this.setState({
                    registerList:list
                })
                console.log("r",this.state.registerList)
            }else{
              this.setState({
                  showIOS1:true,
                  msg:'暂无就诊记录',
              })
            }
        }, (e) => {
              if(e.Issucess=='1'&&e.data.length>0){
                  var re=e.data;
                  for(var i=0;i<re.length;i++){
                      re[i].choose=false;
                  }
                var list=[];
                for(var i=0;i<re.length;i++){
                    if(i<3){
                        list.push(re[i])
                    }
                    if(i==0){
                       list[i].choose=true;
                       this.setState({
                           register:list[i]
                       })
                    }else{
                    } 
                  
                }
               this.setState({
                   registerList:list
               })
               console.log("r",this.state.registerList)
              }else{
                this.setState({
                    showIOS1:true,
                    msg:'暂无就诊记录',
                })
              }           

        });
    }
    selectPat(id){
        var list=this.state.patList;
        var data=[];
        for(var i=0;i<list.length;i++){
            if(list[i].Patient_cardno==id){
                list[i].active=true;
                this.registerList(list[i].Patient_id)
            }else{
                list[i].active=false;
            }
        }
        for(var i=0;i<list.length;i++){
           if(list[i].active){
               data.push(list[i]);
           }
        }
        for(var i=0;i<list.length;i++){
            if(!list[i].active){
                data.push(list[i]);
            }
         }
        

        this.setState({
            patList:data
        })
    }
    addPatient(){
         for(var i=0;i<this.state.patList.length;i++){
             if(this.state.patList[i].active){
                Api
                .addPatientFollow({
                    hisId:'2214',
                    deptId:this.props.location.query.deptId,
                    deptName:this.props.location.query.deptName,
                    Diagnosis_name:this.state.register.Diagnosis_name,
                    openid:window.localStorage.openId,
                    patientCardNo:this.state.patList[i].Patient_cardno,
                    patientName:this.state.patList[i].Patient_name,
                    visitData:JSON.stringify(this.state.register),
                
                    phone:this.state.patList[i].Usertel,
                })
                .then((res) => {
                    if(res.code==0){
                        this.setState({
                            success:true
                        })
                         /* this.context.router.push({
                             pathname:'/ask/index',

                         }) */
                    }else{
                      this.setState({
                          showIOS1:true,
                          msg:res.msg,
                      })
                    }
                }, (e) => {
                    this.setState({
                        showIOS1:true,
                        msg:e.msg,
                    })         
        
                });
             }
         }
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
    selectReport(Visit_no){
         var list =this.state.registerList;
         for(var i=0;i<list.length;i++){
             if(Visit_no==list[i].Visit_no){
                 list[i].choose=true;
                 this.setState({
                     register:list[i]
                 })
             }else{
                 list[i].choose=false;
             }
         }
         this.setState({
             registerList:list
         })

    }
   
    
    
  render() {
     const {
         msg,
         hasCard,
         success,
         registerList,
         patList
         }=this.state;
         console.log("rr",registerList)
    return (
        /*首页*/
      <div className="page-ask">
          <Dialog type="ios" title={this.state.style1.title} buttons={this.state.style1.buttons} show={this.state.showIOS1}>
              {msg}
          </Dialog>
          {<div className="header" >
           <img
           src="./././resources/images/index-banner.png"
               alt=""
               />
         </div>}
          {hasCard&&<div className="content">
             
             {success&&<div className="add_success1">
            <img 
            src="./././resources/images/ask_jrcg.png"
                alt=""
                /> 
                    <p className="tit1">
                    您已成功加入随访计划
                    </p>
             <p className="tit">
             随访消息将在重医儿童医院公众号推送，请注意查看
             </p>
           </div>}
              {!success&&<div className='select_pateint'>
                   <p className='tit'>
                   <span className='left1'></span>
                   请选择加入随访的就诊人
                   <span className='right1'></span>
                   </p>
                   <div className='patient-tab'>
                    {patList&&patList.length>0&&patList.map((item,index)=>{
                        console.log(item.active)
                         return(
                            
                            <div key={index} 
                            className={`${!!item.active?'tab':'tab second-tab'}  `}
                            onClick={()=>{
                                this.selectPat(item.Patient_cardno)
                            }}
                            >
                               
                                {!!item.active&&item.active&&<img
                                className='pateint_bg'
                                src="./././resources/images/ask_jbsk.png"
                                alt=""
                                />} 
                                {!!item.active&&<img
                                className='pateint_select'
                                src="./././resources/images/ask_xz.png"
                                alt=""
                                />} 
                               <div className='selected'>
                                {item.active&&<img
                                src="./././resources/images/ask_tx.png"
                                    alt=""
                                    />} 
                                {!item.active&&<img
                                    src="./././resources/images/ask_tx1.png"
                                        alt=""
                                        />}
                                        {item.Patient_name}
                               </div>
                               <div className='no-select'>
                                 {item.active&&<img
                                    src="./././resources/images/ask_kh.png"
                                        alt=""
                                        /> }
                                    {!item.active&& <img
                                        src="./././resources/images/ask_kh1.png"
                                            alt=""
                                            /> }
                                   就诊卡号：{item.Patient_cardno}
                                </div> 
                            </div>
                         )
                     })
                   }
                   </div>
                   {!!registerList&&registerList.length<=0&&<div className='patient_info'></div>
                   }
                   {!!registerList&&registerList.length>0&&registerList.map((item,index)=>{
                       return(
                        <div className='patient_info' key={index}      onClick={()=>{

                            this.selectReport(item.Visit_no)
                        }}>
                        {/* {!!registerList&&registerList.Visit_date&& */}
                          <p>就诊日期：<span>{!!item&&item.Visit_date}</span></p>
                        {/* } */}
                           <p><span className='time'>科
                           </span>室：<span>{!!item&&item.Dept_name}</span></p>
                           {/* {!!registerList&&registerList.Diagnosis_name && */}
                           <p><span className='time'>病</span>种：
                           <span>{!!item&&item.Diagnosis_name}</span></p>
                         
                     {/* } */}
                     {item.choose&&<img src='../../../resources/images/com.png' 
                      />
                    }
                     {!item.choose&&<img src='../../../resources/images/doc.png' 
                     />}
                    
                         </div>
                       )
                   })}
                  
              </div>}
              
           </div>}
           
           {hasCard&&!success&&!!registerList&&!!registerList.length>0&&<div className='submit-btn'>
                <p onClick={()=>{ 
                    
                    this.addPatient()
                }}>确定</p>
            </div>}
           
      </div>
    );
  }
}

export default Connect()(Widget);
