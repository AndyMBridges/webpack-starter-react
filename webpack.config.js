var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var webpack = require("webpack");
var path = require("path");

var isProd = process.env.NODE_ENV === 'production'; // True or false
var cssDev = ['style-loader', 'css-loader', 'sass-loader']; // Array of CSS loaders for dev mode
var cssProd = ExtractTextPlugin.extract({
    fallbackLoader: 'style-loader',
    loader: ['css-loader','sass-loader'],
    publicPath: '/dist'
});
var cssConfig = isProd ? cssProd : cssDev; // If production else cssProd, else use cssDev

module.exports = {
    // Two entry points for seperate templates
    entry: {
        app: './src/app.js',
        contact: './src/contact.js'
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        // Dynamic filename for mutliple pages
        filename: '[name].bundle.js'
    },
    module: {
        rules: [
            {
                // Pull all scss files and use the following loaders
                test: /\.scss$/,
                use: cssConfig // Use either HMR for dev or loaders for prod
            },
            {
                // Assign loader for JS files
                // Babel older browsers
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            },
            {
                // Assign loader for png files
                test: /\.(jpe?g|png|gif|svg)$/i,
                // Copy images with original filename (custom output path)
                use: [
                    // Set input and output path
                    'file-loader?name=[name].[ext]',
                    //'file-loader?name=[name].[ext]&outputPath=images/&publicPath=images/',
                    'image-webpack-loader'
                ]
            }
        ]
    },
    // Create dev server
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        stats: "errors-only",
        hot: true, // Enable hot module replacement
        open: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Andy Project',
            // minify: {
            //     collapseWhitespace: true
            // },
            hash: true,
            excludeChunks: ['contact'], // Exclude contact entry from app
            // filename: './../index.html', // Enable to change index path
            template: './src/index.html', // Template to use
        }),
        // Create additional template for contact page
        new HtmlWebpackPlugin({
            title: 'Contact Page',
            hash: true,
            filename: 'contact.html',
            chunks: ['contact'], // Only include contact entry chunk
            template: './src/contact.html', // Template to use
        }),
        // Compile to seperate stylesheets
        new ExtractTextPlugin({
            filename: 'app.css',
            disable: !isProd, // Disable to work with HMR, Enable to work with ExtractTextPlugin
            allChunks: true
        }),
        new webpack.HotModuleReplacementPlugin(), // Enable HMR globally
        new webpack.NamedModulesPlugin() // prints more readable module names in console
    ]
}
