import Vue from 'vue'
import router from './plugins/router.js'
import store from './plugins/store.js'
import vuetify from './plugins/vuetify';
import i18n from './plugins/i18n'
import App from './App';

Vue.filter('decimal', function (value) {
  return value.toFixed(2)
})

Vue.filter('integer', function (value) {
  return value.toFixed(0)
})

Vue.filter('space', function (value) {
  if(value == " ")
    return "Space"
  return value
})

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: h => h(App)
}).$mount('#app')