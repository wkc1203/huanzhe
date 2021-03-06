import React, { Component } from 'react';
import { Link } from 'react-router';
import { Button, Toptips, Switch, Dialog, Toast } from 'react-weui';
import ReactPullToRefresh from 'react-pull-to-refresh';
import Connect from '../../../components/connect/Connect';
import { addressMap } from '../../../config/constant/constant';
import * as Api from '../../../components/Api/Api';
import Doctor from './component/Doctor';
import * as Utils from '../../../utils/utils';
import { Drawer } from 'antd-mobile';

import 'style/index.scss';
import hashHistory from 'react-router/lib/hashHistory';

let remsidesc = 0,
    deptFilterArr = [],
    graderFilterArr = [],
    statusFilterArr = [],
    typeFilterArr = [];


class Widget extends Component {
    static contextTypes = {
        router: React.PropTypes.object,
    };
    constructor(props) {
        super(props);
        this.state = {
            tips: false,
            deptName: '筛选科室',
            deptList: [],
            isFunnel: true,
            showToast: false,
            showLoading: false,
            toastTimer: null,
            loadingTimer: null,
            showIOS1: false,
            showIOS2: false,
            showAndroid1: false,
            showAndroid2: false,
            style1: {
                buttons: [
                    {
                        label: '确定',
                        onClick: Utils.hideDialog.bind(this)
                    }
                ]
            },
            style2: {
                title: '提示',
                buttons: [
                    {
                        type: 'default',
                        label: '取消',
                        onClick: Utils.hideDialog.bind(this)
                    },
                    {
                        type: 'primary',
                        label: '确定',
                        onClick: Utils.hideDialog.bind(this)
                    }
                ]
            },
            msg: '',
            searchFocus: false,
            searchValue: '',
            docList: [],
            doctorShow: false,
            searchDoctorList: [],
            deptId: '',
            search1: false,
            searchShow: true,
            searchPage: 1,//查询页
            searchList: [],
            maxinquiryPage: '',//总页数
            maxsearchPage: '',//
            data: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
            isLoadingMore: false,
            inquiryPage: 1,
            scrollTop: '',
            current: '',
            cur: '',
            has: false,
            incur: '',
            incurrent: '',
            currentiInquiry: '',
            canAdd: false,//可以加载
            type: '1',
            open: false,

            paixuStr: '',
            sdaoxuStr: '',
            deptFilter: '',
            graderFilter: '',
            statusFilter: '',
            typeFilter: '',

            graderFilterDate: [
                {
                    id: 'alldoc',
                    name: '全部医生'
                },
                {
                    id: '1',
                    name: '主任医师'
                },
                {
                    id: '2',
                    name: '副主任医师'
                },
                {
                    id: '3',
                    name: '主治医师'
                },
                {
                    id: '4',
                    name: '住院医师'
                }
            ],

            statusFilterDate: [
                {
                    id: 'allsta',
                    name: '全部状态'
                },
                {
                    id: '1',
                    name: '在线'
                },
                {
                    id: '0',
                    name: '离线'
                },
            ]
            ,

            typeFilterDate: [
                {
                    id: 'allfs',
                    name: '全部方式'
                },
                {
                    id: '1',
                    name: '图文问诊'
                },
                {
                    id: '2',
                    name: '电话问诊'
                },
                {
                    id: '3',
                    name: '视频问诊'
                }
            ],
            DocTotalCount: ''




        };
    }
    callback() {
        const wrapper = this.refs.wrapper;
        const loadMoreDataFn = this.loadMoreDataFn;
        const top = wrapper ? wrapper.getBoundingClientRect().top : 0;
        const windowHeight = window.screen.height;
        const that = this; // 为解决不同context的问题

        // console.log(top,windowHeight,'windowHeightwindowHeight')

        if (top && top < windowHeight) {
            // 当 wrapper 已经被滚动到页面可视范围之内触发
            that.loadMoreDataFn();
        }
    }
    sum(type, deptId) {
        Api
            .getSum({
                hisId: '2214',
                type: type,
                deptId: deptId,
                openId: window.localStorage.openId
            })
            .then((res) => {
            }, (e) => {
            });
    }
    componentWillMount() {

        // this.setheight()


        this.setState({
            type: this.props.location.query.type == '2' ? '2' : '1'
        })

    }
    componentDidMount() {
        if (this.props.location.query.deptName == '新型冠状病毒感染肺炎') {
            this.setState({
                tips: true
            })
        }
        this.getDeptList();
        const that = this; // 为解决不同context的问题
        let timeCount;
        this.setState({
            type: this.props.location.query.type == '2' ? '2' : '1'
        })

        if (this.props.location.query.source == 5) {
            if (!!window.localStorage.openId) {
                this.sum(2, this.props.location.query.deptId);
            } else {
                var code = '';
                if (window.location.hostname == 'tih.cqkqinfo.com') {
                    code = 'ff80808165b46560016817f20bbc00b3';
                } else {
                    code = 'ff80808165b46560016817f30cc500b4';
                }
                var storage = window.localStorage;
                //加入缓存
                storage.isOpenId = 1;
                window.location.href = "https://wx.cqkqinfo.com/wx/wechat/authorize/" + code + "?scope=snsapi_base";
                var storage = window.localStorage;
                //加入缓存
                storage.url = window.location.href;
            }
        }
        window.addEventListener('scroll', function () {


            if (this.state.isLoadingMore) {
                return;
            }
            if (timeCount) {
                clearTimeout(timeCount);
            }

            // console.log(window.screen.height)

            timeCount = setTimeout(this.callback(), 5000);
        }.bind(this), false);

        this.getJs();
        if (window.localStorage.deptShow == '2' && window.localStorage.deptListStatus) {
            var deptListStatus = JSON.parse(window.localStorage.deptListStatus);
            window.localStorage.login_access_token = window.localStorage.sessionId;
            this.setState({
                type: deptListStatus.type,
                msg: deptListStatus.msg,
                searchFocus: deptListStatus.searchFocus,
                searchValue: deptListStatus.searchValue,
                docList: deptListStatus.docList,
                doctorShow: deptListStatus.doctorShow,
                searchDoctorList: deptListStatus.searchDoctorList,
                deptId: deptListStatus.deptId,
                search1: deptListStatus.search1,
                searchShow: deptListStatus.searchShow,
                searchPage: deptListStatus.searchPage,//查询页
                searchList: deptListStatus.searchList,
                maxinquiryPage: deptListStatus.maxinquiryPage,//总页数
                maxsearchPage: deptListStatus.maxsearchPage,//
                data: deptListStatus.data,
                isLoadingMore: deptListStatus.isLoadingMore,
                inquiryPage: deptListStatus.inquiryPage,
                scrollTop: deptListStatus.scrollTop,
                current: deptListStatus.current,
                cur: deptListStatus.cur,
                has: deptListStatus.has,
                incur: deptListStatus.incurrent,
                incurrent: deptListStatus.incurrent,
                currentiInquiry: deptListStatus.currentiInquiry,
                canAdd: deptListStatus.canAdd,//可以加载

            })
            // console.log('height',window.localStorage.scrollY,window.localStorage.scrollX)
            window.scrollTo(window.localStorage.scrollX, window.localStorage.scrollY);

        } else {
            window.localStorage.deptShow = '1';
            var deptId = this.props.location.query.deptId || '';
            if (deptId == '') {
                this.selectDept('全部科室', '', this.state.searchPage);
            } else {
                this.setState({
                    deptId: this.props.location.query.deptId
                })
                // console.log("h",this.state.deptId,this.props.location.query.deptId)
                this.selectDept(this.props.location.query.deptName, this.props.location.query.deptId, this.state.searchPage)
            }
        }
    }
    componentWillUnmount() {
        if (this.state.has && window.localStorage.login_access_token1 != 'undefined') {
            window.localStorage.login_access_token = window.localStorage.login_access_token1;
        }
        window.localStorage.deptListStatus = JSON.stringify(this.state);


        deptFilterArr = [],
            graderFilterArr = [],
            statusFilterArr = [],
            typeFilterArr = [];
        document.getElementById('allfs').className = ''
        document.getElementById('allsta').className = ''
        document.getElementById('alldoc').className = ''
        document.getElementById('alldcep').className = ''
        document.body.style.overflowY = 'auto';
        document.getElementById("dept").style.height = 'auto'
        document.getElementById("dept").style.overflow = 'auto';


        this.setState({
            open: false,
            paixuStr: '',
            sdaoxuStr: '',
            DocTotalCount: ''
        })
    }

