const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const cleanWebpackPlugin = require('clean-webpack-plugin');
const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.config.js');
const fs = require('fs');
const path = require('path');
const package = require('../package.json');

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin; // 优化工具

fs.open('./build/env.js', 'w','0777',function(err, fd) {
    const buf = 'export default "production";';
    fs.write(fd, buf, 0, buf.length,0, function(err, written, buffer) {});
});
// let math = Math.random();
module.exports = merge(webpackBaseConfig, {
    output: {
        publicPath: './dist/',
        filename: `[name][hash:5].js`,
        chunkFilename: `[name].chunk[hash:5].js`,
    },
    plugins: [
        new cleanWebpackPlugin(['dist/*'], {
            root: path.resolve(__dirname, '../')
        }),
        new ExtractTextPlugin({
            filename: '[name].css',
            allChunks: true
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: ['echarts','vendor','vender-exten', 'vender-base', 'lab', 'main'],
            minChunks: Infinity
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, '../static'),
                to: '../static',
                ignore: ['.*']
            }
        ]),
        new HtmlWebpackPlugin({
            filename: path.resolve(__dirname, '../dist/index.html'),
            template: 'index.html',
            inject: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true
                // more options:
                // https://github.com/kangax/html-minifier#options-quick-reference
            },
            // necessary to consistently work with multiple chunks via CommonsChunkPlugin
            chunksSortMode: 'dependency'
        }),
        new BundleAnalyzerPlugin(
            {
                analyzerMode: 'server',
                analyzerHost: '127.0.0.1',
                analyzerPort: 8889,
                reportFilename: 'report.html',
                defaultSizes: 'parsed',
                openAnalyzer: true,
                generateStatsFile: false,
                statsFilename: 'stats.json',
                statsOptions: null,
                logLevel: 'info'
            }
        ),
    ]
});
