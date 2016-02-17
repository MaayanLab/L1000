/* eslint spaced-comment:0 */
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
  dirBin: 'bin',
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
  compilerDevtool: 'cheap-module-eval-source-map',
  compilerHashType: 'hash',
  compilerFailOnWarning: false,
  compilerQuiet: false,
  compilerPublicPath: '/L1000/',
  compilerStats: {
    chunks: false,
    chunkModules: false,
    colors: true,
  },
  compilerVendor: [
    'history',
    'react',
    'react-redux',
    'react-router',
    'react-router-redux',
    'redux',
    'classnames',
    'redux-form',
  ],

  // ----------------------------------
  // Test Configuration
  // ----------------------------------
  coverageEnabled: !argv.watch,
  coverageReporters: [
    { type: 'text-summary' },
    { type: 'html', dir: 'coverage' },
  ],
  globals: {},
  utilsPaths: {},
};

// ------------------------------------
// Environment
// ------------------------------------
// N.B.: globals added here must _also_ be added to .eslintrc
config.globals = {
  'process.env': {
    NODE_ENV: JSON.stringify(config.env),
  },
  NODE_ENV: config.env,
  __DEV__: config.env === 'development',
  __PROD__: config.env === 'production',
  __TEST__: config.env === 'test',
  __DEBUG__: config.env === 'development' && !argv.noDebug,
  __BASENAME__: JSON.stringify(process.env.BASENAME || '/L1000'),
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
      `it won't be included in the webpack vendor bundle.
       Consider removing it from vendorDependencies in ~/config/index.js`
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
