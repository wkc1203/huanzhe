import React, { Component } from 'react';
import { Button, Toptips,Dialog,Toast ,showTips} from 'react-weui';
import { Switch,List,Toast as Toasts } from 'antd-mobile'
import Connect from '../../../components/connect/Connect';
import Link from 'react-router/lib/Link';
import * as Api from '../../../components/Api/Api';
import * as Utils from '../../../utils/utils';
import { dateTimeDate } from '../../../utils/utils';
import './style/index.scss';
import hashHistory from 'react-router/lib/hashHistory';
class Widget extends Component {
    static contextTypes = {
        router: React.PropTypes.object,
    };
  constructor(props) {
    super(props);
    this.state = {
        dialogConfig1: {
            title: '处方药品退费申请',
            type: 'ios',
            buttons: [
              {
                type: 'default',
                label: '取消',
                onClick: () => {
                  this.closeDialog1();
                }
              },
              {
                type: 'primary',
                label: '确定',
                onClick: () => {
                  this.cancelOrder();
                }
              }
            ],
            show: false,
          },
          dialogConfig: {
            title:'请选择取消的原因',
            type: 'ios',
            buttons: [
              {
                type: 'default',
                label: '取消',
                onClick: () => {
                  this.closeDialog();
                }
              },
              {
                type: 'primary',
                label: '确定',
                onClick: () => {
                  this.cancelOrder();
                }
              }
            ],
            show: false,
          },
        showToast: false,
        showLoading: false,
        toastTimer: null, 
        loadingTimer: null,
        showIOS1: false,
        showIOS2: false,
        // 是否含有不可配送药，弹框
        showIOS4: false,
        // 没有地址，添加地址
        showIOS5:false,
        showAndroid1: false,
        showAndroid2: false,
        tipsConfig: {
            type: 'warn',
            show: false,
          },
          tipsText: '取消原因不能为空',
        style1: {
            buttons: [
                {
                    label: '确定',
                    onClick: Utils.hideDialog.bind(this)
                }
            ]
        },
        style2: {
            title: '请选择取消的原因',
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
        style3: {
            title: '温馨提示',
            buttons: [
                {
                    type: 'default',
                    label: '到院取药',
                    onClick: this.goHosiptal.bind(this)
                },
                {
                    type: 'primary',
                    label: '立即配送',
                    onClick: this.goPeiSong.bind(this)
                }
            ]
        },
        style4: {
            title: '温馨提示',
            buttons: [
                {
                    type: 'default',
                    label: '取消',
                    onClick: this.bujieshou.bind(this)
                },
                {
                    type: 'primary',
                    label: '接受到院取药',
                    onClick: this.jieshouGoHosiptal.bind(this)
                }
            ]
        },
        style5: {
            title: '温馨提示',
            buttons: [
                {
                    type: 'default',
                    label: '取消',
                    onClick: this.notAddRess.bind(this)
                },
                {
                    type: 'primary',
                    label: '去添加地址',
                    onClick: this.gotoAddress.bind(this)
                }
            ]
        },
        msg:'',
        msg:'',
        describeDetail:{},
        edit:false,
        phone:'',
        mainDiagnosis:'',
        showMore:false,
        showType:'1',
        // 邮寄费用Id
        youjiAddressId:'',
        // 支付成功后，弹框选中取药方式
        isShowGetType:false,
        // 配送地址默认为不配送
        checked:false,
        // 是否显示地址切换按钮
        isShowCheckType:true,
        // 是否显示地址
        isShowDiv:false,
        sendName:'',
        sendPhone:'',
        province:'',
        city:'',
        area:'',
        detailArea:'',
        // 快递单号
        mailNum:'',
        // 切换地址switch是否可选中
        isCheckSwitch:false,
        // 处方是否可以配送
        isNotPeiSong:true,
        // 药品配送几个字是否需要展示
        isShowPeiSong:false,
        // 订单信息
        isOrderInfoShow:false,
    };
  }
  componentDidMount() {
        //隐藏分享等按钮
      Utils.getJsByHide();   
      this.getDetail(this.props.location.query.id);
      // 支付成功后第一次查看，弹框选中配送方式
      // this.setState({
      //     isShowGetType:true
      // })
      // if(this.props.location.query){
      //   const {
      //     query:{
      //       sendName='',
      //       sendPhone='',
      //       province='',
      //       city='',
      //       area='',
      //       detailArea=''
      //     }
      //   } = this.props.location
      //   this.setState({
      //       isShowDiv:true,
      //       sendName,
      //       sendPhone,
      //       province,
      //       city,
      //       area,
      //       detailArea
      //     })
      // }
  }

    showToast() {
        this.setState({showToast: true});
        this.state.toastTimer = setTimeout(()=> {
            this.setState({showToast: false});
        }, 2000);
    }
  componentWillUnmount() {
    // 离开页面时结束所有可能异步逻辑
      this.state.leftTimer && clearInterval(this.state.leftTimer);
  }

  // 到医院取药
  goHosiptal=()=>{
    this.setState({
      isShowGetType:false,
      isShowDiv:false
    })
  }
  // 快递取药
  goPeiSong=()=>{
    this.setState({
      isShowGetType:false,
      checked:true
    })
    this.goGetAddress()
  }

  pay() {
   /*  this.context.router.push({
        pathname:'consult/pay',
        query:{hospitalUserId:this.state.describeDetail.hospitalUserId,source:'describe1',hospitalTradeno:this.state.describeDetail.subscribeOrderNo}
    })  */
    // 判断是否含有不可配送药品
    if(this.state.isNotPeiSong){
      this.setState({
        showIOS4:true
      })
    }else{
      this.context.router.push({
          pathname:'consult/pay',
          query:{userId:this.state.describeDetail.userId,source:'describe2',id:this.state.describeDetail.id,orderId:this.state.describeDetail.orderStr}
      })
    }
  }
  // 不接受到院取药
  bujieshou=()=>{
    this.setState({
      showIOS4:false
    })
  }
  // 接受到院取药
  jieshouGoHosiptal=()=>{
    this.bujieshou()
    this.context.router.push({
        pathname:'consult/pay',
        query:{userId:this.state.describeDetail.userId,source:'describe2',id:this.state.describeDetail.id,orderId:this.state.describeDetail.orderStr}
    })
  }

  cancelOrder()
    {
    var select = '';
    var cancelVal;
    for (var i = 0; i < 3; i++) {
        if (this.refs.cancelInpt.checkbox1[i].checked == true) {
        select = select + ' ' + this.refs.cancelInpt.checkbox1[i].value;
        }
    }
    if (select !== '' && this.refs.yuanyin.value == '') {
        cancelVal = select;
    }
    if (this.refs.cancelInpt.checkbox1.value == '' && this.refs.yuanyin.value !== '') {
        cancelVal = (this.refs.yuanyin.value || '').replace(/(^\s*)|(\s*$)/g, '');
    }
    if (select !== '' && this.refs.yuanyin.value !== '') {
        cancelVal = (select + ' ' + this.refs.yuanyin.value || '').replace(/(^\s*)|(\s*$)/g, '');
    }
    if (select == '' && this.refs.yuanyin.value == '') {
        this.showTips('取消原因不能为空,请选择或填写');
        return;
    }
    if (this.refs.yuanyin.value.length > 100) {
        this.showTips('取消原因太长');
        return;
    }
    this.closeDialog();
    if(this.state.showType=='1'){
      this.cancle(cancelVal);
    }else{
      this.returnMoney(cancelVal);
    }
    
    }
    showTips(text) {
      let { tipsConfig, tipsText }=this.state;
      tipsConfig.type = 'warn';
      tipsConfig.show = true;
      tipsText = text || '取消原因不能为空';
      this.setState({
        tipsText: tipsText,
        tipsConfig: tipsConfig
      });
      this.state.tipsTimer = setTimeout(()=> {
        tipsConfig.show = false;
        this.setState({
          tipsText: tipsText,
        });
      }, 2000);
    }
    returnMoney(cancelVal){
      Api
      .returnDescribe({ 
          id:this.state.describeDetail.id,
          cancelReason:cancelVal,
          hisId:'2214'  
      })
      .then((res) => {
          if (res.code == 0) {
                   this.closeDialog1();
                  this.getDetail(this.state.describeDetail.id)
          }else{
            this.closeDialog1();
            this.hideLoading();
          }
      }, e=> {
      this.hideLoading();
      this.closeDialog1();
          this.setState({
              msg:e.msg,
              showIOS1:true
          })
      });
}
  cancle(cancelVal){
        Api
        .cancleDescribe({ 
            id:this.state.describeDetail.id,
            cancelReason:cancelVal,
            hisId:'2214'  
        })
        .then((res) => {
            if (res.code == 0) {
                    this.getDetail(this.state.describeDetail.id)
                    this.closeDialog();
            }else{
            this.hideLoading();
            this.closeDialog();
            }
        }, e=> {
        this.hideLoading();
        this.closeDialog();
            this.setState({
                msg:e.msg,
                showIOS1:true
            })
        });
  }
  /*获取订单详情*/
  getDetail(id) {
    this.showLoading();
       Api
           .getDescribeDetail({ 
               id:id,
               signFlag:'1',
               hisId:'2214'  
           })
           .then((res) => {
               if (res.code == 0) {
                  this.hideLoading();
                  var info=res.data;
                  info.addInfo=!!res.data.subscribeInfo?JSON.parse(res.data.subscribeInfo):'';
                  info.drugList=!!res.data.recipelList?JSON.parse(res.data.recipelList):'';
                  console.log(info)
                  
                    // 是否可以配送
                    if(info.drugList&&info.drugList!=''&&info.drugList.length>0){
                      let ziti=info.drugList.map((item,index)=>{
                        if(item.Express_flag==1){
                          return true
                        }else{
                          return false
                        }
                      })
                      if(ziti.toString().indexOf('false')>-1){
                        window.localStorage.setItem('isziti',2)
                        this.setState({
                          isNotPeiSong:true,
                          // isShowPeiSong:false
                        })
                      }else{
                        window.localStorage.setItem('isziti',1)
                        this.setState({
                          isNotPeiSong:false
                        })
                      }

                      if(info.status==4){
                        this.setState({
                          isOrderInfoShow:true
                        })
                        if(info.payTime&&info.payTime!=''){
                          let shicha=new Date().getTime()-(new Date(info.payTime).getTime())
                          if((shicha/60000)<29.5){
                             // 没有选中过，
                            if(window.localStorage.getItem('isziti')&&window.localStorage.getItem('isziti')==1){
                              this.setState({
                               isShowPeiSong:true
                              })
                              if(info.deliveryDrugVo){
                                if(info.deliveryDrugVo.status&&info.deliveryDrugVo.status==0){
                                  let addr=JSON.parse(info.deliveryDrugVo.deliveryAddress)
                                  
                                    this.setState({
                                      isShowCheckType:true,
                                      youjiAddressId:addr.id,
                                      mailNum:info.deliveryDrugVo.billNo,
                                      sendName:addr.name,
                                      sendPhone:addr.phone,
                                      province:addr.province,
                                      city:addr.city,
                                      area:addr.district,
                                      detailArea:addr.address
                                    })
                                  
                                }
                                if(info.deliveryDrugVo.status&&info.deliveryDrugVo.status==1){
                                  let addr=JSON.parse(info.deliveryDrugVo.deliveryAddress)
                                  this.setState({
                                    isShowCheckType:false,
                                    youjiAddressId:addr.id,
                                    mailNum:info.deliveryDrugVo.billNo,
                                    sendName:addr.name,
                                    sendPhone:addr.phone,
                                    province:addr.province,
                                    city:addr.city,
                                    area:addr.district,
                                    detailArea:addr.address
                                  })
                                }
                                if(info.deliveryDrugVo.status&&info.deliveryDrugVo.status==2){
                                  this.setState({
                                    isCheckSwitch:true
                                  })
                                }
                              }else{
                                if(this.props.location.query.fromOrder=='1'){
                                  console.log('ts=',this.props.location.query)
                                  this.setState({
                                    isShowPeiSong:true,
                                    isShowCheckType:true,
                                    checked:true,
                                    isShowDiv:true,
                                    youjiAddressId:this.props.location.query.youjiAddressId,
                                    sendName:this.props.location.query.sendName,
                                    sendPhone:this.props.location.query.sendPhone,
                                    province:this.props.location.query.province,
                                    city:this.props.location.query.city,
                                    area:this.props.location.query.area,
                                    detailArea:this.props.location.query.detailArea
                                
                                  })
                                }else{
                                  this.setState({
                                    isShowGetType:true,
                                  })
                                }
                              }
                            }else{
                              this.setState({
                                isShowPeiSong:false
                              })
                            }
                          }else{
                              this.setState({
                                isCheckSwitch:true
                              })
                            }
                        }
                       

                      }

                    }

                  this.setState({
                      describeDetail:info
                  })
                  
               }else{
                this.hideLoading();
               }
           }, e=> {
            this.hideLoading();
               this.setState({
                   msg:e.msg,
                   showIOS1:true
               })
           });
  }
    cancelConfirm(type) {
      this.setState({showType:type})
      if(type=='1'){
        const { dialogConfig } = this.state;
        dialogConfig.show = true;
        this.setState({ dialogConfig});
      }else{
        const { dialogConfig1 } = this.state;
        dialogConfig1.show = true;
        this.setState({ dialogConfig1});
      }
        
    }
    closeDialog() {
      const { dialogConfig } = this.state;
      dialogConfig.show = false;
      this.setState({
        dialogConfig
      });
    }
    closeDialog1() {
      const { dialogConfig1 } = this.state;
      dialogConfig1.show = false;
      this.setState({
        dialogConfig1
      });
    }

    // 开启配送
    getAddress=(e)=>{
      console.log('e=',e)
      this.setState({
        checked:e
      })
      if(e){
        this.goGetAddress()
      }else{
        this.setState({
          isShowDiv:false
        })
      }
    }

    // 获取地址列表
    goGetAddress=()=>{
      Api.
        getAddressList({
          userId:window.localStorage.getItem('userId'),
          pageNum:1
        }).
        then(res=>{
          if(res.code==0&&res.data&&res.data.recordList.length>0){
            let checkItem=''
            for(let i=0;i<res.data.recordList.length;i++){
              if(res.data.recordList[i].defaultFlag==1){
                checkItem=res.data.recordList[i]
              }
            }
            console.log('checkItem=',checkItem)
            if(checkItem==''){
              checkItem=res.data.recordList[0]
            }
              this.setState({
                isShowDiv:true,
                youjiAddressId:checkItem.id,
                sendName:checkItem.name,
                sendPhone:checkItem.phone,
                province:checkItem.province,
                city:checkItem.city,
                area:checkItem.district,
                detailArea:checkItem.address
              })
            
          }else{
            // 弹框是否去新加地址
            this.setState({
              showIOS5:true,
              msg:'请先添加地址',
            })
              
            }
        })
    }
    // 不去添加地址
    notAddRess=()=>{
      this.setState({
        showIOS5:false,
        checked:false,
        isShowGetType:false,
        isShowDiv:false
      })
    }
    // 去添加地址
    gotoAddress=()=>{
      this.setState({
        showIOS5:false
      })
      this.context.router.push({
        pathname:'/usercenter/addAddress',
        query:{
          fromOrder:'1',
          id:this.props.location.query.id
        }
      })
    }

    // 跳转到地址列表
    goManageAddress=()=>{
      this.context.router.push({
            pathname:'/usercenter/manageaddress',
            query:{
              fromOrder:'1',
              id:this.props.location.query.id
            }
          })
    }
    // 跳转到邮费支付页面
    goPayMailMoney=(youfeiId)=>{
      // 查询
      const {
        youjiAddressId,
        sendName,
        sendPhone,
        province,
        city,
        area,
        detailArea
      } = this.state
      // if(youjiAddressId&&youjiAddressId!=''){
      //   // 修改地址
      //   this.updatePeiSongDrug()
      // }else{
      //   // 新增地址
      //   this.addPeiSongDrug()
      // }
      let zhifuPram={
        id:youjiAddressId,
        chronicDiseaseId:this.props.location.query.id,
        sendName,
        sendPhone,
        province,
        city,
        area,
        detailArea
      }
      window.localStorage.setItem('sendAddress',JSON.stringify(zhifuPram))
      this.context.router.push({
        pathname:'/consult/paymail',
        query:{
          orderId:youjiAddressId
        }
      })
    }
    // 修改邮寄订单
    updatePeiSongDrug=()=>{
      const {
        youjiAddressId,
        sendName,
        sendPhone,
        province,
        city,
        area,
        detailArea
      } = this.state
      Api.
        updatePeiSongDrug({
          userId:window.localStorage.getItem('userId'),
          id:youjiAddressId,
          deliveryAddress:JSON.stringify({
            id:youjiAddressId,
            name:sendName,
            phone:sendPhone,
            province,city,
            district:area,
            address:detailArea
          })
        }).
        then(res=>{
          if(res.code==0){
            this.context.router.push({
              pathname:'/consult/paymail',
              query:{
                orderId:youjiAddressId
              }
            })
          }
        })
    }
    // 新增邮寄订单
    addPeiSongDrug=()=>{
      const {
        // chronicDiseaseId,
        youjiAddressId,
        sendName,
        sendPhone,
        province,
        city,
        area,orderId,
        detailArea
      } = this.state
      Api.
        addPeiSongDrug({
          orderId:this.props.location.query.id,
          // chronicDiseaseId,
          userId:window.localStorage.getItem('userId'),
          deliveryAddress:JSON.stringify({
            id:youjiAddressId,
            name:sendName,
            phone:sendPhone,
            province,city,
            district:area,
            address:detailArea
          })
        }).
        then(res=>{
          if(res.code==0){
            this.context.router.push({
              pathname:'/consult/paymail',
              query:{
                orderId:youjiAddressId
              }
            })
          }
        })
    }
    // 复制运单号
    yunhaoCopy=()=>{
      const copyEle = document.querySelector('.contentText') // 获取要复制的节点
      const range = document.createRange(); // 创造range
      window.getSelection().removeAllRanges(); //清除页面中已有的selection
      range.selectNode(copyEle); // 选中需要复制的节点
      window.getSelection().addRange(range); // 执行选中元素
      const copyStatus = document.execCommand("Copy"); // 执行copy操作
      // 对成功与否定进行提示
      if (copyStatus) {
        Toasts.info('复制成功',2);
      } else {
        Toasts.info('复制失败',2);
      }
      window.getSelection().removeAllRanges(); //清除页面中已有的selection
    }

  render() {
    const {
      isShowDiv,sendName,
      sendPhone,province,
      city,area,detailArea,
      isShowCheckType,checked,
      isShowGetType,mailNum,isShowPeiSong,
      msg,describeDetail,isCheckSwitch,
      showType,mainDiagnosis,
      phone,orderDetail,isOrderInfoShow,
      leftTimeFlag,leftTime
    }=this.state
    let diagnosis =''
    if(!!describeDetail.diagnosis){
       diagnosis = describeDetail.diagnosis.split('|').length>2?describeDetail.diagnosis.split('|').splice(0,describeDetail.diagnosis.split('|').length-1).join('|') :describeDetail.diagnosis

    }

    return (
        <div className="container page-describe-detail">
            <div className="home "><span className="jian"
                                        onClick={()=>{
                                            if(this.props.location.query.source=='inquiry'){
                                                this.context.router.goBack();
                                            }else{
                                                this.context.router.push({
                                                    pathname:'ordermng/orderlist',
                                                    query:{userId:describeDetail.userId,busType:'describe'}
                                                });
                                            }
                                           
                                      }} 
                ></span>订单详情
            </div>
            <Toast icon="success-no-circle" show={this.state.showToast}>修改成功</Toast>
            <Dialog type="ios" title={this.state.style1.title} buttons={this.state.style1.buttons} show={this.state.showIOS1}>
                {msg}
            </Dialog>
            <div className='reason-modal'>
              {showType=='1'&&<Dialog {...this.state.dialogConfig} >
              <form ref="cancelInpt">
                <div className="because">
                  <div className="weui-cells weui-cells_checkbox">
                    <label className="weui-cell weui-check__label">
                      <div className="weui-cell__hd">
                        <input type="checkbox" className="weui-check" name="checkbox1" value='医生开错药品'/>
                        <i className="weui-icon-checked"></i>
                      </div>
                      <div className="weui-cell__bd">
                        <p>医生开错药品</p>
                      </div>
                    </label>
                    <label className="weui-cell weui-check__label">
                      <div className="weui-cell__hd">
                        <input type="checkbox" name="checkbox1" className="weui-check" value='药品费用太贵'/>
                        <i className="weui-icon-checked"></i>
                      </div>
                      <div className="weui-cell__bd">
                        <p>药品费用太贵</p>
                      </div>
                    </label>
                    <label className="weui-cell weui-check__label">
                      <div className="weui-cell__hd">
                        <input type="checkbox" name="checkbox1" className="weui-check" value='不想要该药品了'/>
                        <i className="weui-icon-checked"></i>
                      </div>
                      <div className="weui-cell__bd">
                        <p>不想要该药品了</p>
                      </div>
                    </label>
                  </div>
                  <textarea className="m-cancel-text" ref="yuanyin" placeholder="请输入取消原因"/>
                </div>
              </form>
            </Dialog>}
            {showType=='2'&&<Dialog {...this.state.dialogConfig1} >
              <form ref="cancelInpt">
                <div className="because">
                  <div className="weui-cells weui-cells_checkbox">
                    <label className="weui-cell weui-check__label">
                      <div className="weui-cell__hd">
                        <input type="checkbox" className="weui-check" name="checkbox1" value='医生开错药品'/>
                        <i className="weui-icon-checked"></i>
                      </div>
                      <div className="weui-cell__bd">
                        <p>医生开错药品</p>
                      </div>
                    </label>
                    <label className="weui-cell weui-check__label">
                      <div className="weui-cell__hd">
                        <input type="checkbox" name="checkbox1" className="weui-check" value='药品费用太贵'/>
                        <i className="weui-icon-checked"></i>
                      </div>
                      <div className="weui-cell__bd">
                        <p>药品费用太贵</p>
                      </div>
                    </label>
                    <label className="weui-cell weui-check__label">
                      <div className="weui-cell__hd">
                        <input type="checkbox" name="checkbox1" className="weui-check" value='不想要该药品了'/>
                        <i className="weui-icon-checked"></i>
                      </div>
                      <div className="weui-cell__bd">
                        <p>不想要该药品了</p>
                      </div>
                    </label>
                  </div>
                  <textarea className="m-cancel-text" ref="yuanyin" placeholder="请输入取消原因"/>
                </div>
              </form>
            </Dialog>}
            </div>
            
            
            <Toptips {...this.state.tipsConfig}>{this.state.tipsText}</Toptips>  
            <div className="describe-detail">
                {describeDetail.status=='3'&&<div className="order-status">
                    <div className="time">
                      {describeDetail.createDate}
                    </div>
                    <div className="status">
                       <div className="main_infos">
                           <img src='./././resources/images/des_daipay.png'/>
                           <p>
                               <span className='dai'>等待缴费</span>
                               <span className='yuan'>￥{describeDetail.totalFee/100}</span>
                           </p>
                       </div> 
                    </div>
                </div>}
                {describeDetail.status=='4'&&<div className="order-status">
                    <div className="time">
                      {describeDetail.payDate}
                    </div>
                    <div className="status">
                       <div className="main_infos">
                           <img src='./././resources/images/jfcg@2x.png'/>
                           <p>
                               <span className='dai'>缴费成功</span>
                               <span className='yuan'>￥{describeDetail.totalFee/100}</span>
                           </p>
                       </div> 
                    </div>
                </div>}
                {/*<div className='patient main-info'>*/}
                <div className='main-info'>
                <div className="title-tip">
                    <img src='./././resources/images/des_jiu.png'/>就诊人信息
                   
                          
                </div> 
                <div className='info items'> 
                    <div className='item'>
                        <p>姓名：<span>{describeDetail.patientName}</span></p>
                        <p>性别：<span>{describeDetail.patientSex}</span></p>
                        <p>年龄：<span>{describeDetail.patientAge}</span></p>
                    </div>  
                    <div className='item'>
                        <p>院区：<span>{!!describeDetail.addInfo&&!!describeDetail.addInfo.hospitalDistrict&&describeDetail.addInfo.hospitalDistrict}</span></p>
                    </div>
                    <div className='item'>
                        <p>就诊卡号：<span>{describeDetail.patCardNo}</span></p>
                    </div>
                    <div className='item'>
                        <p>科室：<span>{!!describeDetail.addInfo&&!!describeDetail.addInfo.deptName&&describeDetail.addInfo.deptName}</span></p>
                    </div>
                    <div className='item'>
                        <p>就诊时间：<span>{!!describeDetail.addInfo&&!!describeDetail.addInfo.viditDate&&describeDetail.addInfo.viditDate.substring(0,10) }</span></p>
                    </div>
                </div>
          </div>
          <div className='diagnosis main-info'>
                  <div className='title-tip'>
                      <img src='./././resources/images/des_zhen.png'/>诊断</div>
                  <div className="items">
                      {diagnosis}
                </div> 
          </div>
          
          {!!describeDetail.drugList&&!(describeDetail.status=='2'&&describeDetail.auditStatus=='0')&&<div className="handle main-info">
              <div className='title-tip'>
                <img src='./././resources/images/des_chu.png'/>
                药品处方
                <p className='title-info' onClick={()=>{
                  this.context.router.push({
                    pathname:'ordermng/describeinfo',
                    query:{detail:JSON.stringify(describeDetail)}
                  })
                }}>查看详情 <img src='./././resources/images/des_xyjt.png'/></p>
              </div>
  
              <div className="handle_content"> 
                <div className="handle_info">
                     {describeDetail.drugList&&describeDetail.drugList.map((item,index)=>{
                         return(
                            <div className="handle_item" key={index}>
                            <div className="name_tip">
                                <p className="left">{item.Drug_name}</p>
                                <p className="right">￥{item.price}</p>
                            </div>
                            <div className="drug_info">
                                <div className="info_item">
                                    <p className="left">规格：{item.Package_spec}</p>
                                    <p className="right">用量：{item.Dosage}{item.Dosage_unit}</p>
                                </div>
                                <div className="info_item">
                                    <p className="left">数量：{item.amount}{item.Package_units}</p>
                                    <p className="right">用法：{item.Administration}，{item.Freq_desc}</p>
                                </div>
                            </div>
                        </div> 
                         ) 
                     })}
                      <p className="totals">
                        共计￥{describeDetail.totalFee/100}
                      </p> 
                    </div> 
                <div className="des_docinfo">
                  <p>开方医师：{describeDetail.doctorName}（{describeDetail.deptName}）</p>
                  {!!describeDetail.auditDate&&<p>开方日期：{!!describeDetail.auditDate?describeDetail.auditDate:''}</p>}
                </div>
              </div>
            
                
          </div>} 
          {!!describeDetail.caseInfo&&!!describeDetail.caseInfo.recommend&&<div className='diagnosis main-info'>
                <div className='title-tip'>
                    <img src='./././resources/images/des_jian.png'/>建议</div>
                <div className="items">
                    {describeDetail.caseInfo.recommend}
                </div> 
          </div>}

          <Dialog type="ios" title={this.state.style3.title} buttons={this.state.style3.buttons} show={isShowGetType}>
                药品费用支付成功，您可选择到医院药房取药或直接将药品配送到家。
          </Dialog>
          <Dialog type="ios" title={this.state.style4.title} buttons={this.state.style4.buttons} show={this.state.showIOS4}>
                您的处方中含有医院自研类，冷藏类药品，将不支持药品配送，只能选择<span>到院取药</span>。
                若有特色情况确实无法到院取药，请联系医生重新开药或取消订单（取消订单后挂号费将不予退回）。
          </Dialog>
          <Dialog type="ios" title={this.state.style5.title} buttons={this.state.style5.buttons} show={this.state.showIOS5}>
                {msg}
          </Dialog>
          {
            isOrderInfoShow&&
              <div className='diagnosis main-info'>
                    <div className='title-tip'>
                        <img src='./././resources/images/dingdaninfo.png'/>订单信息</div>
                    <div className="items">
                        <div>
                          <p>
                            <span>
                              医院订单号：
                            </span>
                            <span className='order-info-span'>
                            {describeDetail.orderStr?describeDetail.orderStr:'-'}
                            </span>
                          </p>
                          <p className='dingdan-liushui'>
                            <span>
                              支付流水号：
                            </span>
                            <span className='dingdan-liushui-huanhang'>
                            {describeDetail.paySerialNumber?describeDetail.paySerialNumber:'-'}
                            </span>
                          </p>
                          <p>
                            <span>
                              支付时间：
                            </span>
                            <span className='order-info-span'>
                            {describeDetail.payTime&&describeDetail.payTime!=''?dateTimeDate(describeDetail.payTime):'-'}
                            </span>
                          </p>
                        </div>
                    </div> 
              </div>
          }
          {!!describeDetail&&isShowPeiSong&&<div className='diagnosis main-info'>
                <div className='title-tip'>
                    <img src='./././resources/images/yaopingpeisong.png'/>药品配送</div>
                <div className="items yaopingpeisong">
                      {
                        isShowCheckType?
                        <div>
                          <List className='list-yaopin'>
                            <List.Item
                              extra={<Switch
                                platform='ios'
                                disabled={isCheckSwitch}
                                checked={this.state.checked}
                                onChange={(e) => this.getAddress(e)}
                              />}
                            >将处方药品邮寄到家</List.Item>
                          </List>
                          <div onClick={this.goManageAddress} className={`address-info ${isShowDiv?'':'unshow-address'}`}>
                            <div className='address-info-left'>
                              <p className='send-address-info-ziti'>
                                <span>{sendName}</span>
                                <span className='youji-phone'>{sendPhone}</span>
                              </p>
                              <p>
                                <span>{province}</span>
                                <span className='youji-phone'>{city}</span>
                                <span className='youji-phone'>{area}</span>
                                <span className='youji-phone'>{detailArea}</span>
                              </p>
                            </div>
                            <img src='./././resources/images/des_xyjt.png' className='address-info-img'/>
                          </div>
                          </div>
                          :
                          <div>
                            <div className='send-address-info'>
                              <img src='./././resources/images/kdys.png' className='send-address-info-img'/>
                              <div>
                                <p>
                                  <span>运单号：</span>
                                  <span className='contentText send-address-info-ziti'>{mailNum}</span>
                                  <div className='yundan-fuzhi'>
                                    <span onClick={this.yunhaoCopy}>复制</span>
                                  </div>
                                </p>
                                <p>
                                  <span>配送方式：</span>
                                  <span className='send-address-info-ziti'>EMS（中国邮政速递物流）</span>
                                </p>
                              </div>
                            </div>
                            <div className='fenge-line'></div>
                            <div className='send-address-info'>
                              <img src='./././resources/images/dz.png' className='send-address-info-img'/>
                              <div>
                                <p>
                                  <span className='send-address-info-ziti'>{sendName}</span>
                                  <span className='send-address-info-ziti youji-phone'>{sendPhone}</span>
                                </p>
                                <p>
                                  <span>{province}</span>
                                  <span className='youji-phone'>{city}</span>
                                  <span className='youji-phone'>{area}</span>
                                  <span className='youji-phone'>{detailArea}</span>
                                </p>
                              </div>
                            </div>
                          </div>
                      }
                      
                </div> 
          </div>}
          <div className="confirm" >
              {describeDetail.status=='3'&&<p className='p1' onClick={()=>{
                  this.pay()
              }}>确定支付</p>}
              { (describeDetail.status=='1'||describeDetail.status=='2'||describeDetail.status=='3')&&  
              <p className='p2' onClick={()=>{
                  this.cancelConfirm(1)
                  // this.cancle()
              }}>取消订单</p>} 
              { (describeDetail.status=='12')&& 
              <p className='p2' style={{color:'white',background:'#ccc',border:'1px solid #ccc'}}>{describeDetail.statusName}</p>}
              
              {(describeDetail.status=='4')&& isShowCheckType&&!checked&&
              <p className='p2' onClick={()=>{ 
                  this.cancelConfirm(2)
                  // this.cancle()
              }}>申请退款</p>}
    
              {
                (describeDetail.status=='4')&&isShowCheckType&&checked&&
                <p className='p2' onClick={()=>{ 
                    this.goPayMailMoney()
                }}>下一步</p>
              }

          </div>
          </div>
    </div>
    ); 
  }
}
export default Connect()(Widget);