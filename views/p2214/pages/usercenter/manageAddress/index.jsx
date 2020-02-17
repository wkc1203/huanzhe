import React, { Component } from 'react';
import { Dialog } from 'react-weui';
import { Link } from 'react-router';
import { Button,Toast } from 'antd-mobile';
import hashHistory from 'react-router/lib/hashHistory';
import NoResult from '../../../components/noresult/NoResult';
import Connect from '../../../components/connect/Connect';
// import Func from './component/Func';
import * as Utils from '../../../utils/utils';
import * as Api from '../../../components/Api/Api';
import './index.scss';
class Widget extends Component {
    static contextTypes = {
        router: React.PropTypes.object,
    };
  constructor(props) {
    super(props);
    this.state = {
      dataList:'1',
      isShowAlert:false,
      showLoading:false,
      isShowAlert2:false,
      // 是否有列表
      itemShow:false,
      // 防止多次加载，锁
      lock:false,
      // 页码
      pageNum:1,
      sendData:{},
      style1: {
            title: '温馨提示',
            buttons: [
                {
                    type: 'default',
                    label: '取消',
                    onClick: this.cancal.bind(this)
                },
                {
                    type: 'primary',
                    label: '确定',
                    onClick: this.queding.bind(this)
                }
            ]
        },
        style2: {
            title: '提示',
            buttons: [
                {
                    type: 'default',
                    label: '否',
                    onClick: this.cancals.bind(this)
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
      this.getAddress()
      console.log('fromOrder=',this.props.location.query)
     // this.isRegistered();
     window.addEventListener('scroll',this.scrollEvent)

  }
  componentWillUnmount() {
    window.removeEventListener('scroll',this.scrollEvent)
    this.state.loadingTimer && clearTimeout(this.state.loadingTimer);
  }

  showLoading() {
        this.setState({showLoading: true});
        this.state.loadingTimer = setTimeout(()=> {
            this.setState({showLoading: false});
        }, 2000);
    }

  delayScrollFunc(fn, delay) {
      const now = new Date().getTime();
      if (now - this.lastScrollCall < delay) return;
      this.lastScrollCall = now;
      setTimeout(() => {
        fn;
      }, 500);
    }

  scrollEvent=()=>{

    var scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
    //滚动条滚动距离
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
    //窗口可视范围高度
    var clientHeight = window.innerHeight || Math.min(document.documentElement.clientHeight,document.body.clientHeight);

    if(clientHeight + scrollTop >= scrollHeight){
      if(!this.state.lock){
        this.setState({lock:true})
        if(!this.state.itemShow){
            this.delayScrollFunc(this.getAddress(this.state.pageNum+1),2000)
        }

      }
    }
    
  }

  // 获取地址
  getAddress(){
    const {
      pageNum
    } = this.state
    this.showLoading();
    Api.
      getAddressList({
        userId:window.localStorage.getItem('userId'),
        pageNum
      }).
      then(res=>{
        this.hideLoading();
        if(res.code==0&&res.data&&res.data.recordList.length>0){
          if(pageNum>1){
            this.setState({
              dataList:this.state.dataList.concat(res.data.recordList),
            })
          }else{
            this.setState({
              dataList:res.data.recordList
            })
          }
        }else{
          if(pageNum>1){
            this.setState({
              itemShow:true
            })
          }else{
            this.setState({
              dataList:[]
            })
          }
        }
      },e=>{
        this.hideLoading();
        this.setState({
          dataList:[]
        })
      })
  }
  // 新增地址
  addAddress=()=>{
    this.context.router.push({
        pathname:'/usercenter/addAddress',
        query:{
          fromOrder:this.props.location.query.fromOrder,
          id:this.props.location.query.id,
        }
    })
  }
  // 编辑地址
  editAddress=(item)=>{
    this.context.router.push({
        pathname:'/usercenter/addAddress',
        query:{
            fromOrder:'1',
            id:this.props.location.query.id,
            addressId:item.id,
            title:'编辑地址'
        }
    })
  }
  // 删除地址
  detel=(item)=>{
    this.setState({
      isShowAlert:true,
      sendData:item,
    })
  }
  // 取消弹框
  cancal=()=>{
    this.setState({
      isShowAlert:false,
      isShowAlert2:false
    })
  }
  // 取消弹框
  cancals=()=>{
    this.setState({
      isShowAlert:false,
      isShowAlert2:false
    })
  }
  // 确定弹框 -删除
  queding=()=>{
    // 删除
    this.updateOrder(3)
      this.setState({
        isShowAlert:false
      })
  }
  // 修改调用接口
  updateOrder=(status,defaultFlag,item)=>{
    // Toast.loading()
    let pary={
      userId:window.localStorage.getItem('userId'),
      status,
    }
    if(item){
      Object.assign(pary,{id:item.id})
    }else{
      Object.assign(pary,{id:this.state.sendData.id})
    }
    if(defaultFlag&&defaultFlag!=''){
      Object.assign(pary,{defaultFlag})
    }
    this.showLoading();
    Api.
      updateAddress(pary).
      then(res=>{
        // Toast.hide()
        this.hideLoading()
        if(res.code==0){
          if(status==3){
            Toast.info('删除成功',2)
          }
          if(status==1){
            Toast.info('设置成功',2)
          }
          this.setState({
            pageNum:1
          })
          setTimeout(()=>{
            this.getAddress(1)
          },1000)
          return
        }
        if(status==3){
          Toast.info('删除失败',2)
        }
        if(status==1){
            Toast.info('设置失败',2)
        }
      },e=>{
        this.hideLoading()
        if(status==3){
          Toast.info('删除失败',2)
        }
        if(status==1){
            Toast.info('设置失败',2)
        }
      })
  }
  // 前往详情页面
  goDetail=()=>{
    const { 
      sendData
    } = this.state
    this.context.router.push({
        pathname:'/ordermng/describedetail',
        query:{
            id:this.props.location.query.id,
            sendName:sendData.sendName,
            sendPhone:sendData.sendPhone,
            province:sendData.province,
            city:sendData.city,
            area:sendData.area,
            detailArea:sendData.detailArea
        }
      })
  }

  // 默认选中这个
  checkedThis=(e)=>{
    console.log('this.props.location.query.id=',e)
    
    // 发送请求更改默认选中
    this.setState({
      sendData:e
    })
    this.updateOrder(1,1,e)

    // 如果是新加地址哪儿，判断后跳转回去
    /*if(this.props.location.query&&this.props.location.query.fromOrder=='1'){
      console.log('this.props.id=',this.props.location.query)
      this.setState({
        isShowAlert2:true,
      })
    }*/
  }
  swichtThei=(e)=>{
    if(this.props.location.query.fromOrder=='1'){
      this.setState({
        sendData:e
      })
      console.log('eee=',e)
      this.context.router.push({
          pathname:'/ordermng/describedetail',
          query:{
              fromOrder:'1',
              id:this.props.location.query.id,
              sendName:e.name,
              sendPhone:e.phone,
              province:e.province,
              city:e.city,
              area:e.district,
              detailArea:e.address
          }
      })
    }
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
      dataList,
      itemShow,
      showLoading,
      style1,
      style2,
      isShowAlert,
      isShowAlert2
    }=this.state;
    return (
        <div className="page-manage-list">
          <div className="home "><span className="jian"
                                        onClick={()=>{
                                            if(this.props.location.query.fromOrder=='1'){
                                                this.context.router.push({
                                                    pathname:'/ordermng/describedetail',
                                                    query:{
                                                      id:this.props.location.query.id,
                                                    }
                                                });
                                            }else{
                                                this.context.router.goBack();
                                            }
                                           
                                      }} 
                ></span>地址管理
            </div>
           {
            dataList&&dataList.length>0&&dataList!='1'&&dataList.map((item,index)=>{
              return(
                <div className='card' key={index} onClick={e=>this.swichtThei(item)}>
                  <div className='card-heard'>
                    <p>
                      <span className='card-yanse'>{item.name}</span>
                      <span className='card-spant card-yanse'>
                      {item.phone}
                      </span>
                    </p>
                    <p className='card-heard-foot'>
                      <span>{item.province}</span>
                      <span className='card-spant'>{item.city}</span>
                      <span className='card-spant'>{item.district}</span>
                      <span className='card-spant'>{item.address}</span>
                    </p>
                  </div>
                  <div className='card-body'></div>
                  <div className='card-foot'>
                    <div className='card-foot-checked' onClick={e=>{e.stopPropagation();this.checkedThis(item)}}>
                      <input type='radio' name='danxuan' checked={item.defaultFlag==0?false:true}/>
                      <label className={item.defaultFlag==0?'':'checked-yanse'}>
                      默认地址
                      </label>
                    </div>
                    <div className='card-foot-caozuo'>
                      <Button type='primary' size='small' className='card-foot-caozuo-edit' onClick={e=>{e.stopPropagation();this.editAddress(item)}}>编辑</Button>
                      <Button type='primary' size='small' className='card-foot-caozuo-detel' onClick={e=>{e.stopPropagation();this.detel(item)}}>删除</Button>
                    </div>
                  </div>
                </div>
              )
            })
           }
           {dataList.length <= 0&&dataList!='1'&&<NoResult  msg='暂未查询到相关信息'/>}
           {
            itemShow&&dataList.length>0&&
            <div className="no-des displaytextcenter">
                <img src='./././resources/images/mygddl.png'/>     
                <p>没有更多的了</p>
             </div>
           }
           {/*<Toast icon="loading" show={showLoading}>Loading...</Toast>*/}
           <Dialog type="ios" title={style1.title} buttons={style1.buttons} show={isShowAlert}>
                确定要删除吗？
           </Dialog>
           <Dialog type="ios" title={style2.title} buttons={style2.buttons} show={isShowAlert2}>
                设置默认地址成功，是否前往订单页面？
           </Dialog>
           {
            dataList!='1'&&
           <Button type='primary' size='' className='manage-add-btn' onClick={this.addAddress}>新增地址</Button>
           }
        </div>
    );
  }
}
export default Connect()(Widget);
