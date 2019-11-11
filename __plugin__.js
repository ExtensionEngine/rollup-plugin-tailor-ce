import pkg, { tailor, version } from '{{{packagePath}}}';
import { kebabCase } from 'change-case';
import tce from '{{{entryPath}}}';

const { initState, ...Components } = tce;

const isFunction = arg => typeof arg === 'function';

export const config = {
  ...Components,
  ...tailor,
  initState,
  version
};

export const install = Vue => {
  if (isFunction(tce.setup)) tce.setup(Vue);
  Object.entries(Components).forEach(([name, Component]) => {
    name = kebabCase(name);
    if (name === 'edit') Vue.component(pkg.name, Component);
    Vue.component(`${pkg.name}--${name}`, Component);
  });
};

export default install;
