<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="crumb">
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>带材质量统计</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form class="search_bar" :model="searchForm" :inline="true">
      <el-form-item label="喷带日期：">
        <el-date-picker
          v-model="searchForm.date"
          type="daterange"
          :default-time="['00:00:00', '23:59:59']"
          :clearable="false"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="材质：">
        <el-select
          v-model="searchForm.ribbonTypeNames"
          placeholder="请选择"
          multiple
          collapse-tags
        >
          <el-option
            v-for="item in ribbonTypeList"
            :key="item.ribbonTypeId"
            :value="item.ribbonTypeName"
            :label="item.ribbonTypeName"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="规格：">
        <el-select
          v-model="searchForm.ribbonWidths"
          placeholder="请选择"
          multiple
          collapse-tags
        >
          <el-option
            v-for="item in ribbonWidthList"
            :key="item.ribbonWidthId"
            :label="item.ribbonWidth"
            :value="item.ribbonWidth"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="clickSearch"
          >搜索</el-button
        >
        <el-button type="primary" icon="el-icon-refresh" @click="reset"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <div class="main_bd">
      <el-tabs
        type="border-card"
        v-model="searchForm.queryType"
        @tab-click="tabsClick"
      >
        <el-tab-pane label="喷带手" name="byCaster">
          <el-table
            :data="tableDataByCaster"
            stripe
            border
            style="width:100%"
            v-loading="loading"
          >
            <el-table-column
              prop="caster"
              label="喷带手"
              align="center"
              width="70px"
            ></el-table-column>
            <el-table-column
              prop="totalHeatNum"
              label="生产炉次"
              align="center"
              width="100px"
            ></el-table-column>
            <el-table-column
              prop="alloyTotalWeight"
              label="生产投入/kg"
              align="center"
              width="100px"
            ></el-table-column>
            <el-table-column
              prop="totalOutput"
              label="综合产出/kg"
              align="center"
              width="100px"
            ></el-table-column>
            <el-table-column
              prop="rawWeight"
              label="大盘毛重/kg"
              align="center"
              width="110px"
            ></el-table-column>
            <el-table-column
              prop="perFurnaceLoss"
              label="单炉损耗/kg"
              align="center"
              width="100px"
            ></el-table-column>
            <el-table-column
              prop="nozzleNum"
              label="总喷嘴数"
              align="center"
              width="100px"
            ></el-table-column>
            <el-table-column
              prop="perFurnaceNozzleNum"
              label="单炉喷嘴数"
              align="center"
              width="100px"
            ></el-table-column>
            <el-table-column
              prop="uselessRibbonWeight"
              label="废带重量/kg"
              align="center"
              width="80px"
            ></el-table-column>
            <el-table-column
              prop="meltOutWeight"
              label="放钢重量/kg"
              align="center"
              width="100px"
            ></el-table-column>
            <el-table-column
              prop="furnaceNumPerDay"
              label="日均炉次/kg"
              align="center"
              width="100px"
            ></el-table-column>
            <el-table-column
              prop="rawWeightPerDay"
              label="日均毛重/kg"
              align="center"
              width="100px"
            ></el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="机组" name="byCastId">
          <el-table
            :data="tableDataByCastId"
            stripe
            border
            style="width:100%"
            v-loading="loading"
          >
            <el-table-column
              prop="caster"
              label="喷带手"
              align="center"
              width="70px"
            ></el-table-column>
            <el-table-column
              prop="totalHeatNum"
              label="生产炉次"
              align="center"
              width="100px"
            ></el-table-column>
            <el-table-column
              prop="alloyTotalWeight"
              label="生产投入/kg"
              align="center"
              width="100px"
            ></el-table-column>
            <el-table-column
              prop="totalOutput"
              label="综合产出/kg"
              align="center"
              width="100px"
            ></el-table-column>
            <el-table-column
              prop="rawWeight"
              label="大盘毛重/kg"
              align="center"
              width="110px"
            ></el-table-column>
            <el-table-column
              prop="perFurnaceLoss"
              label="单炉损耗/kg"
              align="center"
              width="100px"
            ></el-table-column>
            <el-table-column
              prop="nozzleNum"
              label="总喷嘴数"
              align="center"
              width="100px"
            ></el-table-column>
            <el-table-column
              prop="perFurnaceNozzleNum"
              label="单炉喷嘴数"
              align="center"
              width="100px"
            ></el-table-column>
            <el-table-column
              prop="uselessRibbonWeight"
              label="废带重量/kg"
              align="center"
              width="80px"
            ></el-table-column>
            <el-table-column
              prop="meltOutWeight"
              label="放钢重量/kg"
              align="center"
              width="100px"
            ></el-table-column>
            <el-table-column
              prop="furnaceNumPerDay"
              label="日均炉次/kg"
              align="center"
              width="100px"
            ></el-table-column>
            <el-table-column
              prop="rawWeightPerDay"
              label="日均毛重/kg"
              align="center"
              width="100px"
            ></el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import urlmap from "@/utils/urlmap";
import { defaultDateRange } from "@/utils/const";
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      searchForm: {
        queryType: "byCaster",
        date: [...defaultDateRange],
        ribbonTypeNames: [],
        ribbonWidths: []
      },
      loading: false,
      tableDataByCaster: [],
      tableDataByCastId: []
    };
  },
  computed: {
    ...mapState(["ribbonTypeList", "ribbonWidthList"])
  },
  async created() {
    this.getRibbonTypeList();
    this.getRibbonWidthList();
    this.getTableData();
  },
  methods: {
    ...mapActions(["getRibbonTypeList", "getRibbonWidthList"]),
    clickSearch() {
      this.getTableData();
    },
    reset() {
      this.searchForm = {
        queryType: this.searchForm.queryType,
        date: [...defaultDateRange],
        ribbonTypeNames: [],
        ribbonWidths: []
      };
      this.getTableData();
    },
    getTableData(params = {}) {
      const _params = {
        queryType: this.searchForm.queryType,
        startTime: this.searchForm.date[0],
        endTime: this.searchForm.date[1],
        ribbonTypeNameJson: JSON.stringify(this.searchForm.ribbonTypeNames),
        ribbonWidthJson: JSON.stringify(this.searchForm.ribbonWidths)
      };
      Object.assign(params, _params);
      if (this.loading) {
        return;
      }
      this.loading = true;
      if (this.searchForm.queryType === "byCaster") {
        this.$http("get", urlmap.queryStatisticsRatio, params)
          .then(data => {
            this.tableDataByCaster = data.list;
          })
          .catch(err => {
            console.log(err);
          })
          .finally(() => {
            this.loading = false;
          });
      } else if (this.searchForm.queryType === "byCastId") {
        this.$http("get", urlmap.queryStatisticsRatio, params)
          .then(data => {
            this.tableDataByCastId = data.list;
          })
          .catch(err => {
            console.log(err);
          })
          .finally(() => {
            this.loading = false;
          });
      }
    },
    tabsClick(tab, event) {
      this.searchForm.queryType = tab.name;
      this.getTableData();
    }
  }
};
</script>
<style lang="scss" scoped></style>
