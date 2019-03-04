import React, { Component } from 'react';
import { Button, Toptips,Switch,Dialog,Toast } from 'react-weui';
import Connect from '../../../components/connect/Connect';
import Link from 'react-router/lib/Link';
import { Input,Upload,Anchor,Icon, Modal} from 'antd';
const { TextArea } = Input;
import * as Api from './evaluateApi';
import './style/index.scss';
import hashHistory from 'react-router/lib/hashHistory';
class Widget extends Component {
    static contextTypes = {
        router: React.PropTypes.object,
    };
  constructor(props) {
    super(props);
    this.state = {
        sources:this.props.location.query.sources,
        inquiryId:this.props.location.query.inquiryId,
        name:this.props.location.query.name,
        toptip: '',
        userInfo:window.localStorage.getItem('userInfo'),
        docInfo: {},
        appraisal: '',
        score:5,
        pingShow: false,
        isEvaluate: false,
        orderId:this.props.location.query.orderId,
        txtNum:0,
        t1:{text:'态度好',show:false},
        t2:{text:'及时回复',show:false},
        t3:{text:'解答详细',show:false},
        t4:{text:'很专业',show:false},
        t5:{text:'非常感谢',show:false},
        appraisalLabel:'',
        newScore:'',
        itemList:'',
        newText:'',
        newItem:'',
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
        newTime:''
    };
  }
  componentDidMount() {
        //this.getJs();
      this.getDocDet();
      this.getEvaluate();
  }
  componentWillUnmount() {
    // 离开页面时结束所有可能异步逻辑

  }
    getJs() {
        console.log(window.location.href.substring(0,window.location.href.indexOf("#")-1))
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
    dateTime(time) {
        // 首先把它换成("2018-03-22 02:24:51.000+0000") 然后截取到秒 再进行转换就可以了
        var newTime= time.replace("T"," ");
        var t=newTime.substr(0,19);
        var now =new Date(t.replace(/-/g,'/'))
        var year = now.getFullYear();
        var month = now.getMonth()+1;
        var date=now.getDate();
        var hour=now.getHours()+8;
        if(hour>23){
            hour=hour-24;
            date+=1;
        }
        var minute=now.getMinutes();
        var second=now.getSeconds();
        if(hour.toString().length == 1){
            hour = "0" + hour;
        }
        var minute=now.getMinutes();
        if(minute.toString().length == 1){
            minute = "0" + minute;
        }
        var second=now.getSeconds();
        if(second.toString().length == 1){
            second = "0" + second;
        }
        return year+"/"+month+"/"+date+" "+hour+":"+minute+":"+second;
    }
    /*获取评价详情*/
    getEvaluate(){
        Api
            .evaluate1({orderId: this.props.location.query.orderId})
            .then((res) => {
                if(res.data.length>0){
                    this.setState({
                        pingShow:true,
                        isEvaluate:true,
                        newScore:res.data[0].score?res.data[0].score:'',
                        newText:res.data[0].appraisal?res.data[0].appraisal:'',
                        newItem:res.data[0].appraisalLabel?res.data[0].appraisalLabel:'',
                        newTime:this.dateTime(res.data[0].createTime?res.data[0].createTime:''),

                    })
                    this.setState({
                        newTime:this.dateTime(res.data[0].createTime?res.data[0].createTime:''),


                    });
                    var str=this.state.newItem;
                    var s=[];
                    s= str.split("-");
                    this.setState({
                        itemList:0
                    })
                    for(var i=0;i<s.length;i++)
                    {
                        if(s[i]==this.state.t1.text){
                            var t1=this.state.t1;
                            var itemList=this.itemList;
                            t1.show=true;
                            itemList+=1;
                            this.setState({
                                t1:t1,
                                itemList:itemList
                            })

                        }
                        if(s[i]==this.state.t2.text){
                            var t2=this.state.t2;
                            var itemList=this.itemList;
                            t2.show=true;
                            itemList+=1;
                            this.setState({
                                t2:t2,
                                itemList:itemList
                            })

                        }
                        if(s[i]==this.state.t3.text){
                            var t3=this.state.t3;
                            var itemList=this.itemList;
                            t3.show=true;
                            itemList+=1;
                            this.setState({
                                t3:t3,
                                itemList:itemList
                            })

                        }
                        if(s[i]==this.state.t4.text){
                            var t4=this.state.t4;
                            var itemList=this.itemList;
                            t4.show=true;
                            itemList+=1;
                            this.setState({
                                t4:t4,
                                itemList:itemList
                            })

                        }
                        if(s[i]==this.state.t5.text){
                            var t5=this.state.t5;
                            var itemList=this.itemList;
                            t5.show=true;
                            itemList+=1;
                            this.setState({
                                t5:t5,
                                itemList:itemList
                            })

                        }
                    }
                }
            }, (e) => {
                this.setState({
                    msg:e.msg,
                    showIOS1:true
                })
            });


    }
    //分数
    setScore(id) {

        this.setState({
            score:id
        })
    }
    //评价标签
    setAppraisal(id){
        if(id==1){
            var t1=this.state.t1;
            t1.show=!this.state.t1.show;
            this.setState({
                t1:t1
            })
        }
        if(id==2){
            var t2=this.state.t2;
            t2.show=!this.state.t2.show;
            this.setState({
                t2:t2
            })        }
        if(id==3){
            var t3=this.state.t3;
            t3.show=!this.state.t3.show;
            this.setState({
                t3:t3
            })
        }
        if(id==4){
            var t4=this.state.t4;
            t4.show=!this.state.t4.show;
            this.setState({
                t4:t4
            })        }
        if(id==5){
            var t5=this.state.t5;
            t5.show=!this.state.t5.show;
            this.setState({
                t5:t5
            })
        }
    }
    setATxt(e){
        this.setState({
            txtNum:e.target.value.length,
            appraisal: e.target.value
        })
    }
    /*保存数据*/
    saveContent(e){
        this.setState({
            txtNum:e.target.value.length,
            appraisal: e.target.value
        })
    }
    /*提交评价*/
    submitEvaluate(){
        var  appraisalLabel1='';
        if(this.state.t1.show==true){
            appraisalLabel1+=this.state.t1.text+"-";
            this.setState({
                appraisalLabel:appraisalLabel1
            })
        }
        if(this.state.t2.show==true){
            appraisalLabel1+=this.state.t2.text+"-";
            this.setState({
                appraisalLabel:appraisalLabel1
            })
        }
        if(this.state.t3.show==true){
            appraisalLabel1+=this.state.t3.text+"-";
            this.setState({
                appraisalLabel:appraisalLabel1
            })
        }
        if(this.state.t4.show==true){
            appraisalLabel1+=this.state.t4.text+"-";
            this.setState({
                appraisalLabel:appraisalLabel1
            })
        }
        if(this.state.t5.show==true){
            appraisalLabel1+=this.state.t5.text+"-";
            this.setState({
                appraisalLabel:appraisalLabel1
            })
        }
        this.setState({
            appraisalLabel:appraisalLabel1.substring(0,appraisalLabel1.length-1)
        })
        const doctor = this.state.docInfo;
        const params = {
            hisName: doctor.hisName,
            deptId: doctor.deptId,
            deptName: doctor.deptName,
            doctorId: doctor.doctorId,
            doctorName: doctor.doctorName,
            name: this.state.userInfo.realName,
            appraisal: this.state.appraisal,
            appraisalLabel:appraisalLabel1,
            score: this.state.score,
            orderId: this.state.orderId,
        };
        Api.evaluate(params)
            .then((res) => {
                this.hideLoading();
                if (res.code == 0) {

                    this.showToast();
                    this.end=true;
                    this.setState({
                        end:true,
                    })
                    this.context.router.goBack();

                }
            }, (e) => {
                this.setState({
                    msg:e.msg,
                    showIOS1:true
                })
            });

    }
    /*获取医生信息*/
    getDocDet() {
        Api
            .getDocDet({orderId: this.props.location.query.orderId})
            .then((res) => {
                if(res.code == 0){
                    this.setState({
                        docInfo:res.data.doctor,
                        doctorid:res.data.doctorId,
                        deptid:res.data.deptId
                    })
                }
            }, (e) => {
                this.setState({
                    msg:e.msg,
                    showIOS1:true
                })
            });

    }

  render() {
     const {docInfo,appraisal,score, pingShow,doctorid,deptid,txtNum,t1,t2,t3,t4,t5,newScore,itemList,newText,newTime,msg }=this.state;
    return (
        <div className='container page-evaluate'>
            <div className="home"><span className="jian"
                                        onClick={()=>{
                                      this.context.router.goBack();
                                      }}
                ></span>服务评价
            </div>
            <Toast icon="success-no-circle" show={this.state.showToast}>评价成功</Toast>
            <Dialog type="ios" title={this.state.style1.title} buttons={this.state.style1.buttons} show={this.state.showIOS1}>
                {msg}
            </Dialog>
          <div className='doc-item'>

            <div className="doc-info">
                {docInfo.length!=0&&<img className="doc-img" src={docInfo.image ? docInfo.image : '../../../resources/images/doc.png'} alt="医生头像" />}
              <div className="text-box">
                <div className='doc-name'>{docInfo.doctorName}</div>
                <div className='doc-des'>{docInfo.deptName} {docInfo.level ? '|' : ''} {docInfo.level}</div>
                <div className='doc-des'>{docInfo.hisName}</div>
              </div>
            </div>

          </div>

          <div className='evaluate'>
            <div className='evaluate-item'>

              <div className={`pingJia1 ${pingShow ? 'showTxt': '' }`}>

                <div className="title">请对本次咨询进行评价</div>
                <div className="ping">
                  <div className="xing">星级：
                      <div  className="star"
                            onClick={()=>{
                         this.setScore(1)
                          }}>
                          {score <1&&<img src="../../../resources/images/starH.png" />}
                          {score >=1&&<img src="../../../resources/images/starS.png" />}

                      </div>
                      <div  className="star"
                            onClick={()=>{
                         this.setScore(2)
                          }}>
                          {score <2&&<img src="../../../resources/images/starH.png" />}
                          {score >=2&&<img src="../../../resources/images/starS.png" />}

                      </div>
                      <div  className="star"
                            onClick={()=>{
                         this.setScore(3)
                          }}>
                          {score <3&&<img src="../../../resources/images/starH.png" />}
                          {score >=3&&<img src="../../../resources/images/starS.png" />}

                      </div>
                      <div  className="star"
                            onClick={()=>{
                         this.setScore(4)
                          }}>
                          {score <4&&<img src="../../../resources/images/starH.png" />}
                          {score >=4&&<img src="../../../resources/images/starS.png" />}

                      </div>
                      <div  className="star"
                            onClick={()=>{
                         this.setScore(5)
                          }}>
                          {score <5&&<img src="../../../resources/images/starH.png" />}
                          {score >=5&&<img src="../../../resources/images/starS.png" />}

                      </div>

                </div>

                <div className="xing-dian">点击星星评分</div>
              </div>
              <div className="ping-content">
                  <div  className={`${t1.show ? 'active' : ''}`} onClick={()=>{
                    this.setAppraisal(1)

                    }}>{t1.text}</div>
                  <div  className={`${t2.show ? 'active' : ''}`} onClick={()=>{
                    this.setAppraisal(2)

                    }}>{t2.text}</div>
                  <div  className={`${t3.show ? 'active' : ''}`} onClick={()=>{
                    this.setAppraisal(3)

                    }}>{t3.text}</div>
                  <div  className={`${t4.show ? 'active' : ''}`} onClick={()=>{
                    this.setAppraisal(4)

                    }}>{t4.text}</div>
                  <div  className={`${t5.show ? 'active' : ''}`} onClick={()=>{
                    this.setAppraisal(5)

                    }}>{t5.text}</div>

              </div>
              <div className="ping-area">
				   <TextArea value={appraisal}
                             placeholder="请输入您要评价的内容"
                             onChange={(e)=>{

                                  this.setATxt(e)

                                   }}
                             onPressEnter={(e)=>{
                        this.saveContent(e)

                         }}
                       />
                  <div><span>{txtNum}</span><span>/140</span></div>
              </div>

              <div className="ping-btn">
                  <button className="btn1"
                          onClick={()=>{
                       this.submitEvaluate()

                        }}> 确定评价 </button>
                  <Link
                      to={{
                        pathname:'/consult/deptdetail',
                        query:{doctorId:doctorid,deptId:deptid}
                        }}
                      className="btn2 again">再次咨询</Link>
              </div>
            </div>

            <div className={`pingJia2 ${pingShow ? '': 'showTxt' }`}>

                <div className="ping">
                    <div className="xing">星级：
                        <div  className="star">
                            {newScore <1&&<img src="../../../resources/images/starH.png" />}
                            {newScore >=1&&<img src="../../../resources/images/starS.png" />}

                        </div>
                        <div  className="star">
                            {newScore <2&&<img src="../../../resources/images/starH.png" />}
                            {newScore >=2&&<img src="../../../resources/images/starS.png" />}

                        </div>
                        <div  className="star">
                            {newScore <3&&<img src="../../../resources/images/starH.png" />}
                            {newScore >=3&&<img src="../../../resources/images/starS.png" />}
                        </div>
                        <div  className="star">
                            {newScore <4&&<img src="../../../resources/images/starH.png" />}
                            {newScore >=4&&<img src="../../../resources/images/starS.png" />}
                        </div>
                        <div  className="star">
                            {newScore <5&&<img src="../../../resources/images/starH.png" />}
                            {newScore >=5&&<img src="../../../resources/images/starS.png" />}
                        </div>
                    </div>
                </div>
                <div className={`ping-content ${itemList.length>=1&&itemList.length<=3?'conmidHeight':''} ${itemList.length==0?'conminHeight':''}`} >
                    <div className={`active ${t1.show ? '': 'showTxt' }`}>{t1.text}</div>
                    <div className={`active ${t2.show ? '': 'showTxt' }`}>{t2.text}</div>
                    <div className={`active ${t3.show ? '': 'showTxt' }`}>{t3.text}</div>
                    <div className={`active ${t4.show ? '': 'showTxt' }`}>{t4.text}</div>
                    <div className={`active ${t5.show ? '': 'showTxt' }`}>{t5.text}</div>
                </div>
                <div className="ping-info">
                    <span className="text1">评价详情：</span>
                    <span className="text2">{!!newText?newText:'无'}</span>
                </div>
                <div className="ping-time">
                    <span className="text1">评价时间：</span>
                    <span className="text2">{newTime}</span>
                </div>
                <div className="consult-again">
                    <Link   className="again"
                            to={{
                        pathname:'/consult/deptdetail',
                        query:{doctorId:doctorid,deptId:deptid}
                        }}
                        >再次咨询</Link>
                </div>
            </div>
            </div>
          </div>
        </div>

    );
  }
}
export default Connect()(Widget);