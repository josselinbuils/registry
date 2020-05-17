import { getBestCandidate } from '../getBestCandidate';

describe('getBestCandidate', () => {
  it('should prioritize loaded dependencies', () => {
    // Given
    const name = 'test';
    const factory = () => Promise.resolve();
    window.registry = {
      externalDependencies: [],
      get: {},
      sharedDependencies: [
        {
          name,
          factory,
          version: '1.2.4',
        },
        {
          module: 'module',
          name,
          factory,
          version: '1.1.5',
        },
      ],
    };

    // When
    const bestCandidate = getBestCandidate('test', '^1.1.0');

    // Then
    expect(bestCandidate.version).toEqual('1.1.5');
  });

  it('should secondarily prioritize most recent dependencies', () => {
    // Given
    const name = 'test';
    const factory = () => Promise.resolve();
    window.registry = {
      externalDependencies: [],
      get: {},
      sharedDependencies: [
        { name, factory, version: '1.2.4' },
        { name, factory, version: '1.1.3' },
      ],
    };

    // When
    const bestCandidate = getBestCandidate('test', '^1.1.0');

    // Then
    expect(bestCandidate.version).toEqual('1.2.4');
  });
});