    loadMoreDataFn() {
        if (this.state.searchValue != '' && this.state.search1) {
            // console.log("this.state.inquiryPage",this.state.inquiryPage,this.state.maxinquiryPage)
            if (this.state.inquiryPage <= this.state.maxinquiryPage) {
                // alert(this.state.currentiInquiry+"-----"+this.state.inquiryPage)
                if (this.state.currentiInquiry != this.state.inquiryPage) {
                    this.search(this.state.searchValue, this.state.deptId, this.state.inquiryPage);
                }
            }
        } else {
            //  console.log("seaerchmax",this.state.searchPage,this.state.maxsearchPage)
            if (this.state.searchPage <= this.state.maxsearchPage) {
                // alert(this.state.current+"-----"+this.state.searchPage)
                if (this.state.current != this.state.searchPage) {
                    this.selectDept(this.props.location.query.deptName, this.state.deptId, this.state.searchPage)
                }
            }
        }
    }
    getJs() {
        Api
            .getJsApiConfig({ url: window.location.href.substring(0, window.location.href.indexOf("#")) })
            .then((res) => {
                // console.log(res);
                if (res.code == 0) {
                    //写入b字段
                    // console.log("str",res.data);
                    wx.config({
                        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                        appId: res.data.appId, // 必填，公众号的唯一标识
                        timestamp: res.data.timestamp, // 必填，生成签名的时间戳
                        nonceStr: res.data.noncestr, // 必填，生成签名的随机串
                        signature: res.data.signature,// 必填，签名
                        jsApiList: ['updateTimelineShareData', 'onMenuShareAppMessage', 'hideMenuItems', 'showMenuItems'] // 必填，需要使用的JS接口列表
                    });
                    wx.ready(function () {
                        // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
                        wx.showMenuItems({
                            menuList: ["menuItem:copyUrl", "menuItem:openWithQQBrowser", "menuItem:share:appMessage", "menuItem:share:timeline"
                                , "menuItem:share:qq", "menuItem:share:weiboApp", "menuItem:favorite", "menuItem:share:QZone",
                                "menuItem:openWithSafari"] // 要显示的菜单项，所有menu项见附录3
                        });
                        wx.updateTimelineShareData({
                            title: '重医儿童医院互联网医院', // 分享标题
                            link: location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                            imgUrl: 'http://ihoss.oss-cn-beijing.aliyuncs.com/PIC/hospital/logo-2214.png', // 分享图标
                            success: function () {
                            }
                        })
                        wx.onMenuShareAppMessage({
                            title: '重医儿童医院互联网医院', // 分享标题
                            desc: '', // 分享描述
                            link: location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                            imgUrl: 'http://ihoss.oss-cn-beijing.aliyuncs.com/PIC/hospital/logo-2214.png', // 分享图标
                            type: '', // 分享类型,music、video或link，不填默认为link
                            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                            success: function () {
                                // 用户点击了分享后执行的回调函数

                            }
                        });
                    });

                }
            }, (e) => {
            });
    }
    showToast() {
        this.setState({ showToast: true });
        this.state.toastTimer = setTimeout(() => {
            this.setState({ showToast: false });
        }, 2000);
    }
    getDeptList() {
        // console.log('')
        Api
            .getDeptList()
            .then((res) => {
                if (res.code == 0 && res.data != null) {
                    console.log('getDeptListgetDeptList', res.data)
                    this.setState({
                        deptList: res.data || [],
                    })
                    localStorage.setItem('deptList', res.data)
                }
                // console.log(this.deptList)
            }, (e) => {
                this.setState({
                    msg: e.msg || '系统错误',
                    showIOS1: true
                })
            });
    }
    /*查询科室*/
    selectDept(deptName, deptId, page) {
        this.setState({
            isFunnel: false,
            deptName: deptName,
            searchDoctorList: [],
            searchList: [],
            deptId: deptId
        })
        // console.log("type11",deptId)
        this.getDocList(deptId, page);
        this.setState({
            searchFocus: false,
        })
    }
    /*获取医生列表*/
    getDocList(deptId = '', page = 1) {
        const { paixuStr, sdaoxuStr } = this.state;
        const deptFilter = deptFilterArr.join(';') ? deptFilterArr.join(';') + ';' : '';
        const gradeFilter = graderFilterArr.join(';') ? graderFilterArr.join(';') + ';' : '';
        const statusFilter = statusFilterArr.join(';') ? statusFilterArr.join(';') : '';
        const typeFilter = typeFilterArr.join(';') ? typeFilterArr.join(';') + ';' : '';
        //alert(page)
        if (page == 1) {
            this.setState({
                docList: [],
                searchPage: 1
            })
        }
        this.setState({
            deptId: deptId,
            current: page,

        })
        this.showLoading();
        Api
            .getInfo({
                numPerPage: 10, deptId, vagueName: '', pageNum: page, type: this.state.type,
                sortField: paixuStr, sortMode: sdaoxuStr,
                deptFilter,
                gradeFilter,
                statusFilter,
                typeFilter,
                filterFlag: 1

            })
            .then((res) => {
                this.hideLoading();
                if (res.code == 0 && res.data != null) {
                    var currentPage = page + 1;
                    this.setState({
                        current: page,
                    })
                    if (currentPage > res.data.pageCount) {
                        this.setState({
                            canAdd: false
                        })
                    } else {
                        this.setState({
                            canAdd: true
                        })
                    }
                    if (res.data.sessionId.length > 0 && !window.localStorage.login_access_token) {
                        this.setState({
                            has: true
                        })
                        window.localStorage.sessionId = res.data.sessionId;
                        window.localStorage.login_access_token = res.data.sessionId;
                    } else {
                        if (res.data.sessionId.length > 0 && window.localStorage.login_access_token == 'undefined') {
                            this.setState({
                                has: true
                            })
                            window.localStorage.sessionId = res.data.sessionId;
                            window.localStorage.login_access_token = res.data.sessionId;
                        }
                    }
                    var data = [];
                    for (var i = 0; i < res.data.doctors.length; i++) {
                        if (this.state.type == '2') {
                            if (res.data.doctors[i].type == '2') {
                                data.push(res.data.doctors[i])
                            }
                        } else {
                            if (res.data.doctors[i].type == '1') {
                                data.push(res.data.doctors[i])
                            }
                        }
                    }

                    if (res.data.currentPage == 1) {
                        this.setState({
                            docList: data || [],
                            search1: false,
                            isDefaultImg: true,
                            doctorShow: true,
                            current: page,
                            searchPage: currentPage,
                            maxsearchPage: res.data.pageCount
                        })
                    } else {
                        this.setState({
                            docList: this.state.docList.concat(res.data.doctors) || [],
                            isDefaultImg: true,
                            current: page,
                            searchPage: currentPage,
                            maxsearchPage: res.data.pageCount
                        })
                    }
                }
            }, (e) => {
                this.hideLoading();
                this.setState({
                    msg: e.msg || '系统错误',
                    showIOS1: true
                })
            });
    }


