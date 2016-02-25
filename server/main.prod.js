import Koa from 'koa';
import historyApiFallback from 'koa-connect-history-api-fallback';
import convert from 'koa-convert';
import serve from 'koa-static';
import mount from 'koa-mount';
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

// Serving ~/dist by default. Ideally these files should be served by
// the web server and not the app server, but this helps to demo the
// server in production.
app.use(convert(mount('/L1000', serve(paths.base(config.dirDist)))));

// This rewrites all other routes requests to the root /index.html file
// (ignoring file requests). If you want to implement isomorphic
// rendering, you'll want to remove this middleware.
app.use(convert(historyApiFallback({
  verbose: false,
})));

export default app;
