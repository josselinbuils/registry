export default function registryLoader(this: any, source: string): string {
  const { sharedDependencies } = this.query;
  return [
    'window.registry = { ...window.registry };',
    'window.registry.dependencies = [',
    '  ...window.registry.dependencies,',
    ...sharedDependencies.map(renderDependency),
    '];',
    source,
  ].join('\n');
}

function renderDependency(name: string): string {
  const chunkName = `registry~${name.replace(/@/g, '')}`;
  const { version } = require(`${name}/package.json`);
  return `  { name: '${name}', factory: () => import(/* webpackChunkName: "${chunkName}" */ '${name}'), version: '${version}' },`;
}
