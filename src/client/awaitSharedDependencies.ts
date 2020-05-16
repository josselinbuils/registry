import { getBestCandidate } from './getBestCandidate';
import { RegistryDependency } from './RegistryDependency';

export async function awaitSharedDependencies(
  dependencies: RegistryDependency[]
): Promise<void> {
  for (const { name, range } of dependencies) {
    const bestCandidate = getBestCandidate(name, range);

    if (bestCandidate.content === undefined) {
      bestCandidate.content = await bestCandidate.factory();
    }
  }
}
