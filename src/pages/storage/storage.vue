<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="crumb">
      <el-breadcrumb-item>库存记录</el-breadcrumb-item>
      <el-breadcrumb-item>{{castId}}号机组</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form class="search_bar" :model="searchForm" :inline="true">
      <el-form-item label="入库日期：">
        <el-date-picker
          v-model="searchForm.date"
          type="daterange"
          :default-time="['00:00:00', '23:59:59']"
          :clearable="false"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="炉号：">
        <el-input v-model="searchForm.furnace" placeholder="请输入炉号"></el-input>
      </el-form-item>
      <el-form-item label="材质：">
        <el-select v-model="searchForm.ribbonTypeNames" placeholder="请选择" multiple collapse-tags>
          <el-option v-for="item in ribbonTypeList" :key="item.ribbonTypeId" :value="item.ribbonTypeName" :label="item.ribbonTypeName"></el-option>
        </el-select>
      </el-form-item>
      
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="clickSearch">搜索</el-button>
        <el-button type="primary" icon="el-icon-refresh" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="main_bd">
      <!-- <el-col class="table_hd">
        <el-button type="primary" icon="el-icon-plus" @click="add">创建检测记录</el-button>
      </el-col> -->
      <el-table :data="tableData" stripe border style="width:100%" v-loading="loading"> 
        <el-table-column prop="inStoreDate" label="入库日期" align="center" :formatter="dateFormat" width="110px"></el-table-column>
        <el-table-column prop="furnace" label="炉号" align="center" width="170px" fixed></el-table-column>
        <el-table-column prop="coilNumber" label="盘号" align="center" width="50px" fixed></el-table-column>
        <el-table-column prop="ribbonTypeName" label="材质" align="center" width="70px"></el-table-column>
        <el-table-column prop="ribbonWidth" label="规格" align="center" width="50px"></el-table-column>
        <el-table-column prop="ribbenTotalLevel" label="综合级别" align="center" width="90px"></el-table-column>
        <el-table-column prop="ribbenThicknessLevel" label="带厚级别" align="center" width="90px"></el-table-column>
        <el-table-column prop="coilWeight" label="毛重" align="center" width="70px"></el-table-column>
        <el-table-column prop="coilNetWeight" label="净重" align="center" width="70px"></el-table-column>
        <el-table-column prop="outStoreDate" label="出库日期" align="center" :formatter="dateFormat" width="110px"></el-table-column>
        <el-table-column prop="takeBy" label="实际去向" align="center" width="100px">
          <template slot-scope="scope">
            <div v-if="scope.row.isEditing === false">
              {{ scope.row.takeBy }}
            </div>
            <div v-else>
              <el-select v-model="scope.row.takeBy" placeholder="" size="mini">
                <el-option label="辊剪" value="辊剪"></el-option>
                <el-option label="顺义" value="顺义"></el-option>
                <el-option label="卷绕" value="卷绕"></el-option>
                <el-option label="固安" value="固安"></el-option>
                <el-option label="发货" value="发货"></el-option>
                <el-option label="回炉/置换" value="回炉/置换"></el-option>
                <el-option label="粉末厂" value="粉末厂"></el-option>
              </el-select>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="remainWeight" label="结存" align="center" width="90px"></el-table-column>
        <el-table-column prop="place" label="仓位" align="center" width="100px">
          <template slot-scope="scope">
            <div v-if="scope.row.isEditing === false">
              {{ scope.row.place }}
            </div>
            <div v-else>
              <el-input size="mini" v-model="scope.row.place"></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="clients" label="检测判定去向" align="center" width="120px" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="shipRemark" label="发货备注" align="center" width="100px" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <div v-if="scope.row.isEditing === false">
              {{ scope.row.shipRemark }}
            </div>
            <div v-else>
              <el-input size="mini" v-model="scope.row.shipRemark"></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="150px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="edit(scope.row)" v-if="scope.row.isEditing === false">修改</el-button>
            <el-button size="mini" type="success" @click="save(scope.row)" v-else>保存</el-button>
            <el-button size="mini" type="danger" @click="del(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="total,prev,pager,next"
        :total="pageConfig.total"
        :current-page.sync="pageConfig.current"
        :page-size="pageConfig.pageSize"
        @current-change="handleCurrentChange"></el-pagination>
    </div>
  </div>
</template>

<script>
import urlmap from '@/utils/urlmap';
import { dateFormat } from '@/utils/common';
import { mapState, mapActions } from 'vuex';

export default {
  name: 'melt',
  data () {
    return {
      castId: 6,
      searchForm: {
        caster: '',
        furnace: '',
        ribbonTypeNames: [],
        date: []
      },
      loading: false,
      tableData: [],
      pageConfig: {
        total: 1,
        current: 1,
        pageSize: 10
      }
    }
  },
  computed: {
    ...mapState([
      'ribbonTypeList'
    ])
  },
  // 动态路由匹配
  beforeRouteUpdate(to, from, next) {
    this.castId = to.params.castId;
    this.getTableData();
    next();
  },
  async created () {
    await this.getRibbonTypeList();
    this.getTableData();
  },
  methods: {
    ...mapActions([
      'getRibbonTypeList'
    ]),
    dateFormat(row, column) {
      return dateFormat(row.inStoreDate);
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
      this.searchForm = { caster: '', furnace: '', date: [], ribbonTypeNames: [] };
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
        caster: this.searchForm.caster,
        furnace: this.searchForm.furnace,
        ribbonTypeNameJson: JSON.stringify(this.searchForm.ribbonTypeNames)
      };
      Object.assign(params, _params);
      this.$http('get', urlmap.queryMeasure, params).then(data => {
        this.pageConfig.total = data.count;
        data.list && data.list.forEach(item => {
          item.isEditing = false;
        });
        this.tableData = data.list && data.list.filter(item => {
          return item.isStored === '是';
        });
      }).catch((err) => {
        console.log(err);
      }).finally(() => {
        this.loading = false;
      });
    },
    edit(row) {
      row.isEditing = true;
    },
    del(row) {
      const { _id, furnace, coilNumber } = row;
      this.$confirm(`确定删除 ${furnace} 的第 ${coilNumber} 盘吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 库房测的删除操作并非真正的删除数据，而是将当前带材的入库状态改为 否
        row.isStored = '否';
        this.$http('PUT', urlmap.updateMeasure, row).then(data => {
          this.getTableData();
        }).catch(error => {
          console.log(error);
        });
      }).catch(() => {});
    },
    save(row) {
      row.isEditing = false;
      // this.pageConfig.current = 1;
      // this.getTableData();
      
      // 计算结存：当实际去向确定的时候，结余为 0
      if (row.takeBy) {
        row.remainWeight = 0;
      }
      
      // 发送请求，更新当前的数据
      this.$http('PUT', urlmap.updateMeasure, row).then(data => {

      }).catch(error => {
        console.log(error);
      });
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