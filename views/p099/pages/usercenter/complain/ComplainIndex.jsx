import React, { Component } from 'react';
import { Link } from 'react-router';
import { Upload } from 'antd';
import { Button, Toptips,Switch,Dialog,Toast,Icon } from 'react-weui';
import Connect from '../../../components/connect/Connect';
import { addressMap } from '../../../config/constant/constant';
import * as Api from './complainIndexApi';
import 'style/index.scss';
var imgArr1=[];
var uuList=[];
var nameList=[];
var maxLength=0;
var imgList=[];
var success=[];
var interval1='';
var upload=true;
var files = new Array();
class Widget extends Component {
    static contextTypes = {
        router: React.PropTypes.object,
    };
  constructor(props) {
    super(props);
    this.state = {
        signature:"",
        uuIdList:[],
        g_object_name_type:'random_name',
        g_object_name:'',
        suffix:'',
        policy:"",
        callback:"",
        OSSAccessKeyId:"",
        key:"",
        name:"",
        upLoadImg: [],
        isUploadAll: false,
        toptip: '',
        content: '',
        pics:'',
        reason: '',
        imgArr:[],
        imgArr1:[],
        expire:'',
        reasonList: [
            {reason: '服务态度不好', id: 1},
            {reason: '医生回答不及时', id: 2},
            {reason: '系统不稳定', id: 3},
            {reason: '价格不合理', id: 4},
            {reason: '其他', id: 5}
        ],
        previewVisible: false,
        previewImage: '',
        sign:{},
        fileList:[],
        uploading: false,
        formData:{},
        open:false,
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
        open1:false
    };
  }
    randomName(){

        var myDate = new Date();
        var ossPath='PIC/';
        var fileRandName=Date.now();
        var year=myDate.getFullYear();
        var month;
        var day;
        if(myDate.getMonth()+1<10) {
            var  m=myDate.getMonth()+1;
            month = '0'+m;
        }else{
            month=myDate.getMonth()+1;
        }
        if(myDate.getDate()<10){
            var d=myDate.getDate()+1;
            day='0'+d;
        }else{
            day=myDate.getDate();
        }
        var date=new Date().getTime();

        var m=ossPath+year+'/'+month+'/'+day+"/";

        uuList[0]=m;
            console.log("1"+m);
        return  m;
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
     S4() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    }
     guid() {
         var m=this.S4()+this.S4()+"-"+this.S4()+"-"+this.S4()+"-"+this.S4()+"-"+this.S4()+this.S4()+this.S4();
         nameList[0]=m;
        return m;
    }
    handleUpload(file){
        const formData = new FormData();
        var filename='';
        var image=[];
        console.log("fii",file)

               filename=this.randomName() + this.guid()+file.name.substring(file.name.indexOf("."),file.name.length)
               formData.append('key', filename);
               formData.append("policy",this.state.sign.policy);
               formData.append("callback",this.state.sign.callback);
               formData.append("signature",this.state.sign.signature);
               formData.append("OSSAccessKeyId",this.state.sign.OSSAccessKeyId);
               formData.append('file', file);


        console.log(formData)
        this.setState({
            uploading: true,
        });
    $.ajax({
        url: 'https://ihoss.oss-cn-beijing.aliyuncs.com',
        method: 'POST',
        processData: false,
        contentType: false,
        cache: false,
        data: formData,
        success: (e) => {
            imgArr1=this.state.imgArr;
            imgArr1.push('https://ihoss.oss-cn-beijing.aliyuncs.com/'+filename);
            success.push(file.uid)
            for(var i=0;i<imgArr1.length;i++){
                if(i<=4){
                    image.push(imgArr1[i])
                }
            }
            this.setState({
                uploading: false,
            });
             this.hideLoading();
            this.setState({
                imgArr:image
            })
            if (this.state.imgArr.length >=5) {
                this.setState({
                    open1: true
                })

            }
            console.log("this.sate",this.state.imgArr)
        },

        error:(e) =>{
            console.log("this.sate",this.state.imgArr)
            }
         });
       }
    getJs1(){


        Api
            .getSign({bucket:'ihoss',dir:"PIC"})
            .then((res) => {
                if(res.code==0){
                    this.hideLoading();
                    const sign={
                        signature: res.data.sign,
                        policy: res.data.policy,
                        callback: res.data.callback,
                        OSSAccessKeyId: res.data.accessId,
                    };
                    this.setState({
                        sign:sign,
                        expire:res.data.expire
                    })

                }

            }, (e) => {
                this.setState({
                    msg:e.msg,
                    showIOS1:true
                })
            });

    }
    complain(param) {
        Api
            .complain(param)
            .then((res) => {
                this.showToast();
                setTimeout(() => {
                    this.context.router.goBack();
                },500);

            }, (e) => {
                this.setState({
                    msg:e.msg,
                    showIOS1:true
                })
            });
    }
    submitData() {
        let errMsg = !this.state.reason
            ? '请选择投诉原因'
            : this.state.content.length > 100 ? '描述不能多于100个字' : '';
        if (errMsg) {
            this.setState({
                toptip:errMsg
            })
            this.toptip = errMsg;
            setTimeout(() => {
                this.setState({
                    toptip: ''
                })
            }, 2000);
            return;
        }
        const imgArr1 =this.state.imgArr;
        var len = imgArr1.length;
        if (len == 0) {
            const params = {
                complaintsCert: this.state.pics,
                complaintsContent: this.state.content,
                complaintsReason: this.state.reason,
            };
            this.complain(params);
        } else {
            var pics='';
            if(imgArr1.length>1){

                for(var i=0;i<imgArr1.length;i++){
                     if(i!=imgArr1.length-1){
                         pics=pics+imgArr1[i]+',';
                     }else{
                         pics=pics+imgArr1[i];
                     }

                }
            }else{
                pics=imgArr1[0];
            }
             this.setState({
                 pics:pics
             })
            const params = {
                complaintsCert: pics,
                complaintsContent: this.state.content,
                complaintsReason: this.state.reason,
            };
            this.complain(params);
        }
    }
    saveContent(e) {
        this.setState({
            content:e.target.value
        })
    }
    changeStatus(id) {
        var reasonList = this.state.reasonList.map(item => {
            if (item.id == id) {
                item.active = true;
            } else {
                item.active = false;
            }
            return item;
        });
        var reason;
        reasonList.map(item => {
            if (item.active) {
                reason = item.reason;
            }
        });
        this.setState({
            reason:reason,
            reasonList:reasonList
        })

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


    getJs(){
        Api
            .getJsApiConfig({url:'https://tih.cqkqinfo.com/views/p099/'})
            .then((res) => {
                if(res.code==0){
                    //写入b字段
                    wx.config({
                        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                        appId:res.data.appId, // 必填，公众号的唯一标识
                        timestamp:res.data.timestamp, // 必填，生成签名的时间戳
                        nonceStr:res.data.noncestr, // 必填，生成签名的随机串
                        signature:res.data.signature,// 必填，签名
                        jsApiList: ['previewImage','uploadImage','downloadImage'] // 必填，需要使用的JS接口列表
                    });
                }
            }, (e) => {
                this.setState({
                    msg:e.msg,
                    showIOS1:true
                })
            });
    }
    previewImg(url){
        event.stopPropagation();
        event.preventDefault();
        const arr = [];
        this.state.imgArr.map(item => {
            if (item) {
                arr.push(item);
            }
        });
        wx.previewImage({
            current: url, // 当前显示图片的http链接
            urls: arr // 需要预览的图片http链接列表
        });

    }
  componentDidMount() {
    this.getJs();
      this.getJs1();

  }


    alertTxt(e){
        if(this.state.imgArr.length>=5){
             this.setState({
                 open1:true
             })
            this.setState({
                open:false
            })
              this.setState({
                  msg:'最多只能上传5张图片',
                  showIOS1:true,
              })
        }else{
            upload=true;
            this.setState({
                open:true
            })
            this.setState({
                open1:false
            })
            this.getJs1();

        }
    }
    componentWillUnmount() {
        clearInterval(interval1);
    }
    deleteImg(url){
        event.stopPropagation();
        event.preventDefault();
        var images=this.state.imgArr;
        var s1=[];
        for(var i=0;i<images.length;i++)
        {
            if(url!=images[i]){
                s1.push(images[i]);
            }
        }
        var imgdata=[];
        for(var j=0;j<images.length;j++){
            if(url!=imgList[j]){
                imgdata.push(imgList[j])
            }
        }
        imgList=imgdata;
        this.setState({
            imgArr:s1
        })
        this.setState({
            fileList:[]
        })
        if (this.state.imgArr.length >=5) {
            this.setState({
                open1: true
            })

        }else{
            this.setState({
                open1: false
            })
        }

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
    imgShow(file){
        this.handleUpload(file)
    }

    render() {
        const {signature,sign,uploading,callback,OSSAccessKeyId,toptip,imgArr,reasonList}=this.state
        const { msg,open1 } = this.state;
        console.log(upload)
      const props = {
          multiple:true,
          beforeUpload: (file) => {
              this.showLoading('上传中');
              this.setState(({ fileList }) => ({
                  fileList: [...fileList, file],

              }));
              this.imgShow(file);
              return false;
          },
          fileList: this.state.fileList,
      };
      return (
        <div className="page-complain">

            <Toast icon="success-no-circle" show={this.state.showToast}>提交成功</Toast>
            <Dialog type="ios" title={this.state.style1.title} buttons={this.state.style1.buttons} show={this.state.showIOS1}>
                {msg}
            </Dialog>
                <div className="clearfix">
                </div>
                {toptip
                &&<div className="hc-toptip" >{toptip}</div>}
                <div className="header">
                    <img src="../../..//resources/images/complain-bg.png" />
                    <div className="header-title">感谢您为我们服务提供的宝贵意见</div>
                </div>
                <div className="complain-reason">
                    <div className="reason-title">
                        请选择原因
                    </div>
                    <div className="reason-box">
                        {reasonList&&reasonList.map((item,index)=>{
                            return(
                                <div  key={index}
                                      onClick={()=>{
                              this.changeStatus(item.id)
                               }}
                                      className={`reason-item ${item.active ? 'active' : ''}`}>{item.reason}</div>
                            )
                        })}
                    </div>
                </div>
                <div className="complain-suggest">
                    <div className="suggest-title">请输入投诉或建议的内容</div>
                    <div className="area-box">
                    <textarea   placeholder="请输入"
                                onChange={(e)=>{
                      this.saveContent(e)

                        }}/>
                    </div>
                </div>
                <div className="image-box">
                    <div className="img-title">请上传图片，最多5张，每张不超过2M</div>
                    <div className='img-choose-box'>
                        <div className='img-box3'>
                            <div className="img-item">
                                <Upload   disabled={open1}
                                    {...props} >
                                    <div onClick={(e)=>{
                                           this.alertTxt(e)
                                        }}>
                                        <img src="../../../resources/images/add-img.png" />
                                    </div>
                                </Upload>
                            </div>
                        </div>
                        {imgArr&&imgArr.map((item,index)=>{
                            return(
                                <div className='img-box3' key={index}>
                                    <div className='img-add' >   <Icon value="clear"
                                    onClick={
                                  ()=>{
                                 this.deleteImg(item)

                                  }}
                                        />
                                        <div>
                                           {!!item&&<img src={item} onClick={()=>{
                       this.previewImg(item)

                        }}/>}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                <div className='btn'>
                    <button  className="submit-btn"
                             onClick={()=>{
                    this.submitData()
                    }}
                        >
                        提交
                    </button>
                </div>
                <div className="empty-box"></div>
            </div>
        );
    }

}

export default Connect()(Widget);
