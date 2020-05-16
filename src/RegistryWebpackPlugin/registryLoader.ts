import * as path from 'path';
const packageDotJson = require(path.resolve(process.cwd(), 'package.json'));

export default function registryLoader(this: any, source: string): string {
  const { sharedDependencies } = this.query;
  return [
    'const SHARED_DEPENDENCIES = [',
    ...sharedDependencies.map(renderDependency),
    '];',
    source,
  ].join('\n');
}

function renderDependency(name: string): string {
  const chunkName = `registry~${name.replace(/@/g, '')}`;
  const packageDependencies = {
    // Wondering if there are some use cases where it is ok to have a shared
    // dependency declared in dependencies instead of devDependencies
    ...packageDotJson.dependencies,
    ...packageDotJson.devDependencies,
  };
  const range = packageDependencies[name];
  const { version } = require(`${name}/package.json`);
  return `  { name: '${name}', factory: () => import(/* webpackChunkName: "${chunkName}" */ '${name}'), range: '${range}', version: '${version}' },`;
}
