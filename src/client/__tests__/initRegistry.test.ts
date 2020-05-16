import { initRegistry } from '../initRegistry';
import { Registry } from '../Registry';
import { SharedDependency } from '../SharedDependency';

jest.mock('../getDependency');

describe('initRegistry', () => {
  it('should create a registry containing shared dependencies', () => {
    // Given
    const dependencies = [
      {
        name: 'test',
        factory: () => Promise.resolve(),
        version: '1.2.4',
      },
    ] as SharedDependency[];
    (window as any).EXTERNAL_DEPENDENCIES = [];
    (window as any).SHARED_DEPENDENCIES = dependencies;

    // When
    initRegistry();

    // Then
    const { sharedDependencies } = (window as any).registry as Registry;
    expect(sharedDependencies).toContain(dependencies[0]);
  });

  it('should extend an existing registry', () => {
    // Given
    const dependencies = [
      {
        name: 'test',
        factory: () => Promise.resolve(),
        version: '1.2.4',
      },
      {
        name: 'test',
        factory: () => Promise.resolve(),
        version: '1.2.7',
      },
    ] as SharedDependency[];
    (window as any).EXTERNAL_DEPENDENCIES = [];
    (window as any).SHARED_DEPENDENCIES = [dependencies[0]];
    initRegistry();
    (window as any).SHARED_DEPENDENCIES = [dependencies[1]];

    // When
    initRegistry();

    // Then
    const { sharedDependencies } = (window as any).registry as Registry;
    expect(sharedDependencies).toContain(dependencies[0]);
    expect(sharedDependencies).toContain(dependencies[1]);
  });
});
