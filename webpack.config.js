const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.tsx',
    mode: process.env.NODE_ENV,
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                enforce: 'pre',
                test: /\.js$/,
                loader: 'source-map-loader',
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader',
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true,
                        },
                    },
                ],
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.jsx'],
    },
    output: {
        filename: 'dist/[name].[fullhash].js',
        path: path.resolve(__dirname),
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                icons: {
                    test: /[\\/]node_modules[\\/](@alfalab\/icons)[\\/]/,
                    name: 'icons',
                    chunks: 'all',
                },
                core_components: {
                    test: /[\\/]node_modules[\\/](@alfalab\/core-components)[\\/]/,
                    name: 'core-components',
                    chunks: 'all',
                },
            },
        },
    },
    devServer: {
        static: path.join(__dirname),
        compress: true,
        port: 3000,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'public/index.html',
        }),
    ],
};
