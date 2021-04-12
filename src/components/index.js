import bf from "./bf";
import bottominfo from "./bottominfo";
import sp from "./sp";
import buttonTimer from "./buttonTimer";
import thai from "./thai";

const components = [bf, bottominfo, sp, buttonTimer, thai];

const install = function(Vue) {
  if (install.installed) return;
  components.forEach(component =>
    Vue.component("g-" + component.name, component)
  );
};

export default {
  install
};
