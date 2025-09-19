const { defineConfig } = require('@vue/cli-service')
const path = require('path')

module.exports = defineConfig({
  transpileDependencies: true,
  
  // 生产环境配置
  productionSourceMap: false,
  
  // 公共路径配置
  publicPath: process.env.NODE_ENV === 'production' ? '/act-13402/' : '/',
  
  // 输出目录
  outputDir: 'dist',
  
  // 静态资源目录
  assetsDir: '',
  
  // webpack配置
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        'vue$': 'vue/dist/vue.runtime.esm.js',
        'COMMON': path.resolve(__dirname, 'common'),
        'ASSETS': path.resolve(__dirname, 'common/assets'),
        'XHR-AXIOS': path.resolve(__dirname, 'common/xhr-axios'),
        'i18n-all': path.resolve(__dirname, 'common/i18n/i18n-all'),
        'i18n-async': path.resolve(__dirname, 'common/i18n/i18n-async'),
        '@src': path.resolve(__dirname, 'src'),
        '@assets': path.resolve(__dirname, 'src/assets'),
        '@assets2': path.resolve(__dirname, 'src/assets2'),
        '@views': path.resolve(__dirname, 'src/views'),
        '@components': path.resolve(__dirname, 'src/components'),
        '@components2': path.resolve(__dirname, 'src/components2'),
        '@services': path.resolve(__dirname, 'src/services'),
        '@constant': path.resolve(__dirname, 'src/constant'),
        '@lang': path.resolve(__dirname, 'src/lang')
      }
    },
    output: {
      hashFunction: 'xxhash64',
      filename: 'js/[name].[contenthash:8].js',
      chunkFilename: 'js/[name].[contenthash:8].js'
    }
  },
  
  // webpack链式配置
  chainWebpack: config => {
    // 配置图片资源处理
    config.module
      .rule('images')
      .test(/\.(png|jpe?g|gif|webp|avif)(\?.*)?$/)
      .type('asset')
      .set('generator', {
        filename: 'img/[name].[hash:8][ext]'
      })
    
    // 配置特殊图片处理规则
    config.module
      .rule('images2')
      .test(/^((?!mids).)+\.(jpg|gif|png|svg)$/)
      .type('asset')
      .set('generator', {
        filename: 'img/[name].[hash:8].[ext]'
      })
      .set('parser', {
        dataUrlCondition: {
          maxSize: 1
        }
      })
    
    // 配置SVG处理
    config.module
      .rule('svg')
      .test(/\.(svg)(\?.*)?$/)
      .type('asset/resource')
      .set('generator', {
        filename: 'img/[name].[hash:8][ext]'
      })
    
    // 配置媒体文件
    config.module
      .rule('media')
      .test(/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/)
      .type('asset')
      .set('generator', {
        filename: 'media/[name].[hash:8][ext]'
      })
    
    // 配置字体文件
    config.module
      .rule('fonts')
      .test(/\.(woff2?|eot|ttf|otf)(\?.*)?$/i)
      .type('asset')
      .set('generator', {
        filename: 'fonts/[name].[hash:8][ext]'
      })
    
    // 配置pug模板
    config.module
      .rule('pug')
      .test(/\.pug$/)
      .oneOf('pug-vue')
        .resourceQuery(/vue/)
        .use('pug-plain-loader')
          .loader('pug-plain-loader')
          .end()
        .end()
      .oneOf('pug-template')
        .use('raw-loader')
          .loader('raw-loader')
          .end()
        .use('pug-plain-loader')
          .loader('pug-plain-loader')
          .end()
    
    // CSS模块化配置
    const cssRule = config.module.rule('css')
    cssRule.oneOf('vue-modules')
      .resourceQuery(/module/)
      .use('css-loader')
      .tap(options => {
        return {
          ...options,
          modules: {
            localIdentName: '[name]_[local]_[hash:base64:5]',
            auto: () => true
          }
        }
      })
    
    // SCSS模块化配置
    const scssRule = config.module.rule('scss')
    scssRule.oneOf('vue-modules')
      .resourceQuery(/module/)
      .use('css-loader')
      .tap(options => {
        return {
          ...options,
          modules: {
            localIdentName: '[name]_[local]_[hash:base64:5]',
            auto: () => true
          }
        }
      })
    
    // PostCSS模块化配置
    const postcssRule = config.module.rule('postcss')
    postcssRule.oneOf('vue-modules')
      .resourceQuery(/module/)
      .use('css-loader')
      .tap(options => {
        return {
          ...options,
          modules: {
            localIdentName: '[name]_[local]_[hash:base64:5]',
            auto: () => true
          }
        }
      })
  },
  
  // CSS相关配置
  css: {
    extract: {
      filename: 'css/[name].[contenthash:8].css',
      chunkFilename: 'css/[name].[contenthash:8].css'
    },
    sourceMap: false,
    loaderOptions: {
      css: {
        importLoaders: 2
      },
      postcss: {
        // PostCSS配置
      },
      sass: {
        // Sass配置
      }
    }
  }
})
