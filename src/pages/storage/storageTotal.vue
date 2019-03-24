<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="crumb">
      <el-breadcrumb-item>库存记录</el-breadcrumb-item>
      <el-breadcrumb-item>库存总表</el-breadcrumb-item>
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
      <el-form-item label="综合级别：">
        <el-input v-model="searchForm.ribbonTotalLevels" placeholder="请输入综合级别，以逗号分隔"></el-input>
      </el-form-item>
      <el-form-item label="仓位：">
        <el-input v-model="searchForm.place" placeholder="请输入仓位，以逗号分隔"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="clickSearch">搜索</el-button>
        <el-button type="primary" icon="el-icon-refresh" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="main_bd">
      <el-col class="table_hd">
        <el-button type="primary" icon="el-icon-download" @click="exportExcel" v-if="isExportable">导出</el-button>
      </el-col>
      <el-table :data="tableData" ref="table" stripe border style="width:100%" :height="tableHeight" v-loading="loading"> 
        <el-table-column prop="inStoreDate" label="入库日期" align="center" :formatter="inStoreDateFormat" width="110px"></el-table-column>
        <el-table-column prop="furnace" label="炉号" align="center" width="170px" fixed></el-table-column>
        <el-table-column prop="coilNumber" label="盘号" align="center" width="50px" fixed></el-table-column>
        <el-table-column prop="ribbonTypeName" label="材质" align="center" width="70px"></el-table-column>
        <el-table-column prop="ribbonWidth" label="规格" align="center" width="50px"></el-table-column>
        <el-table-column prop="ribbonTotalLevel" label="综合级别" align="center" width="90px"></el-table-column>
        <el-table-column prop="ribbonThicknessLevel" label="带厚级别" align="center" width="90px"></el-table-column>
        <el-table-column prop="coilWeight" label="毛重" align="center" width="70px"></el-table-column>
        <el-table-column prop="coilNetWeight" label="净重" align="center" width="70px"></el-table-column>
        <el-table-column prop="isStored" label="入库情况" align="center" width="100px">
          <template slot-scope="scope">
            <span v-if="scope.row.isStored == 1">计划内入库</span>
            <span v-if="scope.row.isStored == 2">计划外入库</span>
            <span v-if="scope.row.isStored == 3">否</span>
          </template>
        </el-table-column>
        <el-table-column prop="outStoreDate" label="出库日期" align="center" :formatter="outStoreDateFormat" width="110px"></el-table-column>
        <el-table-column prop="takeBy" label="实际去向" align="center" width="100px">
          <template slot-scope="scope">
            <div v-if="scope.row.isEditing === false">
              {{ scope.row.takeBy }}
            </div>
            <div v-else>
              <el-select v-model="scope.row.takeBy" placeholder="" size="mini">
                <el-option label="不选择" value=""></el-option>
                <el-option label="J" value="J"></el-option>
                <el-option label="F" value="F"></el-option>
                <el-option label="Z" value="Z"></el-option>
                <el-option label="S" value="S"></el-option>
                <el-option label="G" value="G"></el-option>
                <el-option label="W" value="W"></el-option>
                <el-option label="H" value="H"></el-option>
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
        <el-table-column prop="clients" label="检测判定去向" align="center" width="120px" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.clients.toString()}}</template>
        </el-table-column>
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
        <!-- <el-table-column label="操作" align="center" width="150px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="edit(scope.row)" v-if="scope.row.isEditing === false" :disabled="!isEditable">修改</el-button>
            <el-button size="mini" type="success" @click="save(scope.row)" v-else>保存</el-button>
            <el-button size="mini" type="danger" @click="del(scope.row)" v-if="isDeleteable">退库</el-button>
          </template>
        </el-table-column> -->
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
      searchForm: {
        caster: '',
        furnace: '',
        date: [],
        ribbonTypeNames: [],
        ribbonWidths: [],
        ribbonTotalLevels: '',
        ribbonThicknessLevels: [],
        laminationLevels: [],
        place: ''
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
      tableHeight: 550
    }
  },
  computed: {
    ...mapState([
      'ribbonTypeList', 'ribbonWidthList', 'ribbonThicknessLevelList', 'laminationLevelList'
    ])
  },
  created () {
    this.userinfo = JSON.parse(localStorage.getItem('userinfo'));
    this.isEditable = this.setEditable();
    this.isDeleteable = this.setDeleteable();
    this.isExportable = this.setExportable();
    this.getTableData();
    this.getRibbonTypeList();
    this.getRibbonWidthList();
    this.getRibbonThicknessLevelList();
    this.getLaminationLevelList();
  },
  mounted () {
    this.tableHeight = window.innerHeight - this.$refs.table.$el.getBoundingClientRect().top;
  },
  methods: {
    ...mapActions([
      'getRibbonTypeList', 'getRibbonWidthList', 'getRibbonThicknessLevelList', 'getLaminationLevelList'
    ]),
    inStoreDateFormat(row, column) {
      return row.inStoreDate ? dateFormat(row.inStoreDate) : '';
    },
    outStoreDateFormat(row, column) {
      return row.outStoreDate ? dateFormat(row.outStoreDate) : '';
    },
    setEditable() {
      if (this.userinfo.roleId == 6 || this.userinfo.roleId == 1) { // 检测人员 或者厂长 可修改
        return true;
      } else { // 其他
        return false;
      }
    },
    setDeleteable() {
      if (this.userinfo.roleId == 1 || this.userinfo.roleId == 6) { // 厂长和库房 可退库
        return true;
      } else { // 其他
        return false;
      }
    },
    setExportable() {
      if ([1, 2, 3, 6].includes(this.userinfo.roleId)) {
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
      this.searchForm = { caster: '', furnace: '', date: [], ribbonTypeNames: [], ribbonWidths: [], ribbonTotalLevels: '', ribbonThicknessLevels: [], laminationLevels: [], place: '' };
      const params = {
        current: 1
      };
      this.pageConfig.current = 1;
      this.getTableData(params);
    },
    getTableData(params = {}) {
      const _params = {
        // castId: this.castId,
        startTime: this.searchForm.date[0],
        endTime: this.searchForm.date[1],
        caster: this.searchForm.caster,
        furnace: this.searchForm.furnace,
        ribbonTypeNameJson: JSON.stringify(this.searchForm.ribbonTypeNames),
        ribbonWidthJson: JSON.stringify(this.searchForm.ribbonWidths),
        ribbonThicknessLevelJson: JSON.stringify(this.searchForm.ribbonThicknessLevels),
        laminationLevelJson: JSON.stringify(this.searchForm.laminationLevels),
        ribbonTotalLevels: this.searchForm.ribbonTotalLevels,
        place: this.searchForm.place,
        filterBy: 'storage' // 筛选库房所需的数据：入库且结余大于0
      };
      Object.assign(params, _params);
      this.$http('get', urlmap.queryMeasure, params).then(data => {
        this.pageConfig.total = data.count;
        data.list && data.list.forEach(item => {
          item.isEditing = false;
        });
        this.tableData = data.list && data.list.filter(item => {
          return (item.isStored == 1 || item.isStored == 2) && item.isMeasureConfirmed == 1;
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
      this.$confirm(`确定退库 ${furnace} 的第 ${coilNumber} 盘吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 库房测的删除操作并非真正的删除数据，而是将当前带材的入库状态改为不入库，3；并且检测的确认状态也改为0
        row.isStored = 3;
        row.isMeasureConfirmed = 0;
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
      } else {
        row.remainWeight = row.coilNetWeight;
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
    exportExcel() {
      const params = {
        startTime: this.searchForm.date[0],
        endTime: this.searchForm.date[1],
        caster: this.searchForm.caster,
        furnace: this.searchForm.furnace,
        ribbonTypeNameJson: JSON.stringify(this.searchForm.ribbonTypeNames),
        ribbonWidthJson: JSON.stringify(this.searchForm.ribbonWidths),
        ribbonThicknessLevelJson: JSON.stringify(this.searchForm.ribbonThicknessLevels),
        laminationLevelJson: JSON.stringify(this.searchForm.laminationLevels),
        ribbonTotalLevels: this.searchForm.ribbonTotalLevels,
        place: this.searchForm.place,
        filterBy: 'storage' // 筛选库房所需的数据：入库且结余大于0
      };
      const url = `${urlmap.exportStorage}?${qs.stringify(params)}`;
      window.open(url);
    }
  }
}
</script>
