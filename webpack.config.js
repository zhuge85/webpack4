const path = require('path')
const webpack = require('webpack')
// const glob = require('globby');
const entry = require('webpack-glob-entry')
const argv = require('yargs-parser')(process.argv.slice(2))
const pro = argv.mode == 'production' ? true : false //  区别是生产环境和开发环境

// 插件都是一个类，所以我们命名的时候尽量用大写开头
const HtmlWebpackPlugin = require('html-webpack-plugin') // 导入html文件的插件
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin') // 拆分css样式的插件
const CleanWebpackPlugin = require('clean-webpack-plugin') // 打包前先清空build
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin // 可视化资源分析工具

// let styleLess =  new ExtractTextWebpackPlugin('css/[name].[chunkhash].css');
// let resetCss =  new ExtractTextWebpackPlugin('css/reset.[chunkhash].css');

let plu = []
if (pro) {
  //  线上环境
  plu.push(
    new CleanWebpackPlugin('dist'),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      hash: true // 会在打包好的bundle.js后面加上hash串
      // chunks: ['vendor', 'utils']  //  引入需要的chunk
    }),
    // 拆分后会把css文件放到dist目录下的css/style.css
    new ExtractTextWebpackPlugin('[name].[chunkhash].css')
    // styleLess,
    // new BundleAnalyzerPlugin(), // 可视化资源分析工具
  )
} else {
  //  开发环境
  plu.push(
    new HtmlWebpackPlugin({
      template: './src/index.html'
      // chunks: ['vendor', 'utils']  //  引入需要的chunk
    }),
    // CSS抽出成单独的文件
    new ExtractTextWebpackPlugin('[name].css'),
    // new BundleAnalyzerPlugin(), // 可视化资源分析工具
    new webpack.HotModuleReplacementPlugin() // 热更新，热更新不是刷新
  )
}

// 定义了一些文件夹的路径
const BUILD_PATH = path.resolve(__dirname, './dist') // path.resolve('dist')

module.exports = {
  // 入口文件
  // 单个页面
  entry: './src/index.js',
  // 多个页面
  // entry: {
  //   index: './src/index.js',
  //   login: './src/login.js'
  // },
  // 出口文件
  output: {
    filename: pro ? '[name].[chunkhash].js' : '[name].js', // 打包后的文件名称  [name]-bundle.js
    path: BUILD_PATH, // 打包后的目录，必须是绝对路径
    publicPath: './' // html 引入 (/main-bundle.js)
  },
  // 处理对应模块
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: /node_modules/, // 排除掉node_modules，优化打包速度
        include: /src/ // 只转化src目录下的js
      },
      {
        test: /\.less$/, // 解析less
        use: ExtractTextWebpackPlugin.extract({
          // 将css用link的方式引入就不再需要style-loader了
          fallback: 'style-loader',
          use: ['css-loader', 'postcss-loader', 'less-loader'] // 从右向左解析
        })
      },
      {
        test: /\.scss$/, // 解析scss
        use: ExtractTextWebpackPlugin.extract({
          // 将css用link的方式引入就不再需要style-loader了
          fallback: 'style-loader',
          use: ['css-loader', 'postcss-loader', 'sass-loader'] // 从右向左解析
        })
      },
      {
        test: /\.css$/, // 解析css
        use: ExtractTextWebpackPlugin.extract({
          // 将css用link的方式引入就不再需要style-loader了
          fallback: 'style-loader',
          use: ['css-loader', 'postcss-loader']
        })
      },
      {
        test: /\.(jpe?g|png|gif)$/,
        use: [
          {
            loader: 'url-loader', // 引用背景图片
            options: {
              limit: 8192, // 小于8k的图片自动转成base64格式，并且不会存在实体图片
              outputPath: 'icon/', // 图片打包后存放的目录
              publicPath: './icon', // css图片路径
              name: '[name].[ext]'
            }
          }
        ]
      },
      {
        test: /\.(htm|html)$/, // 页面img引用图片
        use: 'html-withimg-loader'
      },
      {
        test: /\.(eot|ttf|woff|svg)$/, //  打包字体图片和svg图片
        use: 'file-loader'
      }
    ]
  },
  // 对应的插件
  plugins: plu,
  // plugins: [
  //   // 通过new一下这个类来使用插件
  //   // 打包前先清空
  //   // new CleanWebpackPlugin('dist'),

  //   // 热更新，热更新不是刷新
  //   // new webpack.HotModuleReplacementPlugin(),

  //   // 提取公共代码 需要单独打包出来的chunk
  //   new HtmlWebpackPlugin({
  //     template: './src/index.html',
  //     chunks: ['vendor', 'index', 'utils']  //  引入需要的chunk
  //   }),

  //   // 单个页面
  //   new HtmlWebpackPlugin({
  //     // 用哪个html作为模板
  //     // 在src目录下创建一个index.html页面当做模板来用
  //     template: './src/index.html',
  //     hash: true, // 会在打包好的bundle.js后面加上hash串
  //   }),

  //   // 多个页面
  //   // new HtmlWebpackPlugin({
  //   //   template: './src/index.html',
  //   //   filename: 'index.html',
  //   //   chunks: ['index']   // 对应关系,index.js对应的是index.html
  //   // }),
  //   // new HtmlWebpackPlugin({
  //   //   template: './src/index2.html',
  //   //   filename: 'login.html',
  //   //   chunks: ['login']   // 对应关系,login.js对应的是login.html
  //   // }),

  //   // 拆分后会把css文件放到dist目录下的css/style.css
  //   new ExtractTextWebpackPlugin('css/style.css'),
  //   new ExtractTextWebpackPlugin('css/reset.css')

  // ],
  // 开发服务器配置
  devServer: {
    port: 3000, // 端口
    open: true, // 自动打开浏览器
    hot: true, // 开启热更新
    overlay: true, // 浏览器页面上显示错误
    historyApiFallback: true
  },
  // 提取公共代码
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          // 抽离第三方插件
          test: /node_modules/, // 指定是node_modules下的第三方包
          chunks: 'initial',
          name: 'vendor', // 打包后的文件名，任意命名
          // 设置优先级，防止和自定义的公共代码提取时被覆盖，不进行打包
          priority: 10
        },
        utils: {
          // 抽离自己写的公共代码，utils里面是一个公共类库
          chunks: 'initial',
          name: 'utils', //  任意命名
          minSize: 0 // 只要超出0字节就生成一个新包
        }
      }
    }
  },
  // 模式配置
  mode: argv.mode,
  devtool: pro ? '' : 'inline-source-map'
}

// new BundleAnalyzerPlugin({
//   analyzerMode: 'server',
//   analyzerHost: '127.0.0.1',
//   analyzerPort: 8889,
//   reportFilename: 'report.html',
//   defaultSizes: 'parsed',
//   openAnalyzer: true,
//   generateStatsFile: false,
//   statsFilename: 'stats.json',
//   statsOptions: null,
//   logLevel: 'info'
// }) // 可视化资源分析工具
