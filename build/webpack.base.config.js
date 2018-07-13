const path = require('path');
const os = require('os');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HappyPack = require('happypack');
var happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
function resolve(dir) {
    return path.join(__dirname, dir);
}
module.exports = {
    entry: {
<<<<<<< HEAD
<<<<<<< HEAD
        main: '@/main',
=======
<<<<<<< HEAD
        // main: '@/main',
        main: ["babel-polyfill", "@/main"],
=======
        main: '@/main',
>>>>>>> d9f9eb6ad8eca5254705e425417ba946004a77d6
>>>>>>> 92c348b677eee0c78b806a0ea67803f9114b020d
=======
        main: '@/main',
>>>>>>> 230ba10e6631f7ff947486f49437ce8f2880ea17
        'vender-base': '@/vendors/vendors.base.js',
        'vender-exten': '@/vendors/vendors.exten.js',
        'lab': '@/js/labjs.min.js'
    },
    output: {
        path: path.resolve(__dirname, '../dist/dist')
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        less: ExtractTextPlugin.extract({
                            use: ['css-loader?minimize', 'autoprefixer-loader', 'less-loader'],
                            publicPath: './',
                            fallback: 'vue-style-loader'
                        }),
                        css: ExtractTextPlugin.extract({
                            use: ['css-loader', 'autoprefixer-loader'],
                            publicPath: './',
                            fallback: 'vue-style-loader'
                        })
                    }
                }
            },
            {
                test: /iview\/.*?js$/,
                loader: 'babel-loader'
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.js[x]?$/,
                include: [resolve('src')],
                exclude: /node_modules/,
                loader: 'happypack/loader?id=happybabel'
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    use: ['css-loader?minimize', 'autoprefixer-loader'],
                    publicPath: './',
                    fallback: 'style-loader'
                })
            },
            {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    use: ['css-hot-loader', 'autoprefixer-loader', 'less-loader'],
                    publicPath: './',
                    fallback: 'style-loader'
                }),
            },
            {
                test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
                loader: 'url-loader?limit=8192&name=file/[hash:8].[name].[ext]'
            },
            {
                test: /\.(html|tpl)$/,
                loader: 'html-loader'
            }
        ]
    },
    plugins: [
        new HappyPack({
            id: 'happybabel',
            loaders: ['babel-loader'],
            threadPool: happyThreadPool,
            verbose: true
        }),
        new webpack.ProvidePlugin({
            jQuery: "jquery",
            $: "jquery"
        })
    ],

    resolve: {
        extensions: ['.js', '.vue'],
        alias: {
            'vue': 'vue/dist/vue.esm.js',
            '@': resolve('../src'),
            'jquery': 'jquery',
            'jsencrypt': '@/js/jsencrypt.min.js',
            'md5': '@/js/md5.min.js',
            'shim': '@/js/shim.min.js',
            'xlsx': '@/js/xlsx.full.min.js',
            'lab': '@/js/labjs.min.js'
        }
    }
};