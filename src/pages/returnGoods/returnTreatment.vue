<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="crumb">
      <el-breadcrumb-item>退货处理</el-breadcrumb-item>
      <el-breadcrumb-item>退货操作</el-breadcrumb-item>
    </el-breadcrumb>
    <Collapse>
      <el-form class="search_bar" :model="searchForm" :inline="true">
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
        <el-form-item label="厚度级别：">
          <el-select v-model="searchForm.ribbonThicknessLevels" placeholder="请选择" multiple collapse-tags>
            <el-option v-for="item in ribbonThicknessLevelList" :key="item.ribbonThicknessLevelId" :label="item.ribbonThicknessLevel" :value="item.ribbonThicknessLevel"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="叠片级别：">
          <el-select v-model="searchForm.laminationLevels" placeholder="请选择" multiple collapse-tags>
            <el-option v-for="item in laminationLevelList" :key="item.laminationLevelId" :label="item.laminationLevel" :value="item.laminationLevel"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="韧性级别：">
          <el-select v-model="searchForm.ribbonToughnessLevels" placeholder="请选择" multiple collapse-tags>
            <el-option v-for="item in ribbonToughnessLevelList" :key="item.ribbonToughnessLevelId" :label="item.ribbonToughnessLevel" :value="item.ribbonToughnessLevel"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="外观级别：">
          <el-select v-model="searchForm.appearenceLevels" placeholder="请选择" multiple collapse-tags>
            <el-option label="A" value="A"></el-option>
            <el-option label="B" value="B"></el-option>
            <el-option label="C" value="C"></el-option>
            <el-option label="不合格" value="不合格"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="clickSearch">搜索</el-button>
          <el-button type="primary" icon="el-icon-refresh" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </Collapse>
    <div class="main_bd">
      <el-col class="table_hd">
        <el-button type="primary" icon="el-icon-success" @click="measureConfirm" v-if="userinfo.roleId == 5">确认入库</el-button>
      </el-col>
      <el-table :data="tableData" ref="table" stripe border style="width:100%" :height="tableHeight" v-loading="loading" @selection-change="handleSelectionChange"> 
        <el-table-column type="selection" width="30" :selectable="setSelectable"></el-table-column>
        <el-table-column prop="furnace" label="炉号" align="center" width="170px" fixed></el-table-column>
        <el-table-column prop="coilNumber" label="盘号" align="center" width="50px" fixed></el-table-column>
        <el-table-column prop="ribbonTypeName" label="材质" align="center" width="70px"></el-table-column>
        <el-table-column prop="ribbonWidth" label="规格" align="center" width="50px"></el-table-column>
        <el-table-column prop="diameter" label="外径(mm)" align="center" width="90px">
          <template slot-scope="scope">
            <div v-if="scope.row.isEditing === false">
              {{ scope.row.diameter }}
            </div>
            <div v-else>
              <el-input size="mini" v-model="scope.row.diameter"></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="coilWeight" label="重量(kg)" align="center" width="90px">
          <template slot-scope="scope">
            <div v-if="scope.row.isEditing === false">
              {{ scope.row.coilWeight }}
            </div>
            <div v-else>
              <el-input size="mini" v-model="scope.row.coilWeight"></el-input>
            </div>
          </template>
        </el-table-column>
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
              <el-input size="mini" v-model="scope.row.ribbonThickness1" @keyup.native="$event => thicknessChangeHandler($event, scope.row)"></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="ribbonThickness2" label="带厚2(μm)" align="center" width="90px">
          <template slot-scope="scope">
            <div v-if="scope.row.isEditing === false">
              {{ scope.row.ribbonThickness2 }}
            </div>
            <div v-else>
              <el-input size="mini" v-model="scope.row.ribbonThickness2" @keyup.native="$event => thicknessChangeHandler($event, scope.row)"></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="ribbonThickness3" label="带厚3(μm)" align="center" width="90px">
          <template slot-scope="scope">
            <div v-if="scope.row.isEditing === false">
              {{ scope.row.ribbonThickness3 }}
            </div>
            <div v-else>
              <el-input size="mini" v-model="scope.row.ribbonThickness3" @keyup.native="$event => thicknessChangeHandler($event, scope.row)"></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="ribbonThickness4" label="带厚4(μm)" align="center" width="90px">
          <template slot-scope="scope">
            <div v-if="scope.row.isEditing === false">
              {{ scope.row.ribbonThickness4 }}
            </div>
            <div v-else>
              <el-input size="mini" v-model="scope.row.ribbonThickness4" @keyup.native="$event => thicknessChangeHandler($event, scope.row)"></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="ribbonThickness5" label="带厚5(μm)" align="center" width="90px">
          <template slot-scope="scope">
            <div v-if="scope.row.isEditing === false">
              {{ scope.row.ribbonThickness5 }}
            </div>
            <div v-else>
              <el-input size="mini" v-model="scope.row.ribbonThickness5" @keyup.native="$event => thicknessChangeHandler($event, scope.row)"></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="ribbonThickness6" label="带厚6(μm)" align="center" width="90px">
          <template slot-scope="scope">
            <div v-if="scope.row.isEditing === false">
              {{ scope.row.ribbonThickness6 }}
            </div>
            <div v-else>
              <el-input size="mini" v-model="scope.row.ribbonThickness6" @keyup.native="$event => thicknessChangeHandler($event, scope.row)"></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="ribbonThickness7" label="带厚7(μm)" align="center" width="90px">
          <template slot-scope="scope">
            <div v-if="scope.row.isEditing === false">
              {{ scope.row.ribbonThickness7 }}
            </div>
            <div v-else>
              <el-input size="mini" v-model="scope.row.ribbonThickness7" @keyup.native="$event => thicknessChangeHandler($event, scope.row)"></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="ribbonThickness8" label="带厚8(μm)" align="center" width="90px">
          <template slot-scope="scope">
            <div v-if="scope.row.isEditing === false">
              {{ scope.row.ribbonThickness8 }}
            </div>
            <div v-else>
              <el-input size="mini" v-model="scope.row.ribbonThickness8" @keyup.native="$event => thicknessChangeHandler($event, scope.row)"></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="ribbonThickness9" label="带厚9(μm)" align="center" width="90px">
          <template slot-scope="scope">
            <div v-if="scope.row.isEditing === false">
              {{ scope.row.ribbonThickness9 }}
            </div>
            <div v-else>
              <el-input size="mini" v-model="scope.row.ribbonThickness9" @keyup.native="$event => thicknessChangeHandler($event, scope.row)"></el-input>
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
                    <td>{{scope.row.storageRule.orderRibbonToughnessLevels}}</td>
                    <td>{{scope.row.storageRule.orderAppearenceLevels}}</td>
                  </tr>
                  <tr>
                    <td>计划外入库要求</td>
                    <td>{{scope.row.storageRule.qualifiedThickness}}</td>
                    <td>{{scope.row.storageRule.qualifiedLaminationFactor}}</td>
                    <td>{{scope.row.storageRule.qualifiedRibbonToughnessLevels}}</td>
                    <td>{{scope.row.storageRule.qualifiedAppearenceLevels}}</td>
                  </tr>
                </tbody>
              </table>
              <el-button slot="reference" size="mini" type="text">详情</el-button>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="isStored" label="是否入库" align="center" width="100px">
          <template slot-scope="scope">
            <div>
              <span v-if="scope.row.isStored === 1">计划内入库</span>
              <span v-if="scope.row.isStored === 2">计划外入库</span>
              <span v-if="scope.row.isStored === 3" class="text_danger">否</span>
              <span v-if="scope.row.isStored === 4" class="text_warn">退货入库</span>
            </div>
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
        <el-table-column prop="measureDate" label="检测时间" align="center" width="120px" :formatter="dateTimeFormat" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="操作" align="center" width="80px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="edit(scope.row)" v-if="scope.row.isEditing === false" :disabled="!isEditable">修改</el-button>
            <el-button size="mini" type="success" @click="save(scope.row)" v-else>保存</el-button>
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
import {cloneDeep} from 'lodash';
import urlmap from '@/utils/urlmap';
import { dateTimeFormat, debounce } from '@/utils/common';
import { mapState, mapActions } from 'vuex';
import Collapse from '@/components/collapse.vue';

