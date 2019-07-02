define('views/p2214/pages/check/checkInfo/CheckInfo.jsx', function(require, exports, module) {

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
  
  var _Link = require('node_modules/react-router/lib/Link');
  
  var _Link2 = _interopRequireDefault(_Link);
  
  var _checkInfoApi = require('views/p2214/pages/check/checkInfo/checkInfoApi');
  
  var Api = _interopRequireWildcard(_checkInfoApi);
  
  var _utils = require('views/p2214/utils/utils');
  
  var Utils = _interopRequireWildcard(_utils);
  
  ''/*@require /views/p2214/pages/check/checkInfo/style/index.css*/;
  
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
              patientName: '全部就诊人',
              isPatShow: false,
              orderList: [],
              showToast: false,
              showLoading: false,
              toastTimer: null,
              loadingTimer: null,
              showIOS1: false,
              showIOS2: false,
              showAndroid1: false,
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
              clickItem: 555,
              patList: [],
              item1Show: true, //咨询显示
              item3Show: false, //检查单显示
              checkInfo: [] //检查项详情
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
      }, {
          key: 'showToast',
          value: function showToast() {
              var _this2 = this;
  
              this.setState({ showToast: true });
              this.state.toastTimer = setTimeout(function () {
                  _this2.setState({ showToast: false });
              }, 2000);
          }
      }, {
          key: 'componentWillUnmount',
          value: function componentWillUnmount() {
              this.setState({
                  patList: [],
                  patientName: '全部就诊人',
                  isPatShow: false,
                  orderList: []
              });
              // 离开页面时结束所有可能异步逻辑
          }
      }, {
          key: 'selectPat',
          value: function selectPat(patientId, patientName) {
              this.setState({
                  patientName: patientName,
                  isPatShow: false
              });
              this.getOrderList(patientId);
          }
      }, {
          key: 'openList',
          value: function openList() {
              this.setState({
                  isPatShow: !this.state.isPatShow
              });
          }
      }, {
          key: 'getCardList',
          value: function getCardList() {
              var _this3 = this;
  
              Api.getCardList().then(function (res) {
                  if (res.code == 0) {
  
                      _this3.setState({ patList: res.data.cardList });
                  }
              }, function (e) {
                  _this3.setState({
                      msg: e.msg,
                      showIOS1: true
                  });
              });
          }
          /*获取订单列表*/
  
      }, {
          key: 'getOrderList',
          value: function getOrderList() {
              var _this4 = this;
  
              var patientId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  
              this.showLoading();
              Api.getOrderList({ patientId: patientId }).then(function (res) {
                  if (res.code == 0) {
                      _this4.hideLoading();
                      var objStatus = { '-1': '待付款', '0': '咨询中', '1': '咨询中', '3': '已完成' };
                      var items = res.data.map(function (item, index) {
                          item.statusName = objStatus[item.status];
                          return item;
                      });
  
                      _this4.setState({ orderList: items });
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
          key: 'getUser',
          value: function getUser() {
              var _this5 = this;
  
              // 获取实名制
  
              Api.getUser().then(function (res) {
                  _this5.setState({ user: res.data });
              }, function (e) {
                  _this5.setState({
                      msg: e.msg,
                      showIOS1: true
                  });
              });
          }
          //切换显示内容
  
      }, {
          key: 'changeShow',
          value: function changeShow(type) {
              if (type == 1) {
                  this.setState({
                      item1Show: true,
                      item2Show: false,
                      item3Show: false
                  });
              }
              if (type == 2) {
                  alert("正在建设中");
                  this.setState({
                      item2Show: true,
                      item1Show: false,
                      item3Show: false
                  });
              }
              if (type == 3) {
                  this.setState({
                      item3Show: true,
                      item2Show: false,
                      item1Show: false
                  });
              }
          }
      }, {
          key: 'render',
          value: function render() {
              var _this6 = this;
  
              var _state = this.state,
                  checkInfo = _state.checkInfo,
                  msg = _state.msg;
  
              return _react2.default.createElement(
                  'div',
                  { className: 'container page-check-info' },
                  _react2.default.createElement(
                      'div',
                      { className: 'home', style: { position: 'fixed', width: '100%', top: '0' } },
                      _react2.default.createElement('span', { className: 'jian',
                          onClick: function onClick() {
                              _this6.context.router.goBack();
                          }
                      }),
                      '\u6211\u7684\u68C0\u9A8C\u68C0\u67E5\u5355'
                  ),
                  _react2.default.createElement(
                      _reactWeui.Toast,
                      { icon: 'success-no-circle', show: this.state.showToast },
                      '\u4FEE\u6539\u6210\u529F'
                  ),
                  _react2.default.createElement(
                      _reactWeui.Dialog,
                      { type: 'ios', title: this.state.style1.title, buttons: this.state.style1.buttons, show: this.state.showIOS1 },
                      msg
                  ),
                  _react2.default.createElement(
                      'div',
                      { className: 'reportInfo' },
                      _react2.default.createElement(
                          'div',
                          { className: 'infoTop' },
                          _react2.default.createElement(
                              'p',
                              null,
                              '\u91CD\u5E86\u513F\u7AE5\u4E92\u8054\u7F51\u533B\u9662\u68C0\u67E5\u5355\uFF08\u62FF\u62A5\u544A\u65F6\u51FA\u793A\uFF09'
                          ),
                          _react2.default.createElement(
                              'div',
                              { className: 'qrCode' },
                              _react2.default.createElement('img', { src: '/views/p2214/resources/images/qCode.jpg?v=794b0ee', alt: '' })
                          )
                      ),
                      _react2.default.createElement(
                          'div',
                          { className: 'infoBasic' },
                          _react2.default.createElement(
                              'div',
                              null,
                              _react2.default.createElement(
                                  'p',
                                  null,
                                  '\u7533\u8BF7\u5E8F\u53F7\uFF1A',
                                  checkInfo.applyNo
                              ),
                              _react2.default.createElement(
                                  'p',
                                  null,
                                  'ID\u53F7\uFF1A',
                                  checkInfo.IDCard
                              )
                          ),
                          _react2.default.createElement(
                              'div',
                              null,
                              _react2.default.createElement(
                                  'p',
                                  null,
                                  '\u5C31\u8BCA\u53F7\uFF1A',
                                  checkInfo.inquiryNo
                              ),
                              _react2.default.createElement(
                                  'p',
                                  null,
                                  '\u5F00\u5355\u5E8F\u53F7\uFF1A',
                                  checkInfo.billNo
                              )
                          ),
                          _react2.default.createElement(
                              'div',
                              null,
                              _react2.default.createElement(
                                  'p',
                                  null,
                                  '\u6267\u884C\u79D1\u5BA4\uFF1A',
                                  checkInfo.executeDept
                              ),
                              _react2.default.createElement(
                                  'p',
                                  null,
                                  '\u7533\u8BF7\u79D1\u5BA4\uFF1A',
                                  checkInfo.applyDept
                              )
                          )
                      ),
                      _react2.default.createElement(
                          'div',
                          { className: 'userInfo' },
                          _react2.default.createElement(
                              'div',
                              null,
                              _react2.default.createElement(
                                  'p',
                                  null,
                                  '\u5C31\u8BCA\u4EBA\uFF1A',
                                  checkInfo.patName
                              ),
                              _react2.default.createElement(
                                  'p',
                                  null,
                                  '\u6027\u522B\uFF1A',
                                  checkInfo.patSex = 'M' ? '男' : '女'
                              )
                          ),
                          _react2.default.createElement(
                              'div',
                              null,
                              _react2.default.createElement(
                                  'p',
                                  null,
                                  '\u5C31\u8BCA\u5361\uFF1A',
                                  checkInfo.patCardNo
                              ),
                              _react2.default.createElement(
                                  'p',
                                  null,
                                  '\u5E74\u9F84\uFF1A',
                                  checkInfo.patAge
                              )
                          )
                      ),
                      _react2.default.createElement(
                          'div',
                          { className: 'itemInfo' },
                          _react2.default.createElement(
                              'div',
                              null,
                              '\u6807\u672C\uFF1A',
                              checkInfo.specimen
                          ),
                          _react2.default.createElement(
                              'div',
                              null,
                              '\u6807\u672C\u8BF4\u660E \uFF1A ',
                              checkInfo.specimenDesc
                          ),
                          _react2.default.createElement(
                              'div',
                              null,
                              '\u5316\u9A8C\u9879\u76EE \uFF1A',
                              checkInfo.project_name
                          )
                      ),
                      _react2.default.createElement(
                          'div',
                          { className: 'payFee' },
                          '\u91D1\u989D\uFF1A',
                          _react2.default.createElement(
                              'span',
                              null,
                              '\uFFE5',
                              (checkInfo.price / 100).toFixed(2)
                          )
                      ),
                      _react2.default.createElement('div', { className: 'totalFee' }),
                      _react2.default.createElement(
                          'div',
                          { className: 'doctorInfo' },
                          _react2.default.createElement(
                              'p',
                              null,
                              '\u533B\u751F\uFF1A',
                              this.props.location.query.doctorName
                          ),
                          _react2.default.createElement(
                              'div',
                              { className: 'net' },
                              _react2.default.createElement(
                                  'p',
                                  { className: 'name' },
                                  this.props.location.query.doctorName
                              ),
                              _react2.default.createElement(
                                  'p',
                                  null,
                                  this.props.location.query.hisName,
                                  ' ',
                                  this.props.location.query.deptName
                              ),
                              _react2.default.createElement(
                                  'p',
                                  null,
                                  this.props.location.query.time
                              )
                          )
                      )
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
