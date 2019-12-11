import React, { Component } from 'react';
import { Link } from 'react-router';
import {Carousel} from 'antd-mobile';
import { Button, Toptips,Switch,Dialog,Toast,TextArea } from 'react-weui';
import Connect from '../../../components/connect/Connect';
import { addressMap } from '../../../config/constant/constant';
import _ from 'lodash';
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
        text:[],
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
        console.log('this.state.info.followedTemplateVo=',this.state.info.followedTemplateVo)
        
        var list=this.state.info.followedTemplateVo;
       for(var i=0;i<list.followedQuestionVoList.length;i++){
            var flag=0;
           if(list.followedQuestionVoList[i].necessary=='0'){
                if(list.followedQuestionVoList[i].type=='3'){
                    console.log('typesds=',list.followedQuestionVoList[i])
                    // if(list.followedQuestionVoList[i].fillinContent&&list.followedQuestionVoList[i].fillinContent!=''){
                    //     flag++;
                    // }else{
                        const textobj=document.getElementsByClassName('text-area') 
                        if(textobj.length>0){
                            console.log('bttextobj=',textobj)
                            console.log('bt=',list.followedQuestionVoList[i])
                            for(let ii=0;ii<textobj.length;ii++){
                                console.log('bttextobj[i]=',textobj[ii])
                                let id=textobj[ii].getAttribute('data-info')
                                let inputId=textobj[ii].getAttribute('data-id')
                                console.log('inputId=',inputId)
                                let neirong=textobj[ii].value
                                console.log('bid=',list.followedQuestionVoList[i].id)
                                
                                if(inputId==list.followedQuestionVoList[i].id){
                                    if(neirong!=''){
                                        console.log('==55555=========')
                                        this.adds(id,inputId,'','3','0',neirong)
                                    }else{
                                        console.log('===========')
                                        this.setState({
                                            showIOS1:true,
                                            msg:'请将问题补充完整'
                                        })
                                        return
                                    }
                                }
                            }
                        }
                        
                    // }
                }else{
                    if(list.followedQuestionVoList[i].followedQuestionOptionVoList.length>0){
                        for(var j=0;j<list.followedQuestionVoList[i].followedQuestionOptionVoList.length;j++){
                           if(list.followedQuestionVoList[i].followedQuestionOptionVoList[j].checked=='1'){
                               flag++;
                           }
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
               console.log("flag",flag)
           }
       }
       
      if(has){
        
        this.showLoading();
        console.log(":ewe") 
        Api
        .getQuestion({
            hisId:'2214',
            status:status,
            id:this.props.location.query.id
        }).then((res)=>{
            if(res.code==0&&res.data){
                let followedTemplateVot={}
                if(!!res.data.answers&&res.data.answers!=null){
                     followedTemplateVot=JSON.parse(res.data.answers)
                 }else{
                     followedTemplateVot=res.data.followedTemplateVo
                 }
                Api
                .submitQuestion({ 
                    hisId:'2214',
                    id:this.state.info.id,
                    answers:JSON.stringify(followedTemplateVot)
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
        })
            
       } 

    }
    adds(id,followedQuestionOptinonId,followedQuestionId,type,check,fillinContent=''){
        console.log(":ewe")
        console.log('this.state=',this.state)
        Api
        .addQuestion({
            hisId:'2214',
            followedQuestionId:followedQuestionOptinonId,
            followedQuestionOptinonId:followedQuestionId,
            followedRecordId:id,
            patientId:this.state.info.patientId,
            type:type,
            fillinContent:fillinContent,
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
    // 内容动态保存
    throttle(func, delay=3000) {            
        let preTime=Date.now()
        console.log(56565)
        return (even)=>{
            const context=this
            even.persist && even.persist();
            let doTime=Date.now()
            if(doTime-preTime>=delay){
                func.apply(context)
                preTime=Date.now()
            }
        }
    }
    setText=(id,inputId)=>{
        console.log('eee=',id,inputId)
        return this.throttle((id,inputId)=>{
            console.log('e=',id,inputId)
            let obj=document.getElementsByClassName('text-area')
            console.log('obj=',obj)
            let text=[]
            if(obj&&obj.length>0){
                for(let i=0;i<obj.length;i++){
                    let neirongi=obj[i].value
                    let idi=obj[i].getAttribute('data-info')
                    let inputIdi=obj[i].getAttribute('data-id')
                    let sendObj={id:idi,inputId:inputIdi,neirong:neirongi}
                    text.push(sendObj)
                }
            }
            console.log('state=',this.state)
            if(text.length>0){
                for(let i=0;i<text.length;i++){
                    if(this.state.text.length>0){
                        for(let j=0;j<this.state.text.length;j++){
                            if(text[i].inputId==this.state.text[j].inputId&&text[i].neirong!=this.state.text[j].neirong&&text[i].neirong!=''){
                                this.adds(text[i].id,text[i].inputId,'','3','0',text[i].neirong)
                            }
                        }
                    }
                    
                }
            }
            this.setState({
                text
            })
        })
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
                    {item.necessary=='0'?<span>*</span>:null}{index+1}.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{item.question}</p>
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
                        }
                        else{
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
                    {
                        item.type=='3'?
                            (info.status=='1'||info.status=='4')?
                                <TextArea placeholder="请输入内容" defaultValue={item.fillinContent} data-info={info.id} data-id={item.id} className='text-area' onChange={this.setText(info.id,item.id)}></TextArea>
                                :
                                <TextArea placeholder="请输入内容" defaultValue={item.fillinContent} className='text-area' readOnly></TextArea>
                                :null
                    }
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
