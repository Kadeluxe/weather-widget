import {defineCustomElement} from "vue";

import App from "./App.vue";

(async function () {
  const styles: string[] = [];
  const modules = import.meta.glob("./**/*.vue");

  for (const path in modules) {
    const mod = await modules[path]();
    // @ts-ignore
    styles.push(mod.default.styles);
  }

  App.styles = [styles.flat().join("")];

  const app = defineCustomElement(App);
  customElements.define("weather-widget", app);
})();
