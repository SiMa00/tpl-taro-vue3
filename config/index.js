import AutoImport from 'unplugin-auto-import/webpack'
import ComponentsPlugin from 'unplugin-vue-components/webpack'

const NutUIResolver = () => {
  return (name) => {
    if (name.startsWith('Nut')) {
      const partialName = name.slice(3)
      return {
        name: partialName,
        from: '@nutui/nutui-taro',
        sideEffects: `@nutui/nutui-taro/dist/packages/${partialName.toLowerCase()}/style`,
      }
    }
  }
}

const config = {
  projectName: 't-pinia',
  date: '2023-3-7',
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: [
    '@tarojs/plugin-html',
    // [
    //   '@tarojs/plugin-framework-vue3',
    //   {
    //     vueLoaderOption: {
    //       compilerOptions: {
    //         isCustomElement: (tag) => tag.includes('ec-canvas'),
    //         whitespace: 'preserve',
    //         // ...
    //       },
    //       reactivityTransform: true, // 开启vue3响应性语法糖
    //     },
    //   },
    // ],
  ],
  // 用于控制对 scss 代码的编译行为，默认使用 dart-sass;
  sass: {
    data: `@import "@nutui/nutui-taro/dist/styles/variables.scss";`, // 配置全局 Scss 变量; 
  },
  designWidth (input) {
    // 配置 NutUI 375 尺寸
    if (input?.file?.replace(/\\+/g, '/').indexOf('@nutui') > -1) {
      return 375
    }
    // 全局使用 Taro 默认的 750 尺寸
    return 750
  },
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2,
    375: 2 / 1
  },
  // 项目源码目录
  sourceRoot: 'src',
  outputRoot: 'dist',
  // outputRoot: `dist/${process.env.TARO_ENV}`,
  // 全局变量设置
  defineConstants: {
  },
  copy: {
    patterns: [
    ],
    options: {
    }
  },
  framework: 'vue3',
  compiler: {
    type: 'webpack5',
    prebundle: { enable: false }, // 是否开启依赖预编译功能; 只有 Webpack5 支持
  },
  cache: {
    enable: false // Webpack5 持久化缓存配置。默认配置请参考：https://docs.taro.zone/docs/config-detail#cache
  },
  // 小程序端专用配置
  mini: {
    webpackChain (chain) {
      chain.plugin('unplugin-auto-import').use(AutoImport({
        imports: [
          'vue',
          // https://vuejs.org/guide/extras/reactivity-transform.html#refs-vs-reactive-variables
          'vue/macros',
        ],
        dts: 'types/auto-imports.d.ts',
        // Auto import for module exports under directories
        // by default it only scan one level of modules under the directory
        dirs: [
          // 'src/composables',
          // 'src/stores',
        ],
        vueTemplate: true,
      }))
      chain.plugin('unplugin-vue-components').use(
        ComponentsPlugin({
          dts: 'types/components.d.ts',
          resolvers: [NutUIResolver()],
        })
      )
      chain.merge({
        module: {
          rule: {
            mjsScript: {
              test: /\.mjs$/,
              include: [/pinia/],
              use: {
                babelLoader: {
                  loader: require.resolve('babel-loader')
                }
              }
            }
          }
        }
      })
    },
    postcss: {
      pxtransform: {
        enable: true,
        config: {
          // selectorBlackList: ['nut-']
        }
      },
      // 小程序端样式引用本地资源内联配置；https://nervjs.github.io/taro-docs/docs/static-reference/
      url: {
        enable: true,
        config: {
          limit: 1024 // 设定转换尺寸上限
        }
      },
      cssModules: {
        // 默认为 false，如需使用 css modules 功能，则设为 true;
        // 小程序中不支持 <style scoped>,将 index.less 重新命名 index.module.less
        enable: true,
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    postcss: {
      autoprefixer: {
        enable: true,
        config: {
        }
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
  }
}

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'))
  }
  return merge({}, config, require('./prod'))
}
