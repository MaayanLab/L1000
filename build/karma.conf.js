import { argv } from 'yargs';
import config from '../config';
import webpackConfig from './webpack.config';

const debug = require('debug')('app:karma');
debug('Create configuration.');

const karmaConfig = {
  basePath: '../', // project root in relation to bin/karma.js
  files: [
    './node_modules/phantomjs-polyfill/bind-polyfill.js',
    {
      pattern: `./${config.dirTest}/**/*.js`,
      watched: false,
      served: true,
      included: true,
    },
  ],
  singleRun: !argv.watch,
  frameworks: ['mocha', 'chai-sinon', 'chai-as-promised', 'chai'],
  preprocessors: {
    [`${config.dirTest}/**/*.js`]: ['webpack'],
  },
  reporters: ['spec'],
  browsers: ['PhantomJS'],
  webpack: {
    devtool: 'inline-source-map',
    resolve: webpackConfig.resolve,
    plugins: webpackConfig.plugins
      .filter(plugin => !plugin.__KARMA_IGNORE__),
    module: {
      loaders: webpackConfig.module.loaders,
    },
    sassLoader: webpackConfig.sassLoader,
  },
  webpackMiddleware: {
    noInfo: true,
  },
  coverageReporter: {
    reporters: config.coverageReporters,
  },
};

if (config.coverageEnabled) {
  karmaConfig.reporters.push('coverage');
  karmaConfig.webpack.module.preLoaders = [{
    test: /\.(js|jsx)$/,
    include: new RegExp(config.dirClient),
    loader: 'isparta',
    exclude: /node_modules/,
  }];
}

export default (cfg) => cfg.set(karmaConfig);
