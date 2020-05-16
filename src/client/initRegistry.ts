import { awaitSharedDependencies } from './awaitSharedDependencies';
import { getDependency } from './getDependency';
import { Registry } from './Registry';

export function initRegistry(): {
  awaitSharedDependencies(): Promise<void>;
} {
  // EXTERNAL_DEPENDENCIES and SHARED_DEPENDENCIES will be injected by the
  // RegistryWebpackPlugin
  // @ts-ignore
  const externalDependencies = EXTERNAL_DEPENDENCIES;
  // @ts-ignore
  const sharedDependencies = SHARED_DEPENDENCIES;
  const global = window as any;
  const registry = global.registry as Registry | undefined;
  const registrySharedDependencies = registry?.sharedDependencies ?? [];
  const get = registry?.get ?? {};

  for (const { name, range } of externalDependencies) {
    const key = `${name}@${range}`;

    if (!get.hasOwnProperty(key)) {
      Object.defineProperty(get, key, {
        get: () => getDependency(name, range),
      });
    }
  }

  // Filled as host and fragments are loaded
  global.registry = {
    get,
    sharedDependencies: [...registrySharedDependencies, ...sharedDependencies],
  } as Registry;

  return {
    awaitSharedDependencies: awaitSharedDependencies.bind(
      null,
      externalDependencies
    ),
  };
}
