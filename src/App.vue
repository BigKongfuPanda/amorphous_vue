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
  html {
    font-size: 12px;
  }
  .text_danger {
    color: #DB2023;
  }
  .text_warn {
    color: rgb(230, 162, 60);
  }
  .el-aside {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    overflow: auto;
    &::-webkit-scrollbar {
      display: none;
    }
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
    margin-bottom: 10px;
  }
  .search_bar {
    background-color: #fff;
    padding: 10px 20px;
    .el-form-item {
      margin-bottom: 0;
    }
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
  .el-table {
    th, td {
      padding: 5px 0;
      .cell {
        padding: 0;
      }
    }
  }
  .el-dialog__header {
    background: #8093FF;
    .el-dialog__title {
      color: #fff;
    }
  }
  .dialog_field {
    .el-form-item__label {
      width: 100px;
    }
    .el-input {
      width: 170px;
    } 
  }
  .el-dialog__headerbtn .el-dialog__close {
    color: #fff;
    &:hover{
      color: #DB2023;
    }
  }
  .orign_field {
    width: 100%;
    // .el-form-item__content {
    //   width: 300px;
    // }
    .el-input {
      width: 100%;
    } 
  }
  .search_bar .el-form-item {
    margin: 5px 0;
  }
  .el-select {
    width: 100%;
  }
  .pull_left {
    float: left;
  }
  .pull_right {
    float: right;
  }
</style>
