import { getBestCandidate } from './getBestCandidate';
import { SharedDependency } from './SharedDependency';

export async function awaitSharedDependencies(
  dependencies: SharedDependency[]
): Promise<void> {
  for (const { name, range } of dependencies) {
    const bestCandidate = getBestCandidate(name, range);

    if (bestCandidate.content === undefined) {
      bestCandidate.content = await bestCandidate.factory();
    }
  }
}
