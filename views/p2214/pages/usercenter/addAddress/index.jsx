import React, { Component } from 'react';
import { Link } from 'react-router';
import { Switch,List,InputItem,Picker,TextareaItem,Toast } from 'antd-mobile';
import { Button,Dialog } from 'react-weui';
import { Form } from 'antd';
import hashHistory from 'react-router/lib/hashHistory';
import Connect from '../../../components/connect/Connect';
// import Func from './component/Func';
import * as Utils from '../../../utils/utils';
import { getRequestParamt } from '../../../utils/utils';
import { valid_name,valid_phone } from '../../../utils/rules';
import { city } from '../../../utils/city';
import * as Api from '../../../components/Api/Api';
import './index.scss';
class Widget extends Component {
    static contextTypes = {
        router: React.PropTypes.object,
    };
  constructor(props) {
    super(props);
    this.state = {
      name:'',
      phone:'',
      address:'',
      detailAddress:'',
      addressId:'',
      showLoading:false,
      checked:true,
      isShowAlert:false,
      isShowAlert2:false,
      addressTitle:'新增地址',
      msg:'',
      style1:{
        title:'提示',
        buttons:[{
          type:'primary',
          label:'确定',
          onClick:this.queding.bind(this)
        }]
      },
      style2: {
            title: '提示',
            buttons: [
                {
                    type: 'default',
                    label: '否',
                    onClick: this.goAddressList.bind(this)
                },
                {
                    type: 'primary',
                    label: '是',
                    onClick: this.goDetail.bind(this)
                }
            ]
        },
     }
  }

  componentDidMount() {
      // this.hasReigister();
        //隐藏分享等按钮
      Utils.getJsByHide();
      console.log('this.props.location.query=',this.props.location.query)
      if(this.props.location.query&&this.props.location.query.title){
        this.setState({
          addressTitle:this.props.location.query.title
        })
      }
      if(this.props.location.query&&this.props.location.query.addressId){
        this.getAddressById(this.props.location.query.addressId)
      }
      window.scrollTo(0,0);
     // this.isRegistered();

  }
  componentWillUnmount() {
    this.state.loadingTimer && clearTimeout(this.state.loadingTimer);
  }

  showLoading() {
      this.setState({showLoading: true});
      this.state.loadingTimer = setTimeout(()=> {
          this.setState({showLoading: false});
      }, 2000);
  }

  // 根据ID，查询详情
  getAddressById=(id)=>{
    // this.showLoading();
    Api.
      getAddressById({
        userId:window.localStorage.getItem('userId'),
        id
      }).
      then(res=>{
        // this.hideLoading();
        console.log('dsfad=',res.data)
        if(res.code==0&&res.data&&res.data.length>0){
          console.log('dsfad=',res.data[0],res.data[0].name)
          this.setState({
            addressId:res.data[0].id,
            name:res.data[0].name,
            phone:res.data[0].phone,
            detailAddress:res.data[0].address,
            checked:res.data[0].defaultFlag==1?true:false
          })
          this.setAddress(res.data[0].province,res.data[0].city,res.data[0].district)
        }
      },e=>{
        console.log('dsfad=',e)
        // this.hideLoading();
      })
  }

  // 设置地址
  setAddress=(province,cityt,district)=>{
    console.log('dt=',province,cityt,district)
        if(district){
          this.setState({
            address:[province,cityt]
          })
        }else{
          this.setState({
            address:[province,cityt,district]
          })
        }
  }

  // 保存
  baocun=(e,val)=>{
    // console.log('222',this.state)
    const {
      name,
      phone,
      address,
      detailAddress,
      checked
    } = this.state
      if(!/^[\u4e00-\u9fa5]{0,}$/g.test(name)){
        this.setState({
          isShowAlert:true,
          msg:'姓名只能输入汉字'
        })
        return
      }
      if(!/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/.test(phone)){
        this.setState({
          isShowAlert:true,
          msg:'输入的手机号码格式错误'
        })
        return
      }
      if(address==''||address.length<=0){
        this.setState({
          isShowAlert:true,
          msg:'请选择所在地区'
        })
        return
      }
      if(detailAddress==''||detailAddress.trim()==''){
        this.setState({
          isShowAlert:true,
          msg:'请输入详细地址'
        })
        return
      }
      this.setState({
        sendName:this.state.name,
        sendPhone:this.state.phone,
        province:this.state.address[0],
        city:this.state.address[1],
        area:this.state.address[2]?this.state.address[2]:'',
        detailArea:this.state.detailAddress,
      })
      // 添加地址
      if(this.state.addressId&&this.state.addressId!=''){
      // this.showLoading()
        let updateOrAdd={}
        Api.
          updateAddress({
            userId:window.localStorage.getItem('userId'),
            id:this.state.addressId,
            name,
            phone,
            province:address[0],
            city:address[1],
            district:address[2]?address[2]:'',
            address:this.state.detailAddress,
            defaultFlag:checked?1:0
          }).
          then(res=>{
            // this.hideLoading()
            updateOrAdd=res.data
            if(res.code==0){
              Toast.info('修改成功',2)
            }else{
              Toast.info('修改失败',2)
            }
          },e=>{
            // this.hideLoading()
            Toast.info('修改失败',2)
          })
      }else{
        // this.showLoading()
        Api.
          addAddressSave({
            userId:window.localStorage.getItem('userId'),
            name,
            phone,
            province:address[0],
            city:address[1],
            district:address[2]?address[2]:'',
            address:this.state.detailAddress,
            defaultFlag:checked?1:0
          }).
          then(res=>{
            // this.hideLoading();
           updateOrAdd=res.data
            if(res.code==0){
              Toast.info('新增成功',1)
            }else{
              Toast.info('新增失败',1)
            }
          },e=>{
            // this.hideLoading();
            Toast.info('新增失败',1)
          })
      }
      setTimeout(()=> {
        // 返回列表
        if(this.props.location.query&&this.props.location.query.fromOrder=='1'){
          // this.setState({
          //   isShowAlert2:true
          // })
          this.getAddress(updateOrAdd)
          
        }else{
          this.context.router.push({
            pathname:'/usercenter/manageaddress',
          })
        }
      }, 1000);
    // })
  }
  // 获取地址列表
   getAddress(updateOrAdd){
    // this.showLoading();
    Api.
      getAddressList({
        userId:window.localStorage.getItem('userId'),
        pageNum:1
      }).
      then(res=>{
        // this.hideLoading();
        if(res.code==0&&res.data&&res.data.recordList.length>1){
          // 去地址列表
            this.context.router.push({
              pathname:'/usercenter/manageaddress',
              query:{
                fromOrder:'1',
                id:this.props.location.query.id,
              }
            })
        }else{
          // 返回详情页
          const { 
            sendName,
            sendPhone,
            province,
            city,
            area,
            detailArea
          } = this.state
          this.context.router.push({
              pathname:'/ordermng/describedetail',
              query:{
                  fromOrder:'1',
                  id:this.props.location.query.id,
                  youjiAddressId:updateOrAdd.id,
                  sendName,
                  sendPhone,
                  province,
                  city,
                  area,
                  detailArea
              }
          })
        }
      },e=>{
        // this.hideLoading();
        this.context.router.push({
          pathname:'/usercenter/manageaddress',
          query:{
            fromOrder:'1'
          }
        })
      })
  }
  // 弹框确定
  queding=()=>{
    this.setState({
      isShowAlert:false,
    })
  }

