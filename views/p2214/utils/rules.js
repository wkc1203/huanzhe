import _ from 'lodash'

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

export const valid_money = (required = true, type = '金额', min, max) => [{
  required,
  message: '请输入' + type
}, {
  validator: (r, v, cb) => money(r, v, cb, type, min, max)
}]