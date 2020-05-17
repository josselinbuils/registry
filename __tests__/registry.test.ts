import { fs } from 'memfs';
import * as path from 'path';
import webpack, { Compiler, OutputFileSystem, Stats } from 'webpack';
import { RegistryOptions, RegistryWebpackPlugin } from '../dist/plugin';

describe('registry', () => {
  it('should set Webpack externals', async () => {
    // When
    const stats = await compile({
      externalDependencies: ['node-noop'],
    });

    // Then
    const { externals } = stats.compilation.compiler.options;
    expect(externals).toEqual({
      'node-noop': ['registry', 'get', 'node-noop@^1.0.0'],
    });
  });

  it('should create chunks for shared dependencies', async () => {
    // When
    const stats = await compile({
      sharedDependencies: ['node-noop'],
    });

    // Then
    const files = (stats.toJson().assets || []).map((asset) => asset.name);
    expect(files).toContain('registry~node-noop.js');
  });
});

function compile(options: RegistryOptions): Promise<Stats> {
  return new Promise<Stats>((resolve, reject) => {
    const compiler = webpack(
      {
        entry: path.resolve(__dirname, '__fixtures__/index.js'),
        plugins: [new RegistryWebpackPlugin(options)],
      },
      (error, stats) => {
        if (error !== null) {
          reject(error);
        } else {
          // Timeout to avoid Jest grumbling because Webpack did not really
          // finished
          setTimeout(() => resolve(stats), 50);
        }
      }
    );
    (compiler as Compiler).outputFileSystem = ({
      ...fs,
      join: path.join,
    } as unknown) as OutputFileSystem;
  });
}
