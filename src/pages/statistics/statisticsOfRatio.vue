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
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="clickSearch">搜索</el-button>
        <el-button type="primary" icon="el-icon-refresh" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="main_bd">
      <el-table :data="tableData" stripe border style="width:100%" v-loading="loading">
        <el-table-column prop="caster" label="喷带手" align="center" width="70px"></el-table-column>
        <el-table-column prop="totalHeatNum" label="炉次" align="center" width="50px"></el-table-column>
        <el-table-column prop="lowHeatNum" label="低产炉次" align="center" width="80px"></el-table-column>
        <el-table-column prop="zeroHeatNum" label="零产炉次" align="center" width="80px">
        </el-table-column>
        <el-table-column prop="lowAndZeroRatio" label="低产零产率" align="center" width="70px"></el-table-column>
        <el-table-column prop="nozzleNum" label="喷嘴数" align="center" width="70px"></el-table-column>
        <el-table-column prop="alloyTotalWeight" label="投入母合金(kg)" align="center" width="100px"></el-table-column>
        <el-table-column prop="rawWeight" label="大盘毛重(kg)" align="center" width="110px"></el-table-column>
        <el-table-column prop="netWeight" label="倒卷净重(kg)" align="center" width="110px"></el-table-column>
        <el-table-column prop="inPlanStoredWeight" label="计划内入库(kg)" align="center" width="90px"></el-table-column>
        <el-table-column prop="outPlanStoredWeight" label="计划外入库(kg)" align="center" width="90px"></el-table-column>
        <el-table-column prop="totalStoredWeight" label="入库重量(kg)" align="center" width="110px"></el-table-column>
        <el-table-column prop="unqualifiedWeight" label="不合格重量(kg)" align="center" width="80px"></el-table-column>
        <el-table-column prop="uselessRibbonWeight" label="废带(kg)" align="center" width="80px"></el-table-column>
        <el-table-column prop="effectiveMeltRatio" label="有效过钢率" align="center" width="80px"></el-table-column>
        <el-table-column prop="rollRatio" label="卷曲率" align="center" width="80px"></el-table-column>
        <el-table-column prop="qualifiedRatio" label="合格率" align="center" width="80px"></el-table-column>
        <el-table-column prop="totalRatio" label="直通率" align="center" width="80px"></el-table-column>
        <el-table-column prop="inPlanRatio" label="订单合格率" align="center" width="80px"></el-table-column>
        <el-table-column label="质量等级分布" align="center" width="110px">
          <el-table-column label="A" prop="qualityOfA"></el-table-column>
          <el-table-column label="B" prop="qualityOfB"></el-table-column>
          <el-table-column label="C" prop="qualityOfC"></el-table-column>
          <el-table-column label="D" prop="qualityOfD"></el-table-column>
          <el-table-column label="E" prop="qualityOfE"></el-table-column>
        </el-table-column>
        <el-table-column prop="qualityOfGood" label="好(kg)" align="center" width="70px"></el-table-column>
        <el-table-column prop="qualityOfFine" label="良(kg)" align="center" width="70px"></el-table-column>
        <el-table-column prop="qualityOfNormal" label="中(kg)" align="center" width="70px"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import urlmap from '@/utils/urlmap';

export default {
  data() {
    return {
      searchForm: {
        date: []
      },
      loading: false,
      tableData: []
    }
  },
  created () {
    this.getTableData();
  },
  methods: {
    clickSearch() {
      this.getTableData();
    },
    reset() {
      this.searchForm = { date: [] };
      this.getTableData(params);
    },
    getTableData(params = {}) {
      const _params = {
        startTime: this.searchForm.date[0],
        endTime: this.searchForm.date[1]
      };
      Object.assign(params, _params);
      this.$http('get', urlmap.queryStatisticsRatio, params).then(data => {
        // data.list.forEach(item => {
        //   const fromMeasure = item.fromMeasure;
        //   item.totalStoredWeight = this.calcSum(fromMeasure, 'totalStoredWeight');
        //   item.inPlanStoredWeight = this.calcSum(fromMeasure, 'inPlanStoredWeight');
        //   item.outPlanStoredWeight = this.calcSum(fromMeasure, 'outPlanStoredWeight');
        //   item.qualityOfA = this.calcSum(fromMeasure, 'qualityOfA');
        //   item.qualityOfB = this.calcSum(fromMeasure, 'qualityOfB');
        //   item.qualityOfC = this.calcSum(fromMeasure, 'qualityOfC');
        //   item.qualityOfD = this.calcSum(fromMeasure, 'qualityOfD');
        //   item.qualityOfE = this.calcSum(fromMeasure, 'qualityOfE');
        //   item.thinRibbonWeight = this.calcSum(fromMeasure, 'thinRibbonWeight');
        //   item.highFactorThinRibbonWeight = this.calcSum(fromMeasure, 'highFactorThinRibbonWeight');
        //   item.inPlanThickRibbonWeight = this.calcSum(fromMeasure, 'inPlanThickRibbonWeight');
        //   item.qualityOfGood = this.calcSum(fromMeasure, 'qualityOfGood');
        //   item.qualityOfFine = this.calcSum(fromMeasure, 'qualityOfFine');
        //   item.qualityOfNormal = this.calcSum(fromMeasure, 'qualityOfNormal');
        //   item.netWeight = this.calcSum(fromMeasure, 'coilNetWeight');
        //   item.unqualifiedWeight = item.netWeight - item.totalStoredWeight;
        // });
        data.list.forEach(item => {
          item.caster = item._id;
        });
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
    calcSum(arr, name) {
      return arr.reduce((sum, item) => {
        if (item[name] === undefined || item[name] === null) {
          item[name] = 0;
        }
        return sum + item[name];
      }, 0).toFixed(2);
    }
  }
}
</script>
<style lang="scss" scoped>

</style>


