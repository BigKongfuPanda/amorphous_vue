<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="crumb">
      <el-breadcrumb-item>生产计划</el-breadcrumb-item>
      <el-breadcrumb-item>6号机组</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form class="search_bar" :model="searchForm">
      <el-form-item label="排产日期：">
        <el-col :span="6">
          <el-form-item prop="date">
            <el-date-picker v-model="searchForm.date" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" :editable="false" :clearable="false" :picker-options="pickerOptions"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" icon="el-icon-search" @click="clickSearch">搜索</el-button>
        </el-col>
      </el-form-item>
    </el-form>
    <div class="main_bd">
      <el-col class="table_hd">
        <el-button type="primary" icon="el-icon-plus" @click="createPlan">新增生产计划</el-button>
      </el-col>
      <el-table :data=tableData stripe border style="width: 100%" v-loading="loading">
        <el-table-column prop="date" label="日期" align="center" width="100px"></el-table-column>
        <el-table-column prop="castId" label="机组" align="center" width="60px"></el-table-column>
        <el-table-column prop="team" label="班组" align="center" width="50px"></el-table-column>
        <el-table-column prop="taskOrder" label="任务单号" align="center" min-width="100px"></el-table-column>
        <el-table-column prop="ribbonTypeName" label="材质" align="center" width="80px"></el-table-column>
        <el-table-column prop="ribbonWidth" label="规格(mm)" align="center" width="90px"></el-table-column>
        <el-table-column prop="client" label="客户" align="center" width="100px"></el-table-column>
        <el-table-column label="带厚(μm)" align="center" width="90px">
          <template slot-scope="scope">
            <span class="text_danger">{{scope.row.thickness}}</span>
          </template>
        </el-table-column>
        <el-table-column label="叠片" align="center" width="80px">
          <template slot-scope="scope">
            <span class="text_danger">{{scope.row.laminationFactor}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="furnace" label="制带炉号" align="center" width="150px"></el-table-column>
        <el-table-column prop="alloyWeight" label="单炉投入" align="center" width="80px"></el-table-column>
        <el-table-column prop="castTime" label="制带时间" align="center" width="110px"></el-table-column>
        <el-table-column prop="rawWeight" label="大盘毛重" align="center" width="80px"></el-table-column>
        <el-table-column label="操作" align="center" width="150px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="editPlan(scope.row)">修改</el-button>
            <el-button size="mini" type="danger" @click="delPlan(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="table_tip">
        <p>1. 文件编号：{{tableData[0] && tableData[0].fileNumber}}</p>
        <p>2. {{tableData[0] && tableData[0].remark}}</p>
      </div>
    </div>
    <dialog-form v-if="dialogVisible" :dialogData="{ formType, dialogVisible, rowData}" @close="closeHandler" @submit="submitHandler"></dialog-form>
  </div>
</template>

<script>
import { dateFormat, dateTimeFormat } from '@/utils/common';
import urlmap from '@/utils/urlmap';
import dialogForm from './components/dialogForm';

export default {
  name: 'plan',
  components: { dialogForm },
  data() {
    return {
      searchForm: {
        date: dateFormat(new Date())
      },
      dialogVisible: false,
      formType: 'create',
      rowData: {},
      tableData: [],
      loading: true
    }
  },
  created() {
    this.getTableData();
  },
  computed: {
    pickerOptions() {
      return {
        disabledDate(time) {
          let date = new Date();
          date.setDate(date.getDate() + 1);
          return time.getTime() >= date.getTime();
        }
      }
    }
  },
  methods: {
    closeHandler() {
      this.dialogVisible = false;
    },
    submitHandler(data) {
      this.dialogVisible = false;
      this.getTableData();
    },
    clickSearch() {
      this.getTableData();
    },
    getTableData() {
      const params = {
        castId: 6,
        date: this.searchForm.date
      };
      this.$http('get', urlmap.queryPlan, params).then(data => {
        this.tableData = data.list;
      }).catch((err) => {
        console.log(err);
      }).finally(() => {
        this.loading = false;
      });
    },
    createPlan() {
      this.formType = 'create';
      this.dialogVisible = true;
    },
    editPlan(row) {
      this.dialogVisible = true;
      this.rowData = row;
      this.formType = 'edit';
    },
    delPlan(row) {
      const { _id, furnace } = row;
      this.$confirm(`确定要删除 ${furnace} 吗？`, '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'})
      .then(() => {
        this.$http('delete', urlmap.delPlan, {_id}).then(res => {
          const data = res.data;
          if(data.status != 0) {
            return this.$message({
              message: '删除失败',
              type: 'error'
            });
          }
          this.$message({
            message: '删除成功',
            type: 'success'
          });
          this.getTableData();
        }).catch(err => {
          this.$alert(err.message, { confirmButtonText: '确定' });
        });
      })
      .catch(() => {});
    }
  }
}
</script>

<style lang="scss" scoped>
  
</style>

