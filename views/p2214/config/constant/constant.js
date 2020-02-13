  export const DOMAIN = 'https://tih.cqkqinfo.com';
// export const DOMAIN = ''

/**
 * 平台id
 * @type {{platformId: number}}
 */
export const CONFIG = {
  platformId:2214,
};

export const PLATEFORMSOURCE_INFO = {
  '1': { 'name': '微信' },
  '2': { 'name': '支付宝' },
};

/**
 * 门诊缴费
 * type: single单笔缴费，multiple多笔缴费
 * @type {{single: boolean}}
 */
export const TREAT = {
  type: 'single',
};

/**
 * 不需要footer的页面
 * @type {string[]}
 */
export const NOFOOTER = [
  // 挂号
  '/register/deptlist',
  // 微网站
  '/microsite/deptlist',
  '/microsite/deptlistfordoc',
  '/microsite/hospdynamicslist',
  '/microsite/hospdynamicsdetail',
  // 门诊缴费
  '/treat/untreatinfo',
  '/treat/untreatlistmulti',
  '/navigation/index',
  '/refrigerationfee/enterusrinfo',

  //维护中
  '/common/development'
];

/**
 * 医院地址url，1：微信，2：支付宝
 * @type {{1: string, 2: string}}
 */
export const addressMap = {
  1: '//apis.map.qq.com/uri/v1/marker?marker=coord:32.992320,112.489340;title:南阳南石医院;addr:河南省南阳市卧龙区中州西路988号&referer=myapp',
  2: '//m.amap.com/navi/?dest=125.333417,43.896975&destName=%E9%95%BF%E6%98%A5%E5%B8%82%E5%A6%87%E4%BA%A7%E5%8C%BB%E9%99%A2&key=ca582245ffab9647fbe7094a29704dd3'
};

/**
 * 重发配置
 * @type {{YYGH: boolean, DBGH: boolean, ZYYJBJ: boolean, MZJF: boolean, YFKCZ: boolean, YYQH: boolean}}
 */
export const ABNORMAL_MAP = {
  'YYGH': true, //预约挂号
  'DBGH': true, //当班挂号
  'ZYYJBJ': true, //住院押金补缴
  'MZJF': true, //门诊缴费
  'YFKCZ': true, //预付卡充值
  'YYQH': true, //预约取号
};

/**
 * 住院模式
 * @type {string}
 */
export const INHOSP = {
  type: 'input', // card选卡模式， input输入住院号 ;
};

/**
 * 挂号配置
 * @type {string}
 */
export const REGISTER = {
  payType: { // 是否支付，【微信支付/支付宝支付/0元挂号/预付卡支付】都属于需要走支付中心的模式，应该配置为true,挂号不付费的为false, 1:预约挂号,2:当班挂号(为了与后台对应)
    1: true,
    2: true,
  }
};
