import * as path from 'path';
import { Compiler, loader, Plugin } from 'webpack';

const PATH_REGEX = /(registry\/dist\/client\/index\.js|registry\/client\/index\.js)$/;
const PLUGIN_NAME = 'RegistryWebpackPlugin';

export class RegistryWebpackPlugin implements Plugin {
  constructor(private readonly options: RegistryOptions) {}

  apply(compiler: Compiler): void {
    const { sharedDependencies } = this.options;

    compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation) => {
      compilation.hooks.normalModuleLoader.tap(
        PLUGIN_NAME,
        (context, module) => {
          const loaderContext = (module as unknown) as loader.LoaderContext;

          if (PATH_REGEX.test(loaderContext.resource)) {
            loaderContext.loaders.unshift({
              loader: path.resolve(__dirname, 'registryLoader.js'),
              options: { sharedDependencies },
            });
          }
        }
      );
    });
  }
}

export interface RegistryOptions {
  sharedDependencies: string[];
}
