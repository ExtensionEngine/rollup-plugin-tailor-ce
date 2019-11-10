'use strict';

/* eslint-env jest */

const { Bundler } = require('bili');
const path = require('path');
const pkg = require('./fixtures/package.json');
const requireFromString = require('require-from-string');

const outputFilename = `${pkg.name}.js`;
const rootDir = path.join(__dirname, './fixtures/');

let asset = null;

process.chdir(rootDir);

test('compile example using bili', async () => {
  const { bundles } = await compile();
  const [bundle] = bundles;
  asset = bundle.get(outputFilename);
  expect(asset && asset.source).toContain(pkg.tailor.type);
});

test('verify correct exports layout', async () => {
  const tce = requireFromString(asset.source);
  expect(typeof tce.default).toBe('function');
  expect(typeof tce.install).toBe('function');
  expect(tce.config.label).toEqual(pkg.tailor.label);
  expect(tce.config.type).toEqual(pkg.tailor.type);
  expect(tce.config.ui).toEqual(pkg.tailor.ui);
  expect(tce.config.version).toEqual(pkg.version);
});

function compile() {
  /** @type {import('bili').Config} */
  const config = {
    input: 'index.js',
    output: {
      format: 'cjs',
      dir: process.cwd()
    },
    bundleNodeModules: ['rollup-plugin-vue', 'vue-runtime-helpers'],
    plugins: {
      vue: true,
      tce: true
    },
    resolvePlugins: {
      tce: require('..')
    }
  };
  /** @type {import('bili').Options} */
  const options = {
    logLevel: 'quiet',
    configFile: 'false',
    rootDir
  };
  const bundler = new Bundler(config, options);
  return bundler.run();
}
