import { fs } from 'memfs';
import * as path from 'path';
import webpack, { Compiler, OutputFileSystem, Stats } from 'webpack';
import { RegistryOptions, RegistryWebpackPlugin } from '../dist/plugin';

describe('registry', () => {
  it('should create chunks for shared dependencies', async () => {
    // When
    const stats = await compile({
      sharedDependencies: ['node-noop'],
    });
    const files = (stats.toJson().assets || []).map((asset) => asset.name);

    // Then
    expect(files).toContain('registry~node-noop.js');
  });
});

function compile(options: RegistryOptions): Promise<Stats> {
  return new Promise<Stats>((resolve, reject) => {
    const compiler = webpack(
      {
        mode: 'development',
        entry: path.resolve(__dirname, '__fixtures__/index.js'),
        plugins: [new RegistryWebpackPlugin(options)],
        output: {
          filename: '[name].js',
          path: path.resolve(process.cwd(), 'tmp'),
        },
      },
      (error, stats) => {
        if (error !== null) {
          reject(error);
        } else {
          resolve(stats);
        }
      }
    );
    (compiler as Compiler).outputFileSystem = ({
      ...fs,
      join: path.join,
    } as unknown) as OutputFileSystem;
  });
}
