<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="crumb">
      <el-breadcrumb-item>生产计划</el-breadcrumb-item>
      <el-breadcrumb-item>{{castId}}号机组</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form class="search_bar" :model="searchForm" :inline="true">
      <el-form-item label="排产日期：">
        <el-date-picker v-model="searchForm.date" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" :editable="false" :clearable="false" :picker-options="pickerOptions"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="clickSearch">搜索</el-button>
      </el-form-item>
    </el-form>
    <div class="main_bd">
      <el-col class="table_hd">
        <el-button type="primary" icon="el-icon-plus" @click="createPlan" v-if="roleId === 1 || roleId === 2">新增生产计划</el-button>
        <el-button type="primary" icon="el-icon-check" @click="approve" v-if="(roleId === 1 || roleId === 2) && tableData.length > 0 && !isApproved" :disabled="roleId === 2 && tableData.length > 0 && !isApproved">待审批</el-button>
        <el-button type="primary" icon="el-icon-check" v-if="(roleId === 1 || roleId === 2) && tableData.length > 0 && isApproved" disabled>已审批</el-button>
      </el-col>
      <el-table :data=tableData stripe border style="width: 100%" v-loading="loading">
        <el-table-column prop="date" label="日期" align="center" width="110px"></el-table-column>
        <el-table-column prop="castId" label="机组" align="center" width="60px"></el-table-column>
        <el-table-column prop="team" label="班组" align="center" width="50px"></el-table-column>
        <el-table-column prop="taskOrder" label="任务单号" align="center" min-width="100px"></el-table-column>
        <el-table-column prop="ribbonTypeName" label="材质" align="center" width="80px"></el-table-column>
        <el-table-column prop="ribbonWidth" label="规格(mm)" align="center" width="90px"></el-table-column>
        <el-table-column prop="client" label="客户" align="center" width="100px"></el-table-column>
        <el-table-column label="订单要求">
          <el-table-column label="带厚(μm)" align="center" width="90px">
            <template slot-scope="scope">
              <span class="text_danger">{{scope.row.orderThickness}}</span>
            </template>
          </el-table-column>
          <el-table-column label="叠片" align="center" width="80px">
            <template slot-scope="scope">
              <span class="text_danger">{{scope.row.orderLaminationFactor}}</span>
            </template>
          </el-table-column>
          <el-table-column label="韧性" align="center" width="80px">
            <template slot-scope="scope">
              <span class="text_danger">{{scope.row.orderRibbonToughnessLevels.toString()}}</span>
            </template>
          </el-table-column>
          <el-table-column label="外观" align="center" width="80px">
            <template slot-scope="scope">
              <span class="text_danger">{{scope.row.orderAppearenceLevels.toString()}}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="计划外入库要求" v-if="roleId === 1 || roleId === 2 || roleId === 3">
          <el-table-column label="带厚(μm)" align="center" width="90px">
            <template slot-scope="scope">
              <span>{{scope.row.qualifiedThickness}}</span>
            </template>
          </el-table-column>
          <el-table-column label="叠片" align="center" width="80px">
            <template slot-scope="scope">
              <span>{{scope.row.qualifiedLaminationFactor}}</span>
            </template>
          </el-table-column>
          <el-table-column label="韧性" align="center" width="80px">
            <template slot-scope="scope">
              <span>{{scope.row.qualifiedRibbonToughnessLevels.toString()}}</span>
            </template>
          </el-table-column>
          <el-table-column label="外观" align="center" width="80px">
            <template slot-scope="scope">
              <span>{{scope.row.qualifiedAppearenceLevels.toString()}}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column prop="furnace" label="制带炉号" align="center" width="150px"></el-table-column>
        <el-table-column prop="alloyWeight" label="单炉投入" align="center" width="80px"></el-table-column>
        <el-table-column prop="castTime" label="制带时间" align="center" width="110px"></el-table-column>
        <el-table-column prop="rawWeight" label="大盘毛重" align="center" width="80px"></el-table-column>
        <el-table-column label="操作" align="center" width="150px">
          <template slot-scope="scope" v-if="roleId === 2">
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
      isApproved: false,
      dialogVisible: false,
      formType: 'create',
      rowData: {},
      tableData: [],
      loading: true,
      castId: 6,
      roleId: null
    }
  },
  // 动态路由匹配
  beforeRouteUpdate(to, from, next) {
    this.castId = to.params.castId;
    this.getTableData();
    next();
  },
  created() {
    this.castId = this.$route.params.castId;
    this.getTableData();
    this.roleId = JSON.parse(localStorage.getItem('userinfo')).roleId;
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
      if (this.formType === 'edit') {
        this.dialogVisible = false;
      }
      this.getTableData();
    },
    clickSearch() {
      this.getTableData();
    },
    getTableData() {
      const params = {
        castId: this.castId,
        date: this.searchForm.date
      };
      this.$http('get', urlmap.queryPlan, params).then(data => {
        let _list = data.list;
        // 如果数组中每一条数据的 approved === 1 都成立，则表示该计划已经审批过
        this.isApproved = _list.every(item => item.approved === 1);

        // 如果计划没有审批，则除了厂长和生产计划以外，其他角色无法看到该张计划单
        if (!this.isApproved) {
          if (this.roleId === 1 || this.roleId === 2) {
            this.tableData = _list;            
          } else {
            this.tableData = [];
          }
        } else { // 计划审核通过，则所有角色都能够看到计划单
          this.tableData = _list;
        }
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
      this.$confirm(`删除后数据无法恢复，确定要删除 ${furnace} 吗？`, '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'})
      .then(() => {
        this.$http('delete', urlmap.delPlan, {_id}).then(data => {
          this.getTableData();
        }).catch(err => {
          console.log(err);
        });
      })
      .catch(() => {});
    },
    approve() {
      this.$confirm('确定要审批吗？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'})
      .then(() => {
        const params = {
          date: this.searchForm.date,
          castId: this.castId,
          roleId: this.roleId
        };
        this.$http('PUT', urlmap.updatePlan, params).then(data => {
          this.getTableData();
        }).catch(err => {
          console.log(err);
        });
      })
      .catch(() => {});
    }
  }
}
</script>

<style lang="scss" scoped>
  
</style>

