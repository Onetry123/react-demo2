import Vue from 'vue'
import Router from 'vue-router'
import Goodslist from '../components/Goodslist.vue'
import cartList from '../components/cartList'
import Address from '../components/Address'
import orderconfirm from '../components/Orderconfirm'
import ordersuccess from '../components/ordersuccess'

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
    },
    {
      path: '/address',
      component:Address
    },
    {
      path: '/orderconfirm',
      component:orderconfirm
    },
    {
      path: '/ordersuccess',
      component:ordersuccess
    }
  ]
})
