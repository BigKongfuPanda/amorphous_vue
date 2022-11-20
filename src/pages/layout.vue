<template>
  <el-container>
    <el-aside width="auto" style="background-color: #304156">
      <div class="aside_title" @click="collapseHandler">
        <img src="../assets/outdent.png" alt v-show="!isCollapse" />
        <img src="../assets/indent.png" alt v-show="isCollapse" />
      </div>
      <el-menu
        :default-active="$route.path"
        mode="vertical"
        :unique-opened="true"
        text-color="#fff"
        active-text-color="#ffd04b"
        background-color="#304156"
        :collapse="isCollapse"
        class="el-menu-vertical"
      >
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-tickets"></i> <span>生产计划</span>
          </template>
          <router-link to="/plan/6">
            <el-menu-item index="/plan/6">6号机组</el-menu-item>
          </router-link>
          <router-link to="/plan/7">
            <el-menu-item index="/plan/7">7号机组</el-menu-item>
          </router-link>
          <router-link to="/plan/8">
            <el-menu-item index="/plan/8">8号机组</el-menu-item>
          </router-link>
          <router-link to="/plan/9">
            <el-menu-item index="/plan/9">9号机组</el-menu-item>
          </router-link>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-tickets"></i> <span>冶炼记录</span>
          </template>
          <router-link to="/melt/6">
            <el-menu-item index="/melt/6">6号机组</el-menu-item>
          </router-link>
          <router-link to="/melt/7">
            <el-menu-item index="/melt/7">7号机组</el-menu-item>
          </router-link>
          <router-link to="/melt/8">
            <el-menu-item index="/melt/8">8号机组</el-menu-item>
          </router-link>
          <router-link to="/melt/9">
            <el-menu-item index="/melt/9">9号机组</el-menu-item>
          </router-link>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title">
            <i class="el-icon-tickets"></i> <span>喷带记录</span>
          </template>
          <router-link to="/cast/6">
            <el-menu-item index="/cast/6">6号机组</el-menu-item>
          </router-link>
          <router-link to="/cast/7">
            <el-menu-item index="/cast/7">7号机组</el-menu-item>
          </router-link>
          <router-link to="/cast/8">
            <el-menu-item index="/cast/8">8号机组</el-menu-item>
          </router-link>
          <router-link to="/cast/9">
            <el-menu-item index="/cast/9">9号机组</el-menu-item>
          </router-link>
        </el-submenu>
        <el-submenu index="4">
          <template slot="title">
            <i class="el-icon-tickets"></i> <span>重卷记录</span>
          </template>
          <router-link to="/roll/6">
            <el-menu-item index="/roll/6">6号机组</el-menu-item>
          </router-link>
          <router-link to="/roll/7">
            <el-menu-item index="/roll/7">7号机组</el-menu-item>
          </router-link>
          <router-link to="/roll/8">
            <el-menu-item index="/roll/8">8号机组</el-menu-item>
          </router-link>
          <router-link to="/roll/9">
            <el-menu-item index="/roll/9">9号机组</el-menu-item>
          </router-link>
          <router-link to="/rollStatics">
            <el-menu-item index="/rollStatics">重卷重量汇总</el-menu-item>
          </router-link>
        </el-submenu>
        <el-submenu index="5">
          <template slot="title">
            <i class="el-icon-tickets"></i> <span>检测记录</span>
          </template>
          <router-link to="/measure/6">
            <el-menu-item index="/measure/6">6号机组</el-menu-item>
          </router-link>
          <router-link to="/measure/7">
            <el-menu-item index="/measure/7">7号机组</el-menu-item>
          </router-link>
          <router-link to="/measure/8">
            <el-menu-item index="/measure/8">8号机组</el-menu-item>
          </router-link>
          <router-link to="/measure/9">
            <el-menu-item index="/measure/9">9号机组</el-menu-item>
          </router-link>
          <router-link to="/measureStatics">
            <el-menu-item index="/measureStatics">合格率统计</el-menu-item>
          </router-link>
        </el-submenu>
        <el-submenu index="6" v-if="[1, 2, 3, 5, 6].includes(roleId)">
          <template slot="title">
            <i class="el-icon-tickets"></i> <span>库房记录</span>
          </template>
          <router-link to="/applyStore">
            <el-menu-item index="/applyStore">申请入库列表</el-menu-item>
          </router-link>
          <router-link to="/scanList">
            <el-menu-item index="/scanList">扫码带材列表</el-menu-item>
          </router-link>
          <!-- <router-link to="/storage/6">
            <el-menu-item index="/storage/6">6号机组</el-menu-item>
          </router-link>
          <router-link to="/storage/7">
            <el-menu-item index="/storage/7">7号机组</el-menu-item>
          </router-link>
          <router-link to="/storage/8">
            <el-menu-item index="/storage/8">8号机组</el-menu-item>
          </router-link>
          <router-link to="/storage/9">
            <el-menu-item index="/storage/9">9号机组</el-menu-item>
          </router-link> -->
          <router-link to="/storageTotal">
            <el-menu-item index="/storageTotal">库存主表</el-menu-item>
          </router-link>
        </el-submenu>
        <el-submenu index="7" v-if="[1, 2, 3, 5, 6].includes(roleId)">
          <template slot="title">
            <i class="el-icon-tickets"></i> <span>退货处理</span>
          </template>
          <router-link to="/returnTreatment">
            <el-menu-item index="/returnTreatment">退货操作</el-menu-item>
          </router-link>
          <router-link to="/returnRecord">
            <el-menu-item index="/returnRecord">退货记录</el-menu-item>
          </router-link>
        </el-submenu>
        <el-submenu
          index="8"
          v-if="roleId === 1 || roleId === 2 || roleId === 3"
        >
          <template slot="title">
            <i class="el-icon-tickets"></i> <span>数据统计</span>
          </template>
          <router-link to="/statisitcsInputOutput">
            <el-menu-item index="/statisitcsInputOutput">投入产出监控</el-menu-item>
          </router-link>
          <router-link to="/statisticsRollWeight">
            <el-menu-item index="/statisticsRollWeight">重卷产量</el-menu-item>
          </router-link>
          <!-- <router-link to="/statisticsOfRatio">
            <el-menu-item index="/statisticsOfRatio">直通率统计表</el-menu-item>
          </router-link>
          <router-link to="/statisticsQuality">
            <el-menu-item index="/statisticsQuality">带材质量统计</el-menu-item>
          </router-link>
          <router-link to="/statisticsOder">
            <el-menu-item index="/statisticsOder">订单统计表</el-menu-item>
          </router-link> -->
        </el-submenu>
        <el-submenu index="9" v-if="[1, 2, 3, 5].includes(roleId)">
          <template slot="title">
            <i class="el-icon-tickets"></i> <span>带材管理</span>
          </template>
          <router-link to="/ribbonType">
            <el-menu-item index="/ribbonType">牌号列表</el-menu-item>
          </router-link>
          <router-link to="/ribbonWidth">
            <el-menu-item index="/ribbonWidth">规格列表</el-menu-item>
          </router-link>
          <router-link to="/ribbonThicknessLevel">
            <el-menu-item index="/ribbonThicknessLevel"
              >厚度等级列表</el-menu-item
            >
          </router-link>
          <router-link to="/laminationLevel">
            <el-menu-item index="/laminationLevel">叠片等级列表</el-menu-item>
          </router-link>
          <router-link to="/ribbonToughnessLevel">
            <el-menu-item index="/ribbonToughnessLevel"
              >韧性等级列表</el-menu-item
            >
          </router-link>
          <router-link to="/appearenceLevel">
            <el-menu-item index="/appearenceLevel">外观等级列表</el-menu-item>
          </router-link>
          <router-link to="/clients">
            <el-menu-item index="/clients">客户列表</el-menu-item>
          </router-link>
          <router-link to="/linerWeight">
            <el-menu-item index="/linerWeight">内衬重量管理</el-menu-item>
          </router-link>
        </el-submenu>
        <el-submenu index="10" v-if="[1, 2, 3, 15].includes(roleId)">
          <template slot="title">
            <i class="el-icon-tickets"></i> <span>账号管理</span>
          </template>
          <router-link to="/user" v-if="[1, 2, 3].includes(roleId)">
            <el-menu-item index="/user">用户列表</el-menu-item>
          </router-link>
          <router-link to="/roller" v-if="[1, 2, 3, 15].includes(roleId)">
            <el-menu-item index="/roller">重卷人员列表</el-menu-item>
          </router-link>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-container :style="{ marginLeft: mgleft }">
      <el-header style="height: 50px">
        <div class="logo"></div>
        <div class="signout">
          <label>
            当前用户： <span style="margin-right: 20px">{{ adminname }}</span>
          </label>
          <el-button
            type="primary"
            @click="modifyPwd"
            :disabled="isDisabled"
            size="small"
            >修改密码</el-button
          >
          <el-button
            type="danger"
            @click="signout"
            :disabled="isDisabled"
            size="small"
            >退出登录</el-button
          >
        </div>
      </el-header>
      <el-main class="main"> <router-view></router-view> </el-main>
    </el-container>
    <!-- 修改密码 -->
    <el-dialog
      title="修改密码"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="closeDialog"
      :center="true"
      v-loading="loading"
      width="30%"
      element-loading-text="拼命加载中"
    >
      <el-form
        :model="formData"
        :rules="rules"
        ref="form"
        label-width="110px"
        style="width: 100%"
        @submit.native.prevent
      >
        <el-form-item label="旧密码：" prop="password">
          <el-input
            v-model="formData.password"
            placeholder="请输入旧密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码：" prop="newPassword">
          <el-input
            v-model="formData.newPassword"
            placeholder="请输入新密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认新密码：" prop="newPasswordVerify">
          <el-input
            v-model="formData.newPasswordVerify"
            placeholder="请再次输入新密码"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="submitForm">提交</el-button>
      </div>
    </el-dialog>
    <!-- 修改密码结束 -->
  </el-container>
