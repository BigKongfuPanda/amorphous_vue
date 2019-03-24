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
      <el-col class="table_hd">
        <el-button type="primary" icon="el-icon-success" @click="measureConfirm">确认入库</el-button>
        <el-button type="primary" icon="el-icon-download" @click="exportExcel" v-if="isExportable" class="pull_right">导出</el-button>
      </el-col>
      <el-table :data="tableData" ref="table" stripe border style="width:100%" :height="tableHeight" v-loading="loading" @selection-change="handleSelectionChange"> 
        <el-table-column type="selection" width="30" :selectable="setSelectable"></el-table-column>
        <el-table-column prop="furnace" label="炉号" align="center" width="170px" fixed></el-table-column>
        <el-table-column prop="coilNumber" label="盘号" align="center" width="50px" fixed></el-table-column>
        <el-table-column prop="ribbonTypeName" label="材质" align="center" width="70px"></el-table-column>
        <el-table-column prop="ribbonWidth" label="规格" align="center" width="50px"></el-table-column>
        <el-table-column prop="castDate" label="生产日期" align="center" :formatter="dateFormat" width="110px"></el-table-column>
        <el-table-column prop="caster" label="喷带手" align="center" width="70px"></el-table-column>
        <el-table-column prop="diameter" label="外径(mm)" align="center" width="90px"></el-table-column>
        <el-table-column prop="coilWeight" label="重量(kg)" align="center" width="90px"></el-table-column>
        <el-table-column prop="laminationFactor" label="叠片系数" align="center" width="80px"></el-table-column>
        <el-table-column prop="laminationLevel" label="叠片等级" align="center" width="80px"></el-table-column>
        <el-table-column prop="realRibbonWidth" label="实际带宽" align="center" width="80px">
          <template slot-scope="scope">
            <div v-if="scope.row.isEditing === false">
              {{ scope.row.realRibbonWidth }}
            </div>
            <div v-else>
              <el-input size="mini" v-model="scope.row.realRibbonWidth"></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="ribbonThickness1" label="带厚1(μm)" align="center" width="90px">
          <template slot-scope="scope">
            <div v-if="scope.row.isEditing === false">
              {{ scope.row.ribbonThickness1 }}
            </div>
            <div v-else>
              <el-input size="mini" v-model="scope.row.ribbonThickness1"></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="ribbonThickness2" label="带厚2(μm)" align="center" width="90px">
          <template slot-scope="scope">
            <div v-if="scope.row.isEditing === false">
              {{ scope.row.ribbonThickness2 }}
            </div>
            <div v-else>
              <el-input size="mini" v-model="scope.row.ribbonThickness2"></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="ribbonThickness3" label="带厚3(μm)" align="center" width="90px">
          <template slot-scope="scope">
            <div v-if="scope.row.isEditing === false">
              {{ scope.row.ribbonThickness3 }}
            </div>
            <div v-else>
              <el-input size="mini" v-model="scope.row.ribbonThickness3"></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="ribbonThickness4" label="带厚4(μm)" align="center" width="90px">
          <template slot-scope="scope">
            <div v-if="scope.row.isEditing === false">
              {{ scope.row.ribbonThickness4 }}
            </div>
            <div v-else>
              <el-input size="mini" v-model="scope.row.ribbonThickness4"></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="ribbonThickness5" label="带厚5(μm)" align="center" width="90px">
          <template slot-scope="scope">
            <div v-if="scope.row.isEditing === false">
              {{ scope.row.ribbonThickness5 }}
            </div>
            <div v-else>
              <el-input size="mini" v-model="scope.row.ribbonThickness5"></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="ribbonThickness6" label="带厚6(μm)" align="center" width="90px">
          <template slot-scope="scope">
            <div v-if="scope.row.isEditing === false">
              {{ scope.row.ribbonThickness6 }}
            </div>
            <div v-else>
              <el-input size="mini" v-model="scope.row.ribbonThickness6"></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="ribbonThickness7" label="带厚7(μm)" align="center" width="90px">
          <template slot-scope="scope">
            <div v-if="scope.row.isEditing === false">
              {{ scope.row.ribbonThickness7 }}
            </div>
            <div v-else>
              <el-input size="mini" v-model="scope.row.ribbonThickness7"></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="ribbonThickness8" label="带厚8(μm)" align="center" width="90px">
          <template slot-scope="scope">
            <div v-if="scope.row.isEditing === false">
              {{ scope.row.ribbonThickness8 }}
            </div>
            <div v-else>
              <el-input size="mini" v-model="scope.row.ribbonThickness8"></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="ribbonThickness9" label="带厚9(μm)" align="center" width="90px">
          <template slot-scope="scope">
            <div v-if="scope.row.isEditing === false">
              {{ scope.row.ribbonThickness9 }}
            </div>
            <div v-else>
              <el-input size="mini" v-model="scope.row.ribbonThickness9"></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="ribbonThicknessDeviation" label="厚度偏差(μm)" align="center" width="110px"></el-table-column>
        <el-table-column prop="ribbonThickness" label="平均厚度(μm)" align="center" width="110px"></el-table-column>
        <el-table-column prop="ribbonThicknessLevel" label="厚度级别" align="center" width="90px"></el-table-column>
        <el-table-column prop="ribbonToughness" label="韧性" align="center" width="90px">
          <template slot-scope="scope">
            <div v-if="scope.row.isEditing === false">
              {{ scope.row.ribbonToughness }}
            </div>
            <div v-else>
              <el-select size="mini" v-model="scope.row.ribbonToughness" placeholder="">
                <el-option v-for="item in ribbonToughnessLevelList" :key="item._id" :label="item.ribbonToughness" :value="item.ribbonToughness"></el-option>
              </el-select>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="ribbonToughnessLevel" label="韧性等级" align="center" width="90px">
          <!-- <template slot-scope="scope">
            <div v-if="scope.row.isEditing === false">
              {{ scope.row.ribbonToughnessLevel }}
            </div>
            <div v-else>
              <el-select size="mini" v-model="scope.row.ribbonToughnessLevel" placeholder="">
                <el-option label="A" value="A"></el-option>
                <el-option label="B" value="B"></el-option>
                <el-option label="C" value="C"></el-option>
                <el-option label="D" value="D"></el-option>
                <el-option label="E" value="E"></el-option>
              </el-select>
            </div>
          </template> -->
        </el-table-column>
        <el-table-column prop="appearence" label="外观" align="center" width="90px">
          <template slot-scope="scope">
            <div v-if="scope.row.isEditing === false">
              {{ scope.row.appearence }}
            </div>
            <div v-else>
               <el-select size="mini" v-model="scope.row.appearence" placeholder="">
                <el-option label="无明显缺陷" value="无明显缺陷"></el-option>
                <el-option label="轻棱" value="轻棱"></el-option>
                <el-option label="棱" value="棱"></el-option>
                <el-option label="轻微麻点" value="轻微麻点"></el-option>
                <el-option label="麻点" value="麻点"></el-option>
                <el-option label="轻微划痕" value="轻微划痕"></el-option>
                <el-option label="划痕" value="划痕"></el-option>
                <el-option label="轻微挖心" value="轻微挖心"></el-option>
                <el-option label="挖心" value="挖心"></el-option>
                <el-option label="少量劈裂" value="少量劈裂"></el-option>
                <el-option label="大量劈裂" value="大量劈裂"></el-option>
                <el-option label="端面损坏" value="端面损坏"></el-option>
              </el-select>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="appearenceLevel" label="外观等级" align="center" width="90px">
          <template slot-scope="scope">
            <div v-if="scope.row.isEditing === false">
              {{ scope.row.appearenceLevel }}
            </div>
            <div v-else>
              <el-select size="mini" v-model="scope.row.appearenceLevel" placeholder="">
                <el-option label="A" value="A"></el-option>
                <el-option label="B" value="B"></el-option>
                <el-option label="C" value="C"></el-option>
                <el-option label="不合格" value="不合格"></el-option>
              </el-select>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="ribbonTotalLevel" label="综合级别" align="center" width="90px">
          <template slot-scope="scope">
            <span :class="scope.row.ribbonTotalLevel === '不合格' ? 'text_danger' : '' ">{{scope.row.ribbonTotalLevel}}</span>
          </template>
        </el-table-column>
        <el-table-column label="入库规则" align="center" width="90px">
          <template slot-scope="scope">
            <el-popover placement="right" trigger="hover">
              <table class="popover_table" cellpadding="0" cellspacing="0">
                <thead>
                  <th>类别</th>
                  <th>带厚</th>
                  <th>叠片</th>
                  <th>韧性</th>
                  <th>外观</th>
                </thead>
                <tbody>
                  <tr>
                    <td>计划内入库要求</td>
                    <td>{{scope.row.storageRule.orderThickness}}</td>
                    <td>{{scope.row.storageRule.orderLaminationFactor}}</td>
                    <td>{{scope.row.storageRule.orderRibbonToughnessLevels.toString()}}</td>
                    <td>{{scope.row.storageRule.orderAppearenceLevels.toString()}}</td>
                  </tr>
                  <tr>
                    <td>计划外入库要求</td>
                    <td>{{scope.row.storageRule.qualifiedThickness}}</td>
                    <td>{{scope.row.storageRule.qualifiedLaminationFactor}}</td>
                    <td>{{scope.row.storageRule.qualifiedRibbonToughnessLevels.toString()}}</td>
                    <td>{{scope.row.storageRule.qualifiedAppearenceLevels.toString()}}</td>
                  </tr>
                </tbody>
              </table>
              <el-button slot="reference" size="mini" type="text">详情</el-button>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="isStored" label="是否入库" align="center" width="100px">
          <template slot-scope="scope">
            <div v-if="scope.row.isMeasureConfirmed === 1">
              <span v-if="scope.row.isStored === 1">计划内入库</span>
              <span v-if="scope.row.isStored === 2">计划外入库</span>
              <span v-if="scope.row.isStored === 3" class="text_danger">否</span>
            </div>
            <!-- <div v-else>
              <el-select v-model="scope.row.isStored" placeholder="" size="mini">
                <el-option label="计划内入库" :value="1"></el-option>
                <el-option label="计划外入库" :value="2"></el-option>
                <el-option label="否" :value="3"></el-option>
              </el-select>
            </div> -->
          </template>
        </el-table-column>
        <el-table-column prop="unStoreReason" label="不入库原因" align="center" width="100px" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <div v-if="scope.row.isEditing === false" class="text_danger">
              {{ scope.row.unStoreReason }}
            </div>
            <div v-else>
              <el-input size="mini" v-model="scope.row.unStoreReason"></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="clients" label="判定去向" align="center" width="120px" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <div v-if="scope.row.isEditing === false">
              {{ scope.row.clients ? scope.row.clients.toString() : '' }}
            </div>
            <div v-else>
              <el-select size="mini" v-model="scope.row.clients" placeholder="" multiple collapse-tags>
                <el-option label="F" value="F"></el-option>
                <el-option label="D" value="D"></el-option>
                <el-option label="VM" value="VM"></el-option>
                <el-option label="VS" value="VS"></el-option>
                <el-option label="VD" value="VD"></el-option>
                <el-option label="O" value="O"></el-option>
                <el-option label="Z" value="Z"></el-option>
              </el-select>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="time" label="检测时间" align="center" width=""></el-table-column>
        <el-table-column label="操作" align="center" width="150px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="edit(scope.row)" v-if="scope.row.isEditing === false" :disabled="!isEditable">修改</el-button>
            <el-button size="mini" type="success" @click="save(scope.row)" v-else>保存</el-button>
            <el-button size="mini" type="danger" @click="del(scope.row)" v-if="isDeleteable">删除</el-button>
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
import qs from 'qs';
import urlmap from '@/utils/urlmap';
import { dateFormat } from '@/utils/common';
import { mapState, mapActions } from 'vuex';

