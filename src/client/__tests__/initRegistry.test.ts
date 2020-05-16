import { initRegistry } from '../initRegistry';
import { Registry } from '../Registry';
import { RegistryDependency } from '../RegistryDependency';

jest.mock('../getDependency');

describe('initRegistry', () => {
  it('should create a registry containing shared dependencies', () => {
    // Given
    const sharedDependencies = [
      {
        name: 'test',
        factory: () => Promise.resolve(),
        range: '^1.2.0',
        version: '1.2.4',
      },
    ] as RegistryDependency[];
    (window as any).SHARED_DEPENDENCIES = sharedDependencies;

    // When
    initRegistry();

    // Then
    const { dependencies } = (window as any).registry as Registry;
    expect(dependencies).toContain(sharedDependencies[0]);
  });

  it('should extend an existing registry', () => {
    // Given
    const sharedDependencies = [
      {
        name: 'test',
        factory: () => Promise.resolve(),
        range: '^1.2.0',
        version: '1.2.4',
      },
      {
        name: 'test',
        factory: () => Promise.resolve(),
        range: '^1.2.5',
        version: '1.2.7',
      },
    ] as RegistryDependency[];
    (window as any).SHARED_DEPENDENCIES = [sharedDependencies[0]];
    initRegistry();
    (window as any).SHARED_DEPENDENCIES = [sharedDependencies[1]];

    // When
    initRegistry();

    // Then
    const { dependencies } = (window as any).registry as Registry;
    expect(dependencies).toContain(sharedDependencies[0]);
    expect(dependencies).toContain(sharedDependencies[1]);
  });
});
