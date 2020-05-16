import { getBestCandidate } from '../getBestCandidate';
import { getDependency } from '../getDependency';
import { SharedDependency } from '../SharedDependency';

jest.mock('../getBestCandidate');

describe('getDependency', () => {
  it('should provide a dependency', () => {
    // Given
    const module = 'module';
    const name = 'name';
    const range = '^1.0.0';
    (getBestCandidate as jest.Mock).mockReturnValueOnce({
      module,
      factory: () => Promise.resolve(),
      name,
      version: '1.0.0',
    } as SharedDependency);

    // When
    const dependency = getDependency(name, range);

    // Then
    expect(getBestCandidate).toHaveBeenCalledTimes(1);
    expect(getBestCandidate).toHaveBeenCalledWith(name, range);
    expect(dependency).toEqual(module);
  });

  it('should throw an error if the dependency has not been loaded', () => {
    // Given
    const name = 'name';
    (getBestCandidate as jest.Mock).mockReturnValueOnce({
      factory: () => Promise.resolve(),
      name,
      version: '1.0.0',
    } as SharedDependency);

    // When/Then
    expect(() => getDependency(name, '^1.0.0')).toThrow();
  });
});
