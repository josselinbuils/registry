import { getBestCandidate } from '../getBestCandidate';
import { getDependency } from '../getDependency';
import { RegistryDependency } from '../RegistryDependency';

jest.mock('../getBestCandidate');

describe('getDependency', () => {
  it('should provide a dependency', () => {
    // Given
    const content = 'content';
    const name = 'name';
    const range = '^1.0.0';
    (getBestCandidate as jest.Mock).mockReturnValueOnce({
      content,
      factory: () => Promise.resolve(),
      name,
      range,
      version: '1.0.0',
    } as RegistryDependency);

    // When
    const dependency = getDependency(name, range);

    // Then
    expect(getBestCandidate).toHaveBeenCalledTimes(1);
    expect(getBestCandidate).toHaveBeenCalledWith(name, range);
    expect(dependency).toEqual(content);
  });

  it('should throw an error if the dependency has not been loaded', () => {
    // Given
    const name = 'name';
    const range = '^1.0.0';
    (getBestCandidate as jest.Mock).mockReturnValueOnce({
      factory: () => Promise.resolve(),
      name,
      range,
      version: '1.0.0',
    } as RegistryDependency);

    // When/Then
    expect(() => getDependency(name, range)).toThrow();
  });
});
