define('views/p2214/pages/consult/deptlist/component/Doctor.jsx', function(require, exports, module) {

  'use strict';
  
  Object.defineProperty(exports, "__esModule", {
      value: true
  });
  
  var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
  
  var _react = require('node_modules/react/react');
  
  var _react2 = _interopRequireDefault(_react);
  
  var _reactRouter = require('node_modules/react-router/lib/index');
  
  var _Connect = require('views/p2214/components/connect/Connect.jsx');
  
  var _Connect2 = _interopRequireDefault(_Connect);
  
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
              phoneShow: false
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
  
              var _props = this.props,
                  doctorId = _props.doctorId,
                  deptId = _props.deptId,
                  image = _props.image,
                  name = _props.name,
                  deptName = _props.deptName,
                  level = _props.level,
                  inquirys = _props.inquirys,
                  specialty = _props.specialty,
                  serviceTimes = _props.serviceTimes,
                  replyTime = _props.replyTime,
                  replyLabel = _props.replyLabel,
                  type = _props.type;
  
              return _react2.default.createElement(
                  'div',
                  {
                      onClick: function onClick() {
                          window.localStorage.deptShow = '2';
                          window.localStorage.scrollYY = window.scrollY;
                          window.localStorage.scrollXX = window.scrollX;
                          _this2.context.router.push({
                              pathname: '/consult/deptdetail',
                              query: { doctorId: doctorId, deptId: deptId, resource: 2, type: type }
  
                          });
                      },
                      className: 'doc-item' },
                  _react2.default.createElement(
                      'div',
                      { className: 'doc-info' },
                      _react2.default.createElement(
                          'div',
                          { className: 'docImg' },
                          _react2.default.createElement('img', { className: 'doc-img', src: image != null && image.indexOf("ihoss") == '-1' ? image : image + "?x-oss-process=image/resize,w_105", alt: '\u533B\u751F\u5934\u50CF' })
                      ),
                      _react2.default.createElement(
                          'div',
                          { className: 'text-box' },
                          _react2.default.createElement(
                              'div',
                              { className: 'doc-item1' },
                              _react2.default.createElement(
                                  'div',
                                  { className: 'doc-name' },
                                  name
                              ),
                              replyLabel == '1' && _react2.default.createElement(
                                  'div',
                                  { className: 'speed' },
                                  '\u56DE\u7B54\u5FEB'
                              ),
                              _react2.default.createElement(
                                  'div',
                                  { className: 'rate' },
                                  '\u597D\u8BC4\u7387\uFF1A',
                                  _react2.default.createElement(
                                      'span',
                                      null,
                                      '98%'
                                  )
                              )
                          ),
                          _react2.default.createElement(
                              'div',
                              { className: 'doc-des2' },
                              deptName,
                              '  ',
                              level
                          ),
                          _react2.default.createElement(
                              'div',
                              {
                                  className: 'doc-des ellipsis' },
                              specialty ? specialty : '暂无描述'
                          ),
                          _react2.default.createElement(
                              'div',
                              { className: 'pinfen' },
                              _react2.default.createElement(
                                  'span',
                                  null,
                                  '\u54A8\u8BE2\u4EBA\u6570\uFF1A',
                                  serviceTimes
                              ),
                              '\u5E73\u5747\u56DE\u590D\u65F6\u957F:  ',
                              replyTime
                          ),
                          _react2.default.createElement('div', null),
                          _react2.default.createElement(
                              'div',
                              { className: 'oper-box' },
                              inquirys.map(function (item2, index2) {
                                  return _react2.default.createElement(
                                      'div',
                                      { key: index2,
                                          className: (item2.type !== '1' ? 'disNo' : 'flex22') + ' ' + (item2.isFull != '1' && item2.type == '1' && item2.isOnDuty == '1' ? 'status-item1' : 'grey-item1') },
                                      item2.isFull == '1' && item2.type == '1' && item2.isOnDuty == '1' && _react2.default.createElement(
                                          'div',
                                          null,
                                          '\u56FE\u6587\u54A8\u8BE2(\u6EE1)'
                                      ),
                                      item2.isFull != '1' && item2.type == '1' && item2.isOnDuty == '1' && _react2.default.createElement(
                                          'div',
                                          null,
                                          '\u56FE\u6587\u54A8\u8BE2'
                                      ),
                                      item2.type == '1' && item2.isOnDuty == '0' && _react2.default.createElement(
                                          'div',
                                          null,
                                          '\u56FE\u6587\u54A8\u8BE2(\u79BB)'
                                      )
                                  );
                              }),
                              _react2.default.createElement(
                                  'div',
                                  { className: 'grey-item1' },
                                  '\u7535\u8BDD\u54A8\u8BE2',
                                  _react2.default.createElement(
                                      'p',
                                      null,
                                      '(\u5F85\u4E0A\u7EBF)'
                                  )
                              ),
                              _react2.default.createElement(
                                  'div',
                                  { className: 'grey-item1', style: { marginRight: '0' } },
                                  '\u89C6\u9891\u54A8\u8BE2',
                                  _react2.default.createElement(
                                      'p',
                                      null,
                                      '(\u5F85\u4E0A\u7EBF)'
                                  )
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
