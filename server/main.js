import koa from 'koa';
import webpack from 'webpack';
import webpackConfig from '../build/webpack.config';
import serve from 'koa-static';
import compress from 'koa-compress';
import logger from 'koa-logger';
import _debug from 'debug';
import config from '../config';

const debug = _debug('app:server');
const paths = config.utilsPaths;
const app = koa();

app.use(logger());
app.use(compress());

// Require routes
require('./routes')(app);

// This rewrites all other routes requests to the root /index.html file
// (ignoring file requests). If you want to implement isomorphic
// rendering, you'll want to remove this middleware.
app.use(require('koa-connect-history-api-fallback')({
  verbose: false,
}));

// ------------------------------------
// Apply Webpack HMR Middleware
// ------------------------------------
if (config.compilerEnableHmr) {
  const compiler = webpack(webpackConfig);

  // Enable webpack-dev and webpack-hot middleware
  const { publicPath } = webpackConfig.output;

  app.use(require('./middleware/webpack-dev')(compiler, publicPath));
  app.use(require('./middleware/webpack-hmr')(compiler));

  // Serve static assets from ~/src/static since Webpack is unaware of
  // these files. This middleware doesn't need to be enabled outside
  // of development since this directory will be copied into ~/dist
  // when the application is compiled.
  app.use(serve(paths.client('static')));
} else {
  debug(
    'Server is being run outside of live development mode. This starter kit ' +
    'does not provide any production-ready server functionality. To learn ' +
    'more about deployment strategies, check out the "deployment" section ' +
    'in the README.'
  );

  // Serving ~/dist by default. Ideally these files should be served by
  // the web server and not the app server, but this helps to demo the
  // server in production.
  app.use(serve(paths.base(config.dirDist)));
}

export default app;
