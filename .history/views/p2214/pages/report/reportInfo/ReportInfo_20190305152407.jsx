import React, { Component } from 'react';
import { Button, Toptips,Switch,Dialog,Toast } from 'react-weui';
import Connect from '../../../components/connect/Connect';
import Link from 'react-router/lib/Link';
import * as Api from './reportInfoApi';
import './style/index.scss';
import JsBarcode from 'jsbarcode';

import hashHistory from 'react-router/lib/hashHistory';
class Widget extends Component {
    static contextTypes = {
        router: React.PropTypes.object,
    };  
  constructor(props) {
    super(props);
    this.state = {
        patientName: '全部就诊人',
        isPatShow: false,
        orderList: [],
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
        clickItem:555,
        patList: [],
        item1Show:true,//咨询显示
        item3Show:false,//检查单显示
        report:'',
        patient:'',
        reportResult:[],
    }
  }
  componentDidMount() {
        this.getJs();
        this.setState({
            report:JSON.parse(this.props.location.query.report),
            patient:JSON.parse(this.props.location.query.patient),
        })
        window.scrollTo(0,0); 
        var report=JSON.parse(this.props.location.query.report);
         console.log(report)
        if(report.type=='2'){
            console.log(report.Exam_no)
               //生成条形码
         JsBarcode(this._barcodeSVG, report.Exam_no,
            {
                displayValue: false,  //  不显示原始值
                textMargin:5,//设置条形码和文本之间的间距
                fontSize:15,//设置文本的大小
                width: 3  // 线条宽度
            }
        );
        }
        if(report.type=='1'){
            console.log(report.Test_no)
              //生成条形码
         JsBarcode(this._barcodeSVG,report.Test_no,
            {
                displayValue: false,  //  不显示原始值
                textMargin:5,//设置条形码和文本之间的间距
                fontSize:15,//设置文本的大小
                width: 3  // 线条宽度
            }
         )
        }
        if(report.type=='1'){
            this.getResult(report.Test_no,report.type)

        }else{
            this.getResult(report.Exam_no,report.type)

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
    getJs() {
        Api
            .getJsApiConfig({url:window.location.href.substring(0,window.location.href.indexOf("#")-1)})
            .then((res) => {
                if (res.code == 0) {
//写入b字段
                    wx.config({
                        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                        appId: res.data.appId, // 必填，公众号的唯一标识
                        timestamp: res.data.timestamp, // 必填，生成签名的时间戳
                        nonceStr: res.data.noncestr, // 必填，生成签名的随机串
                        signature: res.data.signature,// 必填，签名
                        jsApiList: ['hideMenuItems', 'showMenuItems'] // 必填，需要使用的JS接口列表
                    });
                    wx.ready(function () {
//批量隐藏功能
                        wx.hideMenuItems({
                            menuList: ["menuItem:share:QZone", "menuItem:share:facebook", "menuItem:favorite", "menuItem:share:weiboApp", "menuItem:share:qq", "menuItem:share:timeline", "menuItem:share:appMessage", "menuItem:copyUrl", "menuItem:openWithSafari", "menuItem:openWithQQBrowser"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
                        });
                    });
                }
            }, (e) => {
                this.setState({
                    msg: e.msg,
                    showIOS1: true
                })
            });
    }
  componentWillUnmount() {
      this.setState({
          patList:[],
          patientName:'全部就诊人',
          isPatShow:false,
          orderList:[]
      })
    // 离开页面时结束所有可能异步逻辑

  }
    selectPat(patientId, patientName) {
        this.setState({
            patientName:patientName,
            isPatShow:false,
        })
        this.getOrderList(patientId);
    }
    openList() {
        this.setState({
            isPatShow:!this.state.isPatShow,
        })
    }
    getResult(no,type){
        if(type=='1'){
            Api
            .getInspectReportDetails({
                Test_no:no
            })
            .then((res) => {
                 if(res.code==0){
                     
                     this.setState({ reportResult: res.data.data });
                 }
                 }, e=> {
                this.setState({
                    msg:e.msg,
                    showIOS1:true
                })
            });
        }
        if(type=='2'){
            Api
            .getCheckReportDetailsOld({
                Exam_no:no
            })
            .then((res) => {
                 if(res.code==0){

                    this.setState({ reportResult: res.data.data });
                }
                 }, e=> {
                this.setState({
                    msg:e.msg,
                    showIOS1:true
                })
            });
        }
    }
     getCardList() {
         Api
             .getCardList()
             .then((res) => {
                  if(res.code==0){

                      this.setState({ patList: res.data.cardList });
                  }
                  }, e=> {
                 this.setState({
                     msg:e.msg,
                     showIOS1:true
                 })
             });
    }
    /*获取订单列表*/
     getOrderList(patientId = '') {
         this.showLoading();
         Api
             .getOrderList({patientId:patientId})
             .then((res) => {
                 if (res.code == 0) {
                      this.hideLoading();
                     const objStatus = { '-1': '待付款', '0': '咨询中', '1': '咨询中', '3': '已完成' };
                     var items = res.data.map((item, index) => {
                         item.statusName = objStatus[item.status];
                         return item;
                     });


                     this.setState({ orderList: items});
                 }
             }, e=> {
                 this.hideLoading();
                 this.setState({
                     msg:e.msg,
                     showIOS1:true
                 })
             });

    }
  getUser() { // 获取实名制

      Api
      .getUser()
      .then((res) => {
        this.setState({ user: res.data });
      }, e=> {
            this.setState({
                msg:e.msg,
                showIOS1:true
            })
      });
  }
    //切换显示内容
    changeShow(type){
       if(type==1){
           this.setState({
               item1Show:true,
               item2Show:false,
               item3Show:false
           })
       }
        if(type==2){
            alert("正在建设中")
            this.setState({
                item2Show:true,
                item1Show:false,
                item3Show:false
            })
        }
        if(type==3){
            this.setState({
                item3Show:true,
                item2Show:false,
                item1Show:false
            })
        }

    }

  render() {
    const {report,patient,reportResult,clickItem,isPatShow,orderList,patList,msg}=this.state
    return (
    <div className="container page-report-info">
        <div className="home" style={{position:'fixed',width:'100%',top:'0'}}><span className="jian"
                                    onClick={()=>{
                                        
                                            window.history.back();
                                      }}
            ></span>报告详情
        </div>
        <Toast icon="success-no-circle" show={this.state.showToast}>修改成功</Toast>
        <Dialog type="ios" title={this.state.style1.title} buttons={this.state.style1.buttons} show={this.state.showIOS1}>
            {msg}
        </Dialog>
        <div className='reportInfo'>
           <div className='infoTop'>
              <p>条形码（用于医院拿实体报告）</p>
               <div className='qrCode'>
               <svg ref={(ref)=>this._barcodeSVG = ref}></svg>
               </div>
           </div>
           <div className='infoBasic'>
                    <div>
                    <p>姓名 : {patient.patientName}</p>
                    <p>性别 : {patient.patientSex=='M'?'男':'女'}</p>
                    </div>
                    <div>
                        <p>出生日期 : {patient.birthday}</p>
                        <p>检查科室 : {report.Performed_dept_name}</p>
                    </div>
                    {report.type=='1'&&<div>
                        <p>检查时间 : {report.Requested_date_time}</p>
                      
                    </div>}
                    {report.type=='2'&&<div>
                        <p>检查时间 : {report.Req_date_time}</p>
                      
                    </div>}
                   {report.type=='1'&&<div>
                        <p>送检项目 : {report.Sheet_title}</p>
                    </div>}
                    {report.type=='2'&&<div>
                    <p>送检项目 : {report.Exam_item}</p>
                   </div>}

                    {report.type=='1'&&<div>
                        <p>发布时间 : {report.Results_rpt_date_time}</p>
                    </div>}
              
                    {report.type=='2'&&<div>
                        <p>流水号 : {report.Exam_no}</p>
                    </div>}
                    {report.type=='1'&&<div>
                        <p>流水号 : {report.Test_no}</p>
                    </div>}

            
           </div>
           <div className='reportResult'>
           {report.type=='1'&&<p>检验结果</p>}
           {report.type=='2'&&<p>检查结果</p>}
           {reportResult&&reportResult&&reportResult.map((item,index)=>{
            return(
                <div className='resultInfo' key={index}>
                   <div className='basic'>
                        <div className='name'>
                        {item.Report_item_name}
                            </div>
                            <div className='number'>
                                参考值: {item.Normal_value_interval?item.Normal_value_interval:'暂无'} {item.Normal_value_interval?item.Units:''}
                            </div>
               
                   </div>
                    <div className='result'>
                    {item.Abnormal_indicator=="↓"?<img
                    src="./././resources/images/high.png"></img>:''}
                    {item.Abnormal_indicator=="↑"?<img
                    src="./././resources/images/below.png"></img>:''} {item.Result} {item.Units}  
                    </div>
                      
                </div>
            )
        })}
        {report.type=='2'&&report.report_result&&report.report_result.map((item,index)=>{
            return(
                <div className='resultInfo1' key={index}>
                   {item.Exam_para&&item.Exam_para!=''&&<div>检查参数：{item.Exam_para}</div>}
                   {item.Description&&item.Description!=''&&<div>检查所见：{item.Description}</div>}
                   {item.Impression&&item.Impression!=''&&<div>印象：{item.Impression}</div>}
                   {item.Memo&&item.Memo!=''&&<div>建议：{item.Memo}</div>}
                      
                </div>
            )
        })}    
       
              
             
           </div>

        </div>  
    </div>
    );
  }
}
export default Connect()(Widget);