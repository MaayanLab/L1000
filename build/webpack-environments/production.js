import webpack from 'webpack';
import config from '../../config';
import _debug from 'debug';

const debug = _debug('app:webpack:production');

export default (webpackConfig) => {
  const webpackConf = { ...webpackConfig };
  debug('Create configuration.');

  if (config.compilerSourceMaps) {
    debug('Source maps enabled for production.');
    webpackConf.devtool = 'source-map';
  } else {
    debug('Source maps are disabled in production.');
  }

  debug('Apply UglifyJS plugin.');
  webpackConf.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        unused: true,
        dead_code: true,
      },
    })
  );

  return webpackConf;
};
