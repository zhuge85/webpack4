const path = require('path');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const entry = require('webpack-glob-entry');
const FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");
const CleanWebpackPlugin = require('clean-webpack-plugin'); // 打包前先清空build

module.exports = [
  {
    entry: entry('./src/css/*.less'),
    // entry: {
    //   index: entry('./src/css/*.less'),
    //   login: entry('./src/css/*.css')
    // }, 
    output: {
      filename: '[name].css',
      path: path.resolve(__dirname, './dist'),
    },
    module : {
      rules: [
        {
          test: /\.less$/,     // 解析less
          use: ExtractTextWebpackPlugin.extract({
            // 将css用link的方式引入就不再需要style-loader了
            fallback: "style-loader",
            use: ['css-loader', 'postcss-loader', 'less-loader'] // 从右向左解析
          })
        },
        {
          test: /\.scss$/,     // 解析scss
          use: ExtractTextWebpackPlugin.extract({
            // 将css用link的方式引入就不再需要style-loader了
            fallback: "style-loader",
            use: ['css-loader', 'postcss-loader', 'sass-loader'] // 从右向左解析
          })
        },
        {
          test: /\.css$/,     // 解析css
          use: ExtractTextWebpackPlugin.extract({
            // 将css用link的方式引入就不再需要style-loader了
            fallback: "style-loader",
            use: ['css-loader', 'postcss-loader']
          })
        },
        {
          test: /\.(jpe?g|png|gif)$/,
          use: [
            {
              loader: 'url-loader', // 引用背景图片
              options: {
                limit: 8192,    // 小于8k的图片自动转成base64格式，并且不会存在实体图片
                outputPath: 'icon/',   // 图片打包后存放的目录
                publicPath:'../icon'   // css图片路径
              }
            }
          ]
        },
      ]
    },
    plugins: [
      new CleanWebpackPlugin('dist'),
      new FixStyleOnlyEntriesPlugin(),
      new ExtractTextWebpackPlugin({
        filename: `/css/[name].css`,
      }),
    ],
    devServer: {},
    mode: 'development'
  }
];
