<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="crumb">
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>投入产出监控</el-breadcrumb-item>
    </el-breadcrumb>
    <Collapse>
    <el-form class="search_bar" :model="searchForm" :inline="true">
      <el-form-item label="机组：">
        <el-select v-model="searchForm.castIds" placeholder="请选择机组" multiple collapse-tags>
          <el-option :value="6" label="6号机组"></el-option>
          <el-option :value="7" label="7号机组"></el-option>
          <el-option :value="8" label="8号机组"></el-option>
          <el-option :value="9" label="9号机组"></el-option>
        </el-select>
      </el-form-item>
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
      <el-form-item label="材质：">
        <el-select v-model="searchForm.ribbonTypeNames" placeholder="请选择" multiple collapse-tags>
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
  </Collapse>
  <div class="main_bd">
      <el-table :data="tableData" stripe border style="width:100%;height: 100%;" v-loading="loading">
        <el-table-column prop="castId" label="机组" align="center" width="50px"></el-table-column>
        <el-table-column prop="furnace" label="炉号" align="center" width="120px"></el-table-column>
        <el-table-column prop="ribbonTypeName" label="材质" align="center" width="80px">
        </el-table-column>
        <el-table-column prop="ribbonWidth" label="规格" align="center" width="50px"></el-table-column>
        <el-table-column prop="averageRibbonThickness" label="平均带厚" align="center" width="80px"></el-table-column>
        <el-table-column prop="caster" label="喷带手" align="center" width="70px"></el-table-column>
        <el-table-column prop="alloyFixWeight" label="投入(kg)" align="center" width="80px"></el-table-column>
        <el-table-column prop="meltOutWeight" label="放钢(kg)" align="center" width="80px"></el-table-column>
        <el-table-column prop="uselessRibbonWeight" label="废带(kg)" align="center" width="80px"></el-table-column>
        <el-table-column prop="rawWeight" label="大盘毛重(kg)" align="center" width="80px"></el-table-column>
        <!-- <el-table-column prop="rawWeight" label="地面带(kg)" align="center" width="110px"></el-table-column> -->
        <!-- <el-table-column prop="coilNetWeight" label="废料边(kg)" align="center" width="80px"></el-table-column> -->
        <el-table-column prop="totalCoilNumbers" label="倒卷盘数" align="center" width="80px"></el-table-column>
        <el-table-column prop="coilNetWeight" label="倒卷净重(kg)" align="center" width="80px"></el-table-column>
        <el-table-column prop="unqualifiedNetWeight" label="不合格净重(kg)" align="center" width="80px"></el-table-column>
        <el-table-column prop="shouldStoredWeight" label="理论入库净重(kg)" align="center" width="80px"></el-table-column>
        <el-table-column prop="totalStoredWeight" label="实际入库净重(kg)" align="center" width="110px"></el-table-column>
        <el-table-column prop="lowStandardRibbonWeight" label="低端带材(kg)" align="center" width="110px"></el-table-column>
        <el-table-column prop="actualUnqualifiedNetWeight" label="实际不合格带材(kg)" align="center" width="110px"></el-table-column>
        <el-table-column prop="actualUnqualifiedNetWeight" label="一入一出(kg)" align="center" width="110px"></el-table-column>
        <el-table-column prop="inputOutputGap" label="投入差额(kg)" align="center" width="110px"></el-table-column>
        <el-table-column prop="inStoreGap" label="入库差额(kg)" align="center" width="110px"></el-table-column>
        <el-table-column prop="inPlanStoredWeight" label="计划内入库(kg)" align="center" width="90px"></el-table-column>
        <el-table-column prop="outPlanStoredWeight" label="计划外入库(kg)" align="center" width="90px"></el-table-column>
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
import urlmap from "@/utils/urlmap";
import Collapse from "@/components/collapse.vue";
import { mapState, mapActions } from 'vuex';
import moment from "moment";
import { dateFormat, dateTimeFormat, debounce } from "@/utils/common";

const defaultDateRange = [
  `${moment()
    .subtract(6, "days")
    .format("YYYY-MM-DD")} 00:00:00`,
  `${moment().format("YYYY-MM-DD")} 23:59:59`
];

export default {
  name: 'statisitcsInputOutput',
  components: {
    Collapse
  },
  data() {
    return {
      searchForm: {
        date: [...defaultDateRange],
        castIds: [6],
        caster: '',
        furnace: '',
        ribbonTypeNames: [],
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
  created() {
    this.getRibbonTypeList();
    this.getRibbonWidthList();
    this.getTableData()
  },
  mounted() {
    const self = this;
    self.$nextTick(() => {
      // self.tableHeight = window.innerHeight - self.$refs.table.$el.getBoundingClientRect().top;
      self.tableHeight = window.innerHeight - 80;
    });
    window.onresize = debounce(() => {
      // self.tableHeight = window.innerHeight - self.$refs.table.$el.getBoundingClientRect().top;
      self.tableHeight = window.innerHeight - 80;
    }, 1000);
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
      this.searchForm = {
        date: [...defaultDateRange],
        castIds: [],
        caster: '',
        furnace: '',
        ribbonTypeNames: [],
        ribbonWidths: []
      };
      const params = {
        current: 1
      };
      this.pageConfig.current = 1;
      this.getTableData(params);
    },
    getTableData(params = {}) {
      const _params = {
        castIdJson: JSON.stringify(this.searchForm.castIds),
        startTime: this.searchForm.date[0],
        endTime: this.searchForm.date[1],
        caster: this.searchForm.caster,
        furnace: this.searchForm.furnace,
        ribbonTypeNameJson: JSON.stringify(this.searchForm.ribbonTypeNames),
        ribbonWidthJson: JSON.stringify(this.searchForm.ribbonWidths)
      };
      Object.assign(params, _params);
      this.loading = true
      this.$http('get', urlmap.queryStatisticsInputOuput, params).then(data => {
        this.pageConfig.total = data.count;
        this.pageConfig.pageSize = data.limit;
        this.tableData = data.list;
      }).catch((err) => {
        console.log(err);
      }).finally(() => {
        this.loading = false;
      });
    },
    handleCurrentChange(val) {
      const params = {
        current: val
      };
      this.getTableData(params);
    },
  }
}
</script>
<style lang="scss" scoped></style>


