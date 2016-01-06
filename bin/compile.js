/* eslint no-console: 0 */
require('babel-register');

const config = require('../config');
const debug = require('debug')('app:bin:compile');
const fs = require('fs-extra');

const paths = config.utilsPaths;

debug('Create webpack compiler.');
const compiler = require('webpack')(require('../build/webpack.config'));

compiler.run(function runCompiler(err, stats) {
  const jsonStats = stats.toJson();

  debug('Webpack compile completed.');
  console.log(stats.toString(config.compilerStats));

  if (err) {
    debug('Webpack compiler encountered a fatal error.', err);
    process.exit(1);
  } else if (jsonStats.errors.length > 0) {
    debug('Webpack compiler encountered errors.');
    console.log(jsonStats.errors);
    process.exit(1);
  } else if (jsonStats.warnings.length > 0) {
    debug('Webpack compiler encountered warnings.');

    if (config.compilerFailOnWarning) {
      process.exit(1);
    }
  } else {
    debug('No errors or warnings encountered.');
  }

  debug('Copy static assets to dist folder.');
  fs.copySync(paths.client('static'), paths.dist());
});
