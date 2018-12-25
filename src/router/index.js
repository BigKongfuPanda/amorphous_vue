import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

function _import (path) {
  return () => import(`@/pages/${path}.vue`);
}

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: _import('login')
    }
  ]
})
