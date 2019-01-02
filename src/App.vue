<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
  // @import './style/common.scss';
  .text_danger {
    color: #DB2023;
  }
  .el-submenu .el-menu-item {
    min-width: 0;
  }
  .el-menu {
    border: none;
  }
  .el-breadcrumb {
    height: 30px;
    line-height: 30px;
    background-color: #fff;
    padding: 0 20px;
  }
  .main_bd {
    background-color: #fff;
    margin-top: 10px;
    min-height: 500px;
    padding: 10px;
  }
  .table_hd {
    margin-bottom: 10px;
  }
</style>
