<template>
  <div>
    <Navheader />
    <Navbread>
      <span>Goods</span>
    </Navbread>
    <div class="accessory-result-page accessory-page">
      <div class="container">
        <div class="filter-nav">
          <span class="sortby">Sort by:</span>
          <a href="javascript:void(0)" class="default cur">Default</a>
          <a href="javascript:void(0)" class="price" @click="sortGoods()">
            Price
            <svg class="icon icon-arrow-short">
              <use xlink:href="#icon-arrow-short" />
            </svg>
          </a>
          <a href="javascript:void(0)" class="filterby stopPop" @click="showfilterpop">Filter by</a>
        </div>
        <div class="accessory-result">
          <!-- filter -->
          <div class="filter stopPop" id="filter" :class="{'filterby-show':filterby}">
            <dl class="filter-price">
              <dt>Price:</dt>
              <dd @click="setpricefilter('all')">
                <a href="javascript:void(0)" :class="{'cur':pricechecked=='all'}">All</a>
              </dd>
              <dd v-for="(price,index) in pricelist" :key="index" @click="setpricefilter(index)">
                <a
                  href="javascript:void(0)"
                  :class="{'cur':pricechecked==index}"
                >{{price.stateprice}}-{{price.endprice}}</a>
              </dd>
            </dl>
          </div>

          <!-- search result accessories list -->
          <div class="accessory-list-wrap">
            <div class="accessory-list col-4">
              <ul>
                <li v-for="(item,key) in goodslist" :key="key">
                  <Goods :obj="item" @fn='getmsg'></Goods>
                </li>
              </ul>
              <div
                class="load-more"
                v-infinite-scroll="loadMore"
                infinite-scroll-disabled="busy"
                infinite-scroll-distance="30"
              >
                <img src="/static/loading/loading-spinning-bubbles.svg" v-show="loading" alt />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="md-overlay" v-show="overlayflag" @click="closepop"></div>
    <NavModal v-bind:mdShow="mdShow" v-on:close="closeModal">
      <p slot="message">请先登陆，否则无法加入到购物车</p>
      <div slot="btnGroup">
        <a class="btn btn--m" @click="mdShow=false">关闭</a>
      </div>
    </NavModal>
    <NavModal v-bind:mdShow="mdShowCart" v-on:close="closeModal">
      <p slot="message">
        <svg class="icon-status-ok">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok" />
        </svg>
        <span>加入购物车成功</span>
      </p>
      <div slot="btnGroup">
        <a class="btn btn--m" @click="mdShowCart=false">继续购物</a>
        <router-link class="btn btn--m" to="/cart">查看购物车</router-link>
      </div>
    </NavModal>
    <Navfooter />
  </div>
</template>
<script>
import "./../assets/css/base.css";
import "./../assets/css/product.css";
import "./../assets/css/checkout.css";
import Navheader from "./Navheader";
import Navfooter from "./Navfooter";
import Navbread from "./Navbread";
import NavModal from './modal'
import Goods from "./Goods";
import axios from "axios";
export default {
  data() {
    return {
      goodslist: [],
      sortflag: true,
      page: 1,
      pageSize: 8,
      busy: true,
      loading: false,
      pricelist: [
        { stateprice: 0, endprice: 100 },
        { stateprice: 100, endprice: 500 },
        { stateprice: 500, endprice: 1000 },
        { stateprice: 1000, endprice: 5000 }
      ],
      pricechecked: "all",
      filterby: false,
      overlayflag: false,
      mdShow: false,
      mdShowCart: false
    };
  },
  components: { Navheader, Goods, Navfooter, Navbread, NavModal},
  mounted() {
    this.getgoodslist();
  },
  methods: {
    getgoodslist(flag) {
      let param = {
        page: this.page,
        pageSize: this.pageSize,
        sort: this.sortflag ? 1 : -1,
        priceLevel: this.pricechecked
      };
      this.loading = true;
      axios
        .get("/goods/list", {
          params: param
        })
        .then(res => {
          this.loading = false;
          if (flag) {
            this.goodslist = this.goodslist.concat(res.data.result.list);
            if (res.data.result.count == 0) {
              this.busy = true;
            } else {
              this.busy = false;
            }
          } else {
            this.goodslist = res.data.result.list;
            this.busy = false;
          }
        });
    },
    showfilterpop() {
      this.filterby = true;
      this.overlayflag = true;
    },
    sortGoods() {
      this.sortflag = !this.sortflag;
      this.page = 1;
      this.getgoodslist();
    },
    loadMore() {
      this.busy = true;
      setTimeout(() => {
        this.page++;
        this.getgoodslist(true);
      }, 500);
    },
    setpricefilter(index) {
      this.pricechecked = index;
      this.closepop();
      this.getgoodslist();
      this.page = 1;
    },
    closepop() {
      this.filterby = false;
      this.overlayflag = false;
    },
    getmsg(res){
      if(res==1){
        this.mdShow=true;
      }else if(res==0){
        this.mdShowCart=true
      }
    },
    closeModal() {
      this.mdShow = false;
      this.mdShowCart = false;
    }
  }
};
</script>

