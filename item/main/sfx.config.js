/**
 * Created by zhangyuantao on 2017/3/6.
 */

let path = require('path');
let fs = require('fs');
const PROJECT_ROOT = process.cwd();

let BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const TerserPlugin = require('terser-webpack-plugin');

// build时生成的目录
const ASSETS_ROOT = path.resolve(__dirname, './dist');

// build时生成的所有静态资源的目录，目录下面会有js, css, img, font等
const STATIC_DIRECTORY = 'static';

// 指定不需要 lint 的资源目录
const ESLINT_IGNORE = path.resolve(PROJECT_ROOT, '.eslintignore');

// 第三方框架代码放到公共目录
const THIRD_DIRECTORY = '3parts';

const NODE_ENV = process.env.NODE_ENV;

// 生产环境
const IS_PRODUCTION_MODE = NODE_ENV === 'production';

const PUBLIC_PATH = NODE_ENV === 'production' ? '/' : '/';

let StyleLintPlugin = require('stylelint-webpack-plugin');

let OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const PROJECT_NAME = '网络安全决策指挥系统';

module.exports = {

    version: '1.0',

    eslint: {

        // 具体配置可以参考以下链接
        // http://eslint.org/docs/developer-guide/nodejs-api#cliengine

        // 指明需要 eslint 的目录
        files: [
            'src'
        ],
        ignorePath: fs.existsSync(ESLINT_IGNORE) ? ESLINT_IGNORE : undefined
    },

    sourceMap: NODE_ENV === 'production' ? '' : 'source-map',

    // 保持原有的目录结构，会自动保留图片相关文件
    keepStructure: [
        {
            from: __dirname + '/robots.txt',
            to: ASSETS_ROOT + '/robots.txt',
            toType: 'file' // file or dir
        },
        {
            from: __dirname + '/static/img/favicon.ico',
            to: ASSETS_ROOT + '/static/img/favicon.ico',
            toType: 'file' // file or dir
        }
    ],

    // 输出所有调试日志 DEBUG INFO
    logLevel: 'INFO',

    // 启用该选项后，加载的资源文件都使用相对路径，
    relativePublicPath: false,

    // 本地 demo 打包使用
    localMode: false,

    // 解决热更新时间久的问题
    happyPack: true,
    tsCheckerAsync: NODE_ENV !== 'production',

    // 图片资源转换成 base64 的大小临界值，这里让所有图片都转换
    resourceLimit: 1 * 1024,

    // webpack 的入口配置
    entry: {
        app: [
            './src/framework/main.ts'
        ],
        login: [
            './src/framework/login.js'
        ],
        solution:[
            './src/framework/solution.js'
        ],
        loading:[
            './src/framework/loading.js'
        ]
    },

    // 第三方代码单独打包
    thirdEntry: {
        vueAll: [
            'vue',
            'vue-router'
        ],
        chartsAll: [
            'echarts'
        ],
        babelRuntime: [
            'babel-polyfill',
            'core-js'
        ]
    },
    thirdDist: THIRD_DIRECTORY,

    staticDirectory: STATIC_DIRECTORY,

    // webpack 输出配置
    output: {

        // 打包输出的目录
        path: ASSETS_ROOT,

        // 网站的根路径，比如BBC产品线：/bbc/，DC产品线：/dc/ui/
        publicPath: PUBLIC_PATH,

        // 合并后生成的JS的文件全名格式
        filename: `${STATIC_DIRECTORY}/js/[name].[hash].js`,

        cssFilename: `${STATIC_DIRECTORY}/css/[name].[hash].css`,

        // chunk文件的命名格式
        chunkFilename: `${STATIC_DIRECTORY}/js/[name].[hash].js`
    },

    exclude () {
        return function () {
            return false;
        };
    },

    resolve: {
        extensions: ['.jsx', '.js', '.vue', '.ts', '.tsx'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            'src': path.resolve(__dirname, 'src'),
            'framework': path.resolve(__dirname, 'src/framework'),
            'module': path.resolve(__dirname, 'src/module'),
            'util': path.resolve(__dirname, 'src/util'),
            'static': path.resolve(__dirname, 'static'),
            'components': path.resolve(__dirname, 'src/components'),
            'config': path.resolve(__dirname, 'src/framework/const'),
            'const': path.resolve(__dirname, 'src/framework/const')
        }
    },

    optimization: {
        minimize: IS_PRODUCTION_MODE,
        minimizer: IS_PRODUCTION_MODE ? [
            new TerserPlugin({
                cache: true,
                parallel: require('os')
                    .cpus().length,
                sourceMap: !IS_PRODUCTION_MODE,
                terserOptions: {
                    compress: {
                        inline: false,
                        properties: false,
                        keep_fnames: true,
                        drop_debugger: true,
                        drop_console: true
                    },
                    warnings: false,
                    output: {
                        comments: false
                    }
                }
            })
        ] : []
    },

    // 入口html文件配置，由于是单页，一般只配置login.html, index.html即可
    htmlPluginOptions: [
        {

            // 生成的文件
            filename: 'index.html',

            title: PROJECT_NAME,

            // 源文件
            template: NODE_ENV === 'production' ? 'page/index_prod.html' : 'page/index_dev.html',

            // favicon:'favicon.ico',

            // 自动注入哪些chunk，跟entry对应
            chunks: [
                'manifest',
                'vendor',
                'app'
            ],

            inject: true,

            minify: {
                removeComments: NODE_ENV === 'production',
                collapseWhitespace: NODE_ENV === 'production',
                removeAttributeQuotes: NODE_ENV === 'production'
            },
            chunksSortMode: 'dependency',

            // 这块可注入到HTML文件中，形式如："<%= htmlWebpackPlugin.options.data.rakKey %>", "<%= htmlWebpackPlugin.options.data.NODE_ENV %>"
            // 只会全词匹配替换HTML文件中的，js变量则要通过 webpack.DefinePlugin 处理，可参考plugins配置
            data: {
                rsaKey: 'test',
                NODE_ENV: NODE_ENV
            }
        },
        {

            // 生成的文件
            filename: 'login.html',

            title: PROJECT_NAME,

            // 源文件
            template: NODE_ENV === 'production' ? 'page/login.html' : 'page/login.html',

            // favicon:'favicon.ico',

            // 自动注入哪些chunk，跟entry对应
            chunks: [
                'manifest',
                'vendor',
                'login',
                'common'
            ],

            inject: true,

            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true
            },
            chunksSortMode: 'dependency',

            // 这块可注入到HTML文件中，形式如："<%= htmlWebpackPlugin.options.data.rakKey %>", "<%= htmlWebpackPlugin.options.data.NODE_ENV %>"
            // 只会全词匹配替换HTML文件中的，js变量则要通过 webpack.DefinePlugin 处理，可参考plugins配置
            data: {
                NODE_ENV: NODE_ENV
            }
        },
              {

            // 生成的文件
            filename: 'solution.html',

            title: PROJECT_NAME,

            // 源文件
            template: NODE_ENV === 'production' ? 'page/solution_prod.html' : 'page/solution_dev.html',

            // 自动注入哪些chunk，跟entry对应
            chunks: [
                'manifest',
                'vendor',
                'solution'
            ],

            inject: true,

            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true
            },
            chunksSortMode: 'dependency',

            data: {
                NODE_ENV: NODE_ENV
            }
        },
        {

            // 生成的文件
            filename: 'loading.html',

            title: PROJECT_NAME,

            // 源文件
            template: 'page/loading.html',

            favicon:'./static/img/favicon.ico',

            // 自动注入哪些chunk，跟entry对应
            chunks: [
                'manifest',
                'vendor',
                'loading'
            ],

            inject: true,

            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true
            },
            chunksSortMode: 'dependency',

            // 这块可注入到HTML文件中，形式如："<%= htmlWebpackPlugin.options.data.rakKey %>", "<%= htmlWebpackPlugin.options.data.NODE_ENV %>"
            // 只会全词匹配替换HTML文件中的，js变量则要通过 webpack.DefinePlugin 处理，可参考plugins配置
            data: {
                NODE_ENV: NODE_ENV
            }
        },
        {

            // 生成的文件
            filename: 'low_version_browser.html',

            title: PROJECT_NAME,

            // 源文件
            template: 'page/low_version_browser.html',

            favicon:'./static/img/favicon.ico',

            // 自动注入哪些chunk，跟entry对应
            chunks: [
                'manifest',
                'vendor'
            ],

            inject: true,

            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true
            },
            chunksSortMode: 'dependency',

            // 这块可注入到HTML文件中，形式如："<%= htmlWebpackPlugin.options.data.rakKey %>", "<%= htmlWebpackPlugin.options.data.NODE_ENV %>"
            // 只会全词匹配替换HTML文件中的，js变量则要通过 webpack.DefinePlugin 处理，可参考plugins配置
            data: {
                NODE_ENV: NODE_ENV
            }
        }
    ],

    plugins (nodeEnv, plugins) {
        plugins.push(
            new StyleLintPlugin({
                context: 'src',
                configFile: path.resolve(__dirname, './.stylelintrc.js'),
                'files': ['**/*.{html,vue,css,sss,sass,scss,less}'],
                'fix': false,
                'emitErrors': true,
                'failOnError': false
            }),

            // 用于优化css文件
            new OptimizeCssAssetsPlugin({
                assetNameRegExp: /\.css$/g,
                cssProcessorOptions: {
                    safe: true,
                    mergeLonghand: false,
                    discardComments: {
                        removeAll: true // 移除注释
                    }
                },
                canPrint: true
            }),


            // new BundleAnalyzerPlugin()   // 文件大小分析

        );

        return plugins;
    },

    dev: {

        host: '',

        port: 8501,

        https: true,

        // 测试数据存放目录
        mockDirectory: 'mock',

        // mockMapping (options) {
        //
        // },

        // autoOpenBrowser: 'login.html',
        autoOpenBrowser: 'index.html',

        proxyTable: {
            '/': {

                // 目标地址，比如 http://localhost/bbc => https://1.1.1.1/bbc
                // http://10.227.101.92:777 解决方案联调
                target: 'https://10.226.10.170',

                // 关闭证书错误提醒
                secure: false,

                // 日志提示
                      logLevel: 'debug',

                // 发送到目标服务器时添加自定义头部
                headers: {
                    host: '1.1.1.1'
                },

                // proxy 定制，转发到目标服务器前可以hook到本地json
                onProxyReq: undefined,

                // 代理数据返回时触发，可以修改后台返回的数据，比如统一添加http头部等
                onProxyRes: undefined
            }
        },

        // 勾子，本地服务器开启时，可以再次修改webpack中的配置项
        beforeCreateServer (webpackConfig) {
            return webpackConfig;
        },

        afterCreateServer () {

        }
    }

};

