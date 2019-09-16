import React, { Component } from 'react';
import { Button, Toptips,Switch,Dialog,Toast } from 'react-weui';
import Connect from '../../../components/connect/Connect';
import { addressMap } from '../../../config/constant/constant';
import { Link } from 'react-router';
import * as Utils from '../../../utils/utils';
import './style/index.scss';
import hashHistory from 'react-router/lib/hashHistory';
import * as Api from '../../../components/Api/Api';

class Information extends Component {
    static contextTypes = {      
        router: React.PropTypes.object,
    };
    constructor(props) {
        super(props);
        this.state = {
            hospitalInformations:{}
        };
    }
    componentDidMount() {     
        Api.hospitalInformation({hisId:'2214'}).then((res)=>{
            if(res.code==0){
                //const data =JSON.parse(JSON.stringify(res.data)) 
                const data =res.data
                const honorImage = res.data.honorImages
                let honorImages = { __html: honorImage };
                this.setState({
                    hospitalInformations:data,
                    honorImages:honorImages
                })
            }
        })          
      }     
        
    render() {
        const {hospitalInformations} = this.state
        return (
            
            <div className="hospitalInformation">
                <div className="home" style={{position:'relative',width:'100%',top:'0'}}><span className="jian"
                                    onClick={()=>{
                                        console.log(1)
                                        this.context.router.goBack();
                                      }}
                ></span>医院信息
            </div>
            <div className = 'essentialInformation'>
                <p><span>医疗机构名称</span><span>{hospitalInformations.name?hospitalInformations.name:'暂无信息'}</span></p>
                <p><span>医疗机构等级等次</span>{hospitalInformations.grading?hospitalInformations.grading:'暂无信息'}<span></span></p>
                <p>
                    <span>医疗机构执业许可证书</span>
                    <img src ={hospitalInformations.licence?hospitalInformations.licence:'./resources/images/4975e854c9e0b892c900ee6471922ac.png'} alt=''/>               
                </p>
            </div>
                                        
            <div className = 'rang'>
                <p>互联网诊疗服务范围（科目/病种）</p>
                <p>{hospitalInformations.serviceScope?hospitalInformations.serviceScope:'暂无信息'}</p>
            </div>
            <div className = 'certificate'>
                <p className='jx'>荣誉奖项</p>
                <div dangerouslySetInnerHTML={{__html:hospitalInformations?hospitalInformations.honorImages:'<p>暂无信息</p>'}}></div>              
            </div>
        </div>    
               
        )
    }  
}

export default Connect()(Information);
