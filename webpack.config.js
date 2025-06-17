const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: {
    main: './src/content/main.js',
    panel: './src/sidepanel/panel.js',
    background: './src/background/service-worker.js',
    options: './src/options/options.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'manifest.json', to: 'manifest.json' },
        { from: 'src/sidepanel/panel.html', to: 'sidepanel/panel.html' },
        { from: 'src/content/styles.css', to: 'content/styles.css' },
        { from: 'src/options/options.html', to: 'options/options.html' },
        { from: 'src/options/options.js', to: 'options/options.js' }
      ],
    }),
  ],
}; 