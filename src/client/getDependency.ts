import { getBestCandidate } from './getBestCandidate';

export function getDependency(name: string, range: string): any {
  const bestCandidate = getBestCandidate(name, range);

  if (bestCandidate.module === undefined) {
    throw new Error(
      'You required a dependency that has not been loaded yet, please call awaitSharedDependencies first'
    );
  }
  return bestCandidate.module;
}
