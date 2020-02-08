import Vue from 'vue'
import Router from 'vue-router'
import Goodslist from '../components/Goodslist.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: Goodslist
    }
  ]
})
