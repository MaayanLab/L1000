import webpack from 'webpack';
import cssnano from 'cssnano';
import extend from 'extend';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import _debug from 'debug';
import config from '../config';

const debug = _debug('app:webpack:config');
const paths = config.utilsPaths;
const { __DEV__, __PROD__, __TEST__ } = config.globals;

const APP_ENTRY_PATH = `${paths.base(config.dirClient)}/main.js`;
const SERVER_ENTRY_PATH = `${paths.base(config.dirBin)}/server.js`;

debug('Create configuration.');

const cssLoader = !config.compilerCssModules
  ? 'css?sourceMap'
  : [
    'css?modules',
    'sourceMap',
    'importLoaders=1',
    'localIdentName=[name]__[local]___[hash:base64:5]',
  ].join('&');

const baseUrlFontLoader = 'file?prefix=fonts/&name=[path][name].[ext]';

const basePlugins = [new webpack.DefinePlugin(config.globals)];

if (__DEV__) {
  debug('Enable plugins for live development (HMR, NoErrors).');
  basePlugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
  );
} else if (__PROD__) {
  debug('Enable plugins for production (OccurenceOrder, Dedupe & UglifyJS).');
  basePlugins.push(
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        screw_ie8: true,
        unused: true,
        dead_code: true,
        warnings: false,
      },
    }),
  );
}

const baseConfig = {
  devtool: config.compilerDevtool,
  eslint: {
    configFile: paths.base('.eslintrc'),
    emitWarning: __DEV__,
  },
  module: {
    preLoaders: [
      {
        test: /\.(js|jsx)$/,
        loader: 'eslint',
        exclude: /node_modules/,
      },
    ],
    loaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          cacheDirectory: true,
          plugins: ['transform-runtime'],
          presets: __DEV__
            ? ['es2015', 'react', 'stage-0', 'react-hmre']
            : ['es2015', 'react', 'stage-0'],
        },
      },
      { test: /\.json$/,
        loader: 'json',
      },
      {
        test: /\.scss$/,
        include: /src/,
        loaders: ['style', cssLoader, 'postcss', 'sass?sourceMap'],
      },
      {
        test: /\.css$/,
        include: /src/,
        loaders: ['style', cssLoader, 'postcss'],
      },
      // Don't treat global SCSS as modules
      {
        test: /\.scss$/,
        exclude: /src/,
        loaders: ['style', 'css?sourceMap', 'postcss', 'sass?sourceMap'],
      },
      // Don't treat global, third-party CSS as modules
      {
        test: /\.css$/,
        exclude: /src/,
        loaders: ['style', 'css?sourceMap', 'postcss'],
      },
      {
        test: /\.woff(\?.*)?$/,
        loader: `${baseUrlFontLoader}&limit=10000&mimetype=application/font-woff`,
      },
      {
        test: /\.woff2(\?.*)?$/,
        loader: `${baseUrlFontLoader}&limit=10000&mimetype=application/font-woff2`,
      },
      {
        test: /\.otf(\?.*)?$/,
        loader: 'file?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=font/opentype',
      },
      {
        test: /\.ttf(\?.*)?$/,
        loader: `${baseUrlFontLoader}&limit=10000&mimetype=application/octet-stream`,
      },
      {
        test: /\.eot(\?.*)?$/,
        loader: baseUrlFontLoader,
      },
      {
        test: /\.svg(\?.*)?$/,
        loader: `${baseUrlFontLoader}&limit=10000&mimetype=image/svg+xml`,
      },
      {
        test: /\.(png|jpg)$/,
        loader: 'url?limit=8192',
      },
    ],
  },
};

const clientConfig = extend(true, {}, baseConfig, {
  name: 'client',
  target: 'web',
  entry: {
    app: __DEV__
      ? [
        APP_ENTRY_PATH,
        `webpack-hot-middleware/client?path=${config.compilerPublicPath}__webpack_hmr`,
      ]
      : [APP_ENTRY_PATH],
    vendor: config.compilerVendor,
  },
  output: {
    filename: `[name].[${config.compilerHashType}].js`,
    path: paths.base(config.dirDist),
    publicPath: config.compilerPublicPath,
  },
  resolve: {
    root: paths.base(config.dirClient),
    extensions: ['', '.js', '.jsx'],
  },
  plugins: [
    ...basePlugins,
    new HtmlWebpackPlugin({
      template: paths.client('index.html'),
      hash: false,
      favicon: paths.client('static/favicon.ico'),
      filename: 'index.html',
      inject: 'body',
      minify: {
        collapseWhitespace: true,
      },
    }),
    ...(__TEST__ ? [] : [new webpack.optimize.CommonsChunkPlugin({ names: ['vendor'] })]),
  ],
  sassLoader: {
    includePaths: paths.client('styles'),
  },
  postcss: [
    cssnano({
      autoprefixer: {
        add: true,
        remove: true,
        browsers: ['last 3 versions'],
      },
      discardComments: {
        removeAll: true,
      },
      safe: true,
      sourcemap: true,
    }),
  ],
});

const serverConfig = extend(true, {}, baseConfig, {
  entry: {
    server: SERVER_ENTRY_PATH,
  },
  output: {
    filename: `[name].js`,
    path: paths.base(config.dirDist),
    publicPath: config.compilerPublicPath,
    libraryTarget: 'commonjs2',
  },
  target: 'node',
  externals: [
    /^[a-z\-0-9]+$/,
    /.*lodash.*/,
  ],
  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false,
  },
  plugins: [
    ...basePlugins,
    ...(
        __DEV__
        ? [
          new webpack.BannerPlugin('require("source-map-support").install();',
            { raw: true, entryOnly: false }),
        ]
        : []
      ),
  ],
});

/* eslint no-param-reassign:0 */
// ------------------------------------
// Finalize Configuration
// ------------------------------------
// when we don't know the public path (we know it only when HMR is enabled [in development]) we
// need to use the extractTextPlugin to fix this issue:
// http://stackoverflow.com/questions/34133808/webpack-ots-parsing-error-loading-fonts/34133809#34133809
if (!__DEV__) {
  debug('Apply ExtractTextPlugin to CSS loaders.');
  clientConfig.module.loaders.filter(loader =>
    loader.loaders && loader.loaders.find(name => /css/.test(name.split('?')[0]))
  ).forEach(loader => {
    const [first, ...rest] = loader.loaders;
    loader.loader = ExtractTextPlugin.extract(first, rest.join('!'));
    delete loader.loaders;
  });

  clientConfig.plugins.push(
    new ExtractTextPlugin('[name].[contenthash].css', {
      allChunks: true,
    })
  );
}

// Use babel-node in development, bundle in production
const configs = __DEV__ ? [clientConfig] : [clientConfig, serverConfig];

export default configs;
