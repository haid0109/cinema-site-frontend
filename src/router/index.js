import { createRouter, createWebHistory } from 'vue-router'
import landingPage from '../views/landingPage.vue'

const routes = [
  {
    path: '/',
    name: 'landingPage',
    component: landingPage
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