    getdocNum() {

        const deptFilter = deptFilterArr.join(';') ? deptFilterArr.join(';') + ';' : '';
        const gradeFilter = graderFilterArr.join(';') ? graderFilterArr.join(';') + ';' : '';
        const statusFilter = statusFilterArr.join(';') ? statusFilterArr.join(';') : '';
        const typeFilter = typeFilterArr.join(';') ? typeFilterArr.join(';') + ';' : '';

        Api
            .getInfo({
                deptFilter,
                gradeFilter,
                statusFilter,
                typeFilter,
                filterFlag: 2
            })
            .then((res) => {
                this.hideLoading();
                if (res.code == 0 && res.data != null) {
                    // console.log(res.data.totalCount,'getdocNum')
                    this.setState({
                        DocTotalCount: res.data.totalCount || 0,
                    })
                    // getdocNum              
                }
            }, (e) => {
                this.hideLoading();
                this.setState({
                    msg: e.msg || '系统错误',
                    showIOS1: true
                })
            });
    }
    /*获取焦点事件*/
    bindSearchInput() {
        this.setState({
            searchValue: this.state.searchValue,
            search1: true,
        })
        if (this.state.searchValue != '') {
            this.setState({
                search1: true,
                inquiryPage: 1,
            })
        } else {
            this.setState({
                search1: true,
            })
        }
        if (!this.state.searchValue) {
            this.setState({
                searchList: [],
                searchDoctorList: []
            })
        }
        // 获取搜索结果
        clearTimeout(this.searchTimer || '');
        this.searchTimer = setTimeout(() => {
            this.search(this.state.searchValue, this.state.deptId, 1);
        }, 200);
    }
    /*搜索*/
    search(value, deptId, page) {
        this.setState({
            currentiInquiry: page,
        })
        if (this.state.inquiryPage == 1) {
            this.setState({
                searchList: []
            })
        }
        this.showLoading();
        Api
            .getInfo({ numPerPage: 10, deptId: deptId || '', vagueName: value, pageNum: page, type: this.state.type })
            .then((res) => {
                if (res.code == 0 && res.data != null) {
                    this.hideLoading();
                    var currentPage = page + 1;
                    this.setState({
                        currentiInquiry: page,
                    })
                    if (currentPage > res.data.pageCount) {
                        this.setState({
                            canAdd: false
                        })
                    } else {
                        this.setState({
                            canAdd: true
                        })
                    }
                    var data = [];
                    for (var i = 0; i < res.data.doctors.length; i++) {
                        if (this.state.type == '2') {
                            if (res.data.doctors[i].type == '2') {
                                data.push(res.data.doctors[i])
                            }
                        } else {
                            if (res.data.doctors[i].type == '1') {
                                data.push(res.data.doctors[i])
                            }
                        }

                    }
                    if (res.data.currentPage == 1) {
                        this.setState({
                            inquiryPage: currentPage,
                            maxinquiryPage: res.data.pageCount,
                            currentiInquiry: page,
                            searchList: data || [],
                        })
                    } else {
                        this.setState({
                            inquiryPage: currentPage,
                            maxinquiryPage: res.data.pageCount,
                            currentiInquiry: page,
                            searchList: this.state.searchList.concat(data) || [],
                        })
                    }

                    if (res.data.sessionId.length > 0 && !window.localStorage.login_access_token) {
                        this.setState({
                            has: true
                        })
                        window.localStorage.sessionId = res.data.sessionId;

                        window.localStorage.login_access_token = res.data.sessionId;
                    } else {
                        if (res.data.sessionId.length > 0 && window.localStorage.login_access_token == 'undefined') {
                            this.setState({
                                has: true
                            })
                            window.localStorage.sessionId = res.data.sessionId;
                            window.localStorage.login_access_token = res.data.sessionId;
                        }
                    }
                }
            }, (e) => {
                this.hideLoading();
                this.setState({
                    msg: e.msg || '系统错误',
                    showIOS1: true
                })
            });
        Api
            .getDeptList({ numPerPage: 10, searchName: !!value ? value : ' ' })
            .then((res) => {
                if (res.code == 0 && res.data != null) {
                    this.setState({
                        searchDoctorList: res.data || []
                    })
                }
            }, (e) => {
                this.setState({
                    msg: e.msg || '系统错误',
                    showIOS1: true
                })
            });
        if (value !== '') {
            this.setState({
                search1: true,
            })
        } else {
            this.setState({
                search1: false,
            })
        }
    }
    bindSearchFocus(e) {
        this.setState({
            searchFocus: true,
        })
        if (e.detail.value != '') {
            this.setState({
                search1: true,
                inquiryPage: 1,
            })
        } else {
            this.setState({
                search1: false,
            })
        }
    }
    getValue(e) {
        this.setState({
            searchValue: e.target.value,
        })
        if (e.target.value != '') {
            this.setState({
                search1: true,
                inquiryPage: 1,
            })
        } else {
            this.setState({
                search1: true,
            })
        }
        if (!this.state.searchValue) {
            this.setState({
                searchList: [],
                searchDoctorList: []
            })
        }
        // 获取搜索结果
        clearTimeout(this.searchTimer || '');
        if (e.keyCode !== 13) {
            this.searchTimer = setTimeout(() => {
                this.search(this.state.searchValue, this.state.deptId, 1);
            }, 200);
        }
    }

