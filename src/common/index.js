import Vue from "vue";
const context = require.context("./", false, /\.vue$/);

context.keys().forEach((key) => {
  const component = context(key)?.default || context(key);
  const componentName = component.name;
  if (!componentName) {
    // throw new Error(`全局组件请添加name属性${key}`);
  }
  Vue.component(`v-${component.name}`, component);
});
