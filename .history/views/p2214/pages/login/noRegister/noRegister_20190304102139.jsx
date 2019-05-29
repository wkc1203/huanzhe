import React, { Component } from 'react';
import { Button, Toptips,Switch,Dialog,Toast } from 'react-weui';
import Connect from '../../../components/connect/Connect';
import { addressMap } from '../../../config/constant/constant';
import { Link } from 'react-router';
import './style/index.scss';
class Widget extends Component {
    static contextTypes = {
        router: React.PropTypes.object,
    };
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    componentDidMount() {

    }

    render() {
        return (
            <div className="noregister">
                <img src="./././resources/images/code.jpg" alt=" "/>
                 <p>温馨提示：请关注<span>儿童健康圈</span>公众号</p>
            </div>

        );
    }
}

export default Connect()(Widget);
