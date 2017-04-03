import config from './rollup.config';

config.format     = 'umd';
config.dest       = 'dist/nnjs.umd.js';
config.moduleName = 'nnjs';

export default config;
