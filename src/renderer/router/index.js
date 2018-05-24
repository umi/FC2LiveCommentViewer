import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'comment-page',
      component: require('@/components/Comment').default
    },
    {
      path: '/config',
      name: 'config-page',
      component: require('@/components/Config').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
