import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import Upgrades from '../components/Upgrades';
import Teste from '../components/Teste';

const routes = [
  { path: '/', component: Upgrades },
  { path: '/teste', component: Teste }
]

export default new VueRouter({
  routes
})