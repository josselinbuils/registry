import { awaitSharedDependencies } from './awaitSharedDependencies';
import { getDependency } from './getDependency';
import { Registry } from './Registry';

export function initRegistry(): {
  awaitSharedDependencies(): Promise<void>;
} {
  // SHARED_DEPENDENCIES will be injected by the RegistryWebpackPlugin
  // @ts-ignore
  const sharedDependencies = SHARED_DEPENDENCIES;
  const global = window as any;
  const registry = global.registry as Registry | undefined;
  const registryDependencies = registry?.dependencies ?? [];

  // Filled as host and fragments are loaded
  global.registry = {
    get: registry?.get ?? getDependency,
    dependencies: [...registryDependencies, ...sharedDependencies],
  } as Registry;

  return {
    awaitSharedDependencies: awaitSharedDependencies.bind(
      null,
      sharedDependencies
    ),
  };
}
