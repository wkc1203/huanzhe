import React, { Component } from 'react';
import { Button, Toptips,Switch,Dialog,Toast } from 'react-weui';
import Connect from '../../../components/connect/Connect';
import Link from 'react-router/lib/Link';
import * as Api from '../../../components/Api/Api';
import './style/index.scss';
import JsBarcode from 'jsbarcode';
import * as Utils from '../../../utils/utils';
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
                    onClick: Utils.hideDialog.bind(this)
                }
            ]
        },
        style2: {
            title: '提示',
            buttons: [
                {
                    type: 'default',
                    label: '取消',
                    onClick: Utils.hideDialog.bind(this)
                },
                {
                    type: 'primary',
                    label: '确定',
                    onClick: Utils.hideDialog.bind(this)
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
        //隐藏分享等按钮
      Utils.getJsByHide();
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
  componentWillUnmount() {
      this.setState({
          patList:[],
          patientName:'全部就诊人',
          isPatShow:false,
          orderList:[]
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
        {report.type=='2'&&reportResult&&reportResult.map((item,index)=>{
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