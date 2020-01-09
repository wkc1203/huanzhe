import React, { Component } from 'react';
import hashHistory from 'react-router/lib/hashHistory';
import { Tab, TabBarItem, Article, CellsTitle, CellHeader, Cells, Cell, CellBody, CellFooter,
    FormCell, Label, Select, Button as ButtonN, ButtonArea} from 'react-weui';
import { Flex, List, InputItem, Toast,Button } from 'antd-mobile';
import { Form, Input } from 'antd';
import _ from 'lodash';
import Connect from '../../../../components/connect/Connect';
import { Tabs, TabBar } from 'antd-mobile'
import * as Utils from '../../../../utils/utils';
import * as Api from '../../../../components/Api/Api';
import 'index.scss';

import { valid_money } from '../../../../utils/rules'

class TabCardPerson extends Component {
  static contextTypes = {
    router: React.PropTypes.object
  }
  constructor (props) {
    super(props)
    this.state = {
      // xiugaistatus:false
    }
  }
  componentDidMount (){
    console.log('st66999999ate=')
    window.scrollTo(0, 0);
  }
  componentWillUnmount(){
    
  }
  // 切换tab
  qiehuan = (tab, index) => {
    console.log(index,66666)
    this.setState({tab:index})
  }
  
  // 保存
  baocun = (e) => {
    console.log('state=',this.state)
    console.log(e)
    e.preventDefault();
    const {
      form:{
        validateFields,
        getFieldsError,
        getFieldsValue,
        getFieldValue,
        resetFields,
      }
    } = this.props
    console.log('heit=',getFieldsValue())
    validateFields((_err,val)=>{
      const error = Object.values(getFieldsError()).filter(v => v && v[0])[0] || []
      console.log('err=',error)
      console.log('err=',_err)
      console.log('val=',val)
      if(error.length){
        Toast.info(error[0],2)
        return
      }
      var yuanshidata=Object.assign(getFieldsValue())
      var content=JSON.stringify(yuanshidata)
      // 提交修改信息
      this.submitInfo(content)
    })
    // window.location.reload()
  }
  // 
  submitInfo(content){
    Api
    .updatePersonInfo({
      hisId:'2214',
      patientTemplateId:this.props.patientTemplateId,
      patientCardNo:this.props.patientCardNo,
      content:content
    })
    .then((res)=>{
      console.log('res=',res)
      // ()=>this.props.setXiuGaiFlg(true)
      if(res.code==0){
        Toast.info('修改成功',2,()=>{console.log(525);this.props.baocun()})
      }
    },e=>{
      Toast.info('修改失败',2)
    })
  }

  // 修改
  xiugai = () => {
    this.props.setXiuGaiFlg(true)
  }
  // 返回
  fanhui = () => {
    this.props.setXiuGaiFlg(false)
  }

  render() {
    const {
      personGuDing,
      xiugaistatus,
      daixiugaiList,
      otherContent,
      form:{
        getFieldDecorator,
        getFieldProps
      }
    } = this.props

    return(
      <div className='person-card'>
        {
          !xiugaistatus ?
            <Cells className='person-card-form'>
              {
                personGuDing&&personGuDing.length>0?personGuDing.map((personItem,personIndex)=>{
                  return(
                    <Cell key={personIndex}>
                      <CellBody>
                        <Label>{personItem.name}</Label>
                      </CellBody>
                      <CellBody className='person-card-end'>
                          { personItem.value }
                      </CellBody>
                    </Cell>
                  )
                }):null
              }
              {
                  otherContent&&otherContent.length>0?otherContent.map((cellItem,cellIndex)=>{
                    return(
                      <Cell key={cellItem.id}>
                        <CellBody>
                          <Label>{cellItem.name}</Label>
                        </CellBody>
                        <CellBody className='person-card-end'>
                            { cellItem.value }
                        </CellBody>
                      </Cell>
                    )
                  }):null
              }
              {
                personGuDing?
                  <div className='xiugai-div'>
                    <ButtonN type='primary' className={`${daixiugaiList&&daixiugaiList.length>0?'':'xiugai-div-disable'}`} onClick = { this.xiugai } disabled={daixiugaiList&&daixiugaiList.length>0?false:true}>修改</ButtonN>
                  </div>:
                  <div className='queshengye'>未获取到用户信息</div>
              }
              
            </Cells>:
            <Form className='person-card-form' onSubmit={this.baocun}>
              {
                personGuDing&&personGuDing.length>0?personGuDing.map((personItem,personIndex)=>{
                  return(
                    <Cell key={personIndex}>
                      <CellBody>
                        <Label>{personItem.name}</Label>
                      </CellBody>
                      <CellBody className='person-card-end'>
                          { personItem.value }
                      </CellBody>
                    </Cell>
                  )
                }):null
              }
              {
                  daixiugaiList&&daixiugaiList.length>0?daixiugaiList.map((waitItem,waitIndex)=>{
                    return(
                      <Cell key={waitItem.title}>
                        <CellBody>
                          <Label>{waitItem.title}</Label>
                        </CellBody>
                        <CellBody className='huise'>
                          <List>
                            <InputItem
                              placeholder="请输入"
                              {
                                ...getFieldProps(`${waitItem.title}`,{
                                  rules: [{required:waitItem.need==1?true:false,message:`请输入${waitItem.title}`}],
                                  initialValue:waitItem.value
                                })
                              }
                              
                            />
                          </List>
                        </CellBody>
                    </Cell>
                    )
                  }):null
                
              }
                <Form.Item>
                  <div className='xiugai-div'>
                    <ButtonN type='primary' className='xiugai-div-btn' >保存</ButtonN>
                    <ButtonN type='default' className='xiugai-div-fanhui' onClick = { this.fanhui }>返回</ButtonN>
                  </div>
                </Form.Item>
            </Form>
        }
        <div className="tarbar">
          <div  onClick={()=> {hashHistory.replace({pathname:'/ask/index'})}}>
          <img  src="./././resources/images/suifang.jpg"/>
          <div>随访管理</div>
          </div>
          <div className='inquiry'  onClick={()=> {hashHistory.replace({pathname:'/usercenter/mytabcard'})}}>
          <img  src="./././resources/images/hightMy.jpg"/>
          <div>我的</div>
          </div>
          <div style={{display:'none'}}></div>
        </div>
      </div>
    )
  }
}
TabCardPerson = Form.create({})(TabCardPerson);
export default Connect()(TabCardPerson);