import registryLoader from '../registryLoader';

describe('registryLoader', () => {
  it('should add window.registry declaration to registry', () => {
    // Given
    const externalDependencies = ['node-noop', 'node-noop'];
    const packageDependencies = { 'node-noop': '^1.0.0' };
    const sharedDependencies = ['node-noop', 'node-noop'];

    // When
    const registry = registryLoader.call(
      {
        query: {
          externalDependencies,
          packageDependencies,
          sharedDependencies,
        },
      },
      ''
    );

    // Then
    expect(registry).toEqual(`\
const EXTERNAL_DEPENDENCIES = [
  { name: 'node-noop', range: '^1.0.0' },
  { name: 'node-noop', range: '^1.0.0' },
];
const SHARED_DEPENDENCIES = [
  { name: 'node-noop', factory: () => import(/* webpackChunkName: "registry~node-noop" */ 'node-noop'), range: '^1.0.0', version: '1.0.0' },
  { name: 'node-noop', factory: () => import(/* webpackChunkName: "registry~node-noop" */ 'node-noop'), range: '^1.0.0', version: '1.0.0' },
];
`);
  });
});
