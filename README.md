# @extensionengine/rollup-plugin-tailor-ce

[![circleci build status](https://badgen.net/circleci/github/ExtensionEngine/rollup-plugin-tailor-ce/master?icon)](https://circleci.com/gh/ExtensionEngine/rollup-plugin-tailor-ce)
[![npm package version](https://badgen.net/npm/v/@extensionengine/rollup-plugin-tailor-ce)](https://npm.im/@extensionengine/rollup-plugin-tailor-ce)
[![js @extensionengine style](https://badgen.net/badge/code%20style/@extensionengine/black)](https://github.com/ExtensionEngine/eslint-config)

This package provides [rollup](https://rollupjs.org) plugin for building [tailor](https://github.com/ExtensionEngine/tailor) content elements.

## Install

```
$ npm install -D @extensionengine/rollup-plugin-tailor-ce
```

## Usage

Add plugin to your `bili.config.js`:

```js
module.exports = {
  plugins: {
    'tailor-ce': true
  },
  resolvePlugins: {
    'tailor-ce': require('@extensionengine/rollup-plugin-tailor-ce')
  }
};
```
