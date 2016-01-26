import webpackDevMiddleware from 'webpack-dev-middleware';
import applyExpressMiddleware from '../lib/apply-express-middleware';
import _debug from 'debug';
import config from '../../config';

const paths = config.utilsPaths;
const debug = _debug('app:server:webpack-dev');

export default function (compiler, publicPath) {
  debug('Enable webpack dev middleware.');

  const middleware = webpackDevMiddleware(compiler, {
    publicPath,
    contentBase: paths.base(config.dirClient),
    hot: true,
    quiet: config.compilerQuiet,
    noInfo: config.compilerQuiet,
    lazy: false,
    stats: config.compilerStats,
  });

  return async function koaWebpackDevMiddleware(ctx, next) {
    // eslint doesn't think so, but hasNext is modified later
    /* eslint prefer-const: 0 */
    let hasNext = await applyExpressMiddleware(middleware, ctx.req, {
      end: (content) => ctx.body = content,
      setHeader: function setHeader() {
        ctx.set.apply(ctx, arguments);
      },
    });

    if (hasNext) {
      await next();
    }
  };
}
