import { initRegistry } from '@josselinbuils/registry';

const { awaitSharedDependencies } = initRegistry();

awaitSharedDependencies().then(() => {
  import('./render');
});
