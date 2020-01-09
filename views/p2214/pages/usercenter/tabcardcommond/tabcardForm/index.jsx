import React, { Component } from 'react';
import hashHistory from 'react-router/lib/hashHistory';
import { Tab, NavBar, NavBarItem, TabBody, Dialog, Article, Cells, Cell, CellHeader, CellBody, CellFooter, Select,Input,Label } from 'react-weui';
import { Form } from 'antd';
import { Button, Checkbox, Tabs, Flex, List, InputItem } from 'antd-mobile';
// 组件
// import TabCardComponent from '../tabcardcommond/tab/index'
// import TabCardSelect from '../tabcardcommond/select/index'
import Connect from '../../../../components/connect/Connect';
// 图标
// import Hightcharts from 'highcharts';
import * as Utils from '../../../../utils/utils';
import * as Api from '../../../../components/Api/Api';
// import './index.scss';

class AddForm extends Component {
  baocun (){
    console.log(33636)
  }
  render (){
    const {
      form:{
        getFieldDecorator,
        getFieldProps
      }
    } = this.props
    const valueProps=getFieldProps('height',{
       rules: [{ required: true, message: '请输入测量值' }],
    })
    return(
      <Form className='person-card-form' onSubmit={this.baocun}>
        <Cell>
          <CellBody>
            <Label>数据类型</Label>
          </CellBody>
          <CellBody className='huise'>
            <List>
              <Select data={[
                    {
                        value: 1,
                        label: '高血压'
                    },
                    {
                        value: 2,
                        label: '糖尿病'
                    }
                ]} />
            </List>
          </CellBody>
        </Cell>
        <Cell>
          <CellBody>
            <Label>测量值</Label>
          </CellBody>
          <CellBody className='huise'>
            <List>
              <InputItem {...valueProps} placeholder="请输入测量值" />
            </List>
          </CellBody>
        </Cell>
        <Cell>
          <CellBody>
            <Label>测量时间</Label>
          </CellBody>
          <CellBody className='huise'>
            <List>
              <Input type="date" defaultValue="" onChange={ e=> console.log(e.target.value)}/>
            </List>
          </CellBody>
        </Cell>
      </Form>
    )
  }
}
AddForm = Form.create({})(AddForm);
export default Connect()(AddForm);