import React, { Component } from 'react';
import { Link } from 'react-router';
import { Upload } from 'antd';
import { Button, Toptips,Switch,Dialog,Toast,Icon } from 'react-weui';
import Connect from '../../../components/connect/Connect';
import { ImagePicker } from 'antd-mobile';
import * as Utils from '../../../utils/utils';
import { addressMap } from '../../../config/constant/constant';
import * as Api from '../../../components/Api/Api';
import hashHistory from 'react-router/lib/hashHistory';
import 'style/index.scss';
var imgArr1=[];
var uuList=[];
var nameList=[];
var maxLength=0; 
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
            intervals:'',
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
            showIOS3: false,
            showAndroid1: false,
            showAndroid2: false,
            style1: {
                buttons: [
                    {
                        label: '确定',
                        onClick: this.mdtApply.bind(this)
                    }
                ]
            },
            style3: {
              buttons: [
                  {
                      label: '确定',
                      onClick: this.closeImg.bind(this)
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
            files:[],
            isIos:false,
            showlist:false,
            imgType:'',//图片类型
            imgList:[],//图片列表
        };
    }

    componentDidMount(){
      this.getJs1();
      sessionStorage.setItem('isApplyInfo',1);
      Utils.getJsByHide();
      this.setState({
        imgList:!!sessionStorage.getItem('imgList')?JSON.parse(sessionStorage.getItem('imgList')):[]
      }) 
      console.log(!!sessionStorage.getItem('imgList')?JSON.parse(sessionStorage.getItem('imgList')):[],this.state.imgList)
      if(this.state.imgList.length<=0){
        this.addType();
         } 
    }
    componentWillMount(){
      this.setState({
        imgList:!!sessionStorage.getItem('imgList')?JSON.parse(sessionStorage.getItem('imgList')):[]
      })
      console.log(!!sessionStorage.getItem('imgList')?JSON.parse(sessionStorage.getItem('imgList')):[],this.state.imgList)
   
    }
    /*放大图片*/
    previewImg(url) {
      const arr = [];
      var imgArr=[];
      for(var i=0;i<this.state.imgList.length;i++){
          console.log(this.state.imgList[i])
         for(var j=0;j<this.state.imgList[i].img.length;i++){
            imgArr.push(this.state.imgList[i].img[j])
         }
      } 
     imgArr.map(item => {
        if (item) {
            arr.push(item);
        }
     });
        wx.previewImage({
            current: url, // 当前显示图片的http链接
            urls: arr // 需要预览的图片http链接列表
        });
}
     /*获取oss 签名*/
    getJs1(){
      
     Api
          .getSign({bucket: 'ihoss', dir: "PIC"})
          .then((res) => {
              if (res.code == 0) {
                  this.hideLoading();
                  const sign={
                      signature:res.data.sign,
                      policy:res.data.policy,
                      callback:res.data.callback,
                      OSSAccessKeyId:res.data.accessId,
                  };
                 
                      this.setState({
                          sign:sign,
                          expire:res.data.expire
                      })
                  
              }
          }, (e) => {
          });
  }
  /*文件目录*/
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
    return  m;
}
  /* base64转换 */
  base64ToBlob(urlData) {
    var arr = urlData.split(',');
    var ua = navigator.userAgent.toLowerCase();//获取浏览器的userAgent,并转化为小写——注：userAgent是用户可以修改的
    var isIos = (ua.indexOf('iphone') != -1) || (ua.indexOf('ipad') != -1);//判断是否是苹果手机，是则是true
    var  mime ='';
    var bytes;
    
    mime = arr[0].match(/:(.*?);/)[1] || 'image/png';
    bytes = window.atob(arr[1]);
  
    // 去掉url的头，并转化为byte
    // 处理异常,将ascii码小于0的转换为大于0
    var ab = new ArrayBuffer(bytes.length);
    // 生成视图（直接针对内存）：8位无符号整数，长度1个字节
    var ia = new Uint8Array(ab);
    for (var i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i);
    }
    return new Blob([ab], {
        type: mime
    });
}
  /* 是否是图片 */
  isHasImg(url){
    var xmlHttp ;
    if (window.ActiveXObject)
     {
      xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
     }
     else if (window.XMLHttpRequest)
     {
      xmlHttp = new XMLHttpRequest();
     } 
    xmlHttp.open("Get",url,false);
    xmlHttp.send();
    if(xmlHttp.status==404)
    return false;
    else
    return true;
}
    mdtApply(){
        this.context.router.push({
            pathname:'/mdt/apply'
        })
    }
    closeImg(){
      this.setState({
        showIOS3:false,
      })
    }
  /* 上传图片 */
  onChange = (files,file,index) => {
    var that=this;
    if(!!file){
      //图片
      console.log(files,file,index)
      this.setState({
           files,
      });
      var sign=that.state.sign;
      that.showLoading('上传中');
      for(var i=0;i<files.length;i++){
            const formData = new FormData();
            var base64='';
            var reader = new FileReader();//创建一个字符流对象
            reader.readAsDataURL(files[i]);//读取本地图片
            reader.onload = function(e) {
                base64=this.result;
                var S4=(((1+Math.random())*0x10000)|0).toString(16).substring(1);
                var uuid=S4+S4+"-"+S4+"-"+S4+"-"+S4+"-"+S4+S4+S4;
                var filename=that.randomName()+uuid+'.png';
                //上传配置
                formData.append('key',filename);
                formData.append("policy",sign.policy);
                formData.append("callback",sign.callback);
                formData.append("signature",sign.signature);
                formData.append("OSSAccessKeyId",sign.OSSAccessKeyId); 
                formData.append('file',that.base64ToBlob(base64)); 
                $.ajax({
                      url: 'https://ihoss.oss-cn-beijing.aliyuncs.com', 
                      method: 'POST',
                      processData: false,
                      contentType: false,
                      cache: false, 
                      data: formData,
                      success: (e) => {
                          
                        if(that.isHasImg('https://ihoss.oss-cn-beijing.aliyuncs.com/'+filename)){
                              that.hideLoading();
                              var index=that.state.curIndex;
                              var list=that.state.imgList;
                              console.log(index,list.length)
                              if(index==0&&list.length<=0){
                                var info={};
                                info.type='';
                                info.img=[];
                                info.img.push('https://ihoss.oss-cn-beijing.aliyuncs.com/'+filename)
                                list.push(info);

                             }else{
                                for(var i=0;i<list.length;i++){
                                  if(index==i){
                                    //向列表中添加图片
                                    var img=list[i].img;
                                    img.push('https://ihoss.oss-cn-beijing.aliyuncs.com/'+filename)
                                  }
                                }
                             }
                              console.log(list)
                              that.setState({
                                imgList:list
                              })
                              sessionStorage.setItem('imgLength',!!sessionStorage.imgLength?sessionStorage.imgLength*1+1:1);

                              sessionStorage.setItem('imgList',JSON.stringify(that.state.imgList));

                          }
                      },
                      error:(e) =>{
                          that.hideLoading();
                      }
                  });
              }
            }
        }
  } 
  /* 新建类型 */
  addType(){
      console.log("212")
     if(this.state.imgList.length>=5){
            this.setState({ 
              showIOS3:true,
              msg:'最多只能创建5个类型的图片',
            })
     }else{
      var imgList=this.state.imgList;
      var list={}; 
      list.type='';
      list.img=[];
      imgList.push(list)
      this.setState({
        showlist:true,
        imgList:imgList
       })
       sessionStorage.setItem('imgList',JSON.stringify(this.state.imgList));
   
     }
  

  }
    addImg(e,index){
      this.setState({
        imgType:e.target.value
     })
        //将当前图片类型加入图片列表中去
        var imgList=this.state.imgList;
        console.log(this.state.imgList)
        imgList[index].type=e.target.value;
        this.setState({
          imgList:imgList
         })
         sessionStorage.setItem('imgList',JSON.stringify(this.state.imgList));

    }
    /* 删除图片 */
    delImg(index,index1){
      console.log(index,index1)
             var list=this.state.imgList;
             var len=list[index].img.length;
             var imgs=list[index].img;
             console.log(len)
             list[index].img=[];
             for(var j=0;j<len;j++){
                 
                 console.log(index1==j)
                 if(index1!=j){
                   console.log("gigi",imgs[j])
                  list[index].img.push(imgs[j]);
                  console.log(list[index])
                 }
             }
             console.log(list)
             this.setState({
              imgList:list
             })
             sessionStorage.setItem('imgLength',!!sessionStorage.imgLength>=1?sessionStorage.imgLength*1-1:0);
             sessionStorage.setItem('imgList',JSON.stringify(this.state.imgList));

       

    }
  /* 回到申请页面 */
    goApply(){
       for(var i=0;i<this.state.imgList.length;i++){
          
         if(this.state.imgList[i].img.length>0){
           console.log('ee')
           if(!this.state.imgList[i].type||this.state.imgList[i].type==''){
             this.setState({
               showIOS3:true,
               msg:'请为图片设置类型名称'
             })
             return false;
           }
         }
       }
     
      this.context.router.goBack();
    }
   
    render() {
        const {showlist,imgList,reasonList,isSub,imgType}=this.state
        const { msg} = this.state; 
        return (
            <div className="page-mdt-upload">
                <div className="home"><span className="jian"
                                            onClick={()=>{
                                              this.goApply();
                                      }}
                    ></span>创建多学科会诊
                </div>
                <Toast icon="success-no-circle" show={this.state.showToast}>{msg}</Toast>
                <Dialog type="ios" title={this.state.style1.title} buttons={this.state.style1.buttons} show={this.state.showIOS1}>
                    {msg}
                </Dialog>
                <Dialog type="ios" title={this.state.style3.title} buttons={this.state.style3.buttons} show={this.state.showIOS3}>
                    {msg}
                </Dialog>
               <div className="mdt-img">
                  <div className="upload-title">
                     <p className="left">上传图片</p>
                     <p className="right" onClick={()=>{
                       this.addType()
                     }}>
                       新建类型
                       <img src="../../../resources/images/upload-xzlx.png" alt=""/>
                     </p>
                  </div>
                  <div className="all-img">
                    <div className="img-list">
                         {
                           imgList.length>0&&imgList.map((item,index)=>{
                             return(
                              <div className="item" key={index}>
                              <p className="apply-title">
                                  图片类型：
                                  <input type="text" onChange={(e)=>{
                                    this.addImg(e,index)
                                 }} value={item.type} maxLength='20' placeholder='请点击输入图片类型'/>
                                 
                              </p>
                              <div className="img">
                                   {item.img&&item.img.length>0&&item.img.map((item1,index1)=>{
                                     return(
                                      <div className="img-item" key={index1}>
                                      <img className='del-img' onClick={()=>{
                                        this.delImg(index,index1)
                                      }} src="../../../resources/images/upload-xptgb.png" alt=""/>
                                      <img className='main-img' src={item1} alt="" onClick={()=>{
                                        this.previewImg(item)
                                      }} />
                                    </div>
                                     )
                                   })}
                                    {!!item.img&&item.img.length<=7&&<div className="img-item upImg">
                                        <img className='up-img' src="../../../resources/images/upload-zx.png" alt=""/>
                                        <input type="file" id="file"   onChange={(e) => { 
                                          this.setState({
                                            curIndex:index
                                          }) 
                                          this.onChange(e.target.files,e.target.files[0],0)
                                          }} accept="image/*" /> 
                                        <p>添加图片</p>
                                     </div>}
                              </div>
                          </div>
                             )
                           })
                         }
                         {/* showlist&&
                          <div className="item" >
                            <p className="apply-title">
                                图片类型：<input type="text" onChange={(e)=>{
                                   this.addImg(e)
                                }} value={imgType} maxLength='20' placeholder='请点击输入图片类型'/>
                            </p>
                            <div className="img">
                                  <div className="img-item upImg">
                                      <img className='up-img' src="../../../resources/images/upload-zx.png" alt=""/>
                                      <input type="file" id="file"   onChange={(e) => {
                                        this.onChange(e.target.files,e.target.files[0],0)
                                        }} accept="image/*" /> 
                                      <p>添加图片</p>
                                   </div>
                            </div>
                        </div> */
                        }
                    </div>
                    <p className='tip'>注意：最多新建5个类图片类型，每个类型最多上传8张图片。</p>
                     
                    </div>
                    {<div className="btn">
                    <button className="submit-btn1"
                            onClick={
                            ()=>{
                              this.goApply();
                            }}
                        >
                        确定
                    </button>
                </div>}
               </div>
               
            </div>
        );
    }
}
export default Connect()(Widget);
