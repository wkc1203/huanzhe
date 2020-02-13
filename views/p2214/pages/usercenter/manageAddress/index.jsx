import React, { Component } from 'react';
import { Dialog,Toast } from 'react-weui';
import { Link } from 'react-router';
import { Button } from 'antd-mobile';
import hashHistory from 'react-router/lib/hashHistory';
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
     }
  }

  componentDidMount() {
      // this.hasReigister();
        //隐藏分享等按钮
      Utils.getJsByHide();
      this.getAddress()
     // this.isRegistered();

  }
  componentWillUnmount() {
  }


  // 获取地址
  getAddress(){
    this.setState({
      dataList:[
        {
          name:'王小二',
          phone:'133998654863',
          checked:false,
          address:'重庆市渝中区中渝9号',
          detailAddress:'15栋1-2'
        },
        {
          name:'王小二',
          phone:'133998654863',
          checked:true,
          address:'重庆市渝中区中渝9号',
          detailAddress:'15栋1-2'
        },
        {
          name:'王小二',
          phone:'133998654863',
          checked:false,
          address:'重庆市渝中区中渝9号',
          detailAddress:'15栋1-2'
        }
      ]
    })
  }
  // 新增地址
  addAddress=()=>{
    this.context.router.push({
        pathname:'/usercenter/addAddress',
        query:{
            type:0,
        }
    })
  }
  // 编辑地址
  editAddress=(item)=>{
    this.context.router.push({
        pathname:'/usercenter/addAddress',
        query:{
            name:item.name,
            phone:item.phone,
            address:item.address,
            checked:item.checked,
            detailAddress:item.detailAddress
        }
    })
  }
  // 删除地址
  detel=()=>{
    this.setState({
      isShowAlert:true,
    })
  }
  // 取消弹框
  cancal=()=>{
    this.setState({
      isShowAlert:false
    })
  }
  // 确定弹框
  queding=()=>{
    // 删除
    this.setState({
      isShowAlert:false
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
      dataList,
      style1,
      isShowAlert
    }=this.state;
    return (
        <div className="page-manage-list">
           {
            dataList&&dataList.length>0&&dataList!='1'&&dataList.map((item,index)=>{
              return(
                <div className='card' key={index}>
                  <div className='card-heard'>
                    <p>
                      {item.name}
                      <span>
                      {item.phone}
                      </span>
                    </p>
                    <p>
                    {item.address}
                    </p>
                  </div>
                  <div className='card-foot'>
                    <div className='card-foot-checked'>
                      <input type='radio' name='danxuan'/>
                      <span className=''>
                      默认地址
                      </span>
                    </div>
                    <div className='card-foot-caozuo'>
                      <Button type='primary' size='small' className='card-foot-caozuo-edit' onClick={e=>this.editAddress(item)}>编辑</Button>
                      <Button type='primary' size='small' onClick={this.detel}>删除</Button>
                    </div>
                  </div>
                </div>
              )
            })
           }
           <Dialog type="ios" title={style1.title} buttons={style1.buttons} show={isShowAlert}>
                确定要删除吗？
           </Dialog>
           <Button type='primary' size='' className='manage-add-btn' onClick={this.addAddress}>新增地址</Button>
        </div>
    );
  }
}
export default Connect()(Widget);