    onOpenChange = () => {
        if (this.state.open) {
            document.body.style.overflowY = 'auto';
            document.getElementById("dept").style.height = 'auto'
            document.getElementById("dept").style.overflow = 'auto';
        } else {
            document.body.style.overflowY = 'hidden';
            document.getElementById("dept").style.height = document.getElementById("app").offsetHeight + 'px'
            document.getElementById("dept").style.overflow = 'hidden';
        }

        this.setState({ open: !this.state.open }, () => {
            this.setheight()
        });


    }

    setheight() {
        let h11 = document.getElementById("saixuan-btn").offsetHeight || 0;
        let h12 = document.getElementById("app").offsetHeight || 0;
        let h133 = document.getElementById("saixuan-tit").offsetHeight || 0;

        // console.log(h133,h12,h11,'hhhhhhhhhh')


        document.getElementById("saixuan-change").style.height = (h12 - h133 - h11) + 'px'

    }

    paixu(p, s) {

        const { paixuStr, sdaoxuStr } = this.state;
        if (paixuStr === p) {
            ++remsidesc;

        } else {
            remsidesc = 0
        }

        if (remsidesc == 0 || (remsidesc % 2 == 0)) {
            s = 'DESC'
        } else {
            s = 'ASC'
        }



        this.setState({
            paixuStr: p,
            sdaoxuStr: s,

        }, () => {
            // console.log(this.state.paixuStr,this.state.sdaoxuStr,'this.statethis.statethis.statethis.state')

            this.getDocList()

        })

    }

