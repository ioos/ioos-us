const path = require('path');

module.exports = {
  entry: './index.js',
  output: {
    filename: 'ioos-ui-components.min.js',
    path: path.resolve(__dirname, '../public/lib/ioos-components/'),
    publicPath: '/build/', // Ensure publicPath is correctly set for HMR
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, '.'), // Serve from the project root
      watch: false, // Disable watching on static files to prevent infinite loops
    },
    compress: true,
    hot: true, // Enable Hot Module Replacement
    open: true, // Automatically open the browser
    port: 5000, // The port for the dev server
    historyApiFallback: {
      index: 'index.html', // Serve index.html for all routes
    },
    watchFiles: ['src/**/*', 'index.html', 'menuConfig.json'], // Watch these files for changes
    liveReload: true, // Enable live reloading
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: 'raw-loader', // Use raw-loader to load CSS as a string
      },
      {
        test: /\.json$/i,
        type: 'json',
      },
    ],
  },
};
