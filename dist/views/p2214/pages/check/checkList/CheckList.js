define('views/p2214/pages/check/checkList/CheckList.jsx', function(require, exports, module) {

  'use strict';
  
  Object.defineProperty(exports, "__esModule", {
      value: true
  });
  
  var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
  
  var _react = require('node_modules/react/react');
  
  var _react2 = _interopRequireDefault(_react);
  
  var _reactWeui = require('node_modules/react-weui/lib/index');
  
  var _Connect = require('views/p2214/components/connect/Connect.jsx');
  
  var _Connect2 = _interopRequireDefault(_Connect);
  
  var _constant = require('views/p2214/config/constant/constant');
  
  var _reactRouter = require('node_modules/react-router/lib/index');
  
  var _utils = require('views/p2214/utils/utils');
  
  var Utils = _interopRequireWildcard(_utils);
  
  var _checkListApi = require('views/p2214/pages/check/checkList/checkListApi');
  
  var Api = _interopRequireWildcard(_checkListApi);
  
  ''/*@require /views/p2214/pages/check/checkList/style/index.css*/;
  
  var _hashHistory = require('node_modules/react-router/lib/hashHistory');
  
  var _hashHistory2 = _interopRequireDefault(_hashHistory);
  
  function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
  
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
  
  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
  
  function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
  
  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
  
  var Widget = function (_Component) {
      _inherits(Widget, _Component);
  
      function Widget(props) {
          _classCallCheck(this, Widget);
  
          var _this = _possibleConstructorReturn(this, (Widget.__proto__ || Object.getPrototypeOf(Widget)).call(this, props));
  
          _this.state = {
              msgList: [],
              quiryNum: 0,
              showToast: false,
              showLoading: false,
              toastTimer: null,
              loadingTimer: null,
              showIOS1: false,
              showIOS2: false,
              showAndroid1: false,
              no: 3,
              showAndroid2: false,
              style1: {
                  buttons: [{
                      label: '确定',
                      onClick: Utils.hideDialog.bind(_this)
                  }]
              },
              style2: {
                  title: '提示',
                  buttons: [{
                      type: 'default',
                      label: '取消',
                      onClick: Utils.hideDialog.bind(_this)
                  }, {
                      type: 'primary',
                      label: '确定',
                      onClick: Utils.hideDialog.bind(_this)
                  }]
              },
              msg: '',
              checkInfo: [], //订单详情
              itemList: [], //检查项
              patientTel: '', //就诊人电话
              time: '' //申请时间
          };
          return _this;
      }
  
      _createClass(Widget, [{
          key: 'componentDidMount',
          value: function componentDidMount() {
  
              this.setState({
                  checkInfo: JSON.parse(this.props.location.query.content)
              });
              Utils.getJsByHide();
          }
          //确认
  
      }, {
          key: 'confrim',
          value: function confrim() {
              var _this2 = this;
  
              if (this.state.checkInfo.status == '1') {
                  var replaceUrl = window.location.origin + "/views/p2214/#/consult/pay?orderId=" + this.state.checkInfo.orderIdStr + "&totalFee=" + this.state.checkInfo.totalFee + "&inquiryId=" + this.state.checkInfo.inquiryId + "&doctorName=" + this.state.checkInfo.doctorName + "&deptName=" + this.state.checkInfo.deptName + "&patientCard=" + this.state.checkInfo.patCardNo + "&patientName=" + this.state.checkInfo.patientName;
                  top.window.location.replace(replaceUrl);
              } else {
                  Api.confirm({ hisId: 2214, platformId: 2214, id: this.state.checkInfo.id, patientTel: this.state.patientTel }).then(function (res) {
                      if (res.code == 0) {
                          var replaceUrl = window.location.origin + "/views/p2214/#/consult/pay?orderId=" + _this2.state.checkInfo.orderIdStr + "&totalFee=" + _this2.state.checkInfo.totalFee + "&inquiryId=" + _this2.state.checkInfo.inquiryId + "&doctorName=" + _this2.state.checkInfo.doctorName + "&deptName=" + _this2.state.checkInfo.deptName + "&patientCard=" + _this2.state.checkInfo.patCardNo + "&patientName=" + _this2.state.checkInfo.patientName;
                          top.window.location.replace(replaceUrl);
                      }
                  }, function (e) {
                      _this2.hideLoading();
                  });
              }
          }
          //获取检查单信息
  
      }, {
          key: 'getCheckInfo',
          value: function getCheckInfo(id, orderId, inquiryId) {
              var _this3 = this;
  
              Api.getCheckInfo({ hisId: 2214, platformId: 3, id: id, inquiryId: this.props.location.query.inquiryId }).then(function (res) {
                  if (res.code == 0 && res.data != null) {
                      var dateee = new Date(res.data.createTime).toJSON();
  
                      var date = new Date(+new Date(dateee) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '');
                      _this3.setState({
                          checkInfo: res.data,
                          itemList: JSON.parse(res.data.checkItem),
                          patientTel: res.data.patientTel,
                          time: date
                      });
                  }
              }, function (e) {
                  _this3.hideLoading();
              });
          }
      }, {
          key: 'getMsg',
          value: function getMsg() {
              var _this4 = this;
  
              Api.getMsg().then(function (res) {
                  if (res.code == 0 && res.data != null) {
                      _this4.setState({
                          quiryNum: res.data.length
                      });
                  }
              }, function (e) {
                  _this4.hideLoading();
                  _this4.setState({
                      msg: e.msg,
                      showIOS1: true
                  });
              });
          }
      }, {
          key: 'showToast',
          value: function showToast() {
              var _this5 = this;
  
              this.setState({ showToast: true });
              this.state.toastTimer = setTimeout(function () {
                  _this5.setState({ showToast: false });
              }, 2000);
          }
  
          /*获取咨询列表*/
  
      }, {
          key: 'getInquiryList',
          value: function getInquiryList() {
              var _this6 = this;
  
              this.showLoading();
              Api.getInquiryList().then(function (res) {
                  if (res.code == 0) {
                      _this6.hideLoading();
  
                      _this6.setState({
                          msgList: res.data
                      });
  
                      if (_this6.props.location.query.inquiryId && _this6.props.location.query.s != 1) {
                          window.location.href = window.location.href + "&s=1";
                          _this6.context.router.push({
                              pathname: 'inquiry/chat',
                              query: {
                                  inquiryId: _this6.props.location.query.inquiryId,
                                  orderId: _this6.props.location.query.orderId,
                                  status: _this6.props.location.query.status,
                                  no: 1
                              }
                          });
                      }
                  }
              }, function (e) {
                  _this6.hideLoading();
              });
          }
      }, {
          key: 'toNext',
          value: function toNext(type) {
              if (type == 1) {
                  this.context.router.replace({
                      pathname: '/home/index'
                  });
              }
              if (type == 3) {
                  this.context.router.replace({
                      pathname: '/usercenter/home'
                  });
              }
          }
      }, {
          key: 'render',
          value: function render() {
              var _this7 = this;
  
              var _state = this.state,
                  time = _state.time,
                  patientTel = _state.patientTel,
                  checkInfo = _state.checkInfo,
                  itemList = _state.itemList,
                  msgList = _state.msgList,
                  msg = _state.msg;
  
              return _react2.default.createElement(
                  'div',
                  { className: 'container page-list-check' },
                  _react2.default.createElement(
                      _reactWeui.Dialog,
                      { type: 'ios', title: this.state.style1.title, buttons: this.state.style1.buttons,
                          show: this.state.showIOS1 },
                      msg
                  ),
                  _react2.default.createElement(
                      'div',
                      { className: 'home', style: { position: 'relative', width: '100%', top: '0' } },
                      _react2.default.createElement('span', { className: 'jian',
                          onClick: function onClick() {
                              _this7.context.router.goBack();
                          }
                      }),
                      '\u68C0\u9A8C\u68C0\u67E5\u5355'
                  ),
                  _react2.default.createElement(
                      'div',
                      { className: 'check-status' },
                      _react2.default.createElement(
                          'div',
                          { className: 'status-item register-info rightTab', onClick: function onClick() {
                                  _this7.context.router.push({
                                      pathname: '/check/registerInfo'
                                  });
                              } },
                          '\u5982\u4F55\u5230\u533B\u9662\u62FF\u62A5\u544A\uFF1F'
                      ),
                      _react2.default.createElement(
                          'div',
                          { className: 'status-item register-info', style: { marginTop: '10px' } },
                          '\u5C31\u8BCA\u4EBA\uFF1A',
                          checkInfo.patientName
                      ),
                      checkInfo.checkItem && JSON.parse(checkInfo.checkItem).map(function (item, index) {
                          return _react2.default.createElement(
                              'div',
                              { className: 'status-item register-info rightTab', onClick: function onClick() {
                                      _this7.context.router.push({
                                          pathname: '/check/checkInfo',
                                          query: { doctorName: checkInfo.doctorName, content: JSON.stringify(item), time: checkInfo.createTime, hisName: checkInfo.hisName, deptName: checkInfo.deptName }
                                      });
                                  } },
                              '\u68C0\u67E5\u9879\uFF1A',
                              item.project_name
                          );
                      })
                  )
              );
          }
      }]);
  
      return Widget;
  }(_react.Component);
  
  Widget.contextTypes = {
      router: _react2.default.PropTypes.object
  };
  exports.default = (0, _Connect2.default)()(Widget);
  module.exports = exports['default'];

});
