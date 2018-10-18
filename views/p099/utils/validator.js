/**
 * 支持{}或FormData初始化
 * 首先给需要验证的元素添加
 *  name : 与{}或或FormData的key对应
 *  data-validator :验证规则的正则表达式字符串表示(如data-validator="[{'\\d','g'}]")，
 *      内置有required,idcard,mobile,minLength,maxLength,(如data-validator="['required']"，有需要其他的反馈作者),；
 *  支持多个规则验证和自定义tip提示(如data-validator="['required']",
 *      data-validator="[{'required':'',tip:'这个是必输的'},{minLength:6,tip:'最少6个'}]")
 * componentDidMount() {//组件加载完毕时init
    Validator.init(
        初始化的数据{}或者FormData,
        是否自动填充验证错误时的错误样式(true,false),
        自定义错误样式(string,可选，默认给元素的父元素添加'has-error')
    );
  }
 * 点击提交按钮时在提交事件中调用 let val = Validator.validator(),返回所有验证结果的数组[{target.name:验证结果}]
 * if(val.length > 0) //验证不通过
 * if(val.length = 0) //验证通过
 * 具体事例：luoquan分支，http://192.168.11.102:2015/fe-business/fe-business-dev/blob/luoquan/src/pages/construction/introduction/hospintro-edit/Main/view/CardTip.jsx
 */
function validator(obj) {
  let source = initSource(obj);

  let _realsource = set(source);

  return work(_realsource);
}

function initSource(obj) {
  let _source = [];
  let _itor;

  if (typeof obj === 'object') {

    if (obj.tagName && obj.tagName === 'FORM') {
      _source = getFormValue(obj);
    } else {
      for (let o in obj) {
        _source.push({name: o, value: obj[o]});
      }
    }

  } else if (typeof obj === 'string') {
    _source.push({name: obj});
  }
  return _source;
}

function getFormValue(frm) {//传入表单
  let _val = [];
  if (frm.elements.length) {
    for (let i = 0; i < frm.length; i++) {//遍历每个表单元素
      let obj = frm[i];
      if (obj.type != "submit" && obj.type != "reset" && obj.type != "button") {
        if (obj.type == "radio" || obj.type == "checkbox") {
          if (obj.checked) {
            _val.push({
              name: obj.name,
              value: obj.value
            });
          }
        } else {
          _val.push({
            name: obj.name,
            value: obj.value
          });
        }
      }
    }
  }
  return _val;
}

function set(source) {
  let _realsource = [];
  source.forEach((v, k) => {
    let _tnode = getNode(v.name);
    if (!!_tnode) {
      const rule = getRule(_tnode, v);
      _realsource.push({...v, node: _tnode, value: _tnode.value, rule});
    }
  });
  return _realsource;
}

function getNode(name) {
  return document.getElementsByName(name)[0];
}

function getRule(node, v) {

  function _build(k1, k2) {
    if (defaultRule[k1]) {
      return {
        expreg: defaultRule[k1],
        boundary: k2
      };
    } else {
      let _regexp = k2 ? new RegExp(k1, k2) : new RegExp(k1);
      return {expreg: _regexp};
    }
  }

  const _trule = node.getAttribute('data-validator');
  if (!!!_trule) {
    return null;
  }

  let expArr;
  try {
    expArr = eval(_trule);
  } catch (e) {
    throw new Error(`Validator 配置错误,name:${v.name},valdator:${_trule}`);
  }
  let ret = [];
  expArr.forEach((val, key) => {
    let _tvalidator = {};

    if (typeof val === 'object') {
      for (let o in val) {
        if (o !== 'tip') {
          _tvalidator['rule'] = _build.call(this, o, val[o]);
          break;
        }
      }
      _tvalidator['tip'] = val.tip || '';
    } else {
      _tvalidator['rule'] = _build.call(this, val);
    }
    ret.push(_tvalidator);
  });
  return ret;
}

function test(o) {
  let _ret = {ret: true};
  for (let i = 0; i < o.rule.length; i++) {
    let _testret, v = o.rule[i];
    if (typeof v.rule.expreg === 'function') {
      _testret = v.rule.expreg(o.node.value, v.rule.boundary);
    } else {
      _testret = {ret: v.rule.expreg.test(o.node.value)};
    }
    if (!_testret.ret) {
      _ret = _testret;
      _ret.tip = v.tip || _ret.tip;
      break;
    }
  }

  return _ret;
}

