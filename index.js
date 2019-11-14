'use strict';

const { packageJson: pkg, path: packagePath } = require('read-pkg-up').sync();
const path = require('path');
const { readFileSync } = require('fs');
const { render } = require('mustache');

const NAME = '@extensionengine/tailor-ce';
const PREFIX = '\0virtual:';
const REGISTRY = '__TAILOR_CONTENT_ELEMENTS__';
const OPTIONAL_EXPORTS = ['install'];
const SCOPE = /^@[^/]+\//;
const TEMPLATE = readFileSync(require.resolve('./dist/plugin'), 'utf-8');

const isObject = arg => arg !== null && typeof arg === 'object';
const isString = arg => typeof arg === 'string';
const noop = () => {};
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
      const entryName = pkg.name.replace(SCOPE, '');
      const input = { [entryName]: entryId };
      Object.assign(options, { input, shimMissingExports: true });
      // Override `options.onwarn` handler to silence shimmed export warning.
      const { onwarn: warn = noop } = options;
      options.onwarn = function (warning) {
        if (onwarn.call(this, entry, warning)) return;
        warn.apply(this, arguments);
      };
      return options;
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
 * @param {string} entryPath
 * @param {import('rollup').RollupWarning} warning
 * @returns {boolean}
 */
function onwarn(entryPath, warning) {
  if (isString(warning)) return false;
  const code = (warning.code || '').toLowerCase();
  return code === 'shimmed_export' &&
    OPTIONAL_EXPORTS.includes(warning.exportName) &&
    normalize(warning.exporter) === normalize(entryPath);
}

/**
 * @param {import('rollup').InputOption} input
 * @return {Array<string>}
 */
function getInput(input) {
  if (isObject(input)) return Object.values(input);
  if (Array.isArray(input)) return input;
  return [input];
}
