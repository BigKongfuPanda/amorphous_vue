<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="crumb">
      <el-breadcrumb-item>账号管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="main_bd">
      <el-col class="table_hd">
        <el-button type="primary" icon="el-icon-plus" @click="createUser">新增用户</el-button>
      </el-col>
      <el-table :data="tableData" stripe border style="width:100%" v-loading="loading">
        <el-table-column type="index" label="序号" align="center" width="100"></el-table-column>
        <el-table-column prop="username" label="账号" align="center"></el-table-column>
        <el-table-column prop="password" label="密码" align="center"></el-table-column>
        <el-table-column prop="roleId" label="角色" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.roleId === 1">厂长</span>
            <span v-if="scope.row.roleId === 2">生产计划</span>
            <span v-if="scope.row.roleId === 3">普通管理员</span>
            <span v-if="scope.row.roleId === 15">重卷组长</span>
            <span v-if="scope.row.roleId === 4">重卷</span>
            <span v-if="scope.row.roleId === 5">检测</span>
            <span v-if="scope.row.roleId === 6">库房</span>
            <span v-if="scope.row.roleId === 7">6号机组-喷带</span>
            <span v-if="scope.row.roleId === 8">6号机组-化钢</span>
            <span v-if="scope.row.roleId === 9">7号机组-喷带</span>
            <span v-if="scope.row.roleId === 10">7号机组-化钢</span>
            <span v-if="scope.row.roleId === 11">8号机组-喷带</span>
            <span v-if="scope.row.roleId === 12">8号机组-化钢</span>
            <span v-if="scope.row.roleId === 13">9号机组-喷带</span>
            <span v-if="scope.row.roleId === 14">9号机组-化钢</span>
          </template>
        </el-table-column>
        <el-table-column prop="adminname" label="姓名" align="center"></el-table-column>
        <el-table-column prop="createTime" label="注册时间" align="center" width="170px"></el-table-column>
        <el-table-column prop="loginTime" label="最后登录时间" align="center" width="170px"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="delUser(scope.row)">删除账户</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <dialog-form
      v-if="dialogVisible"
      :dialogData="{ formType, dialogVisible, rowData}"
      @close="closeHandler"
      @submit="submitHandler"
    ></dialog-form>
  </div>
</template>

<script>
import dialogForm from "./components/dialogForm";
import urlmap from "@/utils/urlmap";

export default {
  name: "user",
  components: {
    dialogForm
  },
  data() {
    return {
      dialogVisible: false,
      formType: "create",
      rowData: {},
      tableData: [],
      loading: true
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    getUserList() {
      this.$http("GET", urlmap.queryUser, { roleId: 1 })
        .then(data => {
          this.tableData = data.list;
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    createUser() {
      this.dialogVisible = true;
      this.formType = "create";
    },
    delUser(row) {
      const { username, adminname } = row;
      this.$confirm(`删除后数据无法恢复，确定要删除 ${adminname}-${username} 吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http("delete", urlmap.delUser, { username })
            .then(data => {
              this.getUserList();
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(() => {});
    },
    closeHandler() {
      this.dialogVisible = false;
    },
    submitHandler() {
      this.dialogVisible = false;
      this.getUserList();
    }
  }
};
</script>

<style lang="scss" scoped>
</style>