    deptFilter(e, id) {

        let noact = true

        Array.prototype.remove = function (val) {
            var index = this.indexOf(val);
            if (index > -1) {
                this.splice(index, 1);
            }
        };
        // console.log(e,'11',id,e.target.className,deptFilterArr)

        if (!!!e.target.className) {

            e.target.className = 'active'

            if (id == 'alldcep') {
                deptFilterArr = []
            } else {
                deptFilterArr.push(id.toString())
                document.getElementById('alldcep').className = ''
            }
            // deptFilterArr.push(id.toString())

        } else {

            e.target.className = ''
            // deptFilterArr.remove(id.toString())

            if (id == 'alldcep') {
                deptFilterArr = []



                if (this.nocative()) {
                    noact = false
                    this.setState({
                        DocTotalCount: ''
                    })
                }

            } else {

                deptFilterArr.remove(id.toString())

                console.log('noarr', this.noarr())

                if (this.noarr()) {
                    noact = false
                    this.setState({
                        DocTotalCount: ''
                    })
                }

            }

        }

        if (noact) {
            this.getdocNum()
        }



        // console.log('e**********',deptFilterArr)

    }

    graderFilter(e, id) {
        let noact = true

        Array.prototype.remove = function (val) {
            var index = this.indexOf(val);
            if (index > -1) {
                this.splice(index, 1);
            }
        };
        // console.log(e,'11',id,e.target.className,graderFilterArr)

        if (!!!e.target.className) {
            e.target.className = 'active'
            if (id == 'alldoc') {
                graderFilterArr = []
            } else {
                graderFilterArr.push(id.toString())
                document.getElementById('alldoc').className = ''
            }
        } else {
            e.target.className = ''
            if (id == 'alldoc') {
                graderFilterArr = []
                console.log(this.nocative())

                if (this.nocative() || this.noarr()) {
                    noact = false

                    this.setState({
                        DocTotalCount: ''
                    })
                }
            } else {
                graderFilterArr.remove(id.toString())
                if (this.noarr()) {
                    noact = false
                    this.setState({
                        DocTotalCount: ''
                    })
                }

            }
        }

        // console.log('e**********',graderFilterArr)

        if (noact) {
            this.getdocNum()
        }



    }

