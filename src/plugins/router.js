import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import Achievements from '../components/Achievements';

const routes = [
  { path: '/', component: Achievements },
  { path: '/achievements', component: Achievements },
]

export default new VueRouter({
  routes
})