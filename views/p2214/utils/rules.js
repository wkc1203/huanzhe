
import _ from 'lodash'
/* 专门为rc-form写的配置 */

// 原子验证规则

// 汉字
export const onlyHanzi = (type = '') => {
  return (r, v, cb) => {
    if (!/^[\u4e00-\u9fa5]{0,}$/g.test(v)) {
      cb(new Error(`${ type }只能输入汉字`))
    } else {
      cb()
    }
  }
}

// 金额
export const money = (r, v, cb, type, min, max) => {
  if (!/^([1-9]\d{0,9})([.]?|(\.\d{1,2})?)$/g.test(v)) {
    cb(new Error(`输入的${ type }格式错误`))
  } else {
    const parseV = Number(v)

    if (_.isNumber(min) && parseV < min) {
      return cb(new Error(`${ type }必须大于${ min }`))
    }

    if (_.isNumber(max) && parseV > max) {
      return cb(new Error(`${ type }必须小于${ max }`))
    }

    cb()
  }
}

// 手机号码
export const phone = (r, v, cb) => {
  if (!/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/.test(v)) {
    cb(new Error('输入的手机号码格式错误'))
  } else {
    cb()
  }
}

// 银行卡号
export const bankcard = (r, v, cb) => {
  if (!/^([1-9]{1})(\d{15}|\d{18})$/.test(v)) {
    cb(new Error('输入的银行卡号码格式错误'))
  } else {
    cb()
  }
}

// 身份证号码
export const idcard = (r, v, cb) => {
  if (v && !/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/.test(v)) {
    cb(new Error('输入的身份证号码格式错误'))
  } else {
    cb()
  }
}

// 必须勾选
export const checked = (r, v, cb, type) => {
  if (v !== true) {
    cb(new Error(`请勾选${ type }`))
  } else {
    cb()
  }
}

// 首尾不能输入空格
export const noSpace = (type = '') => {
  return (r, v, cb) => {
    if (/(^\s+)|(\s+$)/.test(v)) {
      cb(new Error(`${ type }首尾不能输入空格`))
    } else {
      cb()
    }
  }
}

// 组合验证规则

// 中文姓名
export const valid_name = (required = true) => [{
  required,
  message: '请输入姓名'
}, {
  min: 2,
  message: '姓名最少2个字符'
}, {
  max: 20,
  message: '姓名最多20个字符'
}, {
  validator: onlyHanzi('姓名')
}]

// 金额
export const valid_money = (required = true, type = '金额', min, max) => [{
  required,
  message: '请输入' + type
}, {
  validator: (r, v, cb) => money(r, v, cb, type, min, max)
}]

// 身份证号码
export const valid_idcard = (required = true) => [{
  required,
  message: '请输入身份证号码'
}, {
  validator: idcard
}]

// 手机号码
export const valid_phone = (required = true) => [{
  required,
  message: '请输入手机号码'
}, {
  validator: phone
}]

// 银行卡号
export const valid_bankcard = (required = true) => [{
  required,
  message: '请输入银行卡号'
}, {
  validator: bankcard
}]

// 银行卡号
export const valid_checked = (type) => [{
  validator: (r, v, cb) => checked(r, v, cb, type)
}]
