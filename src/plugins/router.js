import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import Home from '../components/Home';
import Achievements from '../components/Achievements';
import Settings from '../components/Settings';

const routes = [
  { path: '/', component: Home },
  { path: '/achievements', component: Achievements },
  { path: '/settings', component: Settings }
]

export default new VueRouter({
  routes
})