/* eslint key-spacing:0 */
import { argv } from 'yargs';

export default (config) => {
  const HMR_ENABLED = !!argv.hot;
  const overrides = {
    compilerEnableHmr : HMR_ENABLED,
  };

  if (HMR_ENABLED) {
    overrides.compilerPublicPath = (
      `http://${config.serverHost}:${config.serverPort}/`
    );
  }

  return overrides;
};
