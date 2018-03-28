const webpack = require('webpack')
const path = require('path')
const autoprefixer = require('autoprefixer')
const wp_html = require('html-webpack-plugin');
const wp_extract_text = require('extract-text-webpack-plugin');
const wp_copy = require('copy-webpack-plugin');
const wp_image_min = require('imagemin-webpack-plugin').default;

const source = path.resolve(__dirname, 'src')
const build = path.resolve(__dirname, 'dist')
const markup = path.resolve(source, 'markup')

module.exports = (env, argv) => {
    const is_production = argv.mode === 'production'
    const public_path = '/'
    const images_path = 'img/'

    const extract_scss = new wp_extract_text({
        filename: '[name].[contenthash].css',
        disable: !is_production,
    });

    return {
        context: source,
        entry: {
            index: path.resolve(source, 'index.js'),
            // admin: path.resolve(source, 'admin.js')
            // vendors: [
            //     path.resolve(source, 'vendor', 'aframe-ar.js')
            // ]
        },
        output: {
            filename: is_production? '[chunkhash].js' : '[name].js',
            path: build,
            pathinfo: !is_production, 
        },
        devtool: is_production? '' : 'eval-cheap-module-source-map',
        devServer: { contentBase: build, hot: !is_production, https: true },
        bail: is_production,
        resolve: { extensions: ['.js'] },    

        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: [/node_modules/, /vendor/],
                    enforce: 'pre',
                    use: 'babel-loader'
                },
                {
                    test: /\.css$/,
                    loaders: ['raw-loader']
                },

                {
                    test: /\.scss$/,
                    loaders: extract_scss.extract({
                        use: [
                            { loader: 'css-loader' },
                            {
                                loader: 'postcss-loader',
                                options: { plugins: () => [autoprefixer] }
                            },
                            { loader: 'sass-loader' }
                        ],
                        fallback: 'style-loader'
                    })
                },
            ],
        },
        
        plugins: [
            new wp_copy([{ from: images_path, to: images_path }]),
            new wp_image_min({
                disable: !is_production,
                test: `${images_path}/**`,
                optipng: { optimizationLevel: 5 },
                jpegtran: { progressive: true },
            }),
            new wp_html({ filename: './index.html', template: path.resolve(markup, 'index.html') }),
            extract_scss,
            new webpack.ProvidePlugin({
                $: 'jquery',
                jQuery: 'jquery',
                'window.jQuery': 'jquery',
                Tether: 'tether',
            }),
            new webpack.HotModuleReplacementPlugin()
        ],
    }
}