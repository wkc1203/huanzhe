import React, { Component } from 'react';
import { Link } from 'react-router';
import {Carousel} from 'antd-mobile';
import { Button, Toptips,Switch,Dialog,Toast } from 'react-weui';
import Connect from '../../../components/connect/Connect';
import { addressMap } from '../../../config/constant/constant';
import * as Api from './questionApi';
import './style/index.scss';
import * as Utils from '../../../utils/utils';

import { ImagePicker } from 'antd-mobile';
import hashHistory from 'react-router/lib/hashHistory';
var files = new Array();
class Widget extends Component {
    static contextTypes = {
        router: React.PropTypes.object,
    };
  constructor(props) {
    super(props);
    this.state = {
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
        edit:true,
        info:'',
        add:false,

    };
  }
  componentDidMount() {
    Utils.getJsByHide();
      this.getQuestion(this.props.location.query.id)
    
  }
       

    componentWillUnmount() {
        // 离开页面时结束所有可能异步逻辑
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
    submitData(){
        var has=true;
        console.log(this.state.info.followedTemplateVo)
        var list=this.state.info.followedTemplateVo;
        console.log(list.followedQuestionVoList.length)
       for(var i=0;i<list.followedQuestionVoList.length;i++){
            var flag=0;
           if(list.followedQuestionVoList[i].type=='1'){
               for(var j=0;j<list.followedQuestionVoList[i].followedQuestionOptionVoList.length;j++){
                   if(list.followedQuestionVoList[i].followedQuestionOptionVoList[j].checked=='1'){
                       flag++;
                   }
               }
               console.log("flag",flag)
               if(flag==0){
                   has=false;
                this.setState({
                    showIOS1:true,
                    msg:'请将问题补充完整'
                })
               }
                 
           }else{
            console.log("flag1",flag)
            for(var j=0;j<list.followedQuestionVoList[i].followedQuestionOptionVoList.length;j++){
                if(list.followedQuestionVoList[i].followedQuestionOptionVoList[j].checked=='1'){
                    flag++;
                }
            }
            if(flag==0){
                has=false;
                this.setState({
                    showIOS1:true,
                    msg:'请将问题补充完整'
                })
               }
           }
       }
      if(has){
  
            console.log(":ewe") 
            this.showLoading();
            Api
            .submitQuestion({ 
                hisId:'2214',
                id:this.state.info.id,
                answers:JSON.stringify(this.state.info.followedTemplateVo)
            })
            .then((res) => {
                this.hideLoading();
                if(res.code==0){
                    this.setState({
                        add:true
                    })
                }
               
              
            }, (e) => {
                this.hideLoading();
                    this.setState({
                        showIOS1:true,
                        msg:!!e.msg?e.msg:""
                    })
            });
         
       } 

    }
    adds(id,followedQuestionOptinonId,followedQuestionId,type,check){
        console.log(":ewe")
        Api
        .addQuestion({
            hisId:'2214',
            followedQuestionId:followedQuestionOptinonId,
            followedQuestionOptinonId:followedQuestionId,
            followedRecordId:id,
            patientId:this.state.info.patientId,
            type:type,
            oper:check=='0'?'unchecked':'checked'
        })
        .then((res) => {
            if(res.code==0&&res.data){
                this.getQuestion(this.props.location.query.id)
            }
            console.log(res)
          
        }, (e) => {
                this.setState({
                    showIOS1:true,
                    msg:!!e.msg?e.msg:""
                })
        });
    }
    getQuestion(id,status){
        this.showLoading();
        Api
        .getQuestion({
            hisId:'2214',
            status:status,
            id:id
        })
        .then((res) => {
            this.hideLoading();
            if(res.code==0&&res.data){
                 if(!!res.data.answers&&res.data.answers!=null){
                     var info=res.data;
                     info.followedTemplateVo=JSON.parse(res.data.answers);
                    this.setState({
                        info:info
                    })
                    console.log(this.state.info)
                 }else{
                    this.setState({
                        info:res.data
                    })
                 }
                
            }
            console.log(res)
          
        }, (e) => {
            this.hideLoading();
                this.setState({
                    showIOS1:true,
                    msg:!!e.msg?e.msg:'暂无随访问卷'
                })
        });
    } 

    hideDialog() {
        this.setState({
            showIOS1: false,
            showIOS2: false,
            showAndroid1: false,
            showAndroid2: false,
        });
    }
   
    
    
  render() {
     const {
         msg,
         info,
         edit,
         add,
         }=this.state;
    return (
        /*首页*/
      <div className="page-ask-question">
      {!edit&&<div className="home" style={{position:'fixed',width:'100%',top:'0'}}><span className="jian"
            onClick={()=>{
                
                this.context.router.push({
                pathname:'ask/index'
                })
                }}
        ></span>查看历史问卷
        </div>}
        {edit&&<div className="home" style={{position:'fixed',width:'100%',top:'0'}}><span className="jian"
            onClick={()=>{
                
                this.context.router.push({
                pathname:'ask/index'
                })
                }}
        ></span>随访问卷填写
        </div>}
        <Dialog type="ios" title={this.state.style1.title} buttons={this.state.style1.buttons} show={this.state.showIOS1}>
            {msg}
        </Dialog>
        <div className="patInfo">
            <div className="item">
             
              <p>就诊人：{info.patientName}</p>
            </div>
             <div className="item">
                
                <p>科室：{info.deptName}</p>
                <p>病种：{info.diseasesName}</p>
            </div>
        </div>
        <div className="question">
         
          <span className="title">
          
          {!!info.title?info.title:''}</span>
           <div className="cont">
            {!!info.followedTemplateVo&&!!info.followedTemplateVo.followedQuestionVoList
            &&info.followedTemplateVo.followedQuestionVoList.map((item,index)=>{
                return(
                    <div className="item" key={index}>
                    <p className="tit">
                    {index+1}.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{item.question}</p>
                    <div className="answer">
                    {item.followedQuestionOptionVoList&&item.followedQuestionOptionVoList.map((item1,index1)=>{
                        if(item.type=='1'){
                            return(
                                <p key={index1} onClick={()=>{
                                    if((info.status=='1'||info.status=='4')){
                                        this.adds(info.id,item1.followedQuestionId,item1.id,item.type,item1.checked=='0'?'1':'0')

                                    }
                                }}>
                                {item1.checked=='1'&&<img 
                                className='dan'
                                src="./././resources/images/csf_xzyq.png"
                                alt=""
                                /> }
                                
                            {item1.checked=='0'&&<img  className='dan'
                            src="./././resources/images/csf_wxzyq.png"
                            alt=""
                            />}
                                {item1.content}
                            </p>
                            )
                        }else{
                            return(
                                <p key={index1} onClick={()=>{
                                    if((info.status=='1'||info.status=='4')){
                                    this.adds(info.id,item1.followedQuestionId,item1.id,item.type,item1.checked=='0'?'1':'0')
                                    }
                                }}>
                                {item1.checked=='1'&&<img 
                                className='double'
                                src="./././resources/images/csf_xzfx.png"
                                alt=""
                                /> }
                                
                            {item1.checked=='0'&&<img  className='double'
                           
                            src="./././resources/images/csf_wxzfx.png"
                            alt=""
                            />}
                                {item1.content}
                            </p>
                            )
                        }
                       
                    })}
                     </div>
                 </div>
                )
            })}
            </div>
            
             </div>
           {!!info&&(info.status=='1'||info.status=='4')&&<div className="submit"
            onClick={()=>{
                
                this.submitData();
            }}
           >提交</div>}
        
        {add&&<div className='modal-tip1' onClick={(e)=>{
            this.setState({
                add:false
            })
            }}>
            <div className='modal-body-tip'  onClick={(e)=>{
                e.stopPropagation()
                }}>
                <div className='modal-content-tip'>
                     <div className="img">
                       <img  src="./././resources/images/tjcg.png" alt=""></img>
                       <p className='text'>提交成功</p>

                     </div>
                     <div className="btn-close">
                                 <p onClick={(e)=>{
                                    this.setState({
                                        add:false
                                    })
                                    this.context.router.push({
                                        pathname:'/ask/index'
                                    });
                                    }}>确定</p>
                              </div>
                </div>
                
            </div>
        </div>
          }
      </div>
    );
  }
}

export default Connect()(Widget);
