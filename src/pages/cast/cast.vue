<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="crumb">
      <el-breadcrumb-item>喷带记录</el-breadcrumb-item>
      <el-breadcrumb-item>{{castId}}号机组</el-breadcrumb-item>
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
      <el-form-item label="班组：">
        <el-select v-model="searchForm.team" placeholder="请选择班组">
          <el-option :label="castId + '#-甲'" :value="castId + '#-甲'"></el-option>
          <el-option :label="castId + '#-乙'" :value="castId + '#-乙'"></el-option>
          <el-option :label="castId + '#-丙'" :value="castId + '#-丙'"></el-option>
          <el-option :label="castId + '#-丁'" :value="castId + '#-丁'"></el-option>
        </el-select>
      </el-form-item>
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
      <el-col class="table_hd">
        <el-button type="primary" icon="el-icon-plus" @click="add" v-if="isAddAble">创建喷带记录</el-button>
      </el-col>
      <el-table :data="tableData" ref="table"  stripe border style="width:100%" :height="tableHeight" v-loading="loading">
        <el-table-column type="expand" label="展开" width="50px">
          <template slot-scope="props">
            <!-- 副表 -->
            <el-table
            :data="props.row.record" stripe border style="width:100%">
              <el-table-column label="开包" type="index" width="50px"></el-table-column>
              <el-table-column prop="nozzleSize" label="喷嘴规格" align="center" width="80px"></el-table-column>
              <el-table-column prop="treatCoolRoller" label="车修铜辊" align="center" width="80px"></el-table-column>
              <el-table-column prop="coolRollerThickness" label="铜套厚度" align="center" width="80px"></el-table-column>
              <el-table-column prop="ReceiveMeltTime" label="接钢时间" align="center" width="80px"></el-table-column>
              <el-table-column prop="tundishTemperatureWithoutMelt" label="接钢前包温/℃" align="center" width="120px"></el-table-column>
              <el-table-column prop="tundishTemperatureWithMelt" label="接钢后包温/℃" align="center" width="120px"></el-table-column>
              <el-table-column prop="installNozzleTime" label="装杯时间" align="center" width="80px"></el-table-column>
              <el-table-column prop="castTimeStart" label="开包时间" align="center" width="80px"></el-table-column>
              <el-table-column prop="pressure" label="开包压力" align="center" width="80px"></el-table-column>
              <el-table-column prop="tundishTemperatureCasting" label="开包温度/℃" align="center" width="100px"></el-table-column>
              <el-table-column prop="coolRollerTemperatureBeforeCast" label="喷带前水温/℃" align="center" width="120px"></el-table-column>
              <el-table-column prop="coolRollerTemperatureAfterCast" label="喷带后水温/℃" align="center" width="120px"></el-table-column>
              <el-table-column prop="castLocation" label="喷带位置" align="center" width="80px"></el-table-column>
              <el-table-column prop="coilTimes" label="抓取次数" align="center" width="80px"></el-table-column>
              <el-table-column prop="castTimeEnd" label="喷带完成时间" align="center" width="110px"></el-table-column>
              <el-table-column prop="describe" label="喷带结果描述" align="center" width="110px" :show-overflow-tooltip="true"></el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <!-- 主表  castTimes-->
        <el-table-column prop="createTime" label="喷带日期" align="center" width="110px" :formatter="dateFormat">
        </el-table-column>
        <el-table-column prop="ribbonTypeName" label="材质" align="center" width="80px">
        </el-table-column>
        <el-table-column prop="ribbonWidth" label="规格" align="center" width="50px"></el-table-column>
        <el-table-column prop="furnace" label="炉号" align="center" width="170px"></el-table-column>
        <el-table-column prop="team" label="班组" align="center" width="70px"></el-table-column>
        <el-table-column prop="caster" label="喷带手" align="center" width="70px"></el-table-column>
        <el-table-column prop="castTimes" label="开包次数" align="center" width="80px">
          <template slot-scope="scope">
            <span :class="scope.row.castTimes > 1 ? 'text_danger' : '' ">{{scope.row.castTimes}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="tundish" label="在线包号" align="center" width="80px"></el-table-column>
        <el-table-column prop="tundishCar" label="包车编号" align="center" width="80px"></el-table-column>
        <el-table-column prop="isChangeTundish" label="是否换包" align="center" width="80px">
          <template slot-scope="scope">
            <span v-if="scope.row.isChangeTundish === 1">是</span>
            <span v-else>否</span>
          </template>
        </el-table-column>
        <el-table-column prop="nozzleNum" label="喷嘴杯个数" align="center" width="100px"></el-table-column>
        <el-table-column prop="heatCupNum" label="加热杯个数" align="center" width="100px"></el-table-column>
        <el-table-column prop="meltOutWeight" label="放钢重量(kg)" align="center" width="110px"></el-table-column>
        <el-table-column prop="rawWeight" label="大盘毛重(kg)" align="center" width="110px"></el-table-column>
        <el-table-column prop="uselessRibbonWeight" label="废带重量(kg)" align="center" width="110px"></el-table-column>
        <el-table-column prop="remark" label="备注" align="center" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="updatedAt" label="更新时间" align="center" width="170px" :formatter="dateTimeFormat"></el-table-column>
        <el-table-column prop="updatePerson" label="更新者" align="center" width="70px"></el-table-column>
        <el-table-column label="操作" align="center" width="150px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="edit(scope.row)" :disabled="userinfo.roleId !== 1 && userinfo.roleId !== 3 && userinfo.adminname !== scope.row.caster">修改</el-button>
            <el-button size="mini" type="danger" @click="del(scope.row)" v-if="userinfo.roleId === 1 || userinfo.roleId === 3">删除</el-button>
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
    <dialog-form v-if="dialogVisible" :dialogData="{ formType, dialogVisible, rowData, ribbonTypeList, ribbonWidthList }" @close="closeHandler" @submit="submitHandler"></dialog-form>
  </div>
</template>

<script>
import urlmap from '@/utils/urlmap';
import { dateFormat, dateTimeFormat, debounce } from '@/utils/common';
import dialogForm from './components/dialogForm.vue';
import { mapState, mapActions } from 'vuex';

export default {
  name: 'cast',
  components: {
    dialogForm
  },
  data () {
    return {
      userinfo: {},
      castId: 6,
      searchForm: {
        caster: '',
        team: '',
        furnace: '',
        ribbonTypeName: '',
        date: [],
        ribbonWidths: []
      },
      loading: false,
      tableData: [],
      dialogVisible: false,
      formType: 'create',
      rowData: {},
      pageConfig: {
        total: 1,
        current: 1,
        pageSize: 10
      },
      isAddAble: false,
      isDelAble: false,
      tableHeight: 500
    }
  },
  computed: {
    ...mapState([
      'ribbonTypeList', 'ribbonWidthList'
    ])
  },
  // 动态路由匹配
  beforeRouteUpdate(to, from, next) {
    this.castId = to.params.castId;
    this.getTableData();
    // 判断当前用户角色是否有操作权限
    this.isAddAble = this.setIsAddAble(); 
    this.isDelAble = this.setIsDelAble();
    next();
  },
  created () {
    this.castId = this.$route.params.castId;
    this.userinfo = JSON.parse(localStorage.getItem('userinfo'));
    // 判断当前用户角色是否有操作权限
    this.isAddAble = this.setIsAddAble(); 
    this.isDelAble = this.setIsDelAble();
    this.getTableData();
    this.getRibbonTypeList();
    this.getRibbonWidthList();
  },
  mounted () {
    const self = this;
    self.$nextTick(() => {
      self.tableHeight = window.innerHeight - self.$refs.table.$el.getBoundingClientRect().top;
    });
    window.onresize = debounce(() => {
      self.tableHeight = window.innerHeight - self.$refs.table.$el.getBoundingClientRect().top;
    }, 1000)
  },
  methods: {
    ...mapActions([
      'getRibbonTypeList', 'getRibbonWidthList'
    ]),
    dateFormat(row, column) {
      return dateFormat(row.createTime);
    },
    dateTimeFormat(row, column) {
      return dateTimeFormat(row.updatedAt);
    },
    setIsAddAble() {
      // 7：6#机组喷带手，9：7#机组喷带手，11：8#机组喷带手，13：9#机组喷带手
      if (this.userinfo.roleId == 7 || this.userinfo.roleId == 9 || this.userinfo.roleId == 11 || this.userinfo.roleId == 13) {
        return true;
      } else { // 其他
        return false;
      }
    },
    setIsDelAble() {
      if (this.userinfo.roleId === 1 && this.userinfo.roleId === 3) {
        return true;
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
      this.searchForm = { caster: '', team: '', furnace: '', ribbonTypeName: '', date: [], ribbonWidths: [] };
      const params = {
        current: 1
      };
      this.pageConfig.current = 1;
      this.getTableData(params);
    },
    getTableData(params = {}) {
      const _params = {
        castId: this.castId,
        team: this.searchForm.team,
        startTime: this.searchForm.date[0],
        endTime: this.searchForm.date[1],
        caster: this.searchForm.caster,
        furnace: this.searchForm.furnace,
        ribbonTypeName: this.searchForm.ribbonTypeName,
        ribbonWidthJson: JSON.stringify(this.searchForm.ribbonWidths)
      };
      Object.assign(params, _params);
      this.$http('get', urlmap.queryCast, params).then(data => {
        this.pageConfig.total = data.count;
        // 将 record 转化为数组
        data.list.forEach(item => {
          item.record = JSON.parse(item.record);
        });
        this.tableData = data.list;
      }).catch((err) => {
        console.log(err);
      }).finally(() => {
        this.loading = false;
      });
    },
    add() {
      this.dialogVisible = true;
      this.formType = 'add';
    },
    edit(row) {
      this.rowData = row;
      this.dialogVisible = true;
      this.formType = 'edit';
    },
    del(row) {
      const { _id, furnace } = row;
      this.$confirm(`删除后数据无法恢复，确定删除 ${furnace} 吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http('delete', urlmap.delCast, {_id}).then(data => {
          this.getTableData();
        }).catch(error => {
          console.log(error);
        });
      }).catch(() => {});
    },
    closeHandler() {
      this.dialogVisible = false;
    },
    submitHandler() {
      if (this.formType === 'edit') {
        this.dialogVisible = false;
      }
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

