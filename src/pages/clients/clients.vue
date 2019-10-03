<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="crumb">
      <el-breadcrumb-item>客户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="main_bd">
      <el-col class="table_hd">
        <el-button type="primary" icon="el-icon-plus" @click="add">新增客户</el-button>
      </el-col>
      <el-table :data="clientsList" stripe border style="width:100%" v-loading="loading">
        <el-table-column type="index" label="序号" align="center" width="200"></el-table-column>
        <el-table-column prop="client" label="客户" align="center"></el-table-column>
        <el-table-column prop="isFlat" label="是否必须平整" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.isFlat === 1 ? '是' : '否'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="edit(scope.row)">修改</el-button>
            <el-button size="mini" type="danger" @click="del(scope.row)">删除</el-button>
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
import { mapState, mapActions } from "vuex";
import dialogForm from "./components/dialogForm";
import urlmap from "@/utils/urlmap";

export default {
  name: "ribbon",
  components: {
    dialogForm
  },
  data() {
    return {
      dialogVisible: false,
      formType: "create",
      rowData: {},
      tableData: [],
      loading: false
    };
  },
  computed: {
    ...mapState(["clientsList"])
  },
  created() {
    this.getClientsList();
  },
  methods: {
    ...mapActions(["getClientsList"]),
    add() {
      this.dialogVisible = true;
      this.formType = "create";
    },
    edit(row) {
      this.dialogVisible = true;
      this.formType = "edit";
      this.rowData = row;
    },
    del(row) {
      const { clientsId, client } = row;
      this.$confirm(`删除后数据无法恢复，确定要删除 ${client} 吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http("delete", urlmap.delClients, { clientsId })
            .then(data => {
              this.getClientsList();
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
      this.getClientsList();
    }
  }
};
</script>

<style lang="scss" scoped>
</style>


