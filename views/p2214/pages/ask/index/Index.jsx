import React, { Component } from 'react';
import { Link } from 'react-router';
import {Carousel} from 'antd-mobile';
import { Button, Toptips,Switch,Dialog,Toast, TabBarItem, Tab, Article } from 'react-weui';
import Connect from '../../../components/connect/Connect';
import { addressMap } from '../../../config/constant/constant';
import UserCardMap from '../../usercenter/tabcardmap/index'
import * as Api from './indexApi';
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
        patList:[],
        status:'0',
        cardNo:'',
        show1:false,
        show2:false,
        diseases:{},
        dept:{},
        recordList:[],
        deptList:[],
        diseasesList:[],
        // 判断是否是第一次点击进入
        count:0,
        renyuanId:'',
    };
  }
  componentDidMount() {
    Utils.getJsByHide();
    if(!!window.localStorage.openId){
        this.getDept();
     }else{
        var code='';
        if(window.location.hostname=='tih.cqkqinfo.com'){
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
    
    
    getDept(){
        Api
        .getDeseaseType({
            hisId:'2214',
            openid:window.localStorage.openId
        })
        .then((res) => {
            console.log(res)
            if(res.code==0&&res.data&&res.data.patientList.length>0){
                var list=res.data.patientList;
               
                for(var i=0;i<list.length;i++){
                    if(i==0){
                        list[i].active=true;
                    }else{
                        list[i].active=false;
                    }
                }
                this.setState({
                    patList:list,
                    cardNo:list[0].patientCardNo,
                    dept:list[0].deptList[0],
                    diseases:list[0].deptList[0].diseasesList[0],
                })
                console.log(list[0].deptList,list[0].deptList[0].diseasesList)
                var list1=list[0].deptList;
                var list2=list[0].deptList[0].diseasesList;
                for(var i=0;i<list1.length;i++){
                    if(i==0){
                        list1[i].active=true;
                    }else{
                        list1[i].active=false;
                    }
                }
                for(var i=0;i<list2.length;i++){
                    if(i==0){
                        list2[i].active=true;
                    }else{
                        list2[i].active=false;
                    }
                }
                this.setState({
                    deptList:list1,
                    diseasesList:list2
                })


                this.getRecord('0',this.state.cardNo)
                console.log(this.state.cardNo,this.state.deptList,this.state.diseasesList)
            }else{
              this.setState({
                  showIOS1:true,
                  msg:'您暂未加入随访计划'
              })
            }
          
        }, (e) => {
                this.setState({
                    showIOS1:true,
                    msg:'您暂未加入随访计划',
                })
        });
    } 
    getRecord(status,card){
        this.showLoading();
        console.log("222",this.state.status);
        console.log('state=',this.state)
        var id='';
        for(var i=0;i<this.state.diseasesList.length;i++){
            if(this.state.diseasesList[i].active){
                id=this.state.diseasesList[i].diseasesId
            }
        }
        Api
        .getDeseaseRecord({
            hisId:'2214',
            diseasesId:id,
            deptId:this.state.dept.deptId,
            fillin:status,
            openid:window.localStorage.getItem('openId'),
            patCardNo:card,

        })
        .then((res) => {
            this.hideLoading();
            console.log(res)
            if(res.code==0&&!!res.data&&res.data&&res.data.recordList.length>0){
                var list=res.data.recordList;
                for(i=0;i<list.length;i++){
                    list[i].time=Utils.dateTime(list[i].createTime).substring(0,10)
                }
                this.setState({
                    recordList:res.data.recordList
                })

            }else{
                this.setState({
                    recordList:[]
                })
            }
            // this.setState({
            //     count:0
            // })
        }, (e) => {
            this.hideLoading();
                this.setState({
                    showIOS1:true,
                    msg:!!e.msg?e.msg:'暂无随访问卷'
                })
        });
    } 
    showDept(id,item){
        var list=this.state.deptList;
        console.log('typeitme=',item)
        console.log('typestate=',this.state)
        for(var i=0;i<list.length;i++){
            if(id==list[i].deptId){
                this.setState({
                    dept:list[i]
                })
                list[i].active=true;
            }else{
               list[i].active=false;
            }
        }
        
        this.setState({
            deptList:list,
         
        })
        this.getRecord(this.state.status,this.state.cardNo)

    }
    showDiseases(id){
        console.log("id",id,this.state.diseasesList)
        var list=this.state.diseasesList;
           var flag;
        for(var i=0;i<list.length;i++){
             console.log(id,list[i].diseasesId)
            if(id==list[i].diseasesId){
                console.log("i",i)
                flag=i;
                this.setState({
                    diseases:list[i]
                })
                list[i].active=true;
            }else{
               list[i].active=false;
            }
        }
        this.setState({
            diseasesList:list,
            diseases:list[flag]
        })
       
        console.log("idsss",list[1],this.state.diseasesList)
        this.getRecord(this.state.status,this.state.cardNo)

    }
    selectPat(id,item){
        console.log("id",id)
        console.log("idt",item)
        var list=this.state.patList;
        var data=[];
        var dt=item.deptList
        var deptListd=[]
        for(var i=0;i<list.length;i++){
            if(list[i].patientCardNo==id){
                list[i].active=true;
                 
                var list1=list[i].deptList;
                var list2=list[i].deptList[0].diseasesList;
                
                console.log(7777777)
                console.log('deptListd=',deptListd)
                console.log('is=',deptListd.indexOf(this.state.dept.deptId))
                console.log('deptqian=',this.state.dept)
                console.log('list1=',list1)
                for(var j=0;j<list1.length;j++){
                    if(j==0){
                        list1[j].active=true;
                    }else{
                        list1[j].active=false;
                    }
                }
                for(var z=0;z<list2.length;z++){
                    if(z==0){
                        list2[z].active=true;
                    }else{
                        list2[z].active=false;
                    }
                }

                this.setState({
                    deptList:list1,
                    diseases:list2[0],
                    diseasesList:list2,
                })
               
            }else{
                list[i].active=false;
            }
            
            console.log(999999)
            this.setState({
                cardNo:id,
            })
        }
        Object.keys(dt).forEach((key)=>{
            console.log('dt[key]=',dt[key])
            deptListd.push(dt[key].deptId)
          })
        if(deptListd.length>0&&deptListd.indexOf(this.state.dept.deptId)<0){
          console.log(888888)
          this.setState({
            dept:item.deptList[0],
            deptList:item.deptList,
            diseases:list2[0],
            diseasesList:list2,
            cardNo:id,
          },()=>{this.getRecord(this.state.status,id)})
          
          return
        }
             
        console.log("state",this.state.status)
        this.getRecord(this.state.status,id)


        this.setState({
            patList:list,

        })
        console.log(this.state.patList,'s')
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
   
    
    
  render() {
     const {
         msg,
         deptList,
         patList,
         show1,
         show2,
         recordList,
         status,
         diseases,
         dept,
         diseasesList,
         }=this.state;
        
    return (
        /*首页*/
      <div className="page-ask-index">
        {show1&&<div className='selectDept' onClick={()=>{
            this.setState({show1:false})
        }}> 
           {!!deptList&&deptList.length>0&&<div className='contents'>
                <div className='titles sp'>请选择科室</div>
                {!!deptList&&deptList.length>0&&deptList.map((item,index)=>{
                    if(item.active){
                        return(
                            <div className='sp'  key={index}
                            onClick={()=>{
                                this.showDept(item.deptId,item)
                            }} style={{color:'#4cabcf'}}>{item.deptName}</div>
                           )
                    }else{
                        return(
                            <div className='sp'  key={index}
                            onClick={()=>{
                                this.showDept(item.deptId,item)
                            }} >{item.deptName}</div>
                           )
                    }
                   
                  
                })}
               
            </div>}
        </div>}
        {show2&&!!diseasesList&&diseasesList.length>0&&<div className='selectDept' onClick={()=>{
            this.setState({show2:false})
        }}> 
           <div className='contents'>
                <div className='titles sp'>请选择病种</div>
                {!!diseasesList&&diseasesList.length>0&&diseasesList.map((item,index)=>{
                    if(item.active){
                        return(
                            <div className='sp' key={index}
                            onClick={()=>{
                                this.showDiseases(item.diseasesId)
                            }} style={{color:'#4cabcf'}}>{item.diseasesName}</div>
    
                        )
                    }else{
                        return(
                            <div className='sp' key={index}
                            onClick={()=>{
                                this.showDiseases(item.diseasesId)
                            }} >{item.diseasesName}</div>
    
                        )
                    }
                })}
            </div>
        </div>}
          <Dialog type="ios" title={this.state.style1.title} buttons={this.state.style1.buttons} show={this.state.showIOS1}>
              {msg}
          </Dialog>
          {
            !!patList&&patList.length<=0&& <div  className='no-data' style={{background:'white'}}>
            <img src='../../../resources/images/no-result.png'/>
            <div style={{paddingBottom:'350px'}}>暂未查询到相关信息</div>
          </div>
        }
           {!!patList&&patList.length>0&&<div className="manageInfo">
             <div className="patient">
               {!!patList&&patList.length>0&&patList.map((item,index)=>{
                   
                     return(
                        <div className={`${item.active?'pat-item active':'pat-item'}`} key={index}
                        onClick={()=>{
                            this.selectPat(item.patientCardNo,item)
                        }}>
                         {item.patientName}
                        <span></span>
                      </div>
                     )
                  })
                }
               
             </div>
             <div className="info">
             <div className="dept" >
              
                            <div className="dept-item" onClick={()=>{
                                this.setState({show1:true})
                            }}>
                                科室：{dept.deptName}
                                <img 
                                src="./././resources/images/csf_xl.png"
                                    alt=""
                                    /> 
                            </div>
                        <div className="dept-item"  onClick={()=>{
                            this.setState({show2:true})
                        }}>
                            病种：{diseases.diseasesName}
                            <img 
                            src="./././resources/images/csf_xl.png"
                                alt=""
                                /> 
                        </div>
               </div>
                <div className="type">
                  <p className={`type-item ${status=='0'?'active':''}`} onClick={()=>{
                    
                      this.setState({status:'0'})
                      this.getRecord('0',this.state.cardNo)
                  }}>
                   待填写问卷
                  </p>
                  <p className={`type-item ${status=='1'?'active':''}`} onClick={()=>{
                    this.setState({status:'1'})
                    this.getRecord('1',this.state.cardNo)
                }}>
                   历史问卷
                  </p>
                </div>
                {!!recordList&&recordList.length>0&&<div className={` sub_info ${status=='0'?'right_active':'left_active'}`}>

                   <div className="sub-title">
                     <div className="item">
                        <img 
                        src="./././resources/images/sf_bt.png"
                            alt=""
                            /> 
                         <p>标题</p>
                     </div>
                     <div className="item">
                        <img 
                        src="./././resources/images/csf_sj.png"
                            alt=""
                            /> 
                         <p>时间</p>
                     </div>
                     <div className="item ">
                        <img 
                        src="./././resources/images/csf_z.png"
                            alt=""
                            /> 
                         <p>操作</p>
                     </div>
                   </div>
                   {!!recordList&&recordList.length>0&&recordList.map((item,index)=>{
                       return(
                        <div className="main_info" key={index}>
                            <div className="item name">
                            <p className='p1'>{!!item.title?item.title:''}</p>
                            </div>
                            <div className="item time">
                            <p>{item.time}</p>
                            
                            </div>
                            <div className="item operate" >
                            {status=='0'&&<span onClick={()=>{
                                this.context.router.push({
                                    pathname:'/ask/question',
                                    query:{id:item.id}
                 
                                })
                            }}>立即填写</span>}
                            {status=='1'&&<span onClick={()=>{
                                this.context.router.push({
                                    pathname:'/ask/question',
                                    query:{id:item.id}
                                })
                            }}>查看</span>}
                        
                            </div>
                    </div>
                       )
                   })}
                   
                </div>}
                {
                    !!recordList&&recordList.length<=0&& <div  className='no-data' style={{background:'white'}}>
                    <img src='../../../resources/images/no-result.png'/>
                    <div style={{paddingBottom:'30px'}}>暂未查询到相关信息</div>
                  </div>
                }

             </div>
           </div>}
           <div className="tarbar">
              <div>
              <img  src="../../../resources/images/hightSuifang.jpg"/>
              <div>随访管理</div>
              </div>
              <div className='inquiry'  onClick={()=> {hashHistory.replace({pathname:'/usercenter/mytabcard'})}}>
              <img  src="../../../resources/images/lowMy.jpg"/>
              <div>我的</div>
              </div>
              <div style={{display:'none'}}>
              </div>
            </div>
      </div>
    );
  }
}

export default Connect()(Widget);
