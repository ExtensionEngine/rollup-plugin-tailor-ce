import { name as packageName, tailor, version } from '{{{packagePath}}}';
import pluginOptions, * as plugin from '{{{entryPath}}}';
import { paramCase } from 'param-case';

const hasProp = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
const isFunction = arg => typeof arg === 'function';

export * from '{{{entryPath}}}';

const {
  initState = () => ({}),
  components = {}
} = pluginOptions;

export const options = {
  version,
  initState,
  components,
  ...tailor
};

export const install = Vue => {
  if (hasProp(plugin, 'install')) {
    isFunction(plugin.install) && plugin.install(Vue);
  }
  Object.entries(components).forEach(([name, component]) => {
    name = paramCase(name);
    if (name === 'edit') Vue.component(packageName, component);
    Vue.component(`${packageName}--${name}`, component);
  });
};

export default install;
