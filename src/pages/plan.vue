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
      <el-col>
        <el-button type="primary" icon="el-icon-plus" @click="createPlan">新增生产计划</el-button>
      </el-col>
      <el-table :data=tableData stripe style="width: 100%">
        <el-table-column prop></el-table-column>
      </el-table>
    </div>
    
  </div>
  
</template>

<script>
import { dateFormat, dateTimeFormat } from '@/utils/common';
export default {
  name: 'plan',
  data() {
    return {
      searchForm: {
        date: dateFormat(new Date())
      },
      tableData: []
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
    clickSearch() {
      console.log(this.searchForm.date);
    },
    getTableData() {

    },
    createPlan() {

    }
  }
}
</script>

<style lang="scss" scoped>
  .search_bar {
    background-color: #fff;
    padding: 10px 20px;
    margin-top: 10px;
    .el-form-item {
      margin-bottom: 0;
    }
  }
</style>

