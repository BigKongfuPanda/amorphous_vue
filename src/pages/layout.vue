<template>
  <el-container>
    <el-aside width="180px" style="background-color: #304156;">
      <div class="aside_title"></div>
      <el-menu
        default-active="1-1"
        mode="vertical"
        :unique-opened="true"
        text-color="#fff"
        active-text-color="#ffd04b"
        background-color="#304156">
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>生产计划</span>
          </template>
          <el-menu-item index="1-1">6号机组</el-menu-item>
          <el-menu-item index="1-2">7号机组</el-menu-item>
          <el-menu-item index="1-3">8号机组</el-menu-item>
          <el-menu-item index="1-4">9号机组</el-menu-item>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>化钢记录</span>
          </template>
          <el-menu-item index="2-1">6号机组</el-menu-item>
          <el-menu-item index="2-2">7号机组</el-menu-item>
          <el-menu-item index="2-3">8号机组</el-menu-item>
          <el-menu-item index="2-4">9号机组</el-menu-item>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>喷带记录</span>
          </template>
          <el-menu-item index="3-1">6号机组</el-menu-item>
          <el-menu-item index="3-2">7号机组</el-menu-item>
          <el-menu-item index="3-3">8号机组</el-menu-item>
          <el-menu-item index="3-4">9号机组</el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <div class="logo"></div>
        <div class="signout">
          <label>当前用户：<span style="margin-right: 20px">admin</span></label>
          <el-button type="primary">退出登录</el-button>
        </div>
        
      </el-header>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'layout',
  methods: {
    handleOpen() {

    },
    handleClose() {

    }
  }
}
</script>

<style lang="scss" scoped>
  .aside_title {
    height: 60px;
  }
  .main {
    background-color: #f0f2f5;
    min-height: 650px;
  }
  .el-menu.el-menu--horizontal {
    border-bottom: none;
  }
  .logo {
    float: left;
    width: 150px;
    height: 60px;
    background: url('../assets/logo.png') no-repeat 8px center;
  }
  .signout {
    margin-top: 10px;
    float: right;
  }
</style>  


