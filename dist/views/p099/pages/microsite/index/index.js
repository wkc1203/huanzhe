define('views/p099/pages/microsite/index/index.jsx', function(require, exports, module) {

  'use strict';
  
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  
  var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
  
  var _react = require('node_modules/react/react');
  
  var _react2 = _interopRequireDefault(_react);
  
  var _reactRouter = require('node_modules/react-router/lib/index');
  
  var _Connect = require('views/p099/components/connect/Connect.jsx');
  
  var _Connect2 = _interopRequireDefault(_Connect);
  
  var _constant = require('views/p099/config/constant/constant');
  
  var _indexApi = require('views/p099/pages/microsite/index/indexApi');
  
  var Api = _interopRequireWildcard(_indexApi);
  
  ''/*@require /views/p099/pages/microsite/index/style/index.css*/;
  
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
        hospInfo: {}
      };
      return _this;
    }
  
    _createClass(Widget, [{
      key: 'componentDidMount',
      value: function componentDidMount() {}
    }, {
      key: 'getHospIntro',
      value: function getHospIntro() {
        var _this2 = this;
  
        this.showLoading();
        Api.getHisInfo().then(function (res) {
          _this2.hideLoading();
          _this2.setState({ hospInfo: res.data });
        }, function (e) {
          _this2.hideLoading();
          _this2.showPopup({ content: e.msg });
        });
      }
    }, {
      key: 'render',
      value: function render() {
  
        return (
          /*首页*/
          _react2.default.createElement(
            'div',
            { className: 'page-home ' },
            _react2.default.createElement('div', { className: 'header' }),
            _react2.default.createElement(
              'div',
              { className: 'content' },
              _react2.default.createElement(
                'div',
                { className: 'head-des' },
                _react2.default.createElement(
                  'div',
                  { className: 'f-pa' },
                  _react2.default.createElement(
                    _reactRouter.Link,
                    { className: 'd-tab',
                      to: { pathname: '/usercenter/userinfo', query: { patientId: v.patientId } }
                    },
                    _react2.default.createElement(
                      'div',
                      null,
                      _react2.default.createElement('div', { className: 'icon' }),
                      _react2.default.createElement(
                        'div',
                        { className: 'text' },
                        _react2.default.createElement(
                          'div',
                          null,
                          '\u56FE\u6587\u54A8\u8BE2'
                        ),
                        _react2.default.createElement(
                          'div',
                          null,
                          '\u533B\u751F\u5C06\u572824\u5C0F\u65F6\u5185\u56DE\u590D'
                        )
                      )
                    )
                  ),
                  _react2.default.createElement(
                    'div',
                    { className: 'd-tab' },
                    _react2.default.createElement(
                      'div',
                      null,
                      _react2.default.createElement('div', { className: 'icon' }),
                      _react2.default.createElement(
                        'div',
                        { className: 'text' },
                        _react2.default.createElement(
                          'div',
                          null,
                          '\u89C6\u9891\u54A8\u8BE2'
                        ),
                        _react2.default.createElement(
                          'div',
                          null,
                          '\u4E00\u5BF9\u4E00\u89C6\u9891\u54A8\u8BE2'
                        )
                      )
                    )
                  ),
                  _react2.default.createElement(
                    'div',
                    { className: 'd-tab' },
                    _react2.default.createElement(
                      'div',
                      null,
                      _react2.default.createElement('div', { className: 'icon' }),
                      _react2.default.createElement(
                        'div',
                        { className: 'text' },
                        _react2.default.createElement(
                          'div',
                          null,
                          '\u7535\u8BDD\u54A8\u8BE2'
                        ),
                        _react2.default.createElement(
                          'div',
                          null,
                          '\u4E00\u5BF9\u4E00\u7535\u8BDD\u54A8\u8BE2'
                        )
                      )
                    )
                  )
                )
              ),
              _react2.default.createElement(
                'div',
                { className: 'title' },
                '\u5E38\u7528\u670D\u52A1'
              ),
              _react2.default.createElement(
                'div',
                { className: 'b-tab' },
                _react2.default.createElement(
                  _reactRouter.Link,
                  {
                    to: { pathname: '/usercenter/userinfo' }
                  },
                  _react2.default.createElement(
                    'div',
                    { className: 'text' },
                    _react2.default.createElement(
                      'div',
                      null,
                      '\u79D1\u5BA4\u4ECB\u7ECD'
                    ),
                    _react2.default.createElement(
                      'div',
                      null,
                      '\u4E86\u89E3\u533B\u9662\u79D1\u5BA4'
                    )
                  ),
                  _react2.default.createElement('div', { className: 'icon' })
                ),
                _react2.default.createElement(
                  _reactRouter.Link,
                  {
                    to: { pathname: '/usercenter/userinfo' }
                  },
                  _react2.default.createElement(
                    'div',
                    { className: 'text' },
                    _react2.default.createElement(
                      'div',
                      null,
                      '\u4E13\u5BB6\u4ECB\u7ECD'
                    ),
                    _react2.default.createElement(
                      'div',
                      null,
                      '\u4E86\u89E3\u4E13\u5BB6\u4FE1\u606F'
                    )
                  ),
                  _react2.default.createElement('div', { className: 'icon' })
                ),
                _react2.default.createElement(
                  _reactRouter.Link,
                  {
                    to: { pathname: '/usercenter/userinfo' }
                  },
                  _react2.default.createElement(
                    'div',
                    { className: 'text' },
                    _react2.default.createElement(
                      'div',
                      null,
                      '\u5065\u5EB7\u5BA3\u6559'
                    ),
                    _react2.default.createElement(
                      'div',
                      null,
                      '\u513F\u7AE5\u62A4\u7406\u77E5\u8BC6'
                    )
                  ),
                  _react2.default.createElement('div', { className: 'icon' })
                ),
                _react2.default.createElement(
                  _reactRouter.Link,
                  {
                    to: { pathname: '/usercenter/userinfo' }
                  },
                  _react2.default.createElement(
                    'div',
                    { className: 'text' },
                    _react2.default.createElement(
                      'div',
                      null,
                      '\u54A8\u8BE2\u516C\u544A'
                    ),
                    _react2.default.createElement(
                      'div',
                      null,
                      '\u67E5\u770B\u6700\u65B0\u516C\u544A'
                    )
                  ),
                  _react2.default.createElement('div', { className: 'icon' })
                )
              )
            )
          )
        );
      }
    }]);
  
    return Widget;
  }(_react.Component);
  
  exports.default = (0, _Connect2.default)()(Widget);
  module.exports = exports['default'];

});
