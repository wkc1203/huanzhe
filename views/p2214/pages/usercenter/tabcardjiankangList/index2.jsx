import React, { Component } from 'react';
import hashHistory from 'react-router/lib/hashHistory';
import { Button, Cells, Cell, CellBody, CellFooter, SearchBar } from 'react-weui';
import { Result, ListView } from 'antd-mobile';
import Connect from '../../../components/connect/Connect';
import TabManNav from '../tabcardcommond/tabman/index'
import cs from 'classnames';
import * as Utils from '../../../utils/utils';
import * as Api from '../../../components/Api/Api';
import './style/index.scss';

 const data = [{
    id:'123',
    title:'儿童糖尿病患者的日常饮食与注意',
    keshi:'内分泌科',
    biaoqian:'糖尿病；饮食；日常生活'
  },
  {
    id:'213',
    title:'儿童糖尿病患者的日常饮食与注意',
    keshi:'内分泌科',
    biaoqian:'糖尿病；饮食；日常生活'
  },
  {
    id:'312',
    title:'儿童糖尿病患者的日常饮食与注意',
    keshi:'内分泌科',
    biaoqian:'糖尿病；饮食；日常生活'
  }]

  
// 健康宣教
class UserCardXuanJiaoList extends Component {
  static contextTypes = {
    router: React.PropTypes.object
  }
  constructor (props) {
    super(props)
    this.state = {
      searchText:'',
      message:'',
      isShow:false,
      results:[],
      msg:'',
      patList:[],
      status:'0',
      cardNo:'',
      show1:false,
      show2:false,
      diseases:{},
      dept:{},
      recordList:[],
      deptList:[],
      diseasesList:[],
      // 判断是否是第一次点击进入
      count:0,
      renyuanId:'',
      patientCardNo:''
    }
  }

  componentDidMount () {
    // 查询所有
    this.getDept();
  }

  //搜索是页面搜索还是去查询数据库
  handleChange = (text, e) => {
    console.log(text,e)
    if(text){
      this.setState({
        searchText:text
      })
      this.getXuanJiaoList(text)
    }
  }
  handleClick = (data,e) => {
    console.log('data=',data)
    if (data.linkUrl) {
      window.location.href=data.linkUrl
      return
    }
    this.context.router.push({
      pathname:'/usercenter/usercardxuanjiangdetail',
      query:{centent:data.content,title:data.title,deptName:data.deptName,keyWords:data.keyWords}
    })
    window.sessionStorage.setItem('xuanjiao',JSON.stringify(data))
  }
  // 获取当前滚动条的位置
  getScrollTop(){
    let scrollTop=0;
    if(document.documentElement && document.documentElement.getScrollTop){
      scrollTop = document.documentElement.scrollTop;
    } else if (document.body) {
      scrollTop = document.body.scrollTop;
    }
    return scrollTop
  }
  // 获取当前可视范围的高度
  getClientHeight(){
    let clientHeight=0;
    if(document.body.clientHeight&&document.documentElement.clientHeight){
      clientHeight=Math.min(
        document.body.clientHeight,
        document.documentElement.clientHeight
      )
    }else{
      clientHeight=Math.max(
        document.body.clientHeight,
        document.documentElement.clientHeight
      )
    }
    return clientHeight
  }

  // 获取文档完整高度
  getScrollHeight(){
    return Math.max(document.body.scrollHeight,document.documentElement.scrollHeight)
  }
  // var  container = document.getElementById('refreshContainer')

  // var text = document.getElementsByClassName('refreshText')
  // // 节流函数
  // var throttle = function(method, context){
  //     clearTimeout(method.tId);
  //     method.tId = setTimeout(function(){
  //       method.call(context)
  //     }, 300);
  //   }
  // fetchData(){
  //   setTimeout(()=>{
  //      _container.insertAdjacentHTML('beforeend', '<li>new add...</li>')
  //   },1000)
  // }
  // window.onscroll = function() {
  //     if (getScrollTop() + getClientHeight() == getScrollHeight()) {
  //         _text.innerText = '加载中...';
  //         throttle(fetchData);
  //     }
  //   };

