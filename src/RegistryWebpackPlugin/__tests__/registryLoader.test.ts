import registryLoader from '../registryLoader';

describe('registryLoader', () => {
  it('should add window.registry declaration to registry', () => {
    // Given
    const sharedDependencies = ['node-noop', 'node-noop'];

    // When
    const registry = registryLoader.call({ query: { sharedDependencies } }, '');

    // Then
    expect(registry).toEqual(`\
window.registry = { ...window.registry };
window.registry.dependencies = [
  ...window.registry.dependencies,
  { name: 'node-noop', factory: () => import(/* webpackChunkName: "registry~node-noop" */ 'node-noop'), version: '1.0.0' },
  { name: 'node-noop', factory: () => import(/* webpackChunkName: "registry~node-noop" */ 'node-noop'), version: '1.0.0' },
];
`);
  });
});
