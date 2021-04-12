import icon from "./packages/icon/src";
import formItem from "./packages/formItem/src";
import atp from "./packages/atp/src";

const components = [icon, formItem, atp];

const install = function(Vue) {
  if (install.installed) return;
  components.forEach(component => Vue.component(component.name, component));
};

export default {
  install
};
