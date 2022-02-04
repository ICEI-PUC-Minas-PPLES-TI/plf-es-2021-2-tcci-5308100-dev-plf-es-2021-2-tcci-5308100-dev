const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '~': path.resolve(__dirname, './src/'),
      '@Utils': path.resolve(__dirname, './src/utils/'),
      '@Pages': path.resolve(__dirname, './src/pages/'),
      '@Views': path.resolve(__dirname, './src/views/'),
      '@Components': path.resolve(__dirname, './src/components/'),
      '@Services': path.resolve(__dirname, './src/services/'),
      '@Assets': path.resolve(__dirname, './src/assets/'),
      '@GlobalTypes': path.resolve(__dirname, './src/utils/types.ts'),
    },
    configure: {
      mode: 'development',
      devtool: 'source-map',
    },
  },
};