export default {
  name: 'melt',
  components: {Collapse},
  data () {
    return {
      userinfo: {},
      castId: 6,
      searchForm: {
        furnace: '',
        ribbonTypeNames: [],
        ribbonWidths: [],
        ribbonThicknessLevels: [],
        laminationLevels: [],
        ribbonToughnessLevels: [],
        appearenceLevels: []
      },
      loading: false,
      tableData: [],
      pageConfig: {
        total: 1,
        current: 1,
        pageSize: 10
      },
      isEditable: false,
      tableHeight: 550,
      multipleSelection: []
    }
  },
  computed: {
    ...mapState(['ribbonToughnessLevelList', 'ribbonTypeList', 'ribbonWidthList', 'ribbonThicknessLevelList', 'laminationLevelList'])
  },
  // 动态路由匹配
  beforeRouteUpdate(to, from, next) {
    this.castId = to.params.castId;
    this.getTableData();
    this.isEditable = this.setEditable();
    next();
  },
  created () {
    this.castId = this.$route.params.castId;
    this.userinfo = JSON.parse(localStorage.getItem('userinfo'));
    this.isEditable = this.setEditable();
    this.getTableData();
    this.getRibbonToughnessLevelList();
    this.getRibbonTypeList();
    this.getRibbonWidthList();
    this.getRibbonThicknessLevelList();
    this.getLaminationLevelList();
  },
  mounted () {
    const self = this;
    self.$nextTick(() => {
      // self.tableHeight = window.innerHeight - self.$refs.table.$el.getBoundingClientRect().top;
      self.tableHeight = window.innerHeight - 100;
    });
    window.onresize = debounce(() => {
      // self.tableHeight = window.innerHeight - self.$refs.table.$el.getBoundingClientRect().top;
      self.tableHeight = window.innerHeight - 100;
    }, 1000)
  },
  methods: {
    ...mapActions([ 'getRibbonToughnessLevelList', 'getRibbonTypeList', 'getRibbonWidthList', 'getRibbonThicknessLevelList', 'getLaminationLevelList' ]),
    dateTimeFormat(row, column) {
      return row.measureDate? dateTimeFormat(row.measureDate) : '';
    },
    setEditable() {
      if (this.userinfo.roleId == 5 || this.userinfo.roleId == 6) { // 检测人员 或者库房 可修改
        return true;
      } else { // 其他
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
      this.searchForm = { furnace: '', ribbonTypeNames: [], ribbonWidths: [],  ribbonThicknessLevels: [], laminationLevels: [], ribbonToughnessLevels: [], appearenceLevels: [] };
      const params = {
        current: 1
      };
      this.pageConfig.current = 1;
      this.getTableData(params);
    },
    getTableData(params = {}) {
      const _params = {
        castId: this.castId,
        furnace: this.searchForm.furnace,
        ribbonTypeNameJson: JSON.stringify(this.searchForm.ribbonTypeNames),
        ribbonWidthJson: JSON.stringify(this.searchForm.ribbonWidths),
        ribbonThicknessLevelJson: JSON.stringify(this.searchForm.ribbonThicknessLevels),
        laminationLevelJson: JSON.stringify(this.searchForm.laminationLevels),
        ribbonToughnessLevelJson: JSON.stringify(this.searchForm.ribbonToughnessLevels),
        appearenceLevelJson: JSON.stringify(this.searchForm.appearenceLevels)
      };
      Object.assign(params, _params);
      this.$http('get', urlmap.queryMeasure, params).then(data => {
        this.pageConfig.total = data.count;
        this.pageConfig.pageSize = data.limit;
        data.list = data.list.filter(item => {
          return [1,2,4].includes(item.isStored) && item.isMeasureConfirmed == 1;
        });
        
        data.list.forEach(item => {
          item.isEditing = false;
          item.clients = item.clients.split(',');
          item.isMeasureConfirmed = 0;
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
      if (row.isStored == 4 && row.isMeasureConfirmed == 1) {// 已经入库
        return this.$message({
          message: '该带材已经入库，您无权限操作，请联系库房主管人员！',
          type: 'error'
        });
      }
      row.isEditing = true;
    },
    save(row) {
      row.isEditing = false;
      // this.pageConfig.current = 1;
      // this.getTableData();

       /** 
       * 计算单盘净重，不同规格的内衬重量不同
       * 内衬的规格和重量对应表
       * 20.5: 0.05,
        25.5: 0.06,
        30: 0.08,
        40: 0.12,
        50: 0.12
      */
      let linerWeight = 0;
      if (row.ribbonWidth < 25) {
        linerWeight = 0.05;
      } else if (row.ribbonWidth >= 25 && row.ribbonWidth < 30) {
        linerWeight = 0.06;
      } else if (row.ribbonWidth >= 30 && row.ribbonWidth < 40) {
        linerWeight = 0.08;
      } else if (row.ribbonWidth >= 40 && row.ribbonWidth < 50) {
        linerWeight = 0.12;
      } else if (row.ribbonWidth >= 50 && row.ribbonWidth < 58) {
        linerWeight = 0.12;
      } else if (row.ribbonWidth >= 58) { // 58mm 以上的使用两个 30 的内衬拼接起来
        linerWeight = 0.08 * 2;
      } 
      row.coilNetWeight = (row.coilWeight - linerWeight).toFixed(2);
      row.remainWeight = row.coilNetWeight;
      
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
      row.ribbonTotalLevel = row.laminationLevel === '不合格' || row.appearenceLevel === '不合格' ? '不合格' : row.ribbonThicknessLevel + row.laminationLevel + row.ribbonToughnessLevel + row.appearenceLevel;
      // 规格 为 32/35/40/42/45/50/，材质为 1K107B 的带材，如果韧性为D或E，则综合级别为不合格
      if ([32, 35, 40, 42, 45, 50].includes(row.ribbonWidth) && row.ribbonTypeName == '1K107B' && ['D', 'E'].includes(row.ribbonToughnessLevel)) {
        row.ribbonTotalLevel = '不合格';
      }
      //如果带材厚度偏差大于3，同时韧性为D/E,此带材为不合格，否则加F
      if (row.ribbonThicknessDeviation > 3 && ['D', 'E'].includes(row.ribbonToughnessLevel)) {
        row.ribbonTotalLevel = '不合格';
      }
      // 如果带材韧性为D/E，同时带材宽度超出规格±0.2mm，此带材为不合格，否则加E，正偏差为+E,负偏差为-E
      if (row.ribbonWidth < 50) {
        if (['D', 'E'].includes(row.ribbonToughnessLevel) && Math.abs(row.realRibbonWidth - row.ribbonWidth) > 0.2) {
          row.ribbonTotalLevel = '不合格';        
        }
      } else if (row.ribbonWidth >= 50){
        if (['D', 'E'].includes(row.ribbonToughnessLevel) && Math.abs(row.realRibbonWidth - row.ribbonWidth) > 0.3) {
          row.ribbonTotalLevel = '不合格';        
        }
      }
      if (['AD25', 'ND25'].includes(row.ribbonTypeName)) {
        let _width = row.realRibbonWidth - row.ribbonWidth;
        if (_width >= 0.1 || _width <= -0.2) {
          row.ribbonTotalLevel = '不合格';
        }
      }
      
      if (row.ribbonTotalLevel !== '不合格') {
        // 如果厚度为20-22，则加G，厚度为23-24，加L
        if (row.ribbonThickness >= 20 && row.ribbonThickness <= 22) {
          row.ribbonTotalLevel = row.ribbonTotalLevel + 'G';
        }
        if (row.ribbonThickness >= 23 && row.ribbonThickness <= 24) {
          row.ribbonTotalLevel = row.ribbonTotalLevel + 'L';
        }
        // 如果带材厚度偏差大于3，同时韧性为A,B,C,此带材加F
        if (row.ribbonThicknessDeviation > 3 && ['A', 'B', 'C'].includes(row.ribbonToughnessLevel)) {
          row.ribbonTotalLevel = row.ribbonTotalLevel + 'F';
        }
        // 如果带材韧性为A/B/C，同时带材宽度超出规格±0.2mm，加E，正偏差为+E,负偏差为-E
        let _width = row.realRibbonWidth - row.ribbonWidth;
        if (row.ribbonWidth < 50) {
          if (Math.abs(_width) > 0.2 && ['A', 'B', 'C'].includes(row.ribbonToughnessLevel)) {
            if ((_width) < -0.2) {
              row.ribbonTotalLevel = row.ribbonTotalLevel + '-E';
            } else if ((_width) > 0.2) {
              row.ribbonTotalLevel = row.ribbonTotalLevel + '+E';
            }
          }
        } else if (row.ribbonWidth >= 50) {
          if (Math.abs(_width) > 0.3 && ['A', 'B', 'C'].includes(row.ribbonToughnessLevel)) {
            if ((_width) < -0.3) {
              row.ribbonTotalLevel = row.ribbonTotalLevel + '-E';
            } else if ((_width) > 0.3) {
              row.ribbonTotalLevel = row.ribbonTotalLevel + '+E';
            }
          }
        }
      }

      if (row.ribbonThicknessLevel == '' || row.laminationLevel === '' || row.ribbonToughnessLevel == '' || row.appearenceLevel == '') {
        row.ribbonTotalLevel = '';
      }

      // 是否入库：不合格不能入库，端面有问题的不能入库，不满足入库规则的不能入库
      if (row.ribbonTotalLevel === '不合格') {
        row.isStored = 3;
        row.isMeasureConfirmed = 1;
      } else {
        // 入库分为：计划内入库-1，计划外入库-2，退货入库-4, 不合格-3
        row.isStored = 4;
      }
      
      const clone = cloneDeep(row);
      clone.clients = clone.clients.join();
      // 发送请求，更新当前的数据
      this.$http('PUT', urlmap.updateReturnGoods, clone).then(data => {

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
    setSelectable(row, index) {
      // 合格并且已经检测过了的，才可以被选中来入库
      if (row.isStored == 4 && !row.isMeasureConfirmed ) {
        return true;
      } else {
        return false;
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    thicknessChangeHandler(e, row) {
      let ribbonThicknessList = [row.ribbonThickness1, row.ribbonThickness2, row.ribbonThickness3, row.ribbonThickness4, row.ribbonThickness5, row.ribbonThickness6, row.ribbonThickness7, row.ribbonThickness8, row.ribbonThickness9];
      ribbonThicknessList = ribbonThicknessList.map(item => {
        if (item !== '') {
          return Number(item);
        }
      }).filter(item => item !== undefined);
      row.ribbonThicknessDeviation = this.calcMaxDeviation(ribbonThicknessList);
      row.ribbonThickness = ribbonThicknessList.length > 0 ? (ribbonThicknessList.reduce((acc, cur) => acc + cur, 0) / ribbonThicknessList.length).toFixed(2) : 0;
      row.ribbonThicknessLevel = this.calcribbonThicknessLevel(row.ribbonThickness);
    },
    measureConfirm() {
      const selection = cloneDeep(this.multipleSelection);
      if (selection.length === 0) {
        return this.$alert('请选择要入库的带材', '提示', { type: 'warning' });
      }
      selection.forEach(row => {
        row.isMeasureConfirmed = 1; // 1-检测确认入库，0-还没有确认
        row.clients = row.clients.join();
      });
      // 发送请求，更新当前的数据
      this.$http('PUT', urlmap.updateReturnGoods, { dataJson: JSON.stringify(selection) }).then(data => {
        // this.getTableData();
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
