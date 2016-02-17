import Koa from 'koa';
import webpack from 'webpack';
import webpackConfig from '../build/webpack.config';
import webpackHmrMiddleware from './middleware/webpack-hmr';
import webpackDevMiddleware from './middleware/webpack-dev';
import historyApiFallback from 'koa-connect-history-api-fallback';
import convert from 'koa-convert';
import serve from 'koa-static';
import cors from 'koa-cors';
import bodyParser from 'koa-bodyparser';
import compress from 'koa-compress';
import logger from 'koa-logger';
import config from '../config';

const paths = config.utilsPaths;
const app = new Koa();

app.use(convert(cors()));
app.use(convert(bodyParser()));
app.use(convert(logger()));
app.use(convert(compress()));

// Require routes
require('./routes').default(app);

// This rewrites all other routes requests to the root /index.html file
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
const { publicPath } = webpackConfig[0].output;

app.use(webpackHmrMiddleware(compiler, publicPath));
app.use(webpackDevMiddleware(compiler));

// Serve static assets from ~/src/static since Webpack is unaware of
// these files. This middleware doesn't need to be enabled outside
// of development since this directory will be copied into ~/dist
// when the application is compiled.
app.use(convert(serve(paths.client('static'))));


export default app;
