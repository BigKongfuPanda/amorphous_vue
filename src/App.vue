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
  body,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  hr,
  p,
  blockquote,
  dl,
  dt,
  dd,
  ul,
  ol,
  li,
  pre,
  form,
  fieldset,
  legend,
  button,
  input,
  textarea,
  th,
  td {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
  }
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
  .table_tip {
    margin-top: 15px;
    text-indent: 20px;
    font-size: 14px;
    color: #606266;
    p:first-of-type {
      margin-bottom: 5px;
    }
  }
</style>
