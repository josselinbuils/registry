import { initRegistry } from '@josselinbuils/registry/client';

const { awaitSharedDependencies } = initRegistry();

awaitSharedDependencies().then(() => {
  import('./render');
});
