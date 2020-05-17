# registry

Allows sharing dependencies between micro frontends.

# Install

```bash
npm install --dev @josselinbuils/registry
yarn add -D @josselinbuils/registry
```

# Usage

## Host

### Webpack config

Add the **RegistryWebpackPlugin** to your **Webpack** config file:

```javascript
// webpack.config.js

const { RegistryWebpackPlugin } = require('@josselinbuils/registry/plugin');

modules.exports = {
  // [...]
  plugins: [
    new RegistryWebpackPlugin({
      sharedDependencies: ['react', 'react-dom'],
    }),
  ],
};
```

### App

Initialize the registry as soon as possible in your host app:

```javascript
// index.js

import { initRegistry } from '@josselinbuils/registry';

initRegistry();
```

## Fragments

### Webpack config

Add the **RegistryWebpackPlugin** to your **Webpack** config file:

```javascript
// webpack.config.js

const { RegistryWebpackPlugin } = require('@josselinbuils/registry/plugin');

modules.exports = {
  // [...]
  plugins: [
    new RegistryWebpackPlugin({
      externalDependencies: ['react', 'react-dom'],
    }),
  ],
};
```

### App

Initialize the registry before importing any shared dependency in your fragments:

```javascript
// index.js

import { initRegistry } from '@josselinbuils/registry';

const { awaitSharedDependencies } = initRegistry();

awaitSharedDependencies().then(() => {
  import('./render');
});
```

## Examples

You can find a working example in **examples/basic** folder.
