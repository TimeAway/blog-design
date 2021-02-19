const path = require('path');
const webpack = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const paths = require('./webpack.paths');

const isDevelopment = process.env.ENVIRONMENT === 'development';
const isProduction = process.env.ENVIRONMENT === 'production';

module.exports = {
  mode: process.env.ENVIRONMENT,
  devtool: isProduction ? 'source-map' : 'cheap-module-eval-source-map',
  entry: {},
  output: {
    path: paths.appBuild,
    filename: '[name].js',
    library: 'blog-design',
    libraryTarget: 'umd',
  },
  externals: {
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react',
    },
    'react-dom': {
      root: 'ReactDOM',
      commonjs2: 'react-dom',
      commonjs: 'react-dom',
      amd: 'react-dom',
    },
    moment: {
      root: 'moment',
      commonjs2: 'moment',
      commonjs: 'moment',
      amd: 'moment',
    },
  },
  optimization: {
    minimizer: [
      isDevelopment &&
        new UglifyJsPlugin({
          cache: true,
          parallel: true,
          sourceMap: true,
          uglifyOptions: {
            warnings: false,
          },
        }),
      isProduction && new OptimizeCSSAssetsPlugin({}),
    ].filter(Boolean),
  },
  resolve: {
    modules: ['node_modules', path.join(__dirname, '../node_modules')],
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    alias: {},
  },
  module: {
    noParse: [isDevelopment && /moment.js/].filter(Boolean),
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: require.resolve('babel-loader'),
      },
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: require.resolve('babel-loader'),
          },
          {
            loader: require.resolve('ts-loader'),
            options: {
              transpileOnly: true,
            },
          },
          // Remove devWarning if needed
          {
            loader: 'string-replace-loader',
            options: {
              search: 'devWarning(',
              replace: "if (process.env.NODE_ENV !== 'production') devWarning(",
            },
          },
        ],
      },
      // style
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: require.resolve('css-loader'),
            options: {
              sourceMap: true,
            },
          },
          {
            loader: require.resolve('postcss-loader'),
            options: {
              postcssOptions: {
                plugins: ['autoprefixer'],
              },
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: require.resolve('css-loader'),
            options: {
              sourceMap: true,
            },
          },
          {
            loader: require.resolve('postcss-loader'),
            options: {
              postcssOptions: {
                plugins: ['autoprefixer'],
              },
              sourceMap: true,
            },
          },
          {
            loader: require.resolve('less-loader'),
            options: {
              lessOptions: {
                javascriptEnabled: true,
              },
              sourceMap: true,
            },
          },
        ],
      },
      // image
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: require.resolve('url-loader'),
        options: {
          limit: 10000,
          minetype: 'image/svg+xml',
        },
      },
      {
        test: /\.(png|jpg|jpeg|gif)(\?v=\d+\.\d+\.\d+)?$/i,
        loader: require.resolve('url-loader'),
        options: {
          limit: 10000,
        },
      },
    ],
  },
  plugins: [
    new CaseSensitivePathsPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    isProduction && new webpack.optimize.ModuleConcatenationPlugin(),
    isProduction &&
      new webpack.LoaderOptionsPlugin({
        minimize: true,
      }),
    isProduction && new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    isProduction &&
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        openAnalyzer: false,
        reportFilename: '../report.html',
      }),
  ].filter(Boolean),
  node: {
    child_process: 'empty',
    cluster: 'empty',
    dgram: 'empty',
    dns: 'mock',
    fs: 'empty',
    module: 'empty',
    net: 'empty',
    readline: 'empty',
    repl: 'empty',
    tls: 'empty',
  },
  performance: {
    hints: false,
  },
};
