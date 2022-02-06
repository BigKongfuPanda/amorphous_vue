<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="crumb">
      <el-breadcrumb-item>库存记录</el-breadcrumb-item>
      <el-breadcrumb-item>申请入库</el-breadcrumb-item>
    </el-breadcrumb>
    <Collapse>
      <el-form class="search_bar" :model="searchForm" :inline="true">
        <el-form-item label="炉号：">
          <!-- <el-input v-model="searchForm.furnace" placeholder="请输入炉号"></el-input> -->
          <el-select
            v-model="searchForm.furnaces"
            placeholder="请输入炉号关键字"
            multiple
            filterable
            remote
            collapse-tags
            :loading="selectLoading"
            :remote-method="remoteMethod"
          >
            <el-option
              v-for="furnace in furnaceList"
              :key="furnace"
              :label="furnace"
              :value="furnace"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="机组：">
          <el-select v-model="searchForm.castIds" placeholder="请选择" multiple>
            <el-option :value="6" label="6"></el-option>
            <el-option :value="7" label="7"></el-option>
            <el-option :value="8" label="8"></el-option>
            <el-option :value="9" label="9"></el-option>
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
    <el-row class="total_data">
      <el-col :span="4">总盘数：{{ totalCoilNum }}</el-col>
      <el-col :span="4">总重量(kg)：{{ totalWeight }}</el-col>
    </el-row>
    <div class="main_bd">
      <el-col class="table_hd">
        <el-button
          type="primary"
          icon="el-icon-check"
          @click="confirmInStore"
          v-if="roleId === 6"
          >确认入库</el-button
        >
      </el-col>
      <el-table
        :data="tableData"
        ref="table"
        stripe
        border
        style="width: 100%"
        :height="tableHeight"
        v-loading="loading"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="50"
          align="center"
          class-name="selection"
          :selectable="setSelectable"
        ></el-table-column>
        <el-table-column
          prop="furnace"
          label="炉号"
          align="center"
          width="130px"
          fixed
        ></el-table-column>
        <el-table-column
          prop="coilNumber"
          label="盘号"
          align="center"
          width="50px"
          fixed
        >
        </el-table-column>
        <el-table-column
          prop="ribbonTypeName"
          label="材质"
          align="center"
          width="70px"
        ></el-table-column>
        <el-table-column
          prop="ribbonWidth"
          label="规格"
          align="center"
          width="50px"
        ></el-table-column>
        <el-table-column
          prop="ribbonTotalLevel"
          label="综合级别"
          align="center"
          width="90px"
        ></el-table-column>
        <el-table-column
          prop="coilWeight"
          label="毛重"
          align="center"
          width="70px"
        ></el-table-column>
        <el-table-column
          prop="clients"
          label="检测判定去向"
          align="center"
          width="100px"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">{{ scope.row.clients }}</template>
        </el-table-column>
        <el-table-column
          prop="isStored"
          label="预计入库类型"
          align="center"
          width="100px"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.isStored == 1">计划内入库</span>
            <span v-if="scope.row.isStored == 2">计划外入库</span>
            <span v-if="scope.row.isStored == 3">否</span>
            <span v-if="scope.row.isStored == 4" class="text_warn"
              >退货入库</span
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="measureConfirmDate"
          label="申请入库时间"
          align="center"
          width="90px"
          :formatter="dateTimeFormat"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column label="操作" align="center" width="70px">
          <template slot-scope="scope">
            <!-- <el-button size="mini" type="primary" @click="edit(scope.row)" v-if="scope.row.isEditing === false" :disabled="!isEditable">修改</el-button>
            <el-button size="mini" type="success" @click="save(scope.row)" v-else>保存</el-button> -->
            <el-button
              size="mini"
              type="danger"
              @click="del(scope.row)"
              v-if="[1, 6].includes(roleId)"
              >驳回</el-button
            >
          </template>
        </el-table-column>
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
import qs from "qs";
import { cloneDeep } from "lodash";
import urlmap from "@/utils/urlmap";
import { dateFormat, debounce, dateTimeFormat } from "@/utils/common";
import Collapse from "@/components/collapse.vue";

export default {
  name: "storage",
  components: { Collapse },
  data() {
    return {
      roleId: 0,
      searchForm: {
        castIds: [6],
        furnaces: []
      },
      pageConfig: {
        total: 1,
        current: 1,
        pageSize: 10
      },
      loading: false,
      selectLoading: false,
      furnaceList: [],
      totalCoilNum: null,
      totalWeight: null,
      tableData: [],
      tableHeight: 200,
      multipleSelection: []
    };
  },

  created() {
    const userinfo = JSON.parse(localStorage.getItem("userinfo"));
    this.roleId = (userinfo && userinfo.roleId) || 0;
    this.getTableData();
  },
  mounted() {
    const self = this;
    self.$nextTick(() => {
      // self.tableHeight = window.innerHeight - self.$refs.table.$el.getBoundingClientRect().top;
      self.tableHeight = window.innerHeight - 100;
    });
    window.onresize = debounce(() => {
      // self.tableHeight = window.innerHeight - self.$refs.table.$el.getBoundingClientRect().top;
      self.tableHeight = window.innerHeight - 100;
    }, 1000);
  },
  methods: {
    dateTimeFormat(row, column) {
      return row.measureConfirmDate
        ? dateTimeFormat(row.measureConfirmDate)
        : "";
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
        castIds: [],
        furnaces: []
      };
      const params = {
        current: 1
      };
      this.pageConfig.current = 1;
      this.getTableData(params);
    },
    getTableData(params = {}) {
      const _params = {
        castIds: JSON.stringify(this.searchForm.castIds),
        furnaceJson: JSON.stringify(this.searchForm.furnaces)
      };
      Object.assign(params, _params);
      this.loading = true;
      this.$http("get", urlmap.queryApplyStorage, params)
        .then(data => {
          this.tableData = data.list;
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
    edit(row) {
      row.isEditing = true;
    },
    del(row) {
      const { measureId, furnace, coilNumber } = row;
      this.$prompt(
        `确定驳回 ${furnace} 的第 ${coilNumber} 盘吗？`,
        "请输入驳回原因",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputValidator(value) {
            if (!value) {
              return "驳回原因不能为空";
            }
          }
        }
      )
        .then(({ value }) => {
          this.$http("post", urlmap.rejectApplyStorage, {
            measureId,
            rejectReason: value
          })
            .then(data => {
              this.getTableData();
            })
            .catch(error => {
              console.log(error);
            });
        })
        .catch(() => {});
    },
    save(row) {
      row.isEditing = false;

      // 计算结存：当实际去向确定的时候，结余为 0
      if (row.takeBy) {
        row.remainWeight = 0;
      } else {
        row.remainWeight = row.coilNetWeight;
      }

      // 发送请求，更新当前的数据
      this.$http("PUT", urlmap.updateStorage, row)
        .then(data => {})
        .catch(error => {
          console.log(error);
        });
    },
    setSelectable(row, index) {
      return true;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.totalCoilNum = this.multipleSelection.length;
      this.totalWeight = this.multipleSelection.reduce((acc, cur) => {
        const sum = acc + cur.coilNetWeight;
        return sum;
      }, 0);
    },
    remoteMethod(query) {
      if (query !== "") {
        this.selectLoading = true;
        this.$http("GET", urlmap.queryFurnaceList, { query })
          .then(data => {
            this.furnaceList = data.list;
          })
          .catch(err => {
            console.log(err);
          })
          .finally(() => {
            this.selectLoading = false;
          });
      } else {
        this.furnaceList = [];
      }
    },
    confirmInStore() {
      const selectionList = cloneDeep(this.multipleSelection);
      if (selectionList.length === 0) {
        return this.$alert("请选择要入库的带材", "提示", { type: "warning" });
      }
      // 发送请求，更新当前的数据
      this.$http("POST", urlmap.batchAddStorage, {
        dataJson: JSON.stringify(selectionList)
      })
        .then(data => {
          this.getTableData();
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
.total_data {
  height: 46px;
  line-height: 46px;
  background: #fff;
  margin-top: 10px;
  padding: 0 30px;
}
</style>
