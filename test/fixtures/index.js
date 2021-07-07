import Edit from './Edit.vue';
import Greet from './Greet.vue';

const hasProp = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
const isFunction = arg => typeof arg === 'function';

const install = Vue => {
  if (hasProp(Vue, 'onInstall')) {
    isFunction(Vue.onInstall) && Vue.onInstall();
  }
};

export { Edit, Greet, install };

export default {
  initState: () => ({}),
  components: {
    Edit,
    Greet
  }
};
