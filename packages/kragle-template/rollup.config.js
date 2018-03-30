import typescript from 'rollup-plugin-typescript2';

export default {
  name: 'KragleTemplate',
  tsconfig: '../../tsconfig.json',
  input: './index.ts',
  output: {
    file: './dist/kragle-template.js',
    format: 'iife'
  },
  plugins: [
    typescript({
      typescript: require('typescript')
    })
  ]
};
