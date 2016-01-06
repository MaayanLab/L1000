/* eslint key-spacing:0 */
import webpack from 'webpack';
import config from '../../config';
import _debug from 'debug';

const debug = _debug('app:webpack:development');

export default (webpackConfig) => {
  const webpackConf = { ...webpackConfig };
  debug('Create configuration.');

  debug('Enable devtool: "source-maps".');
  webpackConf.devtool = 'source-map';

  // ------------------------------------
  // Enable HMR if Configured
  // ------------------------------------
  if (config.compilerEnableHmr) {
    debug('Enable Hot Module Replacement (HMR).');

    webpackConf.entry.app.push(
      'webpack-hot-middleware/client?path=/__webpack_hmr'
    );

    debug('Override devtool with "cheap-module-eval-source-map".');
    webpackConf.devtool = 'cheap-module-eval-source-map';

    webpackConf.plugins.push(
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin()
    );

    webpackConf.eslint.emitWarning = true;

    // We need to apply the react-transform HMR plugin to the Babel configuration,
    // but _only_ when HMR is enabled. Putting this in the default development
    // configuration will break other tasks such as test:unit because Webpack
    // HMR is not enabled there, and these transforms require it.
    webpackConf.module.loaders = webpackConf.module.loaders.map(loader => {
      if (
        /babel/.test(loader.loader) &&
        !~loader.query.presets.indexOf('react-hmre')
      ) {
        debug('Apply react-transform-hmre preset.');
        loader.query.presets.push('react-hmre');
      }

      return loader;
    });
  }

  return webpackConf;
};
