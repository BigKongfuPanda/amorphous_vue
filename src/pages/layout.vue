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
          <router-link to="/plan/6"><el-menu-item index="1-1">6号机组</el-menu-item></router-link>
          <router-link to="/plan/7"><el-menu-item index="1-2">7号机组</el-menu-item></router-link>
          <router-link to="/plan/8"><el-menu-item index="1-3">8号机组</el-menu-item></router-link>
          <router-link to="/plan/9"><el-menu-item index="1-4">9号机组</el-menu-item></router-link>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>化钢记录</span>
          </template>
          <router-link to="/melt/6"><el-menu-item index="2-1">6号机组</el-menu-item></router-link>
          <router-link to="/melt/7"><el-menu-item index="2-2">7号机组</el-menu-item></router-link>
          <router-link to="/melt/8"><el-menu-item index="2-3">8号机组</el-menu-item></router-link>
          <router-link to="/melt/9"><el-menu-item index="2-4">9号机组</el-menu-item></router-link>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>喷带记录</span>
          </template>
          <router-link to="/cast/6"><el-menu-item index="3-1">6号机组</el-menu-item></router-link>
          <router-link to="/cast/7"><el-menu-item index="3-2">7号机组</el-menu-item></router-link>
          <router-link to="/cast/8"><el-menu-item index="3-3">8号机组</el-menu-item></router-link>
          <router-link to="/cast/9"><el-menu-item index="3-4">9号机组</el-menu-item></router-link>
        </el-submenu>
        <el-submenu index="4">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>带材牌号管理</span>
          </template>
          <router-link to="/ribbon"><el-menu-item index="4-1">带材牌号列表</el-menu-item></router-link>
        </el-submenu>
        <el-submenu index="5">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>账号管理</span>
          </template>
          <router-link to="/user"><el-menu-item index="5-1">用户列表</el-menu-item></router-link>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <div class="logo"></div>
        <div class="signout">
          <label>当前用户：<span style="margin-right: 20px">admin</span></label>
          <el-button type="primary" @click="signout" :disabled="isDisabled">退出登录</el-button>
        </div>
      </el-header>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import urlmap from '@/utils/urlmap';
import { debounce } from '@/utils/common';

export default {
  name: 'layout',
  data () {
    return {
      isDisabled: false
    }
  },
  methods: {
    signout() {
      this.isDisabled = true;
      this.$http('POST', urlmap.signout, {}).then(data => {
        this.$router.push({ path: '/login'});
      }).catch(err => {
        console.log(err);
      }).finally(() => {
        this.isDisabled = false;
      });
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
  .menu_link {
    display: inline-block;
    width: 100%;
    height: 100%;
  }
</style>