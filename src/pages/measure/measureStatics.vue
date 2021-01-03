<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="crumb">
      <el-breadcrumb-item>检测合格率</el-breadcrumb-item>
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
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="机组：">
          <el-select v-model="searchForm.castId" placeholder="请选择">
            <el-option :value="6" label="6号"></el-option>
            <el-option :value="7" label="7号"></el-option>
            <el-option :value="8" label="8号"></el-option>
            <el-option :value="9" label="9号"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="炉号：">
          <el-input
            v-model="searchForm.furnace"
            placeholder="请输入炉号"
          ></el-input>
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
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="clickSearch"
            >搜索</el-button
          >
          <el-button type="primary" icon="el-icon-refresh" @click="reset"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </Collapse>
    <div class="main_bd">
      <el-row class="total_data">
        <el-col :span="6"
          >炉次合计：<span class="total_num">{{ totalCount }}</span></el-col
        >
        <el-col :span="6"
          >净重合计(kg)：<span class="total_num">{{
            totalWeight
          }}</span></el-col
        >
        <el-col :span="6"
          >合格重量合计(kg)：<span class="total_num">{{
            totalQualifiedWeight
          }}</span></el-col
        >
        <el-col :span="6"
          >合格率合计：<span class="total_num">{{
            totalQualifiedRatio
          }}</span></el-col
        >
      </el-row>
      <el-table
        :data="tableData"
        ref="table"
        stripe
        border
        highlight-current-row
        style="width: 100%"
        :height="tableHeight"
        v-loading="loading"
      >
        <el-table-column
          prop="furnace"
          label="炉号"
          align="center"
          fixed
        ></el-table-column>
        <el-table-column
          prop="netWeight"
          label="净重合计(kg)"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="qualifiedWeight"
          label="合格重量(kg)"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="qualifyOfRatio"
          label="合格率（%）"
          align="center"
        ></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import qs from "qs";
import { cloneDeep } from "lodash";
import { Message } from "element-ui";
import urlmap from "@/utils/urlmap";
import { dateFormat, dateTimeFormat, debounce } from "@/utils/common";
import { mapState, mapActions } from "vuex";
import Collapse from "@/components/collapse.vue";

export default {
  name: "melt",
  components: {
    Collapse
  },
  data() {
    return {
      userinfo: {},
      searchForm: {
        castId: 6,
        furnace: "",
        date: [
          new Date(Date.now()),
          new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
        ],
        ribbonTypeNames: [],
        ribbonWidths: []
      },
      loading: false,
      tableData: [],
      tableHeight: 550,
      totalCount: 0,
      totalWeight: 0,
      totalQualifiedWeight: 0,
      totalQualifiedRatio: ""
    };
  },
  computed: {
    ...mapState(["ribbonTypeList"])
  },
  // 动态路由匹配
  beforeRouteUpdate(to, from, next) {
    this.castId = to.params.castId;
    this.getTableData();
    next();
  },
  async created() {
    this.castId = this.$route.params.castId;
    this.userinfo = JSON.parse(localStorage.getItem("userinfo"));
    await this.getRibbonTypeList();
    this.getTableData();
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
    ...mapActions(["getRibbonTypeList"]),
    clickSearch() {
      this.getTableData();
    },
    reset() {
      this.searchForm = {
        caster: "",
        furnace: "",
        date: [],
        ribbonTypeNames: [],
        ribbonWidths: []
      };
      this.getTableData(params);
    },
    getTableData(params = {}) {
      const _params = {
        castId: this.searchForm.castId,
        startTime: this.searchForm.date[0],
        endTime: this.searchForm.date[1],
        furnace: this.searchForm.furnace,
        ribbonTypeNameJson: JSON.stringify(this.searchForm.ribbonTypeNames)
      };
      Object.assign(params, _params);
      this.$http("get", urlmap.queryMeasureStatics, params)
        .then(data => {
          this.tableData = data.list;
          this.totalCount = data.list.length;
          let totalWeight = 0;
          let totalQualifiedWeight = 0;
          data.list.forEach(item => {
            totalWeight += item.netWeight;
            totalQualifiedWeight += item.qualifiedWeight;
          });
          this.totalWeight = totalWeight;
          this.totalQualifiedWeight = totalQualifiedWeight;
          this.totalQualifiedRatio =
            ((100 * totalQualifiedWeight) / totalWeight).toFixed(2) + "%";
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
  }
};
</script>
<style lang="scss" scoped>
.popover_table {
  text-align: center;
  th,
  td {
    border-bottom: 1px solid #dcdfe6;
  }
  td {
    padding: 5px 8px;
  }
}
.total_data {
  height: 46px;
  line-height: 46px;
  background: #fff;
  margin-top: 10px;
  padding: 0 30px;
  font-size: 14px;
  .total_num {
    font-size: 20px;
    font-weight: bold;
  }
}
</style>
