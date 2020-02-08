export default {
  install(vue) {
    vue.prototype.$bus = new Vue({})
  }
};
