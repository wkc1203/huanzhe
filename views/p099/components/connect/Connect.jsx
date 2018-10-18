import React from 'react';

import { Toast, Toptips } from 'react-weui';
import PopUp from '../../components/popup/PopUp';

function Connect(cb) {
  return function (WrapperComponent) {
    const proto = WrapperComponent.prototype;
    let __componentWillMount,
      __componentDidMount,
      __componentWillUnmount,
      __render;

    __componentWillMount = proto.componentWillMount;
    __componentDidMount = proto.componentDidMount;
    __componentWillUnmount = proto.componentWillUnmount;
    __render = proto.render;

    function componentWillMount() {
      if (typeof __componentWillMount === 'function') {
        __componentWillMount.apply(this, arguments);
      }
    }

    function componentDidMount() {
      if (typeof __componentDidMount === 'function') {
        __componentDidMount.apply(this, arguments);
      }
    }

    function componentWillUnmount() {
      if (typeof __componentWillUnmount === 'function') {
        __componentWillUnmount.apply(this, arguments);
      }
      this.state.toastTimer && clearTimeout(this.state.toastTimer);
    }

    Object.assign(proto, {
      componentWillMount,
      componentDidMount,
      componentWillUnmount,
    });

    return class Connect extends WrapperComponent {
      constructor(props) {
        super(props);

        const { state = {} } = this;
        Object.assign(state, {
          toastConfig: {
            show: false,
            icon: 'loading',
          },
          toastText: '加载中...',
          popupConfig: {
            title: '系统提示',
            type: 'fail',
            show: false,
            content: '网络请求失败！',
            button: {
              label: '确定',
              onClick: () => {
                this.hidePopup();
              },
            },
          },
          topTips: {
            tip: '',
            show: false,
          },
        });
        this.state = state;
      }

      showPopup(ags) {
        const { popupConfig } = this.state;
        ags.show = true;
        ags.content = ags.content || '操作失败！';
        this.setState({ popupConfig: { ...popupConfig, ...ags } });
      }

      hidePopup() {
        const popupConfig = {
          title: '系统提示',
          type: 'fail',
          show: false,
          content: '网络请求失败！',
          button: {
            label: '确定',
            onClick: () => {
              this.hidePopup();
            },
          },
        };
        this.setState({ popupConfig });
      }

      showLoading(text) {
        let { toastConfig, toastText } = this.state;
        toastConfig.show = true;
        toastConfig.icon = 'loading';
        toastText = text || '加载中';

        this.setState({
          toastConfig,
          toastText,
        });
      }

      hideLoading() {
        const { toastConfig } = this.state;
        toastConfig.show = false;
        this.setState({
          toastConfig,
        });
      }

      showSuccess(param) {
        let { toastConfig, toastText } = this.state;
        toastConfig.show = true;
        toastConfig.icon = 'success-no-circle';
        toastText = param.title || '操作成功';
        let duration = param.duration === 0 ? 0 : (param.duration || 1500);

        this.setState({
          toastConfig,
          toastText,
        });

        if(duration !== 0){
          this.state.toastTimer = setTimeout(()=> {
            this.hideToast();

            if (param.complete && typeof param.complete == 'function') {
              param.complete();
            }
          }, duration);
        }
      }

      hideToast() {
        const { toastConfig } = this.state;
        toastConfig.show = false;
        this.setState({
          toastConfig,
        });
      }

      showTopTips(param) {
        const { topTips } = this.state;
        topTips.show = true;
        topTips.tip = param.tip;
        this.setState({
          topTips,
        });

        let duration = param.duration === 0 ? 0 : (param.duration || 1500);
        if(duration !== 0){
          this.state.toastTimer = setTimeout(() => {
            topTips.show = false;
            this.setState({
              topTips,
            });

            if (param.complete && typeof param.complete == 'function') {
              param.complete();
            }
          }, duration);
        }
      }

      render() {
        if(typeof super.render != 'undefined'){
          const elementsTree = super.render();
          const { state } = this;
          const injectHtml = (
            <div key="">
              <Toast {...state.toastConfig}>{state.toastText}</Toast>
              <PopUp {...state.popupConfig}>{state.popupConfig.content}</PopUp>
              <Toptips type="warn" show={state.topTips.show}>{state.topTips.tip}</Toptips>
            </div>
          );
          let children;
          // elementsTree.props.children长度为1时为对象，大于1为数组
          children = [].concat(elementsTree.props.children).concat(injectHtml);
          let newProps = {};
          const props = Object.assign({}, elementsTree.props, newProps);
          const newElementsTree = React.cloneElement(elementsTree, props, children);
          return newElementsTree;
        } else {
          return null;
        }
      }
    };
  };
}

export default Connect;
