import contentElement, * as plugin from '{{{entryPath}}}';
import { name as packageName, tailor, version } from '{{{packagePath}}}';
import kebabCase from 'param-case';

const { initState, ...Components } = contentElement;

const hasProp = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
const isFunction = arg => typeof arg === 'function';

export const config = {
  ...Components,
  ...tailor,
  initState,
  version
};

export const install = Vue => {
  if (hasProp(plugin, 'install')) {
    isFunction(plugin.install) && plugin.install(Vue);
  }
  Object.entries(Components).forEach(([name, Component]) => {
    name = kebabCase(name);
    if (name === 'edit') Vue.component(packageName, Component);
    Vue.component(`${packageName}--${name}`, Component);
  });
};

export default install;
