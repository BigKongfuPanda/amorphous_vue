<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="crumb">
      <el-breadcrumb-item>喷带记录</el-breadcrumb-item>
      <el-breadcrumb-item>{{castId}}号机组</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form class="search_bar" :model="searchForm" :inline="true">
      <el-form-item label="喷带日期：">
        <el-date-picker
          v-model="searchForm.date"
          type="daterange"
          :default-time="['00:00:00', '23:59:59']"
          :clearable="false"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="喷带手：">
        <el-input v-model="searchForm.caster" placeholder="请输入喷带手姓名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="clickSearch">搜索</el-button>
        <el-button type="primary" icon="el-icon-refresh" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import urlmap from '@/utils/urlmap';

export default {
  name: 'cast',
  data () {
    return {
      castId: 6,
      searchForm: {
        caster: '',
        date: []
      },
      loading: false,
      tableData: [],
      dialogVisible: false,
      formType: 'create',
      rowData: {},
      pageConfig: {
        total: 1,
        current: 1,
        pageSize: 10
      }
    }
  },
  // 动态路由匹配
  beforeRouteUpdate(to, from, next) {
    this.castId = to.params.castId;
    this.getTableData();
    next();
  },
  created () {
    this.getTableData();    
  },
  methods: {
    dateFormat(row, column) {
      return dateFormat(row.createdAt);
    },
    dateTimeFormat(row, column) {
      return dateTimeFormat(row.updatedAt);
    },
    clickSearch() {
      // 重置当前页码为1
      const params = {
        current: 1
      };
      this.pageConfig.current = 1;
      this.getTableData(params);
    },
    reset() {
      this.searchForm = { caster: '', date: [] };
      const params = {
        current: 1
      };
      this.pageConfig.current = 1;
      this.getTableData(params);
    },
    getTableData(params = {}) {
      const _params = {
        castId: this.castId,
        startTime: this.searchForm.date[0],
        endTime: this.searchForm.date[1],
        caster: this.searchForm.caster
      };
      Object.assign(params, _params);
      this.$http('get', urlmap.queryCast, params).then(data => {
        this.pageConfig.total = data.count;
        this.tableData = data.list;
      }).catch((err) => {
        console.log(err);
      }).finally(() => {
        this.loading = false;
      });
    },
    add() {
      this.dialogVisible = true;
      this.formType = 'add';
    },
    edit(row) {
      this.rowData = row;
      this.dialogVisible = true;
      this.formType = 'edit';
    },
    del(row) {
      const { _id, furnace } = row;
      this.$confirm(`确定删除 ${furnace} 吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http('delete', urlmap.delCast, {_id}).then(data => {
          this.getTableData();
        }).catch(error => {
          console.log(error);
        });
      }).catch(() => {});
    },
    closeHandler() {
      this.dialogVisible = false;
    },
    submitHandler() {
      this.dialogVisible = false;
      this.getTableData();
    },
    handleCurrentChange(val) {
      const params = {
        current: val
      };
      this.getTableData(params);
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