function work(realsource) {
  let _ret = [], _fomdata = {};
  realsource.forEach((v, k) => {
    if (!!v.rule) {
      let _tret = test(v);
      if (!_tret.ret) {
        let _item = {};
        _item.name = v.name;
        _item.result = _tret.ret;
        _item.tip = _tret.tip;
        _ret.push(_item);
      }
    }

    _fomdata[v.name] = v.value;
  });

  return {data: _fomdata, result: _ret};
}

const defaultRule = {
  required(val){
    let ret = {
      ret: typeof(val) !== "undefined" && val !== null && val !== '',
      tip: '不能为空'
    }
    return ret;
  },
  idcard(val){
    val = val.replace(/(^\s*)|(\s*$)/g, "");
    val = val.toUpperCase();
    let len = (val || '').length;

    if (len == 0) {
      return {ret: false, tip: '不能为空'};
    }
    if (len != 18 && len != 15) {
      return {ret: false, tip: '格式错误'};
    }
    if (len == 15) {//15位的身份证，验证了生日是否有效
      let year = val.substring(6, 8);
      let month = val.substring(8, 10);
      let day = val.substring(10, 12);
      let temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day));
      if (temp_date.getYear() != parseFloat(year) || temp_date.getMonth() != parseFloat(month) - 1 || temp_date.getDate() != parseFloat(day)) {
        return {ret: false, tip: '格式错误'};
      }
      return {ret: true};
    }
    if (len == 18) {//18位的身份证，验证最后一位校验位
      let endChar = val.charAt(len - 1);//身份证的最后一为字符
      val = val.substr(0, 17);
      let table = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
      let table2 = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
      let cNum = [];
      for (let i = 0; i < val.length; i++) {
        cNum[i] = val.charAt(i);
      }
      let sum = 0;
      let rs = 0;
      for (let i = 0; i < cNum.length; i++) {
        // 其中(cNum[i]-48)表示第i位置上的身份证号码数字值，table[i]表示第i位置上的加权因子，
        let num = cNum[i].charCodeAt(0);
        let num1 = parseInt(table[i]);
        sum = sum * 1 + (num - 48) * num1;
      }
      // 以11对计算结果取模
      let index = Number(sum % 11);
      // 根据模的值得到对应的校验码,即身份证上的最后一位为校验码
      let verfiyCode = table2[index];
      if (endChar != verfiyCode) {
        return {ret: false, tip: '格式错误'};
      }
      return {ret: true};
    }
  },
  mobile(v){
    return {
      ret: /^1\d{10}$/.test(v),
      tip: '格式错误'
    };
  },
  minLength(val, m){
    return {
      ret: (val || '').length >= m,
      tip: `请输入至少${m}位`
    }
  },
  maxLength(val, m){
    return {
      ret: (val || '').length <= m,
      tip: `请输入最多${m}位`
    }
  },
  equal(val, m) {
    return {
      ret: val === m,
      tip: '不一致'
    }
  },
  isGirl(val){
    val = val.replace(/(^\s*)|(\s*$)/g, "");
    val = val.toUpperCase();
    let len = (val || '').length;
    if (len == 15) {//15位的身份证，验证了性别是否是女性
      let idN = val.charAt(val.length - 1);
      if(idN % 2 !=0){
        return{
          ret:false,
          tip:'请输入女方身份证!' 
        }
      }
    }
    if(len == 18){//18位的身份证，验证了性别是否是女性
      let idN = val.charAt(val.length - 2);
      if(idN % 2 !=0){
        return{
          ret:false,
          tip:'请输入女方身份证!' 
        }
      }
    } 
    return {ret: true};  
  },
  isMen(val){
    val = val.replace(/(^\s*)|(\s*$)/g, "");
    val = val.toUpperCase();
    let len = (val || '').length;
    if (len == 15) {//15位的身份证，验证了性别是否是女性
      let idN = val.charAt(val.length - 1);
      if(idN % 2 ==0){
        return{
          ret:false,
          tip:'请输入男方身份证' 
        }
      }
    }
    if(len == 18){//18位的身份证，验证了性别是否是女性
      let idN = val.charAt(val.length - 2);
      if(idN % 2 ==0){
        return{
          ret:false,
          tip:'请输入男方身份证' 
        }
      }
    }   
    return {ret: true};
  }
}

export {validator as default}

