import Vue from 'vue'
import router from './plugins/router.js'
import store from './plugins/store.js'
import vuetify from './plugins/vuetify';
import i18n from './plugins/i18n'
import App from './App';

Vue.filter('time', function (value) {
  let mins = ~~(value / 60);
  let secs = ~~value % 60;
  return "" + (mins < 10 ? "0" : "") + mins + ":" + (secs < 10 ? "0" : "") + secs;
})

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: h => h(App)
}).$mount('#app')