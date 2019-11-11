'use strict';

const { packageJson: pkg, path: packagePath } = require('read-pkg-up').sync();
const path = require('path');
const { readFileSync } = require('fs');
const { render } = require('mustache');
const virtual = require('rollup-plugin-virtual');

const PLUGIN_ENTRY = require.resolve('./dist/__plugin__');
const TCE_REGISTRY = '__TAILOR_CONTENT_ELEMENTS__';

const moduleName = name => [TCE_REGISTRY, name].join('.');
const normalize = modulePath => path.resolve(process.cwd(), modulePath);

module.exports = () => ({
  /**
   * @param {import('rollup').InputOptions} options
   */
  options(options) {
    // Create virtual entry module.
    const [entry] = Object.values(options.input);
    const name = path.basename(PLUGIN_ENTRY, path.extname(PLUGIN_ENTRY));
    const template = readFileSync(PLUGIN_ENTRY, 'utf-8');
    const code = render(template, {
      packagePath: normalize(packagePath),
      entryPath: normalize(entry)
    });
    options.plugins.push(virtual({ [name]: code }));
    options.shimMissingExports = true;
    // Set `options.input` to newly created entry.
    const input = { [pkg.name]: name };
    return Object.assign(options, { input });
  },
  /**
   * @param {import('rollup').OutputOptions} options
   */
  outputOptions(options) {
    const name = moduleName(pkg.name);
    return Object.assign(options, { name });
  }
});
