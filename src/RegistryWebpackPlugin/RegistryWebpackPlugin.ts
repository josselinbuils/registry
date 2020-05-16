import * as path from 'path';
import webpack, { Compiler, Plugin, SingleEntryPlugin } from 'webpack';
import LoaderContext = webpack.loader.LoaderContext;

const PLUGIN_NAME = 'RegistryWebpackPlugin';

export class RegistryWebpackPlugin implements Plugin {
  constructor(private readonly options: RegistryOptions) {}

  apply(compiler: Compiler): void {
    const { sharedDependencies } = this.options;

    compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation) => {
      compilation.hooks.normalModuleLoader.tap(
        PLUGIN_NAME,
        (context, module) => {
          const loaderContext = (module as unknown) as LoaderContext;

          if (/registry\.js$/.test(loaderContext.resource)) {
            loaderContext.loaders.unshift({
              loader: path.resolve(__dirname, 'registryLoader.js'),
              options: { sharedDependencies },
            });
          }
        }
      );
    });

    new SingleEntryPlugin(
      compiler.context,
      path.resolve(__dirname, 'registry.js'),
      'registry'
    ).apply(compiler);
  }
}

export interface RegistryOptions {
  sharedDependencies: string[];
}
