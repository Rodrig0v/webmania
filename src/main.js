import Vue from 'vue'
import router from './plugins/router.js'
import store from './plugins/store.js'
import vuetify from './plugins/vuetify';

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

import App from './App';

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')