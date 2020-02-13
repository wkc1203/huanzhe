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
      checked:true,
      isShowAlert:false,
      msg:'',
      style1:{
        title:'提示',
        buttons:[{
          type:'primary',
          label:'确定',
          onClick:this.queding.bind(this)
        }]
      }
     }
  }

  componentDidMount() {
      // this.hasReigister();
        //隐藏分享等按钮
      Utils.getJsByHide();
      const typ=getRequestParamt(this.props.location.query)
      this.setState({
        name:typ.name?decodeURI(typ.name):'',
        phone:typ.phone,
        address:decodeURI(typ.address?typ.address:''),
        detailAddress:typ.detailAddress?decodeURI(typ.detailAddress):null
      })
      // this.getAddress()
     // this.isRegistered();

  }
  componentWillUnmount() {
  }

  // 保存
  baocun=(e)=>{
    console.log('222',e)
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
        // Toast.info(error[0],2)
        this.setState({
          isShowAlert:true,
          msg:error[0]
        })
        return
      }
      var yuanshidata=Object.assign(getFieldsValue())
      var content=JSON.stringify(yuanshidata)
      // 提交修改信息
      // this.submitInfo(content)
    })
  }
  // 弹框确定
  queding=()=>{
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
      checked,
      name,
      phone,
      address,
      detailAddress,
      isShowAlert,
      style1,
      msg
    }=this.state;
    const {
      form:{
        getFieldDecorator,
        getFieldProps
      }
    } = this.props
    return (
        <div className="page-address-add">
          <Dialog type="ios" title={style1.title} buttons={style1.buttons} show={isShowAlert}>
              {msg}
          </Dialog>
          <Form className='person-card-form' onSubmit={this.baocun}>

                      <List>
                        <InputItem
                          placeholder="请输入联系人姓名"
                          {
                            ...getFieldProps('name',{
                              rules: [{required:true}],
                              initialValue:name
                            })
                          }
                        >联系人</InputItem>
                      </List>

                      <List>
                        <InputItem
                          placeholder="请输入联系人电话"
                          {
                            ...getFieldProps('phone',{
                              rules: [{required:true}],
                              initialValue:phone
                            })
                          }
                        >联系电话</InputItem>
                      </List>

                      <div>
                      <List className='address-list'>
                        <Picker extra="请输入所在地区"
                          data={city}
                          title=""
                          {...getFieldProps('address', {
                            rules:[{required:true}],
                            initialValue: ['340000', '341500', '341502'],
                          })}
                          onOk={e => console.log('ok', e)}
                          onDismiss={e => console.log('dismiss', e)}
                        >
                          <List.Item arrow="horizontal">所在地区</List.Item>
                        </Picker>
                      </List>
                      </div>

                      <List>
                        <TextareaItem
                          title='详细地址'
                          placeholder="请输入详细地址信息,如街道、门牌号、小区、楼栋号、单元室等"
                          rows={2}
                          {
                            ...getFieldProps('detailAddress',{
                              rules: [{required:true}],
                              initialValue:detailAddress
                            })
                          }
                        />
                       
                      </List>

                      <List>
                        <List.Item
                          extra={<Switch
                            checked={this.state.checked}
                            onChange={() => {
                              this.setState({
                                checked: !this.state.checked,
                              });
                            }}
                          />}
                        >设置默认地址</List.Item>
                      </List>

                <Form.Item>
                  <div className='xiugai-div'>
                    <Button type='primary' className='xiugai-div-btn' >保存</Button>
                  </div>
                </Form.Item>
            </Form>
        </div>
    );
  }
}

Widget = Form.create({})(Widget);
export default Connect()(Widget);
