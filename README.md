## 依赖安装
推荐使用 yarn
```
yarn
```
或者使用 npm
```
npm install
```
 
## 本地运行(以 p099 为例)
```
fis3 release dir_p099
```
num run server
## 编译打包
```
fis3 release dir_p099__prod
```

## 测试&&生产环境部署（sftp）
```
脚手架目录：/app/stsweb/websites/hospital/
工程目录：/app/stsweb/websites/hospital/

```

### views目录结构--p2214
```
.
├── components    自定义组件
├── config        相关配置
│   ├── constant.js  全局配置文件
│   ├── init.js  初始化文件
│   ├── router   路由配置文件
├── pages                            所有业务页面
│   ├── add                          加号
│   │   ├──addManage                 加号详情
│   │   ├──cardtip                   加号确定
│   │   ├──manageList                加号列表
│   ├── ask                          随访
│   │   ├──index                     随访列表
│   │   ├──login                     加入随访
│   │   ├──qestion                   随访问卷
│   ├── auth                         授权
│   │   ├──developing                维护页面
│   │   ├──follow                    随访授权
│   │   ├──getuserinfo               咨询相关授权
│   │   ├──login                     智能预警订阅
│   ├── check                        检查单
│   │   ├──checkInfo                 检查/检验详情
│   │   ├──checkList                 检查单列表
│   │   ├──confirmCheck              检查单详情
│   │   ├──registerInfo              检查单就诊指引
│   ├── consult                      咨询前相关
│   │   ├──alldeptlist               科室列表
│   │   ├──confirminfo               咨询信息确认
│   │   ├──deptdetail                医生详情
│   │   ├──deptlist                  医生列表
│   │   ├──pay                       支付
│   │   ├──report                    免费报告解读申请
│   │   ├──waiting                   支付后等待页
│   ├── home/index                   首页
│   ├── inquiry                      咨询
│   │   ├──chat                      咨询详情
│   │   ├──inquirylist               咨询列表
│   ├── login                        注册
│   │   ├──loginindex                注册页面
│   │   ├──noRegister                关注公众号页面
│   ├── microweb                     首页更多功能 
│   │   ├──article                   新闻公告
│   │   ├──deptinfo                  科室详情
│   │   ├──deptlist                  科室列表
│   │   ├──deptlistfordoc            医生列表
│   │   ├──doctorinfo                医生详情
│   │   ├──news                      资讯
│   │   ├──notice                    公告
│   ├── ordermng                     订单相关
│   │   ├──checkadd                  检查单中的号源详情
│   │   ├──checkdetail               检查单详情
│   │   ├──checkorder                检查项详情
│   │   ├──evaluate                  评价
│   │   ├──orderdetail               咨询订单详情
│   │   ├──orderlist                 订单列表
│   ├── report                       检查检验报告
│   │   ├──reportInfo                检查检验报告详情
│   │   ├──reportList                报告列表 
│   │── usercenter                   个人中心
│   │   ├──addcard                   添加就诊卡（取消）
│   │   ├──cardtip                   绑卡提示
│   │   ├──collect                   收藏
│   │   ├──complain                  投诉
│   │   ├──home                      个人中心首页
│   │   ├──newphone                  修改手机号
│   │   ├──samecard                  同步就诊人（取消）
│   │   ├──userinfo                  就诊人详情
│   │   ├──userlist                  就诊人列表
├── resources                        静态资源文件夹
│   ├── images                       图片资源
│   └── style                        样式资源
│       └── mixins.less              公共样式
├── utils        工具类文件
│   ├── fetch.js                     请求封装
│   ├──  utils.js                    封装的方法      
│   ├── utils.js                     表单验证的方法  
└── socket.io                        socket插件
```
