import config from '../config';
import server from '../server/main';
import _debug from 'debug';

const debug = _debug('app:bin:server');
const port = config.serverPort;
const host = config.serverHost;

server.listen(port);
debug(`Server is now running at ${host}:${port}.`);
