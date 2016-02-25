import _debug from 'debug';
import path from 'path';
import { argv } from 'yargs';

const debug = _debug('app:config:_base');
const config = {
  env: process.env.NODE_ENV || 'development',

  // ----------------------------------
  // Project Structure
  // ----------------------------------
  pathBase: path.resolve(__dirname, '../'),
  dirClient: 'src',
  dirDist: 'dist',
  dirServer: 'server',
  dirTest: 'tests',

  // ----------------------------------
  // Server Configuration
  // ----------------------------------
  serverHost: 'localhost',
  serverPort: process.env.PORT || 3000,

  // ----------------------------------
  // Compiler Configuration
  // ----------------------------------
  compilerCssModules: true,
  compilerDevTool: 'cheap-module-eval-source-map',
  compilerHashType: 'hash',
  compilerFailOnWarning: false,
  compilerQuiet: false,
  compilerPublicPath: '',
  compilerStats: {
    chunks: false,
    chunkModules: false,
    colors: true,
  },
  compilerVendor: [
    'history',
    'react',
    'react-modal',
    'react-redux',
    'react-router',
    'react-router-redux',
    'redux',
    'redux-form',
    'redux-thunk',
    'classnames',
    'jwt-decode',
    'lodash',
    'normalizr',
  ],

  // ----------------------------------
  // Test Configuration
  // ----------------------------------
  coverageEnabled: !argv.watch,
  coverageReporters: [
    { type: 'text-summary' },
    { type: 'lcov', dir: 'coverage' },
  ],
};

/*
-------------------------------------------------

All Internal Configuration Below
Edit at Your Own Risk

-------------------------------------------------
*/

// ------------------------------------
// Environment
// ------------------------------------
// N.B. globals added here must _also_ be added to .eslintrc
config.globals = {
  'process.env': {
    NODE_ENV: JSON.stringify(config.env),
  },
  NODE_ENV: config.env,
  __DEV__: config.env === 'development',
  __PROD__: config.env === 'production',
  __TEST__: config.env === 'test',
  __DEBUG__: config.env === 'development' && !argv.no_debug,
  __DEBUG_NEW_WINDOW__: !!argv.nw,
  __BASENAME__: JSON.stringify(process.env.BASENAME || ''),
};

// ------------------------------------
// Validate Vendor Dependencies
// ------------------------------------
const pkg = require('../package.json');

config.compilerVendor = config.compilerVendor
  .filter((dep) => {
    if (pkg.dependencies[dep]) {
      return true;
    }

    debug(
      `Package "${dep}" was not found as an npm dependency in package.json; ` +
      `it won't be included in the webpack vendor bundle.
       Consider removing it from vendor_dependencies in ~/config/index.js`
    );
  });

// ------------------------------------
// Utilities
// ------------------------------------
config.utilsPaths = (() => {
  const resolve = path.resolve;

  const base = (...args) =>
    resolve.apply(resolve, [config.pathBase, ...args]);

  return {
    base,
    client: base.bind(null, config.dirClient),
    dist: base.bind(null, config.dirDist),
  };
})();

export default config;
