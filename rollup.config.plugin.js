import typescript from '@rollup/plugin-typescript';

export default {
  input: [
    'src/RegistryWebpackPlugin/index.ts',
    'src/RegistryWebpackPlugin/registry.ts',
    'src/RegistryWebpackPlugin/registryLoader.ts',
  ],
  output: {
    dir: 'dist/plugin',
    format: 'cjs',
    strict: false,
  },
  external: ['path', 'webpack'],
  plugins: [
    typescript({
      declaration: true,
      declarationDir: 'dist/plugin',
      exclude: ['**/__tests__/**/*'],
      rootDir: 'src/RegistryWebpackPlugin',
    }),
  ],
};
