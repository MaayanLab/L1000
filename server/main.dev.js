import Koa from 'koa';
import convert from 'koa-convert';
import webpack from 'webpack';
import webpackConfig from '../build/webpack.config';
import webpackDevMiddleware from './middleware/webpack-dev';
import webpackHMRMiddleware from './middleware/webpack-hmr';
import historyApiFallback from 'koa-connect-history-api-fallback';
import serve from 'koa-static';
// import _debug from 'debug';
import cors from 'koa-cors';
import bodyParser from 'koa-bodyparser';
import compress from 'koa-compress';
import logger from 'koa-logger';
import config from '../config';
import makeRoutes from './routes';

// const debug = _debug('app:server');
const paths = config.utils_paths;
const app = new Koa();

app.use(convert(cors()));
app.use(convert(bodyParser()));
app.use(convert(logger()));
app.use(convert(compress()));

// Bootstrap routes
makeRoutes(app);

// This rewrites all routes requests to the root /index.html file
// (ignoring file requests). If you want to implement isomorphic
// rendering, you'll want to remove this middleware.
app.use(convert(historyApiFallback({
  verbose: false,
})));

// ------------------------------------
// Apply Webpack HMR Middleware
// ------------------------------------
const compiler = webpack(webpackConfig);

// Enable webpack-dev and webpack-hot middleware
const { publicPath } = webpackConfig.output;

app.use(webpackDevMiddleware(compiler, publicPath));
app.use(webpackHMRMiddleware(compiler));

// Serve static assets from ~/src/static since Webpack is unaware of
// these files. This middleware doesn't need to be enabled outside
// of development since this directory will be copied into ~/dist
// when the application is compiled.
app.use(convert(serve(paths.client('static'))));

export default app;
