import Vue from 'vue'
import Router from 'vue-router'
import Goodslist from '../components/Goodslist.vue'
import cartList from '../components/cartList'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: Goodslist
    },
    {
      path: '/cart',
      component:cartList
    }
  ]
})
