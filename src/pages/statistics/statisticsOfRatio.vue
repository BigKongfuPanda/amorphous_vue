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
      <el-tabs type="border-card" v-model="searchForm.ratioType" @tab-click="tabsClick">
        <el-tab-pane label="喷带手" name="byCaster">
          <el-table :data="tableDataByCaster" stripe border style="width:100%" v-loading="loading">
            <el-table-column prop="caster" label="喷带手" align="center" width="70px"></el-table-column>
            <el-table-column prop="totalHeatNum" label="炉次" align="center" width="50px"></el-table-column>
            <el-table-column prop="lowHeatNum" label="低产炉次" align="center" width="80px"></el-table-column>
            <el-table-column prop="zeroHeatNum" label="零产炉次" align="center" width="80px">
            </el-table-column>
            <el-table-column prop="lowAndZeroRatio" label="低产零产率" align="center" width="70px"></el-table-column>
            <el-table-column prop="nozzleNum" label="喷嘴数" align="center" width="70px"></el-table-column>
            <el-table-column prop="alloyTotalWeight" label="投入母合金(kg)" align="center" width="100px"></el-table-column>
            <el-table-column prop="rawWeight" label="大盘毛重(kg)" align="center" width="110px"></el-table-column>
            <el-table-column prop="coilNetWeight" label="倒卷净重(kg)" align="center" width="110px"></el-table-column>
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
        </el-tab-pane>
        <el-tab-pane label="班组" name="byTeam">
          <el-table :data="tableDataByTeam" stripe border style="width:100%" v-loading="loading">
            <!-- <el-table-column prop="castId" label="机组" align="center" width="70px"></el-table-column> -->
            <el-table-column prop="team" label="班组" align="center" width="70px"></el-table-column>
            <el-table-column prop="totalHeatNum" label="炉次" align="center" width="50px"></el-table-column>
            <el-table-column prop="lowHeatNum" label="低产炉次" align="center" width="80px"></el-table-column>
            <el-table-column prop="zeroHeatNum" label="零产炉次" align="center" width="80px">
            </el-table-column>
            <el-table-column prop="lowAndZeroRatio" label="低产零产率" align="center" width="70px"></el-table-column>
            <el-table-column prop="nozzleNum" label="喷嘴数" align="center" width="70px"></el-table-column>
            <el-table-column prop="alloyTotalWeight" label="投入母合金(kg)" align="center" width="100px"></el-table-column>
            <el-table-column prop="rawWeight" label="大盘毛重(kg)" align="center" width="110px"></el-table-column>
            <el-table-column prop="coilNetWeight" label="倒卷净重(kg)" align="center" width="110px"></el-table-column>
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
        </el-tab-pane>
        <el-tab-pane label="机组" name="byCastId">
          <el-table :data="tableDataByCastId" stripe border style="width:100%" v-loading="loading">
            <el-table-column prop="castId" label="机组" align="center" width="70px"></el-table-column>
            <el-table-column prop="totalHeatNum" label="炉次" align="center" width="50px"></el-table-column>
            <el-table-column prop="lowHeatNum" label="低产炉次" align="center" width="80px"></el-table-column>
            <el-table-column prop="zeroHeatNum" label="零产炉次" align="center" width="80px">
            </el-table-column>
            <el-table-column prop="lowAndZeroRatio" label="低产零产率" align="center" width="70px"></el-table-column>
            <el-table-column prop="nozzleNum" label="喷嘴数" align="center" width="70px"></el-table-column>
            <el-table-column prop="alloyTotalWeight" label="投入母合金(kg)" align="center" width="100px"></el-table-column>
            <el-table-column prop="rawWeight" label="大盘毛重(kg)" align="center" width="110px"></el-table-column>
            <el-table-column prop="coilNetWeight" label="倒卷净重(kg)" align="center" width="110px"></el-table-column>
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
        </el-tab-pane>
      </el-tabs>
      
    </div>
  </div>
</template>

<script>
import urlmap from '@/utils/urlmap';

