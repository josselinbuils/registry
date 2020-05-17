import typescript from '@rollup/plugin-typescript';
import tsconfig from './tsconfig.plugin.json';

export default {
  input: ['src/plugin/index.ts', 'src/plugin/registryLoader.ts'],
  output: {
    dir: 'dist/plugin',
    format: 'cjs',
    strict: false,
  },
  external: ['path', 'webpack'],
  plugins: [
    typescript({
      ...tsconfig.compilerOptions,
      declaration: true,
      declarationDir: 'dist/plugin',
      exclude: ['node_modules', '**/__tests__/**/*'],
      include: ['src/plugin/**/*'],
    }),
  ],
};
