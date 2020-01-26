import Vue from 'vue'
import VueRouter from 'vue-router'
import Matchmaking from '../views/Matchmaking.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'main',
    component: Matchmaking
  }
]

const router = new VueRouter({
  routes
})

export default router
