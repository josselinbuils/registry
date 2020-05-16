import { ExternalDependency } from './ExternalDependency';
import { getBestCandidate } from './getBestCandidate';

export async function awaitSharedDependencies(
  externalDependencies: ExternalDependency[]
): Promise<void> {
  for (const { name, range } of externalDependencies) {
    const bestCandidate = getBestCandidate(name, range);

    if (bestCandidate.module === undefined) {
      bestCandidate.module = await bestCandidate.factory();
    }
  }
}
