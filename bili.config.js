'use strict';

/** @type {import('bili').Config} */
module.exports = {
  input: './src/plugin.js',
  output: {
    format: 'esm',
    fileName: '[name].js'
  },
  bundleNodeModules: true
};
