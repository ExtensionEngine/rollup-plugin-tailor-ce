'use strict';

module.exports = {
  root: true,
  extends: '@extensionengine',
  overrides: [{
    files: ['src/**', 'test/fixtures/**'],
    parserOptions: {
      sourceType: 'module'
    }
  }]
};
