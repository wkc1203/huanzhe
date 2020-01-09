import React, { Component } from 'react';
import hashHistory from 'react-router/lib/hashHistory';
import { Dialog } from 'react-weui';
import Connect from '../../../components/connect/Connect';
import * as Utils from '../../../utils/utils';
import * as Api from '../../../components/Api/Api';
import './index.scss';

// 宣教详情
class XuanJiaoDetail extends Component {
  static contextTypes = {
    router: React.PropTypes.object
  }
  constructor (props) {
    super(props)
    this.state = {
      title:'',
      keshi:'',
      biaoqian:'',
      content:'',
      time:'',
      msg:'',
      showIOS1:false,
      style1: {
        buttons: [
          {
            label: '确定',
            onClick: this.hideDialog.bind(this)
          }
        ]
        },
    }
  }
  componentDidMount(){
    const { id } = this.props.location.query
    // const datastring=window.sessionStorage.getItem('xuanjiao')
    // if(datastring){
    //   const data=JSON.parse(datastring)
    //   this.setState({
    //     title:data.title,
    //     keshi:data.deptName,
    //     biaoqian:data.keyWords,
    //     content:data.content
    //   },()=>{console.log(this.state)})
    // }
    if(id){
      this.getJiankangXuanJiaoDetail(id)
    }
  }
  // 获取详情页
  getJiankangXuanJiaoDetail(id){
    Api
    .getJiankangXuanJiaoDetail({
      id:id
    }).then((res)=>{
      console.log('res=',res)
      if(res.code==0&&res.data){
        console.log('res=',res.data)
        const {
          title,
          deptName,
          keyWords,
          content,
          createTime
        } = res.data
        this.setState({
          title:title,
          keshi:deptName,
          biaoqian:keyWords,
          content:content,
          time:createTime
        })
      }else{
        console.log('77777')
        this.setState({
          showIOS1:true,
          msg:'未获取到数据',
        })
      }
        
    },e=>{
      this.setState({
        showIOS1:true,
        msg:'未获取到数据',
      })
    })
  }
  hideDialog(){
    this.setState({
      showIOS1: false,
    });
  }
  render(){
    const {
      title,
      keshi,
      biaoqian,
      content,
      msg
    } = this.state
    return(
      <div>
        <h3 className='xuanjiao-detail-tile'>{title}</h3>
        {/*<div className='xuanjiao-detail-keshi'>{keshi}</div>
        <div className='xuanjiao-detail-tile'>{biaoqian}</div>*/}
        <div dangerouslySetInnerHTML={{__html:content}}>
        </div>
      </div>
    )
  }
}
export default Connect()(XuanJiaoDetail);