<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="crumb">
      <el-breadcrumb-item>重卷重量统计</el-breadcrumb-item>
    </el-breadcrumb>
    <Collapse>
      <el-form class="search_bar" :model="searchForm" :inline="true">
        <el-form-item label="生产日期：">
          <el-date-picker
            v-model="searchForm.date"
            type="daterange"
            :default-time="['00:00:00', '23:59:59']"
            value-format="yyyy-MM-dd HH:mm:ss"
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
      <el-col class="table_hd">
        <el-button
          type="primary"
          icon="el-icon-success"
          v-if="[1, 2, 3, 4, 15].includes(userinfo.roleId)"
          @click="handleConfirm"
          >确认送检</el-button
        >
      </el-col>
      <el-table
        :data="tableData"
        ref="table"
        stripe
        border
        highlight-current-row
        style="width: 100%"
        :height="tableHeight"
        v-loading="loading"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="20"
          :selectable="setSelectable"
        ></el-table-column>
        <el-table-column
          prop="furnace"
          label="炉号"
          align="center"
          fixed
        ></el-table-column>
        <el-table-column
          prop="createTime"
          label="喷带日期"
          align="center"
          min-width="110px"
          :formatter="dateFormat"
        >
        </el-table-column>
        <el-table-column prop="ribbonTypeName" label="材质" align="center">
        </el-table-column>
        <el-table-column
          prop="ribbonWidth"
          label="规格"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="castId"
          label="机组"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="alloyTotalWeight"
          label="母合金投入/kg"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="coilCount"
          label="盘数"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="rawWeight"
          label="大盘毛重/kg"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="totalCoilWeight"
          label="重卷净重/kg"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="balanceWeight"
          label="毛重-净重/kg"
          align="center"
        ></el-table-column>
      </el-table>
      <el-pagination
        background
        layout="total,prev,pager,next"
        :total="pageConfig.total"
        :current-page.sync="pageConfig.current"
        :page-size="pageConfig.pageSize"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import urlmap from "@/utils/urlmap";
import moment from "moment";
import { dateFormat, dateTimeFormat, debounce } from "@/utils/common";
import { mapState, mapActions } from "vuex";
import Collapse from "@/components/collapse.vue";

const defaultDateRange = [
  `${moment()
    .subtract(6, "days")
    .format("YYYY-MM-DD")} 00:00:00`,
  `${moment().format("YYYY-MM-DD")} 23:59:59`
];

export default {
  name: "measureStatics",
  components: {
    Collapse
  },
  data() {
    return {
      userinfo: {},
      searchForm: {
        castId: 6,
        furnace: "",
        date: [...defaultDateRange],
        ribbonTypeNames: [],
        ribbonWidths: []
      },
      loading: false,
      tableData: [],
      tableHeight: 550,
      pageConfig: {
        total: 1,
        current: 1,
        pageSize: 10
      }
    };
  },
  computed: {
    ...mapState(["ribbonTypeList", "linerWeightList"])
  },
  async created() {
    this.userinfo = JSON.parse(localStorage.getItem("userinfo"));
    await this.getRibbonTypeList();
    await this.getLinerWeightList();
    this.getTableData();
  },
  mounted() {
    const self = this;
    self.$nextTick(() => {
      self.tableHeight = window.innerHeight - 80;
    });
    window.onresize = debounce(() => {
      self.tableHeight = window.innerHeight - 80;
    }, 1000);
  },
  methods: {
    ...mapActions(["getRibbonTypeList", "getLinerWeightList"]),
    setSelectable(row, index) {
      // 未被确认，则可选
      if (row.isAllRollConfirmed === 1) {
        return false;
      } else {
        return true;
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    dateFormat(row, column) {
      return dateFormat(row.createTime);
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
      this.searchForm = {
        castId: "",
        furnace: "",
        date: [],
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
        castId: this.searchForm.castId,
        startTime: this.searchForm.date[0],
        endTime: this.searchForm.date[1],
        furnace: this.searchForm.furnace,
        ribbonTypeNameJson: JSON.stringify(this.searchForm.ribbonTypeNames)
      };
      Object.assign(params, _params);
      this.loading = true;

      this.$http("get", urlmap.queryRollStatics, params)
        .then(data => {
          Array.isArray(data.list) &&
            data.list.forEach(item => {
              // 计算净重
              item.totalCoilWeight = (
                item.totalCoilWeight -
                this.calcLinerWeight(item.ribbonWidth) * item.coilCount
              ).toFixed(2);
              // 计算大盘毛重和净重的差值
              item.balanceWeight = (
                item.rawWeight - item.totalCoilWeight
              ).toFixed(2);
            });
          this.tableData = data.list || [];
          this.pageConfig.total = data.count;
          this.pageConfig.pageSize = data.limit;
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 计算内衬的重量
    calcLinerWeight(ribbonWidth) {
      /**
       * 计算单盘净重，不同规格的内衬重量不同
       * 内衬的规格和重量对应表
       */
      ribbonWidth = Number(ribbonWidth);
      const { linerWeight } =
        this.linerWeightList.find(item => item.ribbonWidth === ribbonWidth) ||
        {};

      if (!linerWeight) {
        Message({
          message: `带材宽度${ribbonWidth}没有配置所用内衬重量，请联系管理员进行配置！`,
          type: "error"
        });
        return 0;
      }
      return linerWeight;
    },
    handleConfirm() {
      const selectionList = cloneDeep(this.multipleSelection);
      if (selectionList.length === 0) {
        return this.$alert("请选择带材", "提示", { type: "warning" });
      }
      const obj = {};
      selectionList.forEach(item => {
        const { furnace, coilNumber } = item;
        if (obj.hasOwnProperty(furnace) && Array.isArray(obj[furnace])) {
          if (obj[furnace].includes(coilNumber)) {
            return this.$alert(
              `炉号${furnace}，盘号${coilNumber} 存在重复盘号，请检查并手动修改数据，同时更新标签`
            );
          } else {
            obj[furnace].push(coilNumber);
          }
        } else {
          obj[furnace] = [coilNumber];
        }
      });
      // 发送请求，更新当前的数据
      this.$http("POST", urlmap.rollConfirm, {
        rollDataJson: JSON.stringify(selectionList)
      })
        .then(data => {
          if (data.status === 0) {
            this.pageConfig.current = 1;
            this.getTableData();
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    handleCurrentChange(val) {
      const params = {
        current: val
      };
      this.getTableData(params);
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
