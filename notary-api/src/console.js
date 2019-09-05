const repl = require('repl');
const loadEnv = require('./utils/wibson-lib/loadEnv').default;

loadEnv();

const context = repl.start('napi(1.0.0)> ').context; //eslint-disable-line
context.hello = 'hello';
