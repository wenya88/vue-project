const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.config.js');
const fs = require('fs');
const package = require('../package.json');
fs.open('./env.js', 'w','0777', function (err, fd) {
    const buf = 'export default "development";';
    fs.write(fd, buf, 0, buf.length, 0, function (err, written, buffer) { });
});
module.exports = merge(webpackBaseConfig, {
    devtool: '#source-map',

    output: {
        publicPath: '/dist/',
        filename: '[name].js',
        chunkFilename: '[name].chunk.js'
    },
    plugins: [
        new ExtractTextPlugin({
            filename: '[name].css',
            allChunks: true
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: ['vender-exten', 'vender-base', 'lab', 'main'],
            minChunks: Infinity
        }),
        new HtmlWebpackPlugin({
            title: 'iView admin v' + package.version,
            filename: '../index.html',
            template: './src/template/index.ejs',
            inject: false
        })
    ],
    //设置跨域代理
    devServer: {
        // autoOpenBrowser: true,
        // assetsSubDirectory: 'static',
        // assetsPublicPath: '/',
        port:80,
        historyApiFallback: true,
        hot: true,
        inline: true,
        stats: { colors: true },
        proxy: {
            //匹配代理的url
            // '/': {
            //     // 目标服务器地址
            //     target: 'http://192.168.2.19',
            //     pathRewrite: { '^/': '' },
            //     changeOrigin: true
            // }
            // '/task': {
            //     // 目标服务器地址
            //     target: 'http://192.168.2.19/index.php?r=task',
            //     // target: 'http://59.111.95.148/index.php?r=task',
            //     // target: 'http://plat.yhcgame.com/index.php?r=task',
            //     //路径重写
            //     pathRewrite: { '^/task': '' },
            //     changeOrigin: true
            // },
            // '/system': {
            //     // 登录
            //     target: 'http://192.168.2.19/index.php?r=system',
            //     // target: 'http://59.111.95.148/index.php?r=system',
            //     // target: 'http://plat.yhcgame.com/index.php?r=system',
            //     //路径重写
            //     pathRewrite: { '^/system': '' },
            //     changeOrigin: true
            // },
            '/file': {
                // 文件
                target: 'http://file.yhc_plat.com',
                // target: 'http://59.111.95.148/index.php?r=file',
                // target: 'http://plat.yhcgame.com/index.php?r=file',
                // 路径重写
                pathRewrite: { '^/file': '' },
                changeOrigin: true
            }
        }
    }
});