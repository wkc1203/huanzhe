import React, { Component } from 'react';
import hashHistory from 'react-router/lib/hashHistory';
import { CellsTitle, Cells, Cell, CellBody, CellFooter, FlexItem, Article, Tab, NavBar, NavBarItem, TabBody } from 'react-weui';
import { Tabs, Flex, List, Button } from 'antd-mobile'
import Connect from '../../../components/connect/Connect';
import * as Utils from '../../../utils/utils';
import * as Api from '../../../components/Api/Api';
import cs from 'classnames';
import './style/index.scss';
        // <Form>
        //   <CellHeader>
        //     <Select data = { this.state.keshidata }>
        //   </CellHeader>
        //   </CellBody>
        //     <Select data = { this.state.kemudata }>
        //   </CellBody>
        // </Form>
const Item = List.Item;


// class UserCardWenJuan extends Component {
//   static contextTypes = {
//     router: React.PropTypes.object
//   }
//   constructor (props) {
//     super(props)
//     this.state = {
//       tabchild:0,
//       keshidata:[],
//       kemudata:[]
//     }
//   }

//   componentDidMount(){
//     // 获取问卷调查列表
//   }

//   render() {
//     return(
//       <div>
//         <Tab>
//           <NavBar>
//             <NavBarItem active = { this.state.tabchild == 0 } onClick = {e=>this.setState({tabchild:0})}>
//               待填写问卷
//             </NavBarItem>
//             <NavBarItem active = { this.state.tabchild == 1 } onClick = {e=>this.setState({tabchild:1})}>
//               历史问卷
//             </NavBarItem>
//           </NavBar>
//           <TabBody>
//             <Article style = { { display: this.state.tabchild == 0 ? null : 'none'} }>
//               <Flex>
//                 <FlexItem>
//                     <div className="placeholder">标题</div>
//                 </FlexItem>
//                 <FlexItem>
//                     <div className="placeholder">时间</div>
//                 </FlexItem>
//                 <FlexItem>
//                     <div className="placeholder">操作</div>
//                 </FlexItem>
//               </Flex>
//               <Cells>
//                 {
//                   daitianxielist.map((item,index) => {
//                     return (
//                       <Cell key={index}>
//                         <div>
//                           { item.title }
//                         </div>
//                         <div>
//                           { item.time }
//                         </div>
//                         <div onClick = { () => { console.log('tianxiewenjuan')} }>
//                           立即填写
//                         </div>
//                       </Cell>
//                     )
//                   })
//                 }
//               </Cells>
//             </Article>
//             <Article style = { { display: this.state.tabchild == 1 ? null : 'none'} }>
//               <div className='wenjuan-list'>
//                 <div className="placeholder">标题</div>
//                 <div className="placeholder">时间</div>
//                 <div className="placeholder">操作</div>
//               </div>
//             </Article>
//           </TabBody>
//         </Tab>
//       </div>
//     )
//   }
// }

class UserCardWenJuan extends Component {
  static contextTypes = {
    router: React.PropTypes.object
  }
  constructor (props) {
    super(props)
    this.state = {
      tabchild:0,
      keshidata:[],
      kemudata:[]
    }
  }

  componentDidMount(){
    // 获取问卷调查列表
  }
  
  render() {
    const {
      tabs,
      daiwen,
      historywen
    } = this.props
    return(
      <Tabs
        tabs={tabs}
        initialPage={0}
        onChange={(tab, index) => { console.log('onChange', index, tab); }}
        onTabClick={(tab, index) => { console.log('onTabClick', index, tab); }}
      >
        <div key='3652'>
          <Flex className='wenjuan-flex-list'>
            <Flex.Item className='wenjuan-flex-list-item'>
                <div className="placeholder">标题</div>
            </Flex.Item>
            <Flex.Item className='wenjuan-flex-list-item'>
                <div className="placeholder">时间</div>
            </Flex.Item>
            <Flex.Item className='wenjuan-flex-list-item'>
                <div className="placeholder">操作</div>
            </Flex.Item>
          </Flex>
          <Cells className='wenjuan-cells'>
            {
              daiwen.map((item,index) => {
                return (
                    <Flex key={index} className='wenjuan-flex-list'>
                      <Flex.Item className='wenjuan-flex-list-item'>
                        { item.title }
                      </Flex.Item>
                      <Flex.Item className='wenjuan-flex-list-item'>
                        { item.time }
                      </Flex.Item >
                      <Flex.Item className='wenjuan-flex-list-item'>
                        <Button type='primary' size='small' onClick = { () => { console.log('tianxiewenjuan')} }>立即填写</Button>
                      </Flex.Item >  
                    </Flex>
                )
              })
            }
          </Cells>
        </div>
        <div key='1251'>
          <Flex className='wenjuan-flex-list'>
            <Flex.Item className='wenjuan-flex-list-item'>
                <div className="placeholder">标题</div>
            </Flex.Item>
            <Flex.Item className='wenjuan-flex-list-item'>
                <div className="placeholder">时间</div>
            </Flex.Item>
            <Flex.Item className='wenjuan-flex-list-item'>
                <div className="placeholder">操作</div>
            </Flex.Item>
          </Flex>
          <Cells className='wenjuan-cells'>
            {
              historywen.map((itemt,indext) => {
                return (
                  <Flex key={indext} className='wenjuan-flex-list'>
                    <Flex.Item className='wenjuan-flex-list-item'>
                      { itemt.title }
                    </Flex.Item>
                    <Flex.Item className='wenjuan-flex-list-item'>
                      { itemt.time }
                    </Flex.Item >
                    <Flex.Item className='wenjuan-flex-list-item'>
                      <Button type='primary' size='small' onClick = { () => { console.log('tianxiewenjuan')} }>查看</Button>
                    </Flex.Item >  
                  </Flex>
                )
              })
            }
          </Cells>
        </div>
      </Tabs>
    )
  }
}
export default Connect()(UserCardWenJuan);