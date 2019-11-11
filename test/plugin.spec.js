'use strict';

/* eslint-env jest */

const { createLocalVue, mount } = require('@vue/test-utils');
const { mkdirSync, writeFile } = require('fs');
const { Bundler } = require('bili');
const del = require('del');
const path = require('path');
const pkg = require('./fixtures/package.json');
const requireFromString = require('require-from-string');

const isDebug = process.env.DEBUG;
const outputFilename = `${pkg.name}.js`;
const rootDir = path.join(__dirname, './fixtures/');

let asset;
let tmpDir;

if (isDebug) {
  del.sync(path.join(__dirname, '.tmp*'));
  tmpDir = path.join(__dirname, `.tmp_${Date.now()}`);
  mkdirSync(tmpDir);
}

process.chdir(rootDir);

test('compile example using bili', async () => {
  const { bundles } = await compile();
  const [bundle] = bundles;
  asset = bundle.get(outputFilename);
  expect(asset && asset.source).toContain(pkg.tailor.type);
  if (isDebug) {
    return writeFile(path.join(tmpDir, outputFilename), asset.source, 'utf-8');
  }
});

test('verify correct exports layout', async () => {
  const plugin = requireFromString(asset.source);
  expect(typeof plugin.default).toBe('function');
  expect(typeof plugin.install).toBe('function');
  expect(plugin.config.label).toEqual(pkg.tailor.label);
  expect(plugin.config.type).toEqual(pkg.tailor.type);
  expect(plugin.config.ui).toEqual(pkg.tailor.ui);
  expect(plugin.config.version).toEqual(pkg.version);
});

test('register content element', async () => {
  const plugin = requireFromString(asset.source);
  const localVue = createLocalVue();
  localVue.use(plugin);
  expect(localVue.component('tce-example')).toBe(localVue.component('tce-example--edit'));
  const EditCtor = localVue.component('tce-example');
  const GreetCtor = localVue.component('tce-example--greet');
  expect(EditCtor && EditCtor.options).toMatchObject(plugin.config.Edit);
  expect(GreetCtor && GreetCtor.options).toMatchObject(plugin.config.Greet);
});

test('mount edit component', async () => {
  const plugin = requireFromString(asset.source);
  const element = {
    data: {
      content: 'Hello world!'
    }
  };
  const propsData = { element, isFocused: false };
  const wrapper = mount(plugin.config.Edit, { propsData });
  expect(wrapper.html()).toBe('<div class="tce-example"><div>Hello world!</div></div>');
});

test('mount other component', async () => {
  const plugin = requireFromString(asset.source);
  const propsData = { name: 'Tailor' };
  const wrapper = mount(plugin.config.Greet, { propsData });
  expect(wrapper.html()).toBe('<p>Hello Tailor!</p>');
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
