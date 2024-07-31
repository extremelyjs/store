const typescript = require('rollup-plugin-typescript2');

const mode = process.env.MODE;
const isProd = mode === 'prod';

const config = {
  input: `./src/index.ts`,
  output: [
    {
      file: 'lib/index-cjs.js',
      exports: 'named',
      format: 'cjs',
      sourcemap: !isProd
    },
    {
      file: 'lib/index.js',
      format: 'es',
      sourcemap: !isProd
    },
    {
      file: 'lib/index-iife.js',
      name: 'MyLib',
      format: 'iife',
      sourcemap: !isProd
    },
  ],
  plugins: [typescript({
    useTsconfigDeclarationDir: true,
    tsconfigOverride: { compilerOptions: { sourceMap: !isProd } }
  })],
};

module.exports = config;