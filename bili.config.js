'use strict';

/** @type {import('bili').Config} */
module.exports = {
  input: './src/__plugin__.js',
  output: {
    format: 'esm',
    fileName: '__plugin__.js'
  },
  bundleNodeModules: true
};
