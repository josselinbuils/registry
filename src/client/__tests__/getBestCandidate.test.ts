import { getBestCandidate } from '../getBestCandidate';
import { Registry } from '../Registry';

describe('getBestCandidate', () => {
  const global = window as any;

  it('should prioritize loaded dependencies', () => {
    // Given
    const name = 'test';
    const factory = () => Promise.resolve();
    global.registry = {
      sharedDependencies: [
        {
          name,
          factory,
          range: '^1.2.0',
          version: '1.2.4',
        },
        {
          content: 'content',
          name,
          factory,
          range: '^1.1.0',
          version: '1.1.5',
        },
      ],
    } as Registry;

    // When
    const bestCandidate = getBestCandidate('test', '^1.1.0');

    // Then
    expect(bestCandidate.version).toEqual('1.1.5');
  });

  it('should secondarily prioritize most recent dependencies', () => {
    // Given
    const name = 'test';
    const factory = () => Promise.resolve();
    global.registry = {
      sharedDependencies: [
        { name, factory, range: '^1.2.0', version: '1.2.4' },
        { name, factory, range: '^1.1.0', version: '1.1.3' },
      ],
    } as Registry;

    // When
    const bestCandidate = getBestCandidate('test', '^1.1.0');

    // Then
    expect(bestCandidate.version).toEqual('1.2.4');
  });
});
