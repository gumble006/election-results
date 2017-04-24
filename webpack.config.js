module.exports = {
  entry: [
    './src/index.js'
  ],
  output: {
    path: __dirname,
    publicPath: '/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [{
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        presets: ['es2015', 'stage-1']
      }
    },
    { test: /\.json$/, loader: 'json-loader' },
    { test: /\.geojson$/, loader: 'json-loader' }]
  },
  resolve: {
    extensions: ['', '.js']
  },
  devServer: {
    inline: true,
    historyApiFallback: true,
    contentBase: './'
  }
};
