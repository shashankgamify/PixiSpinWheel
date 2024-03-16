const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    // mode: 'production',
    mode: "development",
    entry: './client/index.ts',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist'),
        // publicPath: "dist"
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader'
                // exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './client/index.html',
            filename: 'index.html'
        }),
        new CopyPlugin({
            patterns: [
                { from: './client/assets', to: 'assets' } // this line copies the assets folder to the dist folder
            ]
        })
    ]
};
