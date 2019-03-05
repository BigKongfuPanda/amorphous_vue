<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="crumb">
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>带材质量统计</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form class="search_bar" :model="searchForm" :inline="true">
      <el-form-item label="喷带手：">
        <el-input v-model="searchForm.caster" placeholder="请输入喷带手姓名"></el-input>
      </el-form-item>
      <el-form-item label="炉号：">
        <el-input v-model="searchForm.furnace" placeholder="请输入炉号"></el-input>
      </el-form-item>
      <el-form-item label="材质：">
        <el-select v-model="searchForm.ribbonTypeName" placeholder="请选择">
          <el-option v-for="item in ribbonTypeList" :key="item.ribbonTypeId" :value="item.ribbonTypeName" :label="item.ribbonTypeName"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="规格：">
        <el-select v-model="searchForm.ribbonWidths" placeholder="请选择" multiple collapse-tags>
          <el-option v-for="item in ribbonWidthList" :key="item.ribbonWidthId" :label="item.ribbonWidth" :value="item.ribbonWidth"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="clickSearch">搜索</el-button>
        <el-button type="primary" icon="el-icon-refresh" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="main_bd">
      <el-table :data="tableData" stripe border style="width:100%" v-loading="loading">
        <el-table-column prop="furnace" label="炉号" align="center" width="170px"></el-table-column>
        <el-table-column prop="ribbonTypeName" label="材质" align="center" width="80px">
        </el-table-column>
        <el-table-column prop="ribbonWidth" label="规格" align="center" width="50px"></el-table-column>
        <el-table-column prop="caster" label="喷带手" align="center" width="70px"></el-table-column>
        <el-table-column prop="rawWeight" label="大盘毛重(kg)" align="center" width="110px"></el-table-column>
        <el-table-column prop="netWeight" label="倒卷净重(kg)" align="center" width="110px"></el-table-column>
        <el-table-column prop="netWeight" label="不合格重量(kg)" align="center" width="110px"></el-table-column>
        <el-table-column prop="netWeight" label="入库重量(kg)" align="center" width="110px"></el-table-column>
        <el-table-column prop="netWeight" label="废带(kg)" align="center" width="110px"></el-table-column>
        <el-table-column prop="alloyTotalWeight" label="投入母合金(kg)" align="center" width="110px"></el-table-column>
        <el-table-column label="质量等级分布" align="center" width="110px">
          <el-table-column label="A" prop="A"></el-table-column>
          <el-table-column label="B" prop="B"></el-table-column>
          <el-table-column label="C" prop="C"></el-table-column>
          <el-table-column label="D" prop="D"></el-table-column>
          <el-table-column label="E" prop="E"></el-table-column>
        </el-table-column>
        <el-table-column prop="netWeight" label="薄带(kg)" align="center" width="110px"></el-table-column>
        <el-table-column prop="netWeight" label="高叠片薄带(kg)" align="center" width="110px"></el-table-column>
        <el-table-column prop="netWeight" label="计划内入库重量(kg)" align="center" width="110px"></el-table-column>
        <el-table-column prop="netWeight" label="计划外入库重量(kg)" align="center" width="110px"></el-table-column>
        <el-table-column prop="netWeight" label="符合订单非薄带(kg)" align="center" width="110px"></el-table-column>
        <el-table-column prop="netWeight" label="好(kg)" align="center" width="110px"></el-table-column>
        <el-table-column prop="netWeight" label="良(kg)" align="center" width="110px"></el-table-column>
        <el-table-column prop="netWeight" label="中(kg)" align="center" width="110px"></el-table-column>
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
import { mapState, mapActions } from 'vuex';

export default {
  data() {
    return {
      searchForm: {
        caster: '',
        furnace: '',
        ribbonTypeName: '',
        ribbonWidths: []
      },
      loading: false,
      tableData: [],
      pageConfig: {
        total: 1,
        current: 1,
        pageSize: 10
      },
    }
  },
  computed: {
    ...mapState([
      'ribbonTypeList', 'ribbonWidthList'
    ])
  },
  created () {
    this.getTableData();
    this.getRibbonTypeList();
    this.getRibbonWidthList();
  },
  methods: {
    ...mapActions([
      'getRibbonTypeList', 'getRibbonWidthList'
    ]),
    clickSearch() {
      // 重置当前页码为1
      const params = {
        current: 1
      };
      this.pageConfig.current = 1;
      this.getTableData(params);
    },
    reset() {
      this.searchForm = { caster: '', furnace: '', ribbonTypeName: '', ribbonWidths: [] };
      const params = {
        current: 1
      };
      this.pageConfig.current = 1;
      this.getTableData(params);
    },
    getTableData(params = {}) {
      const _params = {
        caster: this.searchForm.caster,
        furnace: this.searchForm.furnace,
        ribbonTypeName: this.searchForm.ribbonTypeName,
        ribbonWidthJson: JSON.stringify(this.searchForm.ribbonWidths)
      };
      Object.assign(params, _params);
      // this.$http('get', urlmap.queryCast, params).then(data => {
      //   this.pageConfig.total = data.count;
      //   this.tableData = data.list;
      // }).catch((err) => {
      //   console.log(err);
      // }).finally(() => {
      //   this.loading = false;
      // });
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


