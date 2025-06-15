import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Login from '@/components/Login'
import Register from '@/components/Register'
import Users from '@/components/Users'
import Pizzas from '@/components/Pizzas'
import Reviews from '@/components/Reviews'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/users',
      name: 'Users',
      component: Users
    },
    {
      path: '/pizza',
      name: 'Pizzas',
      component: Pizzas
    },
    {
      path: '/reviews',
      name: 'Reviews',
      component: Reviews
    },
    {path: '*', redirect: '/'}
  ],
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})
