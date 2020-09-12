import Vue from 'vue'
import VueRouter from 'vue-router'
import landingPage from '../views/landingPage.vue'
import adminLogin from '../views/adminLogin.vue'
import chooseMovie from '../views/chooseMovie.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'landingPage',
    component: landingPage
  },
  {
    path: '/admin',
    name: 'adminLogin',
    component: adminLogin
  },
  {
    path: '/:cinema',
    name: 'home',
    component: chooseMovie
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
