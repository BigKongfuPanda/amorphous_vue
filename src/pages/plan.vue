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
        <el-table-column label="带厚(μm)" align="center" width="80px">
          <template slot-scope="scope">
            <span class="text_danger">{{scope.row.thickness}}</span>
          </template>
        </el-table-column>
        <el-table-column label="叠片" align="center" width="80px">
          <template slot-scope="scope">
            <span class="text_danger">{{scope.row.laminationFactor}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="furnace" label="制带炉号" align="center" width="160px"></el-table-column>
        <el-table-column prop="alloyWeight" label="单炉投入" align="center" width="80px"></el-table-column>
        <el-table-column prop="castTime" label="制带时间" align="center" width="100px"></el-table-column>
        <el-table-column prop="rawWeight" label="大盘毛重" align="center" width="80px"></el-table-column>
        <el-table-column label="操作" align="center" width="150px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="edit(scope.row)">修改</el-button>
            <el-button size="mini" type="danger" @click="del(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    
  </div>
  
</template>

<script>
import { dateFormat, dateTimeFormat } from '@/utils/common';
import urlmap from '@/utils/urlmap';
export default {
  name: 'plan',
  data() {
    return {
      searchForm: {
        date: dateFormat(new Date())
      },
      tableData: [
        {
          "date": "2018-12-12",
          "castId": 6, // 机组编号
          "team": "早",// 班组
          "taskOrder": "备库", //任务单号
          "ribbonTypeId": 1,
          "ribbonTypeName": "1k107B",
          "ribbonWidth": 30, //带宽 mm 
          "client": "备库", //客户
          "thickness": "23-24", //带材厚度要求
          "laminationFactor": "> 0.80", // 叠片系数的要求
          "furnace": "06-20181120-01/01", //制带炉号
          "alloyWeight": 230, // 单炉投入重量
          "castTime": "8:00-10:00", //计划喷带时间
          "rawWeight": 180, // 实际产出的大盘毛重
          "remark": "计划喷带12炉，如果有富余时间喷带按照当天最后一炉规定的要求生产。",
          "fileNumber": "QEHAT-FJ/D-C03-036-C/0" //文件编号
        }
      ],
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
    clickSearch() {
      this.getTableData();
    },
    getTableData() {
      const params = {
        castId: 6,
        date: this.searchForm.date
      };
      this.$http('get', urlmap.queryPlan, params).then(res => {
        const data = res.data;
        if(data.status != 0) {
          return this.$alert(data.message, { confirmButtonText: '确定' });
        }
        this.tableData = data.data.list;
      }).catch((err) => {
        this.$alert(err.message, { confirmButtonText: '确定' });
      }).finally(() => {
        this.loading = false;
      });
    },
    createPlan() {

    },
    edit() {

    },
    del(row) {
      const furnace = row.furnace;
      this.$confirm(`确定要删除 ${furnace} 吗？`, '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'})
      .then(() => {
        this.$http('delete', urlmap.delPlan, {furnace}).then(res => {
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
  .search_bar {
    background-color: #fff;
    padding: 10px 20px;
    margin-top: 10px;
    .el-form-item {
      margin-bottom: 0;
    }
  }
</style>

