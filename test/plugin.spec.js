'use strict';

/* eslint-env jest */

const { createLocalVue, mount } = require('@vue/test-utils');
const { mkdirSync, writeFile } = require('fs');
const { Bundler } = require('bili');
const path = require('path');
const pkg = require('./fixtures/package.json');
const requireFromString = require('require-from-string');

const isObject = arg => arg !== null && typeof arg === 'object';

const isDebug = process.env.DEBUG;
const outputFilename = `${pkg.name}.js`;
const rootDir = path.join(__dirname, './fixtures/');

let asset;
let tmpDir;

if (isDebug) {
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

test('verify default exports', async () => {
  const plugin = requireFromString(asset.source);
  expect(typeof plugin.default).toBe('function');
  expect(typeof plugin.install).toBe('function');
  const { options } = plugin;
  expect(typeof options.initState).toBe('function');
  expect(isObject(options.components)).toBe(true);
  expect(options.version).toEqual(pkg.version);
  expect(options.label).toEqual(pkg.tailor.label);
  expect(options.type).toEqual(pkg.tailor.type);
  expect(options.ui).toEqual(pkg.tailor.ui);
});

test('verify named exports', async () => {
  const plugin = requireFromString(asset.source);
  const { options, Edit, Greet } = plugin;
  expect(options.components.Edit).toBe(Edit);
  expect(options.components.Greet).toBe(Greet);
});

test('register content element', async () => {
  const plugin = requireFromString(asset.source);
  const localVue = createLocalVue();
  localVue.use(plugin);
  const { options } = plugin;
  expect(localVue.component('tce-example')).toBe(localVue.component('tce-example--edit'));
  const EditCtor = localVue.component('tce-example');
  const GreetCtor = localVue.component('tce-example--greet');
  expect(EditCtor && EditCtor.options).toMatchObject(options.components.Edit);
  expect(GreetCtor && GreetCtor.options).toMatchObject(options.components.Greet);
});

test('mount edit component', async () => {
  const { options } = requireFromString(asset.source);
  const element = {
    data: {
      content: 'Hello world!'
    }
  };
  const propsData = { element, isFocused: false };
  const wrapper = mount(options.components.Edit, { propsData });
  expect(wrapper.html()).toBe('<div class="tce-example"><div>Hello world!</div></div>');
});

test('mount greet component', async () => {
  const { options } = requireFromString(asset.source);
  const propsData = { name: 'Tailor' };
  const wrapper = mount(options.components.Greet, { propsData });
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
