import clock from './clock.vue';

module.exports = {
  install: function (Vue, options) {
    Vue.component('vue-clock', clock);
  }
};