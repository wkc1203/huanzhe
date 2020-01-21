import React, { Component } from 'react';
import { Link } from 'react-router'; 
import { Panel, PanelHeader, PanelBody, MediaBox, MediaBoxTitle, MediaBoxDescription, PanelFooter, CellMore } from 'react-weui';
import Connect from '../../../components/connect/Connect';
import * as Utils from '../../../utils/utils';
import { addressMap } from '../../../config/constant/constant';
import * as Api from '../../../components/Api/Api';
import hashHistory from 'react-router/lib/hashHistory';
import 'style/index.scss';
const {timestampFordate }=Utils
class Widget extends Component {
    static contextTypes = {
        router: React.PropTypes.object,
    };
    constructor(props) {
        super(props);
        this.state = {
            reasonList: [
                // {Reason:"top",submitTime:"2019",submitusr:"1111111111111111111111111111111111111111111111111",suggestContent:"22222",replay:"333"},
                // {Reason:"top",submitTime:"2019",submitusr:"11111",suggestContent:"22222",replay:"333"},
            ]
        }
    };
    componentDidMount(){
        this.hideLoading();
        this.getMySuggestion()
    }
    /* 获取我的建议 */
    getMySuggestion() { 
        const param={
            platformId:2214,
            hisId:2214,
           }
        Api
           // console.log(param,"param")
          
            .getcomplaintslist(param)
            .then((res) => {
                console.log("res", res);
                  if(res.code==0){
                     this.hideLoading();
                    // const reasonList={
                    //      data:res.recordList
                    // };
                    this.setState({
                      reasonList:res.data.recordList
                    })
                    console.log(this.state.reasonList,"reasonList")
                } 
            })

    }
  
    render() {
        const { reasonList } = this.state
        
        return (

            <div className="page-suggestion">
                <div className="home">
                    <span className="jian"
                        onClick={() => {
                            this.context.router.goBack();
                        }}
                    ></span>我的投诉建议
                           </div>
                {/* <div className="addSuggest">
                    <img src="" alt="" />
                </div> */}

                <div className="suggestItem">
                    {
                        reasonList.length<=0 &&

                        <div className='no-data'>
                            <img src='../../../resources/images/no-result.png' />
                            <div className="noSuggestTip">您还没有投诉建议</div>
                            <div className="goIcon">
                                <span className="goBack go"> ‹ </span>
                                <span className="goNext go"> › </span>
                            </div>
                        </div>

                    }
                    {
                        reasonList.length>0 && reasonList.map((item, index) => {
                            const time=new Date(item.createTime)
                            let _year = time.getFullYear();
                            let _month = (time.getMonth() + 1) < 10 ? '0' + (time.getMonth() + 1) : (time.getMonth() + 1);
                            let _date = time.getDate() < 10 ? '0' + time.getDate() : time.getDate();
                            let _hours = time.getHours() < 10 ? '0' + time.getHours() : time.getHours();
                            let _minutes = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes();
                            let _secconds = time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds();
                            const createTime= _year + '-' + _month + '-' + _date + ' ' + _hours + ':' + _minutes + ':' + _secconds;
                            console.log(createTime,"createTime")
                            return (
                                <Panel key={index} className="subSuggestItem">
                                    <PanelBody>
                                        <MediaBox>
                                            <MediaBoxDescription className="sugText">
                                                <p><span className="sugtitle">投诉建议原因：</span> <span className="sugtextss">{item.complaintsReason}</span></p>
                                                <p><span className="sugtitle">提交时间：</span> <span className="sugtextss">{item.createDate}</span></p>
                                                <p><span className="sugtitle">提交人：</span> <span className="sugtextss">{item.patientName}</span></p>
                                                <p><span className="sugtitle">投诉建议内容：</span > <span className="sugtextss">{item.complaintsContent?item.complaintsContent: " 暂无 "}</span></p>
                                               { reasonList[index].replyList!=[]&&
                                                  reasonList[index].replyList.map((iitem,id)=>{
                                                      if(iitem.type==2){
                                                         return(
                                                        <p key={0}><span className="sugtitle">处理回复：</span>
                                                        
                                                         <span  className="sugtextss">{iitem.replyContent}</span>
                                                       
                                                         </p>  
                                                      )  
                                                      }
                                                      
                                                  })
                                                }

                                                <hr className="line"  />
                                            </MediaBoxDescription>
                                        </MediaBox>
                                       
                                    </PanelBody>
                                    <div>
                                    <Link className="queryDetails" 
                                 
                                      to={{
                                            pathname:'/usercenter/suggestdetail',
                                            query:{id:item.id}
                                      } }
                                    
                                    >
                                        <p className="Details"><span>查询详情</span></p>
                                        <p className="goToDetial">
                                         <span>{item.submitTime}</span> 
                                         <img src='../../../resources/images/jt.png' alt=""/>
                                       </p>
                                    </Link>
                                     
                                       
                                    </div>
                                </Panel>
                            )

                        })
                    }
                    <Link className="linkImg" 
                                      to={{
                                            pathname:'/usercenter/mysuggestion',
                                            //query:{doctorId:doctorid,deptId:deptid,resource:2}
                                      } }
                                    
                                    >
                                       <img  src="../../../resources/images/u37.svg" alt=""/>
                    </Link>
                </div>
            </div>

        )
    }
}
export default Connect()(Widget);