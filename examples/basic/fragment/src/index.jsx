import { initRegistry } from '@josselinbuils/registry';

const { awaitExternalDependencies } = initRegistry();

awaitExternalDependencies().then(() => {
  import('./render');
});
