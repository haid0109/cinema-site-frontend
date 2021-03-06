import Vue from 'vue';
import VueRouter from 'vue-router';
import landingPage from '../views/landingPage.vue';
import adminLogin from '../views/adminLogin.vue';
import adminDashboard from '../views/adminDashboard.vue';
import login from '../views/login.vue';
import register from '../views/register.vue';
import account from '../views/account.vue';
import chooseMovie from '../views/chooseMovie.vue';
import movie from '../views/movie.vue';
import performance from '../views/performance.vue';
import bought from '../views/bought.vue';

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
    component: adminLogin,
  },
  {
    path: '/admin/dashboard',
    name: 'adminDashboard',
    component: adminDashboard,
    meta: {
      requiresAuth: true,
      requiresAdmin: true
    }
  },
  {
    path: '/login',
    name: 'login',
    component: login
  },
  {
    path: '/register',
    name: 'register',
    component: register
  },
  {
    path: '/account',
    name: 'account',
    component: account,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/:cinema',
    name: 'home',
    component: chooseMovie
  },
  {
    path: '/:cinema/:date',
    name: 'home',
    component: chooseMovie
  },
  {
    path: '/:cinema/movie/:movieId',
    name: 'home',
    component: movie
  },
  {
    path: '/:cinema/movie/:movieId/:start',
    name: 'home',
    component: performance
  },
  {
    path: '/bought/:phoneNum/:code',
    name: 'bought',
    component: bought
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if(to.name == 'home' && (!sessionStorage.getItem('cinemaName') || !sessionStorage.getItem('cinemaId'))) next({path: '/'});
  if(to.matched.some(record => record.meta.requiresAuth)){
    if(to.matched.some(record => record.meta.requiresAdmin)){
      if(!sessionStorage.getItem('jwtAdmin') || !sessionStorage.getItem('cinemaId')) 
        next({path: '/admin'});
      else next();
    }
    else{
      if(!sessionStorage.getItem('jwt')) next({path: '/login'});
      else next();
    }
  }
  else next();
});

export default router
