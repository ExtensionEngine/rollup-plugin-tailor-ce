import contentElement, * as plugin from '{{{entryPath}}}';
import { name as packageName, tailor, version } from '{{{packagePath}}}';
import kebabCase from 'param-case';

const hasProp = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
const isFunction = arg => typeof arg === 'function';

export * from '{{{entryPath}}}';

const {
  initState = () => ({}),
  components = {}
} = contentElement;

export const config = {
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
    name = kebabCase(name);
    if (name === 'edit') Vue.component(packageName, component);
    Vue.component(`${packageName}--${name}`, component);
  });
};

export default install;