export default {
  data() {
    return {
      searchForm: {
        ratioType: 'byCaster',
        date: []
      },
      loading: false,
      tableDataByCaster: [],
      tableDataByTeam: [],
      tableDataByCastId: []
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
      this.searchForm = { ratioType: this.searchForm.ratioType, date: [] };
      this.getTableData();
    },
    getTableData(params = {}) {
      const _params = {
        ratioType: this.searchForm.ratioType,
        startTime: this.searchForm.date[0],
        endTime: this.searchForm.date[1]
      };
      Object.assign(params, _params);
      if (this.searchForm.ratioType === 'byCaster') {
        this.$http('get', urlmap.queryStatisticsRatio, params).then(data => {
          // const list = data.list;

          // // 第一次遍历，求出每一炉的各种重量
          // list.forEach(item => {
          //   item.caster = item._id;
          //   item.lowHeatNum = 0;
          //   item.zeroHeatNum = 0;
          //   item.uselessRibbonWeight = 0;
          //   const furnaceList = item.furnaceList;
          //   furnaceList.forEach(furnace => {
          //     // 废带重量
          //     item.uselessRibbonWeight += furnace.uselessRibbonWeight == undefined ? 0 : furnace.uselessRibbonWeight;
          //     // 低产零产率：6,8,9机组 <= 80kg，7机组 <=50，算低产
          //     if (furnace.rawWeight == 0) {
          //       item.zeroHeatNum++;
          //     }
          //     if (furnace.castId === 7) {
          //       if (furnace.rawWeight > 0 && furnace.rawWeight <= 50) {
          //         item.lowHeatNum++;
          //       }
          //     } else {
          //       if (furnace.rawWeight > 0 && furnace.rawWeight <= 80) {
          //         item.lowHeatNum++;
          //       }
          //     }
          //     item.lowAndZeroRatio = ((item.lowHeatNum + item.zeroHeatNum) * 100 / item.totalHeatNum).toFixed(2) + '%';

          //     furnace.coilNetWeight = 0;
          //     furnace.inPlanStoredWeight = 0;
          //     furnace.outPlanStoredWeight = 0;
          //     furnace.totalStoredWeight = 0;
          //     furnace.qualityOfA = 0;
          //     furnace.qualityOfB = 0;
          //     furnace.qualityOfC = 0;
          //     furnace.qualityOfD = 0;
          //     furnace.qualityOfE = 0;
          //     furnace.qualityOfGood = 0;
          //     furnace.qualityOfFine = 0;
          //     furnace.qualityOfNormal = 0;
          //     furnace.fromMeasure.forEach(measure => {
          //       furnace.coilNetWeight += measure.coilNetWeight == undefined ? 0 : measure.coilNetWeight;
          //       furnace.inPlanStoredWeight += measure.inPlanStoredWeight == undefined ? 0 : measure.inPlanStoredWeight;
          //       furnace.outPlanStoredWeight += measure.outPlanStoredWeight == undefined ? 0 : measure.outPlanStoredWeight;
          //       furnace.totalStoredWeight += measure.totalStoredWeight == undefined ? 0 : measure.totalStoredWeight;
          //       furnace.qualityOfA += measure.qualityOfA == undefined ? 0 : measure.qualityOfA;
          //       furnace.qualityOfB += measure.qualityOfB == undefined ? 0 : measure.qualityOfB;
          //       furnace.qualityOfC += measure.qualityOfC == undefined ? 0 : measure.qualityOfC;
          //       furnace.qualityOfD += measure.qualityOfD == undefined ? 0 : measure.qualityOfD;
          //       furnace.qualityOfE += measure.qualityOfE == undefined ? 0 : measure.qualityOfE;
          //       furnace.qualityOfGood += measure.qualityOfGood == undefined ? 0 : measure.qualityOfGood;
          //       furnace.qualityOfFine += measure.qualityOfFine == undefined ? 0 : measure.qualityOfFine;
          //       furnace.qualityOfNormal += measure.qualityOfNormal == undefined ? 0 : measure.qualityOfNormal;
          //     });
          //   });
          // });

          // // 第二次遍历，求出部分的结果
          // list.forEach(item => {
          //   item.coilNetWeight = 0;
          //   item.inPlanStoredWeight = 0;
          //   item.outPlanStoredWeight = 0;
          //   item.totalStoredWeight = 0;
          //   item.qualityOfA = 0;
          //   item.qualityOfB = 0;
          //   item.qualityOfC = 0;
          //   item.qualityOfD = 0;
          //   item.qualityOfE = 0;
          //   item.qualityOfGood = 0;
          //   item.qualityOfFine = 0;
          //   item.qualityOfNormal = 0;
          //   const furnaceList = item.furnaceList;
          //   furnaceList.forEach(furnace => {
          //     item.coilNetWeight += furnace.coilNetWeight;
          //     item.inPlanStoredWeight += furnace.inPlanStoredWeight;
          //     item.outPlanStoredWeight += furnace.outPlanStoredWeight;
          //     item.totalStoredWeight += furnace.totalStoredWeight;
          //     item.qualityOfA += furnace.qualityOfA;
          //     item.qualityOfB += furnace.qualityOfB;
          //     item.qualityOfC += furnace.qualityOfC;
          //     item.qualityOfD += furnace.qualityOfD;
          //     item.qualityOfE += furnace.qualityOfE;
          //     item.qualityOfGood += furnace.qualityOfGood;
          //     item.qualityOfFine += furnace.qualityOfFine;
          //     item.qualityOfNormal += furnace.qualityOfNormal;
          //   });
          // });

          // // 第三次遍历，求出合格率直通率等
          // list.forEach(item => {
          //   item.totalStoredWeight = item.totalStoredWeight.toFixed(2);
          //   // 不合格重量
          //   item.unqualifiedWeight = item.rawWeight - item.totalStoredWeight;
          //   // 有效过钢率，卷曲率，合格率，直通率
          //   item.qualifiedRatio = item.totalStoredWeight / item.rawWeight;
          //   item.effectiveMeltRatio = (item.rawWeight + item.uselessRibbonWeight) / item.alloyTotalWeight;
          //   item.rollRatio = item.rawWeight / (item.rawWeight + item.uselessRibbonWeight);
          //   item.totalRatio = ((item.effectiveMeltRatio * item.rollRatio * item.qualifiedRatio) * 100).toFixed(2) + '%';
          //   item.qualifiedRatio = (item.qualifiedRatio * 100).toFixed(2) + '%';
          //   item.effectiveMeltRatio = (item.effectiveMeltRatio * 100).toFixed(2) + '%';
          //   item.rollRatio = (item.rollRatio * 100).toFixed(2) + '%';
          //   // 订单合格率
          //   item.inPlanRatio = ((item.inPlanStoredWeight / item.rawWeight) * 100).toFixed(2) + '%';
          // });
          this.tableDataByCaster = data.list;
        }).catch((err) => {
          console.log(err);
        }).finally(() => {
          this.loading = false;
        });
      } else if(this.searchForm.ratioType === 'byTeam') {
        this.$http('get', urlmap.queryStatisticsRatio, params).then(data => {
          // const list = data.list;

          // // 第一次遍历，求出每一炉的各种重量
          // list.forEach(item => {
          //   item.team = item._id;
          //   item.lowHeatNum = 0;
          //   item.zeroHeatNum = 0;
          //   item.uselessRibbonWeight = 0;
          //   const furnaceList = item.furnaceList;
          //   furnaceList.forEach(furnace => {
          //     // 废带重量
          //     item.uselessRibbonWeight += furnace.uselessRibbonWeight == undefined ? 0 : furnace.uselessRibbonWeight;
          //     // 低产零产率：6,8,9机组 <= 80kg，7机组 <=50，算低产
          //     if (furnace.rawWeight == 0) {
          //       item.zeroHeatNum++;
          //     }
          //     if (furnace.castId === 7) {
          //       if (furnace.rawWeight > 0 && furnace.rawWeight <= 50) {
          //         item.lowHeatNum++;
          //       }
          //     } else {
          //       if (furnace.rawWeight > 0 && furnace.rawWeight <= 80) {
          //         item.lowHeatNum++;
          //       }
          //     }
          //     item.lowAndZeroRatio = ((item.lowHeatNum + item.zeroHeatNum) * 100 / item.totalHeatNum).toFixed(2) + '%';

          //     furnace.coilNetWeight = 0;
          //     furnace.inPlanStoredWeight = 0;
          //     furnace.outPlanStoredWeight = 0;
          //     furnace.totalStoredWeight = 0;
          //     furnace.qualityOfA = 0;
          //     furnace.qualityOfB = 0;
          //     furnace.qualityOfC = 0;
          //     furnace.qualityOfD = 0;
          //     furnace.qualityOfE = 0;
          //     furnace.qualityOfGood = 0;
          //     furnace.qualityOfFine = 0;
          //     furnace.qualityOfNormal = 0;
          //     furnace.fromMeasure.forEach(measure => {
          //       furnace.coilNetWeight += measure.coilNetWeight == undefined ? 0 : measure.coilNetWeight;
          //       furnace.inPlanStoredWeight += measure.inPlanStoredWeight == undefined ? 0 : measure.inPlanStoredWeight;
          //       furnace.outPlanStoredWeight += measure.outPlanStoredWeight == undefined ? 0 : measure.outPlanStoredWeight;
          //       furnace.totalStoredWeight += measure.totalStoredWeight == undefined ? 0 : measure.totalStoredWeight;
          //       furnace.qualityOfA += measure.qualityOfA == undefined ? 0 : measure.qualityOfA;
          //       furnace.qualityOfB += measure.qualityOfB == undefined ? 0 : measure.qualityOfB;
          //       furnace.qualityOfC += measure.qualityOfC == undefined ? 0 : measure.qualityOfC;
          //       furnace.qualityOfD += measure.qualityOfD == undefined ? 0 : measure.qualityOfD;
          //       furnace.qualityOfE += measure.qualityOfE == undefined ? 0 : measure.qualityOfE;
          //       furnace.qualityOfGood += measure.qualityOfGood == undefined ? 0 : measure.qualityOfGood;
          //       furnace.qualityOfFine += measure.qualityOfFine == undefined ? 0 : measure.qualityOfFine;
          //       furnace.qualityOfNormal += measure.qualityOfNormal == undefined ? 0 : measure.qualityOfNormal;
          //     });
          //   });
          // });

          // // 第二次遍历，求出部分的结果
          // list.forEach(item => {
          //   item.coilNetWeight = 0;
          //   item.inPlanStoredWeight = 0;
          //   item.outPlanStoredWeight = 0;
          //   item.totalStoredWeight = 0;
          //   item.qualityOfA = 0;
          //   item.qualityOfB = 0;
          //   item.qualityOfC = 0;
          //   item.qualityOfD = 0;
          //   item.qualityOfE = 0;
          //   item.qualityOfGood = 0;
          //   item.qualityOfFine = 0;
          //   item.qualityOfNormal = 0;
          //   const furnaceList = item.furnaceList;
          //   furnaceList.forEach(furnace => {
          //     item.coilNetWeight += furnace.coilNetWeight;
          //     item.inPlanStoredWeight += furnace.inPlanStoredWeight;
          //     item.outPlanStoredWeight += furnace.outPlanStoredWeight;
          //     item.totalStoredWeight += furnace.totalStoredWeight;
          //     item.qualityOfA += furnace.qualityOfA;
          //     item.qualityOfB += furnace.qualityOfB;
          //     item.qualityOfC += furnace.qualityOfC;
          //     item.qualityOfD += furnace.qualityOfD;
          //     item.qualityOfE += furnace.qualityOfE;
          //     item.qualityOfGood += furnace.qualityOfGood;
          //     item.qualityOfFine += furnace.qualityOfFine;
          //     item.qualityOfNormal += furnace.qualityOfNormal;
          //   });
          // });

          // // 第三次遍历，求出合格率直通率等
          // list.forEach(item => {
          //   item.totalStoredWeight = item.totalStoredWeight.toFixed(2);
          //   // 不合格重量
          //   item.unqualifiedWeight = item.rawWeight - item.totalStoredWeight;
          //   // 有效过钢率，卷曲率，合格率，直通率
          //   item.qualifiedRatio = item.totalStoredWeight / item.rawWeight;
          //   item.effectiveMeltRatio = (item.rawWeight + item.uselessRibbonWeight) / item.alloyTotalWeight;
          //   item.rollRatio = item.rawWeight / (item.rawWeight + item.uselessRibbonWeight);
          //   item.totalRatio = ((item.effectiveMeltRatio * item.rollRatio * item.qualifiedRatio) * 100).toFixed(2) + '%';
          //   item.qualifiedRatio = (item.qualifiedRatio * 100).toFixed(2) + '%';
          //   item.effectiveMeltRatio = (item.effectiveMeltRatio * 100).toFixed(2) + '%';
          //   item.rollRatio = (item.rollRatio * 100).toFixed(2) + '%';
          //   // 订单合格率
          //   item.inPlanRatio = ((item.inPlanStoredWeight / item.rawWeight) * 100).toFixed(2) + '%';
          // });
          this.tableDataByTeam = data.list;
        }).catch((err) => {
          console.log(err);
        }).finally(() => {
          this.loading = false;
        });
      } else if(this.searchForm.ratioType === 'byCastId') {
        this.$http('get', urlmap.queryStatisticsRatio, params).then(data => {
          // const list = data.list;

          // // 第一次遍历，求出每一炉的各种重量
          // list.forEach(item => {
          //   item.castId = item._id;
          //   item.lowHeatNum = 0;
          //   item.zeroHeatNum = 0;
          //   item.uselessRibbonWeight = 0;
          //   const furnaceList = item.furnaceList;
          //   furnaceList.forEach(furnace => {
          //     // 废带重量
          //     item.uselessRibbonWeight += furnace.uselessRibbonWeight == undefined ? 0 : furnace.uselessRibbonWeight;
          //     // 低产零产率：6,8,9机组 <= 80kg，7机组 <=50，算低产
          //     if (furnace.rawWeight == 0) {
          //       item.zeroHeatNum++;
          //     }
          //     if (furnace.castId === 7) {
          //       if (furnace.rawWeight > 0 && furnace.rawWeight <= 50) {
          //         item.lowHeatNum++;
          //       }
          //     } else {
          //       if (furnace.rawWeight > 0 && furnace.rawWeight <= 80) {
          //         item.lowHeatNum++;
          //       }
          //     }
          //     item.lowAndZeroRatio = ((item.lowHeatNum + item.zeroHeatNum) * 100 / item.totalHeatNum).toFixed(2) + '%';

          //     furnace.coilNetWeight = 0;
          //     furnace.inPlanStoredWeight = 0;
          //     furnace.outPlanStoredWeight = 0;
          //     furnace.totalStoredWeight = 0;
          //     furnace.qualityOfA = 0;
          //     furnace.qualityOfB = 0;
          //     furnace.qualityOfC = 0;
          //     furnace.qualityOfD = 0;
          //     furnace.qualityOfE = 0;
          //     furnace.qualityOfGood = 0;
          //     furnace.qualityOfFine = 0;
          //     furnace.qualityOfNormal = 0;
          //     furnace.fromMeasure.forEach(measure => {
          //       furnace.coilNetWeight += measure.coilNetWeight == undefined ? 0 : measure.coilNetWeight;
          //       furnace.inPlanStoredWeight += measure.inPlanStoredWeight == undefined ? 0 : measure.inPlanStoredWeight;
          //       furnace.outPlanStoredWeight += measure.outPlanStoredWeight == undefined ? 0 : measure.outPlanStoredWeight;
          //       furnace.totalStoredWeight += measure.totalStoredWeight == undefined ? 0 : measure.totalStoredWeight;
          //       furnace.qualityOfA += measure.qualityOfA == undefined ? 0 : measure.qualityOfA;
          //       furnace.qualityOfB += measure.qualityOfB == undefined ? 0 : measure.qualityOfB;
          //       furnace.qualityOfC += measure.qualityOfC == undefined ? 0 : measure.qualityOfC;
          //       furnace.qualityOfD += measure.qualityOfD == undefined ? 0 : measure.qualityOfD;
          //       furnace.qualityOfE += measure.qualityOfE == undefined ? 0 : measure.qualityOfE;
          //       furnace.qualityOfGood += measure.qualityOfGood == undefined ? 0 : measure.qualityOfGood;
          //       furnace.qualityOfFine += measure.qualityOfFine == undefined ? 0 : measure.qualityOfFine;
          //       furnace.qualityOfNormal += measure.qualityOfNormal == undefined ? 0 : measure.qualityOfNormal;
          //     });
          //   });
          // });

          // // 第二次遍历，求出部分的结果
          // list.forEach(item => {
          //   item.coilNetWeight = 0;
          //   item.inPlanStoredWeight = 0;
          //   item.outPlanStoredWeight = 0;
          //   item.totalStoredWeight = 0;
          //   item.qualityOfA = 0;
          //   item.qualityOfB = 0;
          //   item.qualityOfC = 0;
          //   item.qualityOfD = 0;
          //   item.qualityOfE = 0;
          //   item.qualityOfGood = 0;
          //   item.qualityOfFine = 0;
          //   item.qualityOfNormal = 0;
          //   const furnaceList = item.furnaceList;
          //   furnaceList.forEach(furnace => {
          //     item.coilNetWeight += furnace.coilNetWeight;
          //     item.inPlanStoredWeight += furnace.inPlanStoredWeight;
          //     item.outPlanStoredWeight += furnace.outPlanStoredWeight;
          //     item.totalStoredWeight += furnace.totalStoredWeight;
          //     item.qualityOfA += furnace.qualityOfA;
          //     item.qualityOfB += furnace.qualityOfB;
          //     item.qualityOfC += furnace.qualityOfC;
          //     item.qualityOfD += furnace.qualityOfD;
          //     item.qualityOfE += furnace.qualityOfE;
          //     item.qualityOfGood += furnace.qualityOfGood;
          //     item.qualityOfFine += furnace.qualityOfFine;
          //     item.qualityOfNormal += furnace.qualityOfNormal;
          //   });
          // });

          // // 第三次遍历，求出合格率直通率等
          // list.forEach(item => {
          //   item.totalStoredWeight = item.totalStoredWeight.toFixed(2);
          //   // 不合格重量
          //   item.unqualifiedWeight = item.rawWeight - item.totalStoredWeight;
          //   // 有效过钢率，卷曲率，合格率，直通率
          //   item.qualifiedRatio = item.totalStoredWeight / item.rawWeight;
          //   item.effectiveMeltRatio = (item.rawWeight + item.uselessRibbonWeight) / item.alloyTotalWeight;
          //   item.rollRatio = item.rawWeight / (item.rawWeight + item.uselessRibbonWeight);
          //   item.totalRatio = ((item.effectiveMeltRatio * item.rollRatio * item.qualifiedRatio) * 100).toFixed(2) + '%';
          //   item.qualifiedRatio = (item.qualifiedRatio * 100).toFixed(2) + '%';
          //   item.effectiveMeltRatio = (item.effectiveMeltRatio * 100).toFixed(2) + '%';
          //   item.rollRatio = (item.rollRatio * 100).toFixed(2) + '%';
          //   // 订单合格率
          //   item.inPlanRatio = ((item.inPlanStoredWeight / item.rawWeight) * 100).toFixed(2) + '%';
          // });
          this.tableDataByCastId = data.list;
        }).catch((err) => {
          console.log(err);
        }).finally(() => {
          this.loading = false;
        });
      }
    },
    tabsClick(tab, event) {
      this.searchForm.ratioType = tab.name;
      this.getTableData();
    }
  }
}
</script>
<style lang="scss" scoped>

</style>


