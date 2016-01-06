/* eslint key-spacing:0 spaced-comment:0 */
import _debug from 'debug';
import path from 'path';
import { argv } from 'yargs';

const debug = _debug('app:config:_base');
const config = {
  env : process.env.NODE_ENV,

  // ----------------------------------
  // Project Structure
  // ----------------------------------
  pathBase  : path.resolve(__dirname, '../'),
  dirClient : 'src',
  dirDist   : 'dist',
  dirServer : 'server',
  dirTest   : 'tests',

  // ----------------------------------
  // Server Configuration
  // ----------------------------------
  serverHost : 'localhost',
  serverPort : process.env.PORT || 3000,

  // ----------------------------------
  // Compiler Configuration
  // ----------------------------------
  compilerCssModules     : true,
  compilerEnableHmr      : false,
  compilerGlobals         : {
    React : 'react',
    ReactDOM : 'react-dom',
  },
  compilerSourceMaps     : true,
  compilerHashType       : 'hash',
  compilerFailOnWarning : false,
  compilerQuiet           : false,
  compilerPublicPath     : '',
  compilerStats           : {
    chunks : false,
    chunkModules : false,
    colors : true,
  },
  compilerVendor : [
    'history',
    'react',
    'react-redux',
    'react-router',
    'redux',
    'redux-actions',
    'redux-simple-router',
  ],

  // ----------------------------------
  // Test Configuration
  // ----------------------------------
  coverageEnabled   : !argv.watch,
  coverageReporters : [
    { type : 'text-summary' },
    { type : 'html', dir : 'coverage' },
  ],
};

/************************************************
-------------------------------------------------

All Internal Configuration Below
Edit at Your Own Risk

-------------------------------------------------
************************************************/

// ------------------------------------
// Environment
// ------------------------------------
config.globals = {
  'process.env'  : {
    NODE_ENV : JSON.stringify(config.env),
  },
  NODE_ENV     : config.env,
  __DEV__      : config.env === 'development',
  __PROD__     : config.env === 'production',
  __DEBUG__    : config.env === 'development' && !argv.no_debug,
  __DEBUG_NEW_WINDOW__ : !!argv.nw,
  __BASENAME__ : JSON.stringify(process.env.BASENAME || '/'),
};

// ------------------------------------
// Validate Vendor Dependencies
// ------------------------------------
const pkg = require('../package.json');

config.compilerVendor = config.compilerVendor
  .filter(dep => {
    if (pkg.dependencies[dep]) return true;

    debug(
      `Package "${dep}" was not found as an npm dependency in package.json; ` +
      `it won't be included in the webpack vendor bundle.\n` +
      `Consider removing it from vendor_dependencies in ~/config/index.js`
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
    client : base.bind(null, config.dirClient),
    dist   : base.bind(null, config.dirDist),
  };
})();

export default config;