    statusFilter(e, id) {
        let noact = true

        Array.prototype.remove = function (val) {
            var index = this.indexOf(val);
            if (index > -1) {
                this.splice(index, 1);
            }
        };
        // console.log(e,'11',id,e.target.className,statusFilterArr)

        if (!!!e.target.className) {
            e.target.className = 'active'
            if (id == 'allsta') {
                statusFilterArr = []

            } else {
                statusFilterArr = [id.toString()]
                document.getElementById('allsta').className = ''

            }

        } else {


            e.target.className = ''
            statusFilterArr = []

            if (id == 'allsta') {
                console.log(this.nocative())

                if (this.nocative() || this.noarr()) {
                    noact = false

                    this.setState({
                        DocTotalCount: ''
                    })
                }
            } else {
                if (this.noarr()) {
                    noact = false
                    this.setState({
                        DocTotalCount: ''
                    })
                }

            }

        }

        if (noact) {
            this.getdocNum()
        }



        // console.log('e**********',statusFilterArr)

    }

    typeFilter(e, id) {
        let noact = true

        Array.prototype.remove = function (val) {
            var index = this.indexOf(val);
            if (index > -1) {
                this.splice(index, 1);
            }
        };
        // console.log(e,'11',id,e.target.className,typeFilterArr)

        if (!!!e.target.className) {
            e.target.className = 'active'

            if (id == 'allfs') {
                typeFilterArr = []
            } else {
                typeFilterArr.push(id.toString())

                document.getElementById('allfs').className = ''
            }

        } else {
            e.target.className = ''
            if (id == 'allfs') {
                typeFilterArr = []

                console.log(this.nocative())
                if (this.nocative() || this.noarr()) {
                    noact = false

                    this.setState({
                        DocTotalCount: ''
                    })
                }


            } else {
                typeFilterArr.remove(id.toString())
                if (this.noarr()) {
                    noact = false
                    this.setState({
                        DocTotalCount: ''
                    })
                }

            }
        }


        if (noact) {
            this.getdocNum()
        }



        // console.log('e**********',typeFilterArr)

    }

    nocative() {
        return !!(document.getElementById('allfs').className == '' &&
            document.getElementById('allsta').className == '' &&
            document.getElementById('alldoc').className == '' &&
            document.getElementById('alldcep').className == '')
    }

    noarr() {
        console.log(deptFilterArr.length, graderFilterArr.length, statusFilterArr.length, typeFilterArr.length, 'all-length')
        console.log(deptFilterArr, graderFilterArr, statusFilterArr, typeFilterArr, 'all')
        return !!(deptFilterArr.length == 0 &&
            graderFilterArr.length == 0 &&
            statusFilterArr.length == 0 &&
            typeFilterArr.length == 0)
    }

    nosaixuan() {
        deptFilterArr = [],
            graderFilterArr = [],
            statusFilterArr = [],
            typeFilterArr = [];
        document.getElementById('allfs').className = ''
        document.getElementById('allsta').className = ''
        document.getElementById('alldoc').className = ''
        document.getElementById('alldcep').className = ''
        document.body.style.overflowY = 'auto';
        document.getElementById("dept").style.height = 'auto'
        document.getElementById("dept").style.overflow = 'auto';


        this.setState({
            open: false,
            paixuStr: '',
            sdaoxuStr: '',
            DocTotalCount: ''
        })

        this.getDocList();

    }

    isgosx() {
        this.setState({
            open: false
        })
        document.body.style.overflowY = 'auto';
        document.getElementById("dept").style.height = 'auto'
        document.getElementById("dept").style.overflow = 'auto';
        this.getDocList()
    }


    cancelModal() {
        this.setState({
            tips: false,
            footShow: false
        })
    }

