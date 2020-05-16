import { getBestCandidate } from './getBestCandidate';
import { RegistryDependency } from './RegistryDependency';

export async function awaitSharedDependencies(
  externalDependencies: RegistryDependency[]
): Promise<void> {
  for (const { name, range } of externalDependencies) {
    const bestCandidate = getBestCandidate(name, range);

    if (bestCandidate.content === undefined) {
      bestCandidate.content = await bestCandidate.factory();
    }
  }
}
