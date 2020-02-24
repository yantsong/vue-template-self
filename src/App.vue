
<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import {getSurgeStockStocks} from '@/services/flash'
import {homeJinri} from '@/services/api'
export default {
  name: 'App',
  created () {
    homeJinri().then(
      res => {
        console.log(res)
      }
    )
    getSurgeStockStocks().then(
      res => {
        console.log(res, 'res')
      }
    )
  }
}
</script>

<style lang="scss">
// @import url('./style/index.scss');
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
img {
  content: normal !important;
}
</style>