    render() {
        const { msg, docList, canAdd, searchValue, searchList, search1, searchDoctorList, doctorShow, type, open
            , sdaoxuStr, paixuStr,
            graderFilterDate,
            statusFilterDate,
            typeFilterDate,
            DocTotalCount,
            deptList, tips

        } = this.state;

        const deptAllListStatus = !!window.localStorage.deptAllListStatus ? JSON.parse(window.localStorage.deptAllListStatus).deptList : deptList;

        // console.log(DocTotalCount,'DocTotalCountDocTotalCountDocTotalCount')

        const sidebar = (
            <div className="saixuanBox" id="saixuanBox">
                <div className="saixuan-tit" id="saixuan-tit">筛选</div>

                <div className="saixuan-change" id="saixuan-change">
                    <div className="saixuan-child">

                        <div className='saixuan-child-tit'>科室名称
                        <i></i>
                        </div>
                        <div className="saixuan-con">

                            <div id="alldcep" onClick={(e) => { this.deptFilter(e, 'alldcep') }}>全部科室</div>
                            {/* {
                                console.log('测试'),
                                console.log(deptAllListStatus)
                            } */}
                            {deptAllListStatus && !!deptAllListStatus.length > 0 && deptAllListStatus.map((item, index) => {
                                // console.log(item,index)
                                let isact = false;
                                deptFilterArr.length > 0 && deptFilterArr.map((i) => {
                                    // console.log()
                                    if (i == item.no) {
                                        isact = true
                                    }
                                })
                                return (
                                    <div className={isact ? 'active' : ''} onClick={(e) => { this.deptFilter(e, item.no) }} key={index}>{item.name}</div>
                                )
                            })}
                            {/* //deptAllListStatus.deptList 为空处理 */}

                        </div>

                        <div className='saixuan-child-tit'>医生职称</div>
                        <div className="saixuan-con">

                            {graderFilterDate && graderFilterDate.map((item, index) => {
                                let isact = false;
                                graderFilterArr.length > 0 && graderFilterArr.map((i) => {
                                    if (i == item.id) {
                                        isact = true
                                    }

                                })
                                // console.log(graderFilterArr,'graderFilterArr')                                
                                // console.log(item.id,isact,'1111')

                                return (
                                    <div id={item.id} className={isact ? 'active' : ''} onClick={(e) => { this.graderFilter(e, item.id) }} key={index}>{item.name}</div>
                                )
                            })}

                        </div>

                        <div className='saixuan-child-tit'>医师状态<span>(单选)</span></div>
                        <div className="saixuan-con">

                            {statusFilterDate && statusFilterDate.map((item, index) => {
                                // console.log(item,index)
                                let isact = false;
                                statusFilterArr.length > 0 && statusFilterArr.map((i) => {
                                    // console.log()
                                    if (i == item.id) {
                                        isact = true
                                    }
                                })
                                return (
                                    <div id={item.id} className={isact ? 'active' : ''} onClick={(e) => { this.statusFilter(e, item.id) }} key={index}>{item.name}</div>
                                )
                            })}
                        </div>

                        <div className='saixuan-child-tit'>服务方式</div>

                        <div className="saixuan-con">
                            {typeFilterDate && typeFilterDate.map((item, index) => {
                                // console.log(item,index)
                                let isact = false;
                                typeFilterArr.length > 0 && typeFilterArr.map((i) => {
                                    // console.log()
                                    if (i == item.id) {
                                        isact = true
                                    }
                                })
                                return (
                                    <div id={item.id} className={isact ? 'active' : ''} onClick={(e) => { this.typeFilter(e, item.id) }} key={index}>{item.name}</div>
                                )
                            })}
                        </div>

                    </div>

                </div>


                <div className="saixuan-btn" id="saixuan-btn">
                    <div onClick={() => { this.nosaixuan() }}>重置</div>
                    <div onClick={() => {
                        this.isgosx()
                    }}>确定{!!DocTotalCount ? '（' + DocTotalCount + '名医生）' : ''}</div>
                </div>

            </div>
        );


        return (

            <div>
                <div className='dept' id="dept">
                    {tips && <div className='modal1'>
                        <div className='modal-body-protocol showtips'>
                            <div className='modal-title'>温馨提示</div>
                            <div className='modal-content-protocol'>
                                <div className="contentred">
                                    由于目前医院医生资源紧张，请大家务必不要重复咨询！医生会尽快回复，夜间的咨询回复会相对较慢，
                                    请耐心等待。新冠肺炎咨询仅限排查新型冠状病毒感染，其他症状的患者请咨询其他对症科室。
                            </div>
                                <div className="blackContent">
                                    <p>1、请大家不要恐慌、焦虑。</p>
                                    <p> 2、去过武汉的人员，无症状，无不适者，请自行执行居家隔离。</p>
                                    <p>3、对于发热症状完全消失的确诊病人，最好经过2周的隔离期，否则与之接触的人，仍有被感染的风险。</p>
                                    <p>4、如果有密切接触确认病人或发热史，请一定要告诉医务人员您有这样的病史，不要刻意隐瞒病史，以减少更多人感染的风险。</p>
                                    <p>5、充足的休息和足够营养是提高免疫力的最好措施，避免过度的紧张、焦虑和恐慌。</p>
                                    <p>6、医生的回答仅仅是健康咨询类建议，不作为诊断、治疗、处方等诊疗性依据，若是急、重患者请佩戴口罩后及时到院就诊。</p>
                                    
                                </div>
                               
                            </div>
                            <div className='ok' onClick={() => {
                                this.cancelModal()
                            }}>
                                    <span>确认</span>

                                </div>
                        </div>

                    </div>}
                    <div className="home"><span className="jian"
                        onClick={() => {
                            if (this.props.location.query.source == 1 || this.props.location.query.source == 5) {
                                this.context.router.push({
                                    pathname: 'consult/alldeptlist',
                                    query: { type: type }
                                })
                            } else {
                                this.context.router.push({
                                    pathname: 'home/index'
                                })
                            }
                        }}
                    ></span> {type == '2' ? '护理咨询' : '找专家'}
                    </div>
                    <div className="allSearch">
                        <Dialog type="ios" title={this.state.style1.title} buttons={this.state.style1.buttons}
                            show={this.state.showIOS1}>
                            {msg}
                        </Dialog>
                        <div className="m-search active" style={{ marginBottom: '1px' }}>
                            <div className="search-ipt">
                                <div className="ipt-icon">
                                    <img src="../../../resources/images/search.png" />
                                </div>
                                <form action="/" method="post" onSubmit={
                                    (e) => {
                                        e.preventDefault();
                                    }
                                }
                                >
                                    <input className="ipt"
                                        value={searchValue}
                                        placeholder={type == '2' ? "点击搜索科室/护士" : "点击搜索科室/医生"}
                                        //    onFocus={(e)=>{
                                        //             this.bindSearchFocus(e)
                                        //             }}
                                        onChange={(e) => {
                                            this.getValue(e)
                                        }}
                                    />
                                </form>
                            </div>
                        </div>

                        <div className="m-search" style={{ margin: "0px 8px" }}>
                            <div className="doc-screen">
                                <div className={paixuStr == "inquirys" ? "active" : ''} onClick={() => { this.paixu('inquirys', 'DESC') }} >问诊量<i>
                                    {paixuStr == "inquirys" ?



                                        sdaoxuStr == 'DESC' ? <img src="../../../resources/images/suxu.png" alt="" /> : <img src="../../../resources/images/daoxu.png" alt="" />



                                        :
                                        <img src="../../../resources/images/noxuan.png" alt="" />
                                    }


                                </i></div>

                                <div className={paixuStr == "replyTime" ? "active" : ''} onClick={() => { this.paixu('replyTime', 'DESC') }} >回复时长<i>
                                    {paixuStr == "replyTime" ?

                                        sdaoxuStr == 'DESC' ? <img src="../../../resources/images/suxu.png" alt="" /> : <img src="../../../resources/images/daoxu.png" alt="" />


                                        :
                                        <img src="../../../resources/images/noxuan.png" alt="" />
                                    }

                                </i></div>
                                <div className={paixuStr == "favorite" ? "active" : ''} onClick={() => { this.paixu('favorite', 'DESC') }} >好评率<i>
                                    {paixuStr == "favorite" ?
                                        sdaoxuStr == 'DESC' ? <img src="../../../resources/images/suxu.png" alt="" /> : <img src="../../../resources/images/daoxu.png" alt="" />


                                        :
                                        <img src="../../../resources/images/noxuan.png" alt="" />
                                    }

                                </i></div>
                                <div onClick={this.onOpenChange}>筛选<i>
                                    <img className="sx" src="../../../resources/images/shaixuan.png" alt="" />

                                </i></div>
                            </div>
                        </div>

                        <div className="page-dept-list">
                            {search1 &&
                                <div className="m-search-content" style={{ marginTop: '6px' }}>
                                    {searchList.length <= 0 && searchDoctorList.length <= 0 &&
                                        <div className="wgt-empty-box">
                                            <img className="wgt-empty-img" src="../../../resources/images/no-result.png" alt=""></img>
                                            <div className="wgt-empty-txt">暂未查询到相关信息
                            </div>
                                        </div>}
                                    {(searchList.length >= 0 || searchDoctorList.length >= 0) &&
                                        <div className="search-content">
                                            {searchDoctorList.length > 0 &&
                                                <div className="content">
                                                    {searchDoctorList.length > 0 &&
                                                        <div className="title2">科室
                                </div>}
                                                    {searchDoctorList.length > 0 && searchDoctorList.map((item, index) => {
                                                        return (
                                                            <div className="title1"
                                                                key={index}
                                                                onClick={() => {
                                                                    this.getDocList(item.no, 1);
                                                                    this.setState({
                                                                        search1: false,
                                                                        doctorShow: true,
                                                                        searchFocus: false,
                                                                    })
                                                                }}
                                                            >{item.name}</div>
                                                        )
                                                    })}
                                                </div>}
                                            <div className="space"></div>
                                            {searchList.length > 0 && <div className="title2">
                                                {type == '2' ? '护士' : '医生'}
                                            </div>}
                                            {searchList.map((item1, index1) => {
                                                return (
                                                    <Doctor {...item1} key={index1} type={type}></Doctor>
                                                )
                                            }
                                            )
                                            }
                                        </div>}
                                </div>
                            }
                            {doctorShow && !search1 &&
                                <div className="m-search-content">
                                    {docList.length <= 0 && <div className='no-data'>
                                        <img src='../../../resources/images/no-result.png' />

                                        <div>暂未查询到相关信息</div>
                                    </div>}
                                    {docList.length > 0 && docList.map((item, index) => {
                                        return (
                                            <Doctor {...item} key={index}></Doctor>
                                        )
                                    }
                                    )}
                                </div>
                            }
                        </div>
                        {canAdd && <div className="loadMore" ref="wrapper"  > </div>}
                    </div>



                </div>



                <Drawer
                    className="my-drawer"
                    style={!!open ? { minHeight: document.documentElement.clientHeight, zIndex: '100000', top: 0 } : { minHeight: document.documentElement.clientHeight, zIndex: '-1' }}
                    enableDragHandle
                    sidebar={sidebar}
                    position="right"
                    width='80%'
                    dragToggleDistance={100}
                    open={open}
                    onOpenChange={this.onOpenChange}
                >
                    <div>            </div>
                </Drawer>

            </div>
        );
    }
}
export default Connect()(Widget);
