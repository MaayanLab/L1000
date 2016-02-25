import { argv } from 'yargs';
import config from '../config';
import webpackConfig from './webpack.config';
import _debug from 'debug';

const debug = _debug('app:karma');
debug('Create configuration.');

const karmaConfig = {
  basePath: '../', // project root in relation to bin/karma.js
  files: [
    './node_modules/phantomjs-polyfill/bind-polyfill.js',
    {
      pattern: `./${config.dirTest}/test-bundler.js`,
      watched: false,
      served: true,
      included: true,
    },
  ],
  singleRun: !argv.watch,
  frameworks: ['mocha'],
  reporters: ['mocha'],
  preprocessors: {
    [`${config.dirTest}/test-bundler.js`]: ['webpack'],
  },
  browsers: ['PhantomJS'],
  webpack: {
    devtool: 'cheap-module-source-map',
    resolve: {
      ...webpackConfig.resolve,
      alias: {
        ...webpackConfig.resolve.alias,
        sinon: 'sinon/pkg/sinon.js',
      },
    },
    plugins: webpackConfig.plugins,
    module: {
      noParse: [
        /\/sinon\.js/,
      ],
      loaders: webpackConfig.module.loaders.concat([
        {
          test: /sinon(\\|\/)pkg(\\|\/)sinon\.js/,
          loader: 'imports?define=>false,require=>false',
        },
      ]),
    },
    externals: {
      ...webpackConfig.externals,
      jsdom: 'window',
      cheerio: 'window',
      'react/lib/ExecutionEnvironment': true,
      'react/lib/ReactContext': 'window',
      'text-encoding': 'window',
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

// cannot use `export default` because of Karma.
module.exports = (cfg) => cfg.set(karmaConfig);