  // 获取人物列表
  // 选项点击
  selectPat(id,item) {
    console.log(item)
    console.log('setstatepat=',this.state)
    this.setState({
      patientCardNo:item.patientCardNo
    })
    const list=this.state.patList;
    var data=[];
    var dt=item.deptList
    var flg=false
    var deptListd=[]
    for(var i=0;i<list.length;i++){
      if(list[i].patientCardNo==id){
        list[i].active=true;
      }else{
        list[i].active=false;
      }
      this.setState({
          cardNo:id,
      })
    }
    // 获取个人信息
    this.getXuanJiaoList()
    console.log(666898)
    this.setState({
        patList:list,
    })
  }
  // 获取人物nav
  getDept(){
    Api
    .getDeseaseType({
        hisId:'2214',
        openid:window.localStorage.openId
    })
    .then((res) => {
        console.log(res)
        if(res.code==0&&res.data&&res.data.patientList.length>0){
            var list=res.data.patientList;
            for(var i=0;i<list.length;i++){
                    if(i==0){
                        list[i].active=true;
                    }else{
                        list[i].active=false;
                    }
                }
                this.setState({
                    patList:list,
                    cardNo:list[0].patientCardNo,
                    // dept:list[0].deptList[0],
                    // diseases:list[0].deptList[0].diseasesList[0],
                })
                // console.log(list[0].deptList,list[0].deptList[0].diseasesList)
                this.getXuanJiaoList()
        }
    })
  }
  // 获取列表
  getXuanJiaoList = (name) => {
    console.log('state=',this.state)
    Api
    .getJiankangXuanJiaoList({
      keyWords:name,
      // pageNum:1,
      // numPerPage:10,
    })
    .then((res)=>{
      if(res.code==0&&res.data&&res.data.recordList.length>0) {
        const list=res.data.recordList
        this.setState({
          results:list
        })
      }else{
        this.setState({
          results:data
        })
        // this.setState({
        //   isShow:true,
        //   message:'暂无宣教'
        // })
      }
    },e=>{
      console.log(66666)
      this.setState({
        isShow:true,
        message:'暂无宣教'
      })
    })
  }

  render () {
    const {
      name,
      sex,
      age,
      height,
      weight,
      isAlone,
      results,
      message,
      isShow,
      patList
    } = this.state
    const classString=cs('spe','am-icon','am-icon-md','xuanjiao-img')
    return (
      <div className='jiankang-pat'>
        <div className="patient">
         {!!patList&&patList.length>0&&patList.map((item,index)=>{
           return(
              <div className={`${item.active?'pat-item active':'pat-item'}`} key={index}
                onClick={()=>{
                    this.selectPat(item.patientCardNo,item)
                }}>
                 {item.patientName}
                <span></span>
              </div>
             )
          })
        }
        </div>
        <div className="info">
            <div className='xuanjiao'>
              {
                isShow ?
                  <Result
                    className='xuanjiao'
                    img={<img src='../../../resources/images/no-result.png' className={classString} alt="" />}
                    title={message}
                  >
                  </Result>:
                  <div>
                    <SearchBar
                      onChange = { this.handleChange.bind(this) }
                      placeholder = '检查项目A'
                    />
                    <Cells id="refreshContainer">
                      {
                        results.map((item,index) => {
                          console.log('item=', item)
                          return (
                            <Cell key={item.id} onClick = { e => { this.handleClick(item,e) } }>
                              <div>
                                <div className='jiankang-list'>
                                  <div>
                                    { item.title }
                                  </div>
                                  <div className='jiankang-list-houzui'>
                                    { item.deptName==null ? '内科' : item.deptName }
                                  </div>
                                </div>
                                <div className='jiankang-list-biaoqian'>
                                  <span>
                                    { item.keyWords}
                                  </span>
                                </div>
                              </div>
                            </Cell>
                          )
                        })
                      }
                    </Cells>
                      <p class="refreshText"></p>
                  </div>
              }
            </div>
          </div>
      </div>
    )
  }
}
export default Connect()(UserCardXuanJiaoList);