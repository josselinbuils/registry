import { awaitSharedDependencies } from '../awaitSharedDependencies';
import { getBestCandidate } from '../getBestCandidate';
import { SharedDependency } from '../SharedDependency';

jest.mock('../getBestCandidate');

describe('awaitSharedDependencies', () => {
  it('should fill dependency content', async () => {
    // Given
    const content = 'content';
    const externalDependencies = [{ name: 'test', range: '^1.1.0' }];
    const sharedDependencies = [
      {
        name: 'test',
        factory: () => Promise.resolve(content),
        range: '^1.2.0',
        version: '1.2.4',
      },
    ] as SharedDependency[];
    (getBestCandidate as jest.Mock).mockReturnValueOnce(sharedDependencies[0]);

    // When
    await awaitSharedDependencies(externalDependencies);

    // Then
    expect(sharedDependencies[0].content).toEqual(content);
  });

  it('should ignore already filled dependencies', async () => {
    // Given
    const externalDependencies = [{ name: 'test', range: '^1.1.0' }];
    const sharedDependencies = [
      {
        content: 'content',
        name: 'test',
        factory: jest.fn(),
        range: '^1.2.0',
        version: '1.2.4',
      },
    ] as SharedDependency[];
    (getBestCandidate as jest.Mock).mockReturnValueOnce(sharedDependencies[0]);

    // When
    await awaitSharedDependencies(externalDependencies);

    // Then
    expect(sharedDependencies[0].factory).not.toHaveBeenCalled();
  });
});
