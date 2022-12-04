<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="crumb">
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>机组和重卷产量统计</el-breadcrumb-item>
    </el-breadcrumb>
    <Collapse>
      <el-form class="search_bar" :model="searchForm" :inline="true">
        <el-form-item label="生产日期：">
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
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="clickSearch"
            >搜索</el-button
          >
          <!-- <el-button type="primary" icon="el-icon-refresh" @click="reset"
            >重置</el-button
          > -->
        </el-form-item>
      </el-form>
    </Collapse>
    <div class="main_bd">
      <el-tabs
        v-model="activeName"
        type="border-card"
        @tab-click="handleTabClick"
      >
        <el-tab-pane label="各机组炉数/母合金/大盘毛重统计" name="caster">
          <el-table
            :data="castTableData"
            stripe
            border
            show-summary
            style="width:100%"
            v-loading="loading"
          >
            <el-table-column
              prop="castId"
              label="机组"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="furnaceCount"
              label="炉数"
              align="center"
            ></el-table-column>
            <el-table-column
              label="母合金消耗/kg"
              prop="totalAlloyWeight"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="totalRawWeight"
              label="大盘毛重/kg"
              align="center"
            ></el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="重卷人员产量统计" name="roller">
          <el-table
            :data="rollerTableData"
            stripe
            border
            show-summary
            style="width:100%"
            v-loading="loading"
          >
            <el-table-column
              prop="rollerName"
              label="重卷人员"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="totalCoilNetWeight"
              label="倒卷净重/kg"
              align="center"
            ></el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import urlmap from "@/utils/urlmap";
import Collapse from "@/components/collapse.vue";
import { defaultDateRange } from "@/utils/const";

export default {
  name: "statisticsRawWeight",
  components: {
    Collapse
  },
  data() {
    return {
      searchForm: {
        date: [...defaultDateRange]
      },
      loading: false,
      rollerTableData: [],
      castTableData: [],
      activeName: "caster"
    };
  },
  watch: {
    activeName: {
      handler(val) {
        switch (val) {
          case "roller":
            this.getRollerTableData();
            break;
          case "caster":
            this.getCastTableData();
            break;
        }
      },
      immediate: true
    }
  },
  methods: {
    clickSearch() {
      switch (this.activeName) {
        case "roller":
          this.getRollerTableData();
          break;
        case "caster":
          this.getCastTableData();
          break;
      }
    },
    handleTabClick(tab) {
      if (tab.name === this.activeName) {
        return;
      }
    },
    getRollerTableData(params = {}) {
      const _params = {
        startTime: this.searchForm.date[0],
        endTime: this.searchForm.date[1]
      };
      Object.assign(params, _params);
      this.loading = true;
      this.$http("get", urlmap.queryStatisticsRollWeightByRoller, params)
        .then(data => {
          this.rollerTableData = data.list;
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getCastTableData(params = {}) {
      const _params = {
        startTime: this.searchForm.date[0],
        endTime: this.searchForm.date[1]
      };
      Object.assign(params, _params);
      this.loading = true;
      this.$http("get", urlmap.queryStatisticsRawWeightByCastId, params)
        .then(data => {
          this.castTableData = data.list;
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }
};
</script>
<style lang="scss" scoped></style>
