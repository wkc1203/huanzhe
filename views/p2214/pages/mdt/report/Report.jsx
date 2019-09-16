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
            mdtInfo:{},
            dept:[],

        };
    }

    componentDidMount(){
       this.setState({
        mdtInfo:JSON.parse(this.props.location.query.info),
        dept:[],
       })  
       console.log('info',this.state.mdtInfo)
    }
   
   
    render() {
        const {mdtInfo,dept,reasonList,isSub,imgType}=this.state
        const { msg} = this.state;           
        return (    
            <div className="page-mdt-report">
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
                <div className= 'title'>
                <div>重庆医科大学附属儿童医院</div>
                <div>多学科会诊报告</div>
                </div>
                    
             <div className= 'people'>
                <div> 
                    <img src='/images/hzdx@2x.png'/>
                    <span>会诊对象</span>
                </div>
                <div className='peopleMsg'>
                    <div className= 'name'>{mdtInfo.info.patientName}</div>
                    <div className= 'msg'>
                        <span>性别：{mdtInfo.info.patientSex}</span>
                        <span>年龄：{mdtInfo.info.patientAge}</span>
                        <span>就诊卡号：{mdtInfo.info.patientCardNo}</span>
                    </div>
                </div>
            </div>
    
             <div className= 'people'>
                <div> 
                    <img src='/images/sxzj@2x.png'/>
                    <span>首席专家</span>
                </div>
                <div className='peopleMsg'>
                   <span>{mdtInfo.info.patientDoctorName}（{mdtInfo.info.patientDoctorTitle}） </span>
                </div>
            </div>
    
            <div className= 'people'>
                <div> 
                    <img src='/images/hzsj@2x.png'/>
                    <span>会诊时间</span>
                </div>
                <div className='peopleMsg'>
                   <span>{mdtInfo.info.consultationTime}</span>
                </div>
            </div>
    
            <div className= 'people'>
                <div> 
                    <img src='/images/hzzj@2x.png'/>
                    <span>会诊专家</span>
                </div>
                <div className='peopleMsg'>
                   <span>
                     {!!mdtInfo.doctor&&mdtInfo.doctor.map((item,index)=>{
                     
                     })} 
                    </span>
                </div>
            </div>
            <div className= 'descript'>
                <div> 
                    <img src='/images/bqbcms@2x.png'/>
                    <span>主治医师陈川荣汇报病史</span>
                </div>
                <div className='descript1'>
                   <text > lorem lorem lorem lorem lorem lorem  lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem</text>
                    <div >
                        <div className= 'imageType'>
                            <img src='/images/jx@2x.png'/>
                            <text>图片类型</text>
                            <div>
                                <img src = '/images/addM.png'/>
                                <img src = '/images/addM.png'/>
                                <img src = '/images/addM.png'/>
                                <img src = '/images/addM.png'/>
                                <img src = '/images/addM.png'/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>  
    
            <div className='doctorReport'>
               {!!dept&&dept.length>0&&dept.map((item,index)=>{
                 retrun(
                  <div className='dept' >
                    <div className='deptName'>{item.name}</div>
                    <div className="doctorDes">{item.doctor1}</div>
                    <div className="doctorDes">{item.doctor2}</div>
                </div>
                 )
               })}
                
            </div>   
    
               
            </div>
        );
    }
}
export default Connect()(Widget);