  // 前往地址管理列表
  goAddressList=()=>{
    this.setState({
      isShowAlert2:false
    })
    this.context.router.push({
      pathname:'/usercenter/manageaddress',
      query:{
        fromOrder:this.props.location.query?this.props.location.query.fromOrder:''
      }
    })
  }

  // 前往详情页面
  goDetail=()=>{
    const { 
      sendName,
      sendPhone,
      province,
      city,
      area,
      detailArea
    } = this.state
    this.context.router.push({
        pathname:'/ordermng/describedetail',
        query:{
            id:this.props.location.query.id,
            sendName,
            sendPhone,
            province,
            city,
            area,
            detailArea
        }
      })
  }


//是否注册
hasReigister() {
    Api
        .isRegistered()
        .then((res) => {
               if(res.code==0&&res.msg=='hasBind'){
               }else{
                if(window.localStorage.getItem('back')==1){
                    this.context.router.push({
                        pathname:'home/index'
                    })
                }
               }
        }, (e) => {
                 if(e.msg=='hasBind'){
               }else{
                if(window.localStorage.getItem('back')==1){
                    this.context.router.push({
                        pathname:'home/index'
                    })
                }
               } 
        });
}
//是否注册
isRegistered() {
    Api
        .isRegistered()
        .then((res) => {
        }, (e) => {
        });
}

  render() {
    const {
      checked,
      name,
      phone,
      address,
      detailAddress,
      isShowAlert,
      isShowAlert2,
      style1,
      style2,
      msg,
      addressTitle
    }=this.state;
    
    return (
        <div >
          <div className="home "><span className="jian"
                                        onClick={()=>{
                                                this.context.router.goBack();
                                      }} 
                ></span>{addressTitle}
          </div>
          <div className="page-address-add">
            <Dialog type="ios" title={style1.title} buttons={style1.buttons} show={isShowAlert}>
                {msg}
            </Dialog>
            <Dialog type="ios" title={style2.title} buttons={style2.buttons} show={isShowAlert2}>
                新增地址成功，是否将此地址设为默认地址并前往订单页面？
            </Dialog>

            <div className='person-card-form'>
                <List className='list-radius'>
                  <InputItem
                    placeholder="请输入联系人姓名"
                    value={name}
                    onChange={e=>this.setState({name:e})}
                  >联系人</InputItem>
                </List>

                <List>
                  <InputItem
                    placeholder="请输入联系人电话"
                    value={phone}
                    onChange={e=>this.setState({phone:e})}
                  >联系电话</InputItem>
                </List>

                <List className='address-list'>
                  <Picker extra="请输入所在地区"
                    data={city}
                    value={address}
                    onChange={e=>this.setState({address:e})}
                  >
                    <List.Item arrow="horizontal">所在地区</List.Item>
                  </Picker>
                </List>

                <List className='list-radius-footer'>
                  <TextareaItem
                    title='详细地址'
                    placeholder="请输入详细地址信息,如街道、门牌号、小区、楼栋号、单元室等"
                    rows={2}
                    value={detailAddress}
                    onChange={e=>this.setState({detailAddress:e})}
                  />
                 
                </List>

                <List className='list-radius-switch'>
                  <List.Item
                    extra={
                      <Switch
                      onChange={e=>this.setState({checked:e})}
                      checked={checked}
                      color='red'
                      platform='ios'
                    />}
                  >设置默认地址</List.Item>
                </List>

                <div className='xiugai-div'>
                  <Button type='primary' className='xiugai-div-btn' onClick={this.baocun}>保存</Button>
                </div>
                
            </div>
        </div>
      </div>
    );
  }
}

// Widget = Form.create({})(Widget);
export default Connect()(Widget);
