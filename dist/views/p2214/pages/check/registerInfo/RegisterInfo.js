define('views/p2214/pages/check/registerInfo/RegisterInfo.jsx', function(require, exports, module) {

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
  
  var _registerInfoApi = require('views/p2214/pages/check/registerInfo/registerInfoApi');
  
  var Api = _interopRequireWildcard(_registerInfoApi);
  
  var _utils = require('views/p2214/utils/utils');
  
  var Utils = _interopRequireWildcard(_utils);
  
  ''/*@require /views/p2214/pages/check/registerInfo/style/index.css*/;
  
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
              msg: ''
          };
          return _this;
      }
  
      _createClass(Widget, [{
          key: 'componentDidMount',
          value: function componentDidMount() {}
      }, {
          key: 'render',
          value: function render() {
              var _this2 = this;
  
              var _state = this.state,
                  msgList = _state.msgList,
                  msg = _state.msg;
  
              return _react2.default.createElement(
                  'div',
                  { className: 'container page-register-info' },
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
                              _this2.context.router.goBack();
                          }
                      }),
                      '\u5C31\u8BCA\u6307\u5F15'
                  ),
                  _react2.default.createElement(
                      'div',
                      { className: 'info' },
                      _react2.default.createElement(
                          'p',
                          { className: 'register-title' },
                          '\u5982\u4F55\u68C0\u67E5'
                      ),
                      _react2.default.createElement(
                          'p',
                          { className: 'register-text' },
                          '\u6309\u7167\u68C0\u67E5\u5355\u9879\u76EE\uFF0C\u5230\u68C0\u67E5\u79D1\u5BA4\uFF0C\u51FA\u793A\u60A8\u7684\u5B9E\u4F53\u5C31\u8BCA\u5361\uFF0C\u82E5\u6CA1\u6709\u5B9E\u4F53\u5C31\u8BCA\u5361\uFF0C \u51FA\u793A\u60A8 \u7684\u7535\u5B50\u5C31\u8BCA\u5361\u4E8C\u7EF4\u7801'
                      )
                  ),
                  _react2.default.createElement(
                      'div',
                      { className: 'info' },
                      _react2.default.createElement(
                          'p',
                          { className: 'register-title' },
                          '\u5982\u4F55\u67E5\u770B\u62A5\u544A'
                      ),
                      _react2.default.createElement(
                          'p',
                          { className: 'register-text' },
                          '\u5728\u62A5\u544A\u51FA\u6765\u540E\uFF0C\u5728\u4E2A\u4EBA\u4E2D\u5FC3\u67E5\u770B\u6211\u7684\u68C0\u9A8C\u68C0\u67E5\u62A5\u544A'
                      )
                  ),
                  _react2.default.createElement(
                      'div',
                      { className: 'info' },
                      _react2.default.createElement(
                          'p',
                          { className: 'register-title' },
                          '\u5982\u4F55\u53D6\u5B9E\u4F53\u62A5\u544A'
                      ),
                      _react2.default.createElement(
                          'p',
                          { className: 'register-text' },
                          '\u5728\u62A5\u544A\u51FA\u6765\u540E\uFF0C\u5728\u62FF\u62A5\u544A\u7A97\u53E3\uFF0C\u51FA\u793A\u60A8\u7684\u68C0\u67E5\u5355\u6761\u5F62\u7801\u3002 \u68C0\u67E5\u5355\u6761\u5F62\u7801\u5C31\u5728\u68C0\u9A8C\u68C0\u67E5\u62A5\u544A\u9875\u9762\u4E2A\u4EBA\u4E2D\u5FC3>\u75C5\u5386\u8BB0\u5F55>\u68C0\u67E5\u5355'
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
