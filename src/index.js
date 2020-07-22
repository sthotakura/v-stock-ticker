import stockTicker from "./stock-ticker.vue";

function install(Vue) {
  if (install.installed) return;

  install.installed = true;
  Vue.component("v-stock-ticker", stockTicker);
}

const plugin = {
  install,
};

let GlobalVue = null;
if (typeof window !== "undefined") {
  GlobalVue = window.Vue;
} else if (typeof global !== "undefined") {
  GlobalVue = global.Vue;
}

if (GlobalVue) {
  GlobalVue.use(plugin);
}

stockTicker.install = install;

export default stockTicker;
