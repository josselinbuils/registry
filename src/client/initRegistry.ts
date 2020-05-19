import { awaitExternalDependencies } from './awaitExternalDependencies';
import { getDependency } from './getDependency';

export function initRegistry(): {
  awaitExternalDependencies(): Promise<void>;
} {
  // EXTERNAL_DEPENDENCIES and SHARED_DEPENDENCIES will be injected by the
  // RegistryWebpackPlugin
  // @ts-ignore
  const externalDependencies = EXTERNAL_DEPENDENCIES;
  // @ts-ignore
  const sharedDependencies = SHARED_DEPENDENCIES;
  const { registry } = window;
  const registryExternalDependencies = registry?.externalDependencies ?? [];
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
  window.registry = {
    get,
    externalDependencies: [
      ...registryExternalDependencies,
      ...externalDependencies,
    ],
    sharedDependencies: [...registrySharedDependencies, ...sharedDependencies],
  };

  return {
    awaitExternalDependencies: awaitExternalDependencies.bind(
      null,
      externalDependencies
    ),
  };
}
