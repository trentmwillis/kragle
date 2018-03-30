import typescript from 'rollup-plugin-typescript2';

export default {
  name: 'KragleElement',
  input: './index.ts',
  output: {
    file: './dist/kragle-element.js',
    format: 'iife'
  },
  globals: {
    'kragle-template': 'KragleTemplate'
  },
  plugins: [
    typescript({
      typescript: require('typescript')
    })
  ],
  external: 'kragle-template'
};
