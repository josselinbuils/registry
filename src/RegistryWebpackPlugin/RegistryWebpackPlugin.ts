import * as path from 'path';
import { Compiler, loader, Plugin } from 'webpack';

const PATH_REGEX = /(registry\/dist\/client\/index\.js|registry\/client\/index\.js)$/;
const PLUGIN_NAME = 'RegistryWebpackPlugin';

const packageDotJson = require(path.resolve(process.cwd(), 'package.json'));
const packageDependencies = {
  // Wondering if there are some use cases where it is ok to have a shared
  // dependency declared in dependencies instead of devDependencies
  ...packageDotJson.dependencies,
  ...packageDotJson.devDependencies,
};

export class RegistryWebpackPlugin implements Plugin {
  constructor(private readonly options: RegistryOptions) {}

  apply({ hooks, options }: Compiler): void {
    const { externalDependencies = [], sharedDependencies = [] } = this.options;

    if (externalDependencies.length > 0) {
      const externals = {} as { [name: string]: string[] };

      for (const name of externalDependencies) {
        externals[name] = [
          'registry',
          'get',
          `${name}@${packageDependencies[name]}`,
        ];
      }

      if (options.externals === undefined) {
        options.externals = externals;
      } else if (Array.isArray(options.externals)) {
        options.externals = [externals, ...options.externals];
      } else {
        options.externals = [externals, options.externals];
      }
    }

    hooks.compilation.tap(PLUGIN_NAME, (compilation) => {
      compilation.hooks.normalModuleLoader.tap(
        PLUGIN_NAME,
        (context, module) => {
          const loaderContext = (module as unknown) as loader.LoaderContext;

          if (PATH_REGEX.test(loaderContext.resource)) {
            loaderContext.loaders.unshift({
              loader: path.resolve(__dirname, 'registryLoader.js'),
              options: {
                externalDependencies,
                packageDependencies,
                sharedDependencies,
              },
            });
          }
        }
      );
    });
  }
}

export interface RegistryOptions {
  externalDependencies?: string[];
  sharedDependencies?: string[];
}
