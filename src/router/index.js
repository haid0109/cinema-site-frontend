import Vue from 'vue'
import VueRouter from 'vue-router'
import landingPage from '../views/landingPage.vue'
import chooseMovie from '../views/chooseMovie.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'landingPage',
    component: landingPage
  },
  {
    path: '/København',
    name: 'chooseMovie',
    component: chooseMovie
  },
  {
    path: '/Aarhus',
    name: 'chooseMovie',
    component: chooseMovie
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
