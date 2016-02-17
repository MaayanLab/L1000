/* eslint no-param-reassign:0 */
import webpackDevMiddleware from 'webpack-dev-middleware';
import applyExpressMiddleware from '../lib/apply-express-middleware';
import _debug from 'debug';
import config from '../../config';

const paths = config.utils_paths;
const debug = _debug('app:server:webpack-dev');

export default function (compiler, publicPath) {
  debug('Enable webpack dev middleware.');

  const middleware = webpackDevMiddleware(compiler, {
    publicPath,
    contentBase: paths.base(config.dir_client),
    hot: true,
    quiet: config.compiler_quiet,
    noInfo: config.compiler_quiet,
    lazy: false,
    stats: config.compiler_stats,
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
