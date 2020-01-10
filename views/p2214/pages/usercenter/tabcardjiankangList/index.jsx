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

  // {
  //   id:'123',
  //   title:'儿童糖尿病患者的日常饮食与注意',
  //   keshi:'内分泌科',
  //   biaoqian:'糖尿病；饮食；日常生活'
  // },
  // {
  //   id:'213',
  //   title:'儿童糖尿病患者的日常饮食与注意',
  //   keshi:'内分泌科',
  //   biaoqian:'糖尿病；饮食；日常生活'
  // },
  // {
  //   id:'312',
  //   title:'儿童糖尿病患者的日常饮食与注意',
  //   keshi:'内分泌科',
  //   biaoqian:'糖尿病；饮食；日常生活'
  // }
var throttle = function(func, delay) {            
          var timer = null;            
          return function() {                
              var context = this;               
              var args = arguments;                
              if (!timer) {                    
                  timer = setTimeout(function() {                        
                      func.apply(context, args);                        
                      timer = null;                    
                  }, delay);                
              }            
          }        
      }
// 健康宣教
class UserCardXuanJiaoList extends Component {
  static contextTypes = {
    router: React.PropTypes.object
  }
  constructor (props) {
    super(props)
    this.state = {
      isShowJiaZai:true,
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
      isShowSecond:false,
      diseases:{},
      dept:{},
      recordList:[],
      deptList:[],
      diseasesList:[],
      // 判断是否是第一次点击进入
      count:0,
      // 是否显示搜索框
      isSearch:[],
      renyuanId:'',
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
      throttle(this.getXuanJiaoList(text),1000)
    }
  }
  // search =()=>{
  //   this.getXuanJiaoList()
  // }
  handleClick = (data,e) => {
    console.log('data=',data)
    if (data.linkUrl&&data.linkUrl.startsWith('http')) {
      window.location.href=data.linkUrl
      return
    }
    this.context.router.push({
      pathname:'/usercenter/usercardxuanjiangdetail',
      query:{id:data.id}
    })
    // window.sessionStorage.setItem('xuanjiao',JSON.stringify(data))
  }
  // 获取人物列表
  // 选项点击
  selectPat(id,item) {
    console.log(item)
    console.log('setstatepat=',this.state)
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
    }
    this.setState({
        cardNo:id,
        isShowSecond:false
    },()=>{
      // 获取宣教列表
      this.getFirstXuanJiaoList()
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
        this.setState({
          isShowJiaZai:false
        })
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
                    cardNo:list[0].patientCardNo,
                    patList:list,
                })
                this.getFirstXuanJiaoList()
        }
    })
  }
  // 第一次获取列表
  getFirstXuanJiaoList = () => {
    Api
    .getJiankangXuanJiaoList({
      keyWords:'',
      patientCardNo:this.state.cardNo,
      hisId:'2214',
      // patientCardNo:this.state.cardNo
      // pageNum:1,
      // numPerPage:10,
    })
    .then((res)=>{
      if(res.code==0&&res.data&&res.data.length>0) {
        const list=res.data
        this.setState({
          results:list,
          isShow:false
        })
      }
      // else{
      //   this.setState({
      //     isShow:true,
      //     message:'暂无宣教'
      //   })
      // }
    },e=>{
      console.log(66666)
      // this.setState({
      //   isShow:true,
      //   message:'暂无宣教'
      // })
    })
  }
  // 模糊查询获取列表
  getXuanJiaoList = (name) => {
    console.log('state=',this.state)
    Api
    .getJiankangXuanJiaoList({
      keyWords:name||'',
      patientCardNo:this.state.cardNo,
      hisId:'2214',
      // patientCardNo:this.state.cardNo
      // pageNum:1,
      // numPerPage:10,
    })
    .then((res)=>{
      if(res.code==0&&res.data&&res.data.length>0) {
        const list=res.data
        this.setState({
          results:list,
          isShowSecond:false
        })
      }
      // else{
      //   this.setState({
      //     isShowSecond:true,
      //     message:'未查询到'
      //   })
      // }
    },e=>{
      console.log(66666)
      // this.setState({
      //   isShowSecond:true,
      //   message:'未查询到'
      // })
    })
  }

  render () {
    const {
      isShowJiaZai,
      name,
      sex,
      age,
      height,
      weight,
      isAlone,
      results,
      message,
      isShow,
      isShowSecond,
      patList
    } = this.state
    const classString=cs('spe','am-icon','am-icon-md','xuanjiao-img')
    return (
      <div className='jiankang-pat'>
        <div className={`patient ${!!patList&&patList.length<=0?'yingchang':''}`}>
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
        {
          !!patList&&patList.length<=0&& <div  className='no-data' style={{background:'white'}}>
          <img src='../../../resources/images/no-result.png'/>
          <div style={{paddingBottom:'350px'}}>{isShowJiaZai?'加载中...':'暂未查询到相关信息'}</div>
          </div>
        }
        {
          !!patList&&patList.length>0&&
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
                  <div className='xuanjiao-search'>
                    {/*<SearchBar
                      onChange = { this.handleChange.bind(this) }
                      placeholder = '检查项目A' 
                    />*/}
                    {
                      !!patList&&patList.length>0?
                      <input className='xuanjiao-search-input' placeholder = '请输入关键字' onChange = {e=>this.getXuanJiaoList(e.target.value)}/>
                      :null
                    }
                    <Cells>
                      {
                        !isShowSecond?results.map((item,index) => {
                          console.log('item=', item)
                          return (
                            <Cell key={item.id} onClick = { e => { this.handleClick(item,e) } }>
                              <div>
                                <div className='jiankang-list'>
                                  <div className='jiankang-list-title'>
                                    { item.title }
                                  </div>
                                  <div className='jiankang-list-houzui'>
                                    { item.deptName==null ? '' : item.deptName }
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
                        }):
                        <Result
                          className='xuanjiao'
                          img={<img src='../../../resources/images/no-result.png' className={classString} alt="" />}
                          title={message}
                        />
                      }
                    </Cells>
                  </div>
              }
            </div>
          </div>
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
export default Connect()(UserCardXuanJiaoList);