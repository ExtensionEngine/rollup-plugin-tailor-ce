import { name, tailor, version } from '{{{packagePath}}}';
import tce from '{{{entryPath}}}';

const { initState, ...Components } = tce;

const componentName = Component => [name, Component.name].join('--');
const isEditView = Component => Component.name.toLowerCase() === 'edit';
const isFunction = arg => typeof arg === 'function';

export const config = {
  ...Components,
  ...tailor,
  initState,
  version
};

export const install = Vue => {
  if (isFunction(tce.setup)) tce.setup(Vue);
  Object.values(Components).forEach(Component => {
    if (isEditView(Component)) Vue.component(name, Component);
    Component.name = componentName(Component);
    Vue.component(Component.name, Component);
  });
};

export default install;
