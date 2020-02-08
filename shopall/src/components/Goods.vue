<template>
  <div>
    <div class="pic">
      <a href="#">
        <img v-lazy="'../../static/'+obj.productImage" alt />
      </a>
    </div>
    <div class="main">
      <div class="name">{{obj.productName}}</div>
      <div class="price">{{obj.salePrice}}</div>
      <div class="btn-area">
        <a href="javascript:;" class="btn btn--m" @click="addcart(obj.productId)">加入购物车</a>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  props:{
    obj:{
      type:Object,
    }
  },
  methods:{
    addcart(id){
      axios.post("/goods/addCart",{
          productId:id
      }).then((res)=>{
        console.log(res)
        if(res.data.status==0){
            alert("加入成功");
        }else{
            alert("msg"+res.msg)
        }
      })
    }
  }
};
</script>
<style lang="scss">
</style>
