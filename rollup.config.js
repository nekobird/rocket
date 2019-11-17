import typescript from 'rollup-plugin-typescript';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import alias from 'rollup-plugin-alias';
import pkg from './package.json';
import { terser } from "rollup-plugin-terser";

export default {
  input: 'rocket/rocket.ts',
  output: [
    {
      file: pkg.main,
      name: 'rocket',
      format: 'commonjs',
      sourcemap: true,
      plugins: [
        terser(),
      ],
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true,
    },
  ],
  plugins: [
    alias({
      resolve: ['.ts'],
      entries: {
        '~': __dirname + '/rocket',
      },
    }),
    resolve({
      extensions: ['.ts'],
    }),
    typescript(),
    babel({
      exclude: 'node_modules/**',
      extensions: ['.ts'],
      runtimeHelpers: true,
    }),
    commonjs(),
  ],
}