import config from './rollup.config';

config.format = 'umd';
config.dest = 'dist/localforage-setitems.js';
config.moduleName = 'localforageSetItems';

export default config;
