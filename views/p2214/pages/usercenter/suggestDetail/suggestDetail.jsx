import React, { Component } from 'react'
import { Link } from 'react-router';
import { Panel, PanelHeader, PanelBody, MediaBox, MediaBoxTitle, MediaBoxDescription, PanelFooter, Gallery, GalleryDelete, Button, Icon } from 'react-weui';
import Connect from '../../../components/connect/Connect';
import { ImagePicker } from 'antd-mobile';
import * as Utils from '../../../utils/utils';
import { addressMap } from '../../../config/constant/constant';
import * as Api from '../../../components/Api/Api';
import hashHistory from 'react-router/lib/hashHistory';
import 'style/index.scss';
class Widget extends Component {
    static contextTypes = {
        router: React.PropTypes.object,
    };
    constructor(props) {
        super(props);
        this.state = {
            reasonList: [],
            replyList:[],
            img: [],
            replyUrl:[],
            modalIsOpen: false,
            index: 0,
            isOpen: false,
            showMultiple: false,//图片放大
        }
    };
    /* 获取我的建议 */
    componentDidMount() {
        this.tosuggestdetail() 
    }


    //获取建议详情
    tosuggestdetail() {
        const id = this.props.location.query.id
        console.log(this.props.location.query, 'id')
        const param = {
            platformId: 2214,
            hisId: 2214,
            id,
        }
        console.log(param, "param")
        Api
            .getcomplaintDetail(param)
            .then((res) => {
                console.log("resss", res);
                if (res.code == 0) {
                    // this.hideLoading();
                    this.setState({
                        reasonList: res.data,
                        replyList: res.data.replyList
                    })
                    console.log(this.state.reasonList, "reasonList")
                    console.log(this.state.replyList,"replyList")
                    if(res.data.complaintsCert!==""){  
                       const img=this.state.reasonList.complaintsCert.split(",")
                        
                       this.setState({
                        img:img,
                    })
                     console.log(this.state.img,"stateimgs")
                   }

                }
            })

    }


    
    render() {
        const BackButtonStyle = {
            display: 'inline-block',
            width: 'auto',
            color: 'white',
            border: 'none',
            position: 'absolute',
            top: '5px',
            left: '15px'
        }

        const { reasonList,replyList,replyUrl,index,isOpen,img,showMultiple } = this.state
        // const time = new Date(reasonList.createTime)
        // let _year = time.getFullYear();
        // let _month = (time.getMonth() + 1) < 10 ? '0' + (time.getMonth() + 1) : (time.getMonth() + 1);
        // let _date = time.getDate() < 10 ? '0' + time.getDate() : time.getDate();
        // let _hours = time.getHours() < 10 ? '0' + time.getHours() : time.getHours();
        // let _minutes = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes();
        // let _secconds = time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds();
        // const createTime = _year + '-' + _month + '-' + _date + ' ' + _hours + ':' + _minutes + ':' + _secconds;
        // console.log(createTime, "createTime")
        return (

            <div className="page-suggestion totaldetial">
                <div className="home">
                    <span className="jian"
                        onClick={() => {
                            this.context.router.goBack();
                        }}
                    ></span>投诉建议详情
                </div>

                <div className="suggestItem">
                    {
                        reasonList &&

                        <div>
                            <div className="subSuggestItem detailItem">

                                <div className="sugText">
                                  <p><span className="sugtitle">提交时间：</span> <span className="sugtext">{reasonList.createDate}</span></p>
                                   <p><span className="sugtitle">提交人：</span> <span className="sugtext">{reasonList.patientName}</span></p>
                                    <p><span className="sugtitle">投诉建议原因：</span> <span className="sugtext">{reasonList.complaintsReason}</span></p>
                                    <p><span className="sugtitle">投诉建议内容：</span ></p>
                                    <div className="sugtextDetil">{reasonList.complaintsContent}</div>
                                    {this.state.img.length > 0 &&
                                    <div className="sugImg">         
                                        {
                                            img.length > 0 && 
                                            img.map((item, index) => {
                                                return (
                                                   <img src={item} alt="" key={index} onClick={()=>this.setState({ showMultiple: true})}/> 
                                               
                                                )
                                            })
                                        }
                                        {  showMultiple&&
                                         <Gallery src={img} show={showMultiple} onClick={(e)=>this.setState({ showMultiple: false})}>
                                            {/* <Button
                                                style={BackButtonStyle}
                                                onClick={e=>this.setState({ showSingle: false})}
                                                plain
                                            >
                                                Back
                                            </Button> */}
                                            {/* <GalleryDelete
                                                onClick={ (e, i)=> alert('click deleted id:' + i) }
                                            /> */}
                                        </Gallery>
                                        }
                                    </div>
                                   }
                                          { replyList && replyList.map((reply,index)=>{
                                            if(reply.type==2){
                                            return(
                                                <div>
                                                    <p className="replayItem">
                                                        <span className="sugtitles">处理回复</span>
                                                        
                                                        <span className="submitTime">{reply.createDate}</span>
                                                    
                                                    </p>
                                                        <div className="sugcontext" key={index}>{reply.replyContent}</div>
                                                 </div>
                                            )
                                             }
                                        })
                                    //    }
                                          }

                            
                                </div>         
                                  {  replyList.length>0 &&    
                                        <hr className="line"/>}
                                 { replyList.length>0 && replyList.map((reply,index)=>{
                                     return(
                                         <div className="sugText" key={index}>
                                       
                                       <p className="replayItem">
                                        <span className="sugtitles">追加回复</span>
                                        <span className="submitTime">
                                        {reply.createDate}
                                        </span>
                                       </p> 
                                       <div className="sugcontext">{reply.replyContent}</div>
                                     { replyUrl.length > 0 &&
                                          <div className="sugImg">
                                            {
                                               replyUrl.map((items, index) => {
                                                    return (
                                                        <img src={items} alt="" key={index} /> 
                                                    )
                                                })
                                            }
                                           </div>
                                       
                                       } 
                                     </div>
                                     )
                                    
                                 }) 
                                
                                 }


                            </div>
                            <Button className="reply"
                                onClick={() => {
                                    this.context.router.push({
                                        pathname: '/usercenter/replay',
                                        query: { id: this.props.location.query.id }
                                    })
                                }
                                }
                            >追加回复</Button>
                            <Button className="reply back"
                                onClick={() => {
                                    this.props.history.go(-1)
                                }
                                }
                            >返回</Button>
                        </div>



                    }
                </div>
            </div>

        )
    }
}
export default Connect()(Widget);