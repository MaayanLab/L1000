import webpackHotMiddleware from 'webpack-hot-middleware';
import applyExpressMiddleware from '../lib/apply-express-middleware';
import _debug from 'debug';

const debug = _debug('app:server:webpack-hmr');

export default function (compiler, opts) {
  debug('Enable Webpack Hot Module Replacement (HMR).');

  const middleware = webpackHotMiddleware(compiler, opts);
  return function* run(next) {
    // nextStep is modified later
    /* eslint prefer-const: 0 */
    let nextStep = yield applyExpressMiddleware(middleware, this.req, this.res);

    if (nextStep && next) {
      yield* next;
    }
  };
}
