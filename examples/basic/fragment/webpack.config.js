const { RegistryWebpackPlugin } = require('@josselinbuils/registry/plugin');

module.exports = {
  entry: './src/index.jsx',
  output: {
    filename: 'fragment.js',
    jsonpFunction: 'webpackJsonpFragment',
    publicPath: 'http://localhost:3001/',
  },
  module: {
    rules: [
      {
        test: /\.(j?sx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
    ],
  },
  plugins: [
    new RegistryWebpackPlugin({
      externalDependencies: ['react', 'react-dom'],
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  devServer: {
    contentBase: './public',
    port: 3001,
  },
  devtool: 'eval-source-map',
};
