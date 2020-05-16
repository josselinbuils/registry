import { Registry } from './Registry';
import { rcompare, satisfies } from './semver';
import { SharedDependency } from './SharedDependency';

/**
 * Provides the best dependency candidate to be loaded regarding the following
 * criteria sorted by importance: already loaded, most recent version.
 */
export function getBestCandidate(
  name: string,
  range: string
): SharedDependency {
  const globalSharedDependencies = ((window as any).registry as Registry)
    .sharedDependencies;

  return globalSharedDependencies
    .filter((dep) => dep.name === name && satisfies(dep.version, range))
    .sort((a, b) => {
      if (a.content && !b.content) {
        return -1;
      }
      if (b.content && !a.content) {
        return 1;
      }
      return rcompare(a.version, b.version) as number;
    })[0];
}
