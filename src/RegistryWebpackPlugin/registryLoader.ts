import { RegistryOptions } from './RegistryWebpackPlugin';

export default function registryLoader(this: any, source: string): string {
  const { externalDependencies, packageDependencies, sharedDependencies } = this
    .query as RegistryLoaderOptions;

  return [
    'const EXTERNAL_DEPENDENCIES = [',
    ...externalDependencies.map(
      (name) => `  { name: '${name}', range: '${packageDependencies[name]}' },`
    ),
    '];',
    'const SHARED_DEPENDENCIES = [',
    ...sharedDependencies.map(
      renderSharedDependency.bind(null, packageDependencies)
    ),
    '];',
    source,
  ].join('\n');
}

function renderSharedDependency(
  packageDependencies: { [name: string]: string },
  name: string
): string {
  const chunkName = `registry~${name.replace(/@/g, '')}`;
  const range = packageDependencies[name];
  const { version } = require(`${name}/package.json`);
  return `  { name: '${name}', factory: () => import(/* webpackChunkName: "${chunkName}" */ '${name}'), range: '${range}', version: '${version}' },`;
}

interface RegistryLoaderOptions extends RegistryOptions {
  packageDependencies: { [name: string]: string };
}
