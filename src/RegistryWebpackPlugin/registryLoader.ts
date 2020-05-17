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
    ...sharedDependencies.map(renderSharedDependency),
    '];',
    source,
  ].join('\n');
}

function renderSharedDependency(name: string): string {
  const chunkName = `registry~${name.replace(/@/g, '')}`;
  const { version } = require(`${name}/package.json`);
  return `  { name: '${name}', factory: () => import(/* webpackChunkName: "${chunkName}" */ '${name}'), version: '${version}' },`;
}

interface RegistryLoaderOptions extends Required<RegistryOptions> {
  packageDependencies: { [name: string]: string };
}