export default {
  name: 'melt',
  data () {
    return {
      userinfo: {},
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
      },
      isExportable: false,
      isEditable: false,
      isDeleteable: false,
      tableHeight: 550,
      multipleSelection: []
    }
  },
  computed: {
    ...mapState([ 'ribbonToughnessLevelList' ])
  },
  // 动态路由匹配
  beforeRouteUpdate(to, from, next) {
    this.castId = to.params.castId;
    this.getTableData();
    this.isExportable = this.setExportable();
    this.isEditable = this.setEditable();
    this.isDeleteable = this.setDeleteable();
    next();
  },
  created () {
    this.castId = this.$route.params.castId;
    this.userinfo = JSON.parse(localStorage.getItem('userinfo'));
    this.isExportable = this.setExportable();
    this.isEditable = this.setEditable();
    this.isDeleteable = this.setDeleteable();
    this.getTableData();
    this.getRibbonToughnessLevelList();
  },
  mounted () {
    this.tableHeight = window.innerHeight - this.$refs.table.$el.getBoundingClientRect().top;
  },
  methods: {
    ...mapActions([ 'getRibbonToughnessLevelList' ]),
    dateFormat(row, column) {
      return dateFormat(row.castDate);
    },
    setEditable() {
      if (this.userinfo.roleId == 5 || this.userinfo.roleId == 1) { // 检测人员 或者厂长 可修改
        return true;
      } else { // 其他
        return false;
      }
    },
    setDeleteable() {
      if (this.userinfo.roleId == 1) { // 厂长 可删除
        return true;
      } else { // 其他
        return false;
      }
    },
    setExportable() {
      if ([1, 2, 3, 5].includes(this.userinfo.roleId)) {
        return true;
      } else {
        return false;
      }
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
          item.storageRule = {
            orderThickness: item.orderThickness,
            orderLaminationFactor: item.orderLaminationFactor,
            orderRibbonToughnessLevels: item.orderRibbonToughnessLevels,
            orderAppearenceLevels: item.orderAppearenceLevels,
            qualifiedThickness: item.qualifiedThickness,
            qualifiedLaminationFactor: item.qualifiedLaminationFactor,
            qualifiedRibbonToughnessLevels: item.qualifiedRibbonToughnessLevels,
            qualifiedAppearenceLevels: item.qualifiedAppearenceLevels
          };
        });
        this.tableData = data.list;
      }).catch((err) => {
        console.log(err);
      }).finally(() => {
        this.loading = false;
      });
    },
    edit(row) {
      if (row.isStored == 1 || row.isStored == 2) {// 已经入库
        return this.$message({
          message: '该带材已经入库，您无权限操作，请联系库房主管人员！',
          type: 'error'
        });
      }
      row.isEditing = true;
    },
    del(row) {
      const { _id, furnace, coilNumber } = row;
      this.$confirm(`删除后数据无法恢复，确定删除 ${furnace} 的第 ${coilNumber} 盘吗？`, '提示', {
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
      // this.pageConfig.current = 1;
      // this.getTableData();
      
      // 计算叠片系数和叠片等级 realRibbonWidth diameter coilWeight
      row.laminationFactor = ((row.coilWeight - 0.09)/(Math.PI * (row.diameter * row.diameter / 4 - 95 * 95 / 4) * 7.2) * Math.pow(10, 6) / row.realRibbonWidth).toFixed(2);
      row.laminationLevel = this.calcLaminationLevel(row.laminationFactor);

      // 根据韧性描述判定韧性等级 ribbonToughnessLevel
      row.ribbonToughnessLevel = this.ribbonToughnessLevelList.reduce((acc, cur) => {
        acc[cur.ribbonToughness] = cur.ribbonToughnessLevel;
        return acc;
      }, {})[row.ribbonToughness];

      // 计算厚度最大偏差、平均厚度、厚度级别
      row.ribbonThickness1 = typeof row.ribbonThickness1 === 'string' ? Number(row.ribbonThickness1.trim()) : row.ribbonThickness1;
      row.ribbonThickness2 = typeof row.ribbonThickness2 === 'string' ? Number(row.ribbonThickness2.trim()) : row.ribbonThickness2;
      row.ribbonThickness3 = typeof row.ribbonThickness3 === 'string' ? Number(row.ribbonThickness3.trim()) : row.ribbonThickness3;
      row.ribbonThickness4 = typeof row.ribbonThickness4 === 'string' ? Number(row.ribbonThickness4.trim()) : row.ribbonThickness4;
      row.ribbonThickness5 = typeof row.ribbonThickness5 === 'string' ? Number(row.ribbonThickness5.trim()) : row.ribbonThickness5;
      row.ribbonThickness6 = typeof row.ribbonThickness6 === 'string' ? Number(row.ribbonThickness6.trim()) : row.ribbonThickness6;
      row.ribbonThickness7 = typeof row.ribbonThickness7 === 'string' ? Number(row.ribbonThickness7.trim()) : row.ribbonThickness7;
      row.ribbonThickness8 = typeof row.ribbonThickness8 === 'string' ? Number(row.ribbonThickness8.trim()) : row.ribbonThickness8;
      row.ribbonThickness9 = typeof row.ribbonThickness9 === 'string' ? Number(row.ribbonThickness9.trim()) : row.ribbonThickness9;

      row.ribbonThicknessDeviation = this.calcMaxDeviation([row.ribbonThickness1, row.ribbonThickness2, row.ribbonThickness3, row.ribbonThickness4, row.ribbonThickness5, row.ribbonThickness6, row.ribbonThickness7, row.ribbonThickness8, row.ribbonThickness9]);
      row.ribbonThickness = ((row.ribbonThickness1 + row.ribbonThickness2 + row.ribbonThickness3 + row.ribbonThickness4 + row.ribbonThickness5 + row.ribbonThickness6 + row.ribbonThickness7 + row.ribbonThickness8 + row.ribbonThickness9) / 9).toFixed(2);
      row.ribbonThicknessLevel = this.calcribbonThicknessLevel(row.ribbonThickness);

      // 综合级别
      // 叠片系数不合格，或者外观等级为不合格，则综合级别为不合格
      row.ribbonTotalLevel = row.laminationLevel === '不合格' || row.appearenceLevel === '不合格' || row.ribbonThicknessDeviation > 3 ? '不合格' : row.ribbonThicknessLevel + row.laminationLevel + row.ribbonToughnessLevel + row.appearenceLevel;
      // 规格 为 32/35/40/42/45/50/，材质为 1K107B 的带材，如果韧性为D，则综合级别为不合格
      if ([32, 35, 40, 42, 45, 50].includes(row.ribbonWidth) && row.ribbonTypeName == '1K107B' && row.ribbonToughnessLevel == 'D') {
        row.ribbonTotalLevel = '不合格';
      }
      // 如果厚度为20-22，则加G，厚度为23-24，加L
      if (row.ribbonTotalLevel !== '不合格') {
        if (row.ribbonThickness >= 20 && row.ribbonThickness <= 22) {
          row.ribbonTotalLevel = row.ribbonTotalLevel + 'G';
        }
        if (row.ribbonThickness >= 23 && row.ribbonThickness <= 24) {
          row.ribbonTotalLevel = row.ribbonTotalLevel + 'L';
        }
      }

      if (row.ribbonThicknessLevel == '' || row.laminationLevel === '' || row.ribbonToughnessLevel == '' || row.appearenceLevel == '') {
        row.ribbonTotalLevel = '';
      }

      // 是否入库：不合格不能入库，端面有问题的不能入库，不满足入库规则的不能入库
      if (row.ribbonTotalLevel === '不合格') {
        row.isStored = 3;
      } else {
        // 入库分为：计划内入库和计划外入库
        row.isStored = this.setStoredType(row);
        if (row.isStored === 1) {
          row.inPlanStoredWeight = row.coilNetWeight;
          // 符合订单非薄带重量：满足订单要求且厚度为2级别的带材重量
          if (row.ribbonThicknessLevel === 2) {
            row.inPlanThickRibbonWeight = row.coilNetWeight;
          }
        } else if (row.isStored === 2) {
          row.outPlanStoredWeight = row.coilNetWeight;          
        }

        // 总入库重量
        row.totalStoredWeight = (row.inPlanStoredWeight + row.outPlanStoredWeight).toFixed(2);

        // 计算各质量等级的重量
        this.calcQualityOfABCDE(row);
        // 计算薄带和高叠片薄带的重量
        this.calcThinRibbonWeight(row);
        // // 质量等级为好的带材质量：A + 符合订单非薄带
        // row.qualityOfGood = (row.qualityOfA + row.inPlanThickRibbonWeight).toFixed(2);
        // // 质量等级为良的带材质量：B
        // row.qualityOfFine = row.qualityOfB;
        // // 质量等级为中的带材质量：30**、40**+ 计划外入库
        // if (/^[3-4]0[A-Z]{2,3}$/.test(row.ribbonTotalLevel)) {
        //   row.qualityOfNormal = row.coilNetWeight;
        // } else if(row.isStored === 2) {
        //   row.qualityOfNormal = row.outPlanStoredWeight;
        // }

        // 质量等级为好的带材质量：符合订单的带材
        row.qualityOfGood = row.inPlanStoredWeight;
        // 质量等级为良的带材质量：除去符合任务单要求的薄带（31**41**51**61**71**81**32**42**52**62**72**82**33**43**53**63**73**83**34**44**54**64**74**84**）还有德国法国的（22*B、23*B）
        // 质量等级为中的带材质量：除去好和良的其他入库。
        if (row.isStored === 2) {
          if (/^[3-8][1-4][A-Z]{2,3}$/.test(row.ribbonTotalLevel) || /^2[2-3][A-C]BL?$/.test(row.ribbonTotalLevel)) {
            row.qualityOfFine = row.coilNetWeight;
          } else {
            row.qualityOfNormal = row.coilNetWeight;
          }
        }
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
    },
    calcThinRibbonWeight(row) {
      if (row.ribbonThickness > 23) {
        return;
      }
      // 高叠片薄带重量 ≤23, >=0.78
      if (row.laminationFactor >= 0.78) {
        return row.highFactorThinRibbonWeight = row.coilNetWeight;
      }
      // 薄带重量 ≤23, >=0.75
      if (row.laminationFactor >= 0.75) {
        row.thinRibbonWeight = row.coilNetWeight;
      }
    },
    calcQualityOfABCDE(row) {
      // 计算各质量等级的重量
      // A: 32**,42**,52**,62**,72**,82**,33**,43**,53**,63**,73**,83**,34**,44**,54**,64**,74**,84**
      const requireMentOfA = /^[3-8][2-4][A-Z]{2,3}$/;
      // B: 31**,41**,51**,61**,71**,81**
      const requireMentOfB = /^[3-8]1[A-Z]{2,3}$/;
      // C: 30**,40**,50**,60**,70**,80**
      const requireMentOfC = /^[3-8]0[A-Z]{2,3}$/;
      // D: 21**,22**,23**,24**
      const requireMentOfD = /^2[1-4][A-Z]{2,3}$/;
      // E: 11**,12**,13**,14**
      const requireMentOfE = /^1[1-4][A-Z]{2,3}$/;
      const ribbonTotalLevel = row.ribbonTotalLevel;
      if (requireMentOfA.test(ribbonTotalLevel)) {
        row.qualityOfA = row.coilNetWeight;
      } else if (requireMentOfB.test(ribbonTotalLevel)) {
        row.qualityOfB = row.coilNetWeight;
      } else if (requireMentOfC.test(ribbonTotalLevel)) {
        row.qualityOfC = row.coilNetWeight;
      } else if (requireMentOfD.test(ribbonTotalLevel)) {
        row.qualityOfD = row.coilNetWeight;
      } else if (requireMentOfE.test(ribbonTotalLevel)) {
        row.qualityOfE = row.coilNetWeight;
      }
    },
    calcLaminationLevel(factor) {
      if (!factor) return '';
      if (factor >= 0.84) {
        return '4';
      } else if(factor >= 0.82 && factor < 0.84) {
        return '3';
      } else if(factor >= 0.80 && factor < 0.82) {
        return '2';
      } else if(factor >= 0.78 && factor < 0.80) {
        return '1';
      } else if(factor >= 0.75 && factor < 0.78) {
        return '0';
      } else {
        return '不合格';
      }
    },
    calcMaxDeviation(arr) {
      arr.sort((a, b) => {
        return a - b;
      });
      const _len = arr.length;
      return arr[_len - 1] - arr[0];
    },
    calcribbonThicknessLevel(thickness) {
      if (!thickness) {
        return;
      }
      if (thickness > 26) {
        return 1;
      } else if(thickness > 23 && thickness <= 26) {
        return 2;
      } else if(thickness > 20 && thickness <= 23) {
        return 3;
      } else if(thickness > 18 && thickness <= 20) {
        return 4;
      } else if(thickness > 16 && thickness <= 18) {
        return 5;
      } else if(thickness > 14 && thickness <= 16) {
        return 6;
      } else if(thickness > 12 && thickness <= 14) {
        return 7;
      } else if(thickness <= 12) {
        return 8;
      }
    },
    setStoredType(row) {
      let inPlanFlag = true;
      let outPlanFlag = true;
      // 计划内：厚度
      const ribbonThickness = row.ribbonThickness;
      const orderThickness = row.orderThickness;
      if (orderThickness.indexOf('≤') > -1) { // ≤23
        const maxThickness = parseInt(orderThickness.substr(1));
        if (ribbonThickness > maxThickness) {
          // 厚度不符合符合计划内入库的要求
          inPlanFlag = false;
        }
      } else if (orderThickness.indexOf('-') > -1) {
        const maxThickness = orderThickness.split('-')[1];
        const minThickness = orderThickness.split('-')[0];
        if (ribbonThickness < minThickness || ribbonThickness > maxThickness) {
          inPlanFlag = false;
        }
      }
      // 计划内：叠片
      const laminationFactor = row.laminationFactor;
      const orderLaminationFactor = row.orderLaminationFactor;
      if (orderLaminationFactor.indexOf('≥') > -1) { // ≥0.78
        const minLaminationFactor = parseInt(orderLaminationFactor.substr(1));
        if (laminationFactor < minLaminationFactor) {
          // 叠片不符合符合计划内入库的要求
          inPlanFlag = false;
        }
      } else if (orderLaminationFactor.indexOf('-') > -1) {
        const maxLaminationFactor = orderLaminationFactor.split('-')[1];
        const minLaminationFactor = orderLaminationFactor.split('-')[0];
        if (laminationFactor < minLaminationFactor || laminationFactor > maxLaminationFactor) {
          inPlanFlag = false;
        }
      }
      // 计划内：韧性
      const ribbonToughnessLevel = row.ribbonToughnessLevel;
      const orderRibbonToughnessLevels = row.orderRibbonToughnessLevels;
      if (!orderRibbonToughnessLevels.includes(ribbonToughnessLevel)) {
        inPlanFlag = false;
      }
      // 计划内：外观
      const appearenceLevel = row.appearenceLevel;
      const orderAppearenceLevels = row.orderAppearenceLevels;
      if (!orderAppearenceLevels.includes(appearenceLevel)) {
        inPlanFlag = false;
      }

      if (inPlanFlag) {
        return 1;
      }

      // 计划外：厚度
      const qualifiedThickness = row.qualifiedThickness;
      if (qualifiedThickness.indexOf('≤') > -1) { // ≤23
        const maxThickness = parseInt(qualifiedThickness.substr(1));
        if (ribbonThickness > maxThickness) {
          // 厚度不符合符合计划外入库的要求
          outPlanFlag = false;
        }
      } else if (qualifiedThickness.indexOf('-') > -1) {
        const maxThickness = qualifiedThickness.split('-')[1];
        const minThickness = qualifiedThickness.split('-')[0];
        if (ribbonThickness < minThickness || ribbonThickness > maxThickness) {
          outPlanFlag = false;
        }
      }
      // 计划外：叠片
      const qualifiedLaminationFactor = row.qualifiedLaminationFactor;
      if (qualifiedLaminationFactor.indexOf('≥') > -1) { // ≥0.78
        const minLaminationFactor = parseInt(qualifiedLaminationFactor.substr(1));
        if (laminationFactor < minLaminationFactor) {
          // 叠片不符合符合计划外入库的要求
          outPlanFlag = false;
        }
      } else if (qualifiedLaminationFactor.indexOf('-') > -1) {
        const maxLaminationFactor = qualifiedLaminationFactor.split('-')[1];
        const minLaminationFactor = qualifiedLaminationFactor.split('-')[0];
        if (laminationFactor < minLaminationFactor || laminationFactor > maxLaminationFactor) {
          outPlanFlag = false;
        }
      }
      // 计划外：韧性
      const qualifiedRibbonToughnessLevels = row.qualifiedRibbonToughnessLevels;
      if (!qualifiedRibbonToughnessLevels.includes(ribbonToughnessLevel)) {
        outPlanFlag = false;
      }
      // 计划外：外观
      const qualifiedAppearenceLevels = row.qualifiedAppearenceLevels;
      if (!qualifiedAppearenceLevels.includes(appearenceLevel)) {
        outPlanFlag = false;
      }

      if (outPlanFlag) {
        return 2
      }

      return 3;
    },
    exportExcel() {
      const params = {
        castId: this.castId,
        startTime: this.searchForm.date[0],
        endTime: this.searchForm.date[1],
        caster: this.searchForm.caster,
        furnace: this.searchForm.furnace
      };
      const url = `${urlmap.exportMeasure}?${qs.stringify(params)}`;
      window.open(url);
    },
    setSelectable(row, index) {
      // 合格并且已经检测过了的，才可以被选中来入库
      if ([1, 2].includes(row.isStored) && !row.isMeasureConfirmed ) {
        return true;
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    measureConfirm() {
      if (this.multipleSelection.length === 0) {
        this.$alert('请选择要入库的带材', '提示');
      }
      this.multipleSelection.forEach(row => {
        row.isMeasureConfirmed = 1; // 1-检测确认入库，0-还没有确认
      });
      // 发送请求，更新当前的数据
      this.$http('PUT', urlmap.updateMeasure, { dataJson: JSON.stringify(this.multipleSelection) }).then(data => {
        this.getTableData();
      }).catch(error => {
        console.log(error);
      });
    }
  }
}
</script>
<style lang="scss" scoped>
.popover_table {
  text-align: center;
  th, td {
    border-bottom: 1px solid #dcdfe6;
  }
  td {
    padding: 5px 8px;
  }
}
</style>
