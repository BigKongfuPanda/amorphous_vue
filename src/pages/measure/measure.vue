<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="crumb">
      <el-breadcrumb-item>检测记录</el-breadcrumb-item>
      <el-breadcrumb-item>{{castId}}号机组</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form class="search_bar" :model="searchForm" :inline="true">
      <el-form-item label="生产日期：">
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
      <el-form-item label="炉号：">
        <el-input v-model="searchForm.furnace" placeholder="请输入炉号"></el-input>
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
        <el-table-column prop="furnace" label="炉号" align="center" width="170px"></el-table-column>
        <el-table-column prop="ribbonTypeName" label="材质" align="center" width="70px"></el-table-column>
        <el-table-column prop="ribbonWidth" label="规格" align="center" width="50px"></el-table-column>
        <el-table-column prop="castDate" label="生产日期" align="center" :formatter="dateFormat" width="110px"></el-table-column>
        <el-table-column prop="caster" label="喷带手" align="center" width="70px"></el-table-column>
        <el-table-column prop="coilNumber" label="盘号" align="center" width="50px"></el-table-column>
        <el-table-column prop="diameter" label="外径(mm)" align="center" width="90px"></el-table-column>
        <el-table-column prop="coilWeight" label="重量(kg)" align="center" width="90px"></el-table-column>
        <el-table-column prop="laminationFactor" label="叠片系数" align="center" width="80px"></el-table-column>
        <el-table-column prop="laminationLevel" label="叠片等级" align="center" width="80px"></el-table-column>
        <el-table-column prop="realRibbonWidth" label="实际带宽" align="center" width="80px"></el-table-column>
        <el-table-column prop="ribbenThickness1" label="带厚1(μm)" align="center" width="90px"></el-table-column>
        <el-table-column prop="ribbenThickness2" label="带厚2(μm)" align="center" width="90px"></el-table-column>
        <el-table-column prop="ribbenThickness3" label="带厚3(μm)" align="center" width="90px"></el-table-column>
        <el-table-column prop="ribbenThickness4" label="带厚4(μm)" align="center" width="90px"></el-table-column>
        <el-table-column prop="ribbenThickness5" label="带厚5(μm)" align="center" width="90px"></el-table-column>
        <el-table-column prop="ribbenThickness6" label="带厚6(μm)" align="center" width="90px"></el-table-column>
        <el-table-column prop="ribbenThickness7" label="带厚7(μm)" align="center" width="90px"></el-table-column>
        <el-table-column prop="ribbenThickness8" label="带厚8(μm)" align="center" width="90px"></el-table-column>
        <el-table-column prop="ribbenThickness9" label="带厚9(μm)" align="center" width="90px"></el-table-column>
        <el-table-column prop="ribbenThicknessDeviation" label="厚度偏差(μm)" align="center" width="110px"></el-table-column>
        <el-table-column prop="ribbenThickness" label="平均厚度(μm)" align="center" width="110px"></el-table-column>
        <el-table-column prop="ribbenThicknessLevel" label="厚度级别" align="center" width="90px"></el-table-column>
        <el-table-column prop="ribbenToughness" label="韧性" align="center" width="90px"></el-table-column>
        <el-table-column prop="ribbenToughnessLevel" label="韧性等级" align="center" width="90px"></el-table-column>
        <el-table-column prop="appearence" label="外观" align="center" width="90px"></el-table-column>
        <el-table-column prop="appearenceLevel" label="外观等级" align="center" width="90px"></el-table-column>
        <el-table-column prop="ribbenTotalLevel" label="综合级别" align="center" width="90px"></el-table-column>
        <el-table-column prop="storageRule" label="入库规则" align="center" width="90px" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="isStored" label="是否入库" align="center" width="90px"></el-table-column>
        <el-table-column prop="clients" label="去向" align="center" width="90px" :show-overflow-tooltip="true"></el-table-column>
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

export default {
  name: 'melt',
  data () {
    return {
      castId: 6,
      searchForm: {
        caster: '',
        furnace: '',
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
      return dateFormat(row.castDate);
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
      this.searchForm = { caster: '', furnace: '', date: [] };
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
        furnace: this.searchForm.furnace
      };
      Object.assign(params, _params);
      this.$http('get', urlmap.queryMeasure, params).then(data => {
        this.pageConfig.total = data.count;
        data.list && data.list.forEach(item => {
          item.isEditing = false;
        });
        this.tableData = data.list;
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
      const { _id, furnace } = row;
      this.$confirm(`确定删除 ${furnace} 吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http('delete', urlmap.delMeasure, {_id}).then(data => {
          this.getTableData();
        }).catch(error => {
          console.log(error);
        });
      }).catch(() => {});
    },
    save(row) {
      row.isEditing = false;
      this.pageConfig.current = 1;
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