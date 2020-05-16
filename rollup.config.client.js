import closureCompiler from '@ampproject/rollup-plugin-closure-compiler';
import typescript from '@rollup/plugin-typescript';
import tsconfig from './tsconfig.client.json';

export default {
  input: 'src/client/index.ts',
  output: {
    dir: 'dist/client',
    format: 'es',
    strict: false,
  },
  plugins: [
    typescript({
      ...tsconfig.compilerOptions,
      declaration: true,
      declarationDir: 'dist/client',
      exclude: ['node_modules', '**/__tests__/**/*'],
      include: ['src/client/**/*'],
    }),
    closureCompiler(),
  ],
};
