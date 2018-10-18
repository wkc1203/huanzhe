import * as Util from '../../utils/utils';
// import initReactFastclick from 'react-fastclick';

import { CONFIG } from '../constant/constant';

(() => {
  const browserName = Util.getPlatformSource();
  const requestParam = Util.getRequestParam();

  const platformSourceMap = {
    'wechat': 1,
    'alipay': 2,
  };
  const platformId = 2214;
  const hisId =2214;
  const platformSource =3;
  const openId='';
  const login_access_token=window.localStorage.getItem('login_access_token')||'';
  window.CONSTANT_CONFIG = {
    hisId,
    platformSource,
    platformId,
    login_access_token,

  };
  // Util.isIOS && Util.isIOS() && initReactFastclick();
})();
