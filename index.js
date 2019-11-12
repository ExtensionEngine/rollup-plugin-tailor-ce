'use strict';

const { packageJson: pkg, path: packagePath } = require('read-pkg-up').sync();
const path = require('path');
const { readFileSync } = require('fs');
const { render } = require('mustache');

const NAME = '@extensionengine/tailor-ce';
const PREFIX = '\0virtual:';
const REGISTRY = '__TAILOR_CONTENT_ELEMENTS__';
const TEMPLATE = readFileSync(require.resolve('./dist/__plugin__'), 'utf-8');

const isObject = arg => arg !== null && typeof arg === 'object';
const normalize = modulePath => path.resolve(process.cwd(), modulePath);

module.exports = function () {
  let entryId;
  let entryCode;

  return {
    name: NAME,
    /** @param {import('rollup').InputOptions} options */
    options(options) {
      // Create virtual entry module.
      const [entry] = getInput(options.input);
      const entryPath = normalize(entry);
      entryId = [PREFIX, entryPath].join('');
      entryCode = render(TEMPLATE, {
        packagePath: normalize(packagePath),
        entryPath
      });
      // Set `options.input` to newly created entry.
      const input = { [pkg.name]: entryId };
      return Object.assign(options, { input, shimMissingExports: true });
    },
    /** @param {import('rollup').OutputOptions} options */
    outputOptions(options) {
      const name = [REGISTRY, pkg.name].join('.');
      return Object.assign(options, { name });
    },
    /** @param {string} id */
    resolveId(id) {
      return id === entryId ? id : null;
    },
    /** @param {string} id */
    load(id) {
      return id === entryId ? entryCode : null;
    }
  };
};

/**
 * @param {import('rollup').InputOption} input
 * @return {Array<string>}
 */
function getInput(input) {
  if (isObject(input)) return Object.values(input);
  if (Array.isArray(input)) return input;
  return [input];
}
