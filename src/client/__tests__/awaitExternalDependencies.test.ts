import { awaitExternalDependencies } from '../awaitExternalDependencies';
import { getBestCandidate } from '../getBestCandidate';
import { SharedDependency } from '../SharedDependency';

jest.mock('../getBestCandidate');

describe('awaitExternalDependencies', () => {
  it('should fill dependency module', async () => {
    // Given
    const module = 'module';
    const externalDependencies = [{ name: 'test', range: '^1.1.0' }];
    const sharedDependencies = [
      {
        name: 'test',
        factory: () => Promise.resolve(module),
        version: '1.2.4',
      },
    ] as SharedDependency[];
    (getBestCandidate as jest.Mock).mockReturnValueOnce(sharedDependencies[0]);

    // When
    await awaitExternalDependencies(externalDependencies);

    // Then
    expect(sharedDependencies[0].module).toEqual(module);
  });

  it('should ignore already filled dependencies', async () => {
    // Given
    const externalDependencies = [{ name: 'test', range: '^1.1.0' }];
    const sharedDependencies = [
      {
        module: 'module',
        name: 'test',
        factory: jest.fn(),
        version: '1.2.4',
      },
    ] as SharedDependency[];
    (getBestCandidate as jest.Mock).mockReturnValueOnce(sharedDependencies[0]);

    // When
    await awaitExternalDependencies(externalDependencies);

    // Then
    expect(sharedDependencies[0].factory).not.toHaveBeenCalled();
  });
});