</template>

<script>
import urlmap from "@/utils/urlmap";

export default {
  name: "layout",
  data() {
    const verifyPassword = (rule, value, callback) => {
      if (value !== this.formData.newPassword) {
        return callback(new Error("两次输入的密码不一致"));
      } else {
        callback();
      }
    };
    return {
      isCollapse: false,
      mgleft: "180px",
      isDisabled: false,
      username: "",
      adminname: "",
      roleId: null,
      loading: false,
      dialogVisible: false,
      formData: {
        password: "",
        newPassword: "",
        newPasswordVerify: ""
      },
      rules: {
        password: [
          { required: true, message: "请输入旧密码", trigger: "blur" },
          {
            min: 6,
            max: 20,
            message: "长度在 6 到 20 个字符",
            trigger: "blur"
          }
        ],
        newPassword: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          {
            min: 6,
            max: 20,
            message: "长度在 6 到 20 个字符",
            trigger: "blur"
          }
        ],
        newPasswordVerify: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          {
            min: 6,
            max: 20,
            message: "长度在 6 到 20 个字符",
            trigger: "blur"
          },
          { validator: verifyPassword, trigger: "blur" }
        ]
      }
    };
  },
  created() {
    const userinfo = JSON.parse(localStorage.getItem("userinfo"));
    this.username = userinfo.username;
    this.adminname = userinfo.adminname;
    this.roleId = userinfo.roleId;
  },
  methods: {
    collapseHandler() {
      this.isCollapse = !this.isCollapse;
      this.mgleft = this.isCollapse ? "72px" : "180px";
    },
    signout() {
      this.isDisabled = true;
      this.$http("POST", urlmap.signout, {})
        .then(data => {
          localStorage.removeItem("userinfo");
          const returnUrl = encodeURIComponent(window.location.href);
          this.$router.push({ path: "/login", query: { returnUrl } });
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          this.isDisabled = false;
        });
    },
    modifyPwd() {
      this.dialogVisible = true;
    },
    closeDialog() {
      this.dialogVisible = false;
    },
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true;
          const params = {
            username: this.username,
            password: this.formData.password,
            newPassword: this.formData.newPassword
          };
          this.$http("PUT", urlmap.updatePassword, params)
            .then(data => {
              this.dialogVisible = false;
            })
            .catch(err => {
              console.log(err);
            })
            .finally(() => {
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.el-menu-vertical:not(.el-menu--collapse) {
  width: 180px;
}
.aside_title {
  height: 50px;
  line-height: 50px;
  text-align: center;
  img {
    width: 20px;
    height: 20px;
  }
}
.main {
  background-color: #f0f2f5;
  min-height: 650px;
  padding: 10px;
}
.el-menu.el-menu--horizontal {
  border-bottom: none;
}
.logo {
  float: left;
  width: 150px;
  height: 50px;
  background: url("../assets/logo.png") no-repeat 8px center;
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
