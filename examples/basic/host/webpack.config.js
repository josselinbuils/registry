const { RegistryWebpackPlugin } = require('@josselinbuils/registry/plugin');

module.exports = {
  entry: './src/index.jsx',
  output: {
    filename: 'host.js',
    jsonpFunction: 'webpackJsonpHost',
    publicPath: 'http://localhost:3000/',
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
      sharedDependencies: ['react', 'react-dom'],
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  devServer: {
    contentBase: './public',
    port: 3000,
  },
  devtool: 'eval-source-map',
};
