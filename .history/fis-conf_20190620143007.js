fis.set('component.gitlab', {
  domain: 'http://192.168.11.102:2015/',
  token: 'g9jQosqgzmbXEKyRHvE-',
  author: "fe-components"
});
fis.set('component.dir', 'components_modules');
fis.set('project.fileType.text', 'ts,es,es6');
fis.set('project.ignore', ['package.json', '.git/**', '.svn/**', '.idea/**', '.vscode/**', 'output/**', 'dist/**', 'node_modules/**',]);
// fis.set("project.watch.usePolling", true);
var _config = {
  ftp: {
    host: '192.168.11.100',
    port: '21',
    user: 'oper',
    password: 'oper#gzhc2015'
  },
  media: (fis.project.currentMedia() + ""),
  domain: '',
  prodDomain: '//static.med.gzhc365.com',
  path: '',
  hasView: true,
  sourceMaps: false
};
var query = '?v=a0123456789b';
fis.match('**', { query: query });
var nowTime = new Date();
var nowYear = ('' + nowTime.getFullYear()).substr(-2);
var nowMonth = ('00' + (nowTime.getMonth() + 1)).substr(-2);
var nowDay = nowTime.getDate();
var nowHour = ('00' + nowTime.getHours()).substr(-2);
var nowMinute = ('00' + nowTime.getMinutes()).substr(-2);
var timeStamp = '' + nowYear + nowMonth + nowDay + nowHour + nowMinute;
var __dir_flag = _config.media.split("_")[0] || '',
  __dir_name = _config.media.split("_")[1] || '',
  __opt_name = _config.media.split("_")[2] || '',
  __skin_name = _config.media.split("_")[3] || '';
if (__dir_flag == "dir") {
  fis.match('/node_modules/**', {
    isMod: true,
    useSameNameRequire: true
  });
  fis.unhook('components');
  fis.hook('node_modules', {
    shimBuffer: false
  });
  fis.set('project.files', [
    '/views/' + __dir_name + '/index.html',
    '/mock/**',
    '/media/**',
    'server.conf',
  ]);
  fis.match('**.html', {
    useMap: true,
    parser: fis.plugin('html-uri')
  });
  fis.match('**.{sass,scss}', {
    parser: fis.plugin('node-sass'),
    rExt: '.css'
  });
  fis.match('**.less', {
    parser: fis.plugin('less-2.x'),
    rExt: '.css'
  });
  fis.match('**.{scss,less,css}', {
    preprocessor: fis.plugin('cssprefixer', {
      "browsers": ["FireFox > 1", "Chrome > 1", "ie >= 7"]
    })
  });
// 4. 添加css和image加载支持
  fis.match('*.{js,jsx,ts,tsx,es,es6}', {
    preprocessor: [
      fis.plugin('js-require-css'),
      fis.plugin('js-require-file', {
        useEmbedWhenSizeLessThan: 10 * 1024 // 小于10k用base64
      })
    ]
  });
// 1. 配置需要模块化的文件
  fis.match('**.{es6,jsx,js}', {
    isMod: true
  });
  fis.hook('commonjs', {
    baseUrl: '/',
    packages: [],
    paths: {},
    extList: ['', '.web.tsx', '.web.ts', '.web.jsx', '.web.js', '.ts', '.tsx', '.js', '.jsx', '.json', '.es6', '.es']
  });
  fis.match('/views/' + __dir_name + '/**.{js,es6,jsx}', {
    parser: fis.plugin('babel-imweb', {
      sourceMaps: _config.sourceMaps
    }),
    rExt: '.js'
  });
  fis.match('/components_modules/**.{js,es6,jsx}', {
    parser: fis.plugin('babel-imweb', {
      sourceMaps: _config.sourceMaps
    }),
    rExt: '.js'
  });
  fis.match('**/{require,mod}.js', {
    parser: false,
    isMod: false
  }, true);
  fis.match('/components_modules/common/*.js', {
    parser: false,
    isMod: false
  }, true);
  fis.match('::packager', {
    postpackager: [
      fis.plugin('loader', {
        resourceType: 'mod', // 取值[amd | cmd | mod | system]
        useInlineMap: true, // config 配置文件内联输出
        allInOne: {
          css: '/views/' + __dir_name + '/pkg/aio' + __opt_name + '.css',
          js: '/views/' + __dir_name + '/pkg/aio' + __opt_name + '.js',
          sourceMap: _config.sourceMaps,
          includeAsyncs: true, //是否包含异步依赖。
          attrs:function (orignAttr, url) {
            if (orignAttr.match(/javascript/)) return orignAttr + ' crossorigin="anonymous"';
            return orignAttr;
          }
        },
      }),
      fis.plugin('query-x', {
        placeholder: query, // 这里传入占位符
        replace: function (ret, subpath, file) {
          if(file.basename == 'mod.js'){
            return fis.util.md5(file.getContent()) + '_' + timeStamp;
          }
          return fis.util.md5(file.getContent());
        }
      })
    ],
  });
  fis.match('/views/' + __dir_name + '/**.map', {
    release: _config.path + '/views/' + __dir_name + '/sourcemaps/$&'
  });
  fis.match('server.conf', {
    release: '/config/server.conf'
  }, true);
  fis.match('/mock/**', {
    parser: false,
    useHash: false,
    isMod: false,
    skipBrowserify: true,
    release: '$&',
    ignoreDependencies: true
  }, true);
  if (_config.hasView === false) {
    fis.match('/views/' + __dir_name + '/index.html', {
      release: _config.path + '/' + __dir_name + '/index' + __opt_name + '.html'
    }, true);
  } else {
    fis.match('/views/' + __dir_name + '/index.html', {
      release: _config.path + '/views/' + __dir_name + '/index' + __opt_name + '.html'
    }, true);
  }
  fis.match('**', {
    domain: _config.domain,
    release: _config.path + '$&',
    deploy: [
      fis.plugin('skip-packed', {
        skipPackedToPkg: true,
        skipPackedToAIO: true,
        skipPackedToCssSprite: true,
      }),
      fis.plugin('local-deliver', { to: 'dist/' })
    ]
  });
  if (__skin_name == 'prod') {
    fis.match('**', {
      domain: _config.prodDomain,
    });
    fis.match('**.{css,scss,less}', {
      optimizer: fis.plugin('clean-css')
    });
    fis.match('{/views,/components_modules,/node_modules}/**{.es6,.js,.jsx}', {
      optimizer: fis.plugin('uglify-js', {
        compress: {
          unused: false,
          drop_console: true,
          drop_debugger: true
        },
        sourceMap: false
      })
    });
  } else if (__skin_name == 'qa') {
    fis.match('**.{css,scss,less}', {
      optimizer: fis.plugin('clean-css')
    });
    fis.match('{/views,/components_modules,/node_modules}/**{.es6,.js,.jsx}', {
      optimizer: fis.plugin('uglify-js', {
        compress: {
          unused: false,
          drop_console: true,
          drop_debugger: true
        },
        sourceMap: false
      })
    });
  }
} else {
  fis.match('**.nothisext', {
    release: '$&',
    deploy: [
      fis.plugin('local-deliver', { to: 'output/' })
    ]
  });
}