<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="crumb">
      <el-breadcrumb-item>重卷记录</el-breadcrumb-item>
      <el-breadcrumb-item>{{ castId }}号机组</el-breadcrumb-item>
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
        <el-form-item label="喷带手：">
          <el-input
            v-model="searchForm.caster"
            placeholder="请输入喷带手姓名"
          ></el-input>
        </el-form-item>
        <el-form-item label="炉号：">
          <el-input
            v-model="searchForm.furnace"
            placeholder="请输入炉号"
          ></el-input>
        </el-form-item>
        <el-form-item label="重卷：">
          <!-- <el-input v-model="searchForm.roller" placeholder="请输入重卷人姓名"></el-input> -->
          <el-select v-model="searchForm.roller" placeholder="请选择重卷人姓名">
            <el-option
              v-for="item in rollerList"
              :key="item.roller"
              :value="item.roller"
              :label="item.rollerName"
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
        <el-button type="primary" icon="el-icon-success" @click="handleConfirm"
          >确认送检</el-button
        >
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="add"
          v-if="isAddable"
          >创建重卷记录</el-button
        >
        <el-button
          type="primary"
          icon="el-icon-download"
          @click="exportExcel"
          class="pull_right"
          >导出</el-button
        >
      </el-col>
      <el-table
        :data="tableData"
        stripe
        border
        style="width: 100%"
        v-loading="loading"
        ref="table"
        :height="tableHeight"
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
          min-width="130px"
        ></el-table-column>
        <el-table-column
          prop="ribbonTypeName"
          label="材质"
          align="center"
          min-width="60px"
        ></el-table-column>
        <el-table-column
          prop="ribbonWidth"
          label="规格"
          align="center"
          width="40px"
        ></el-table-column>
        <el-table-column
          prop="castDate"
          label="生产日期"
          align="center"
          :formatter="dateFormat"
          min-width="80px"
        ></el-table-column>
        <el-table-column
          prop="caster"
          label="喷带手"
          align="center"
          width="50px"
        ></el-table-column>
        <el-table-column
          prop="coilNumber"
          label="盘号"
          align="center"
          width="40px"
        ></el-table-column>
        <el-table-column
          prop="diameter"
          label="外径(mm)"
          align="center"
          width="70px"
        ></el-table-column>
        <el-table-column
          prop="coilWeight"
          label="重量(kg)"
          align="center"
          width="70px"
        ></el-table-column>
        <el-table-column
          prop="rollMachine"
          label="机器编号"
          align="center"
          width="70px"
        ></el-table-column>
        <el-table-column
          prop="roller"
          label="重卷人员"
          align="center"
          width="70px"
        >
          <template slot-scope="scope">
            <span>{{ getRollerName(scope.row.roller) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="createdAt"
          label="重卷日期"
          align="center"
          :formatter="rollDateFormat"
          min-width="80px"
        ></el-table-column>
        <el-table-column label="是否平整" align="center" width="60px">
          <template slot-scope="scope">
            <span :class="{ text_danger: scope.row.isFlat === 1 }">{{
              scope.row.isFlat === 1 ? "否" : "是"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="140px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="edit(scope.row)"
              v-if="[1, 2, 3, 4, 15].includes(userinfo.roleId)"
              :disabled="
                getRollerName(scope.row.roller) !== userinfo.adminname &&
                userinfo.roleId !== 1
              "
              >修改</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="del(scope.row)"
              v-if="[1, 2, 3, 4, 15].includes(userinfo.roleId)"
              >删除</el-button
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
    <dialog-form
      v-if="dialogVisible"
      :rollerList="rollerList"
      :dialogData="{ formType, dialogVisible, rowData }"
      @close="closeHandler"
      @submit="submitHandler"
    ></dialog-form>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import urlmap from "@/utils/urlmap";
import { dateFormat, debounce, dateTimeFormat } from "@/utils/common";
import dialogForm from "./components/dialogForm.vue";
import Collapse from "@/components/collapse.vue";
import qs from "qs";
import { cloneDeep } from "lodash";

export default {
  name: "melt",
  components: {
    dialogForm,
    Collapse,
  },
  data() {
    return {
      userinfo: {},
      isAddable: false,
      isEditable: false,
      castId: 6,
      searchForm: {
        caster: "",
        furnace: "",
        roller: "",
        date: [],
      },
      loading: false,
      tableData: [],
      dialogVisible: false,
      formType: "add",
      rowData: {},
      pageConfig: {
        total: 1,
        current: 1,
        pageSize: 10,
      },
      tableHeight: 200,
      multipleSelection: [],
    };
  },
  // 动态路由匹配
  beforeRouteUpdate(to, from, next) {
    this.castId = to.params.castId;
    this.getTableData();
    // 判断当前用户角色是否有操作权限
    this.isAddable = this.setIsAddable();
    this.isEditable = this.setIsEditable();
    next();
  },
  computed: {
    ...mapState(["rollerList"]),
  },
  async created() {
    this.castId = this.$route.params.castId;
    this.userinfo = JSON.parse(localStorage.getItem("userinfo"));
    // 判断当前用户角色是否有操作权限
    this.isAddable = this.setIsAddable();
    this.isEditable = this.setIsEditable();
    await this.getRollerList();
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
    ...mapActions(["getRollerList"]),
    getRollerName(roller) {
      const { rollerName } =
        this.rollerList.find((item) => item.roller === roller) || {};
      return rollerName || "";
    },
    dateFormat(row, column) {
      return dateFormat(row.castDate);
    },
    rollDateFormat(row, column) {
      return dateTimeFormat(row.createdAt);
    },
    clickSearch() {
      // 重置当前页码为1
      const params = {
        current: 1,
      };
      this.pageConfig.current = 1;
      this.getTableData(params);
    },
    reset() {
      this.searchForm = { caster: "", furnace: "", roller: "", date: [] };
      const params = {
        current: 1,
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
        furnace: this.searchForm.furnace,
        roller: this.searchForm.roller,
      };
      Object.assign(params, _params);
      this.$http("get", urlmap.queryRollData, params)
        .then((data) => {
          this.pageConfig.total = data.count;
          this.pageConfig.pageSize = data.limit;
          data.list &&
            data.list.forEach((item) => {
              item.clients = item.clients ? item.clients.split(",") : [];
            });
          this.tableData = data.list;
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    add() {
      this.dialogVisible = true;
      this.formType = "add";
    },
    edit(row) {
      this.rowData = row;
      this.dialogVisible = true;
      this.formType = "edit";
    },
    del(row) {
      const { measureId, furnace, coilNumber } = row;
      this.$confirm(
        `该操作可能会影响检测数据，请确认没有送检和入库之后再删除`,
        `确定要删除 ${furnace} 的 第 ${coilNumber} 盘 吗？`,
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          this.$http("delete", urlmap.delRoll, { measureId })
            .then((data) => {
              this.getTableData();
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch(() => {});
    },
    closeHandler() {
      this.dialogVisible = false;
    },
    submitHandler() {
      if (this.formType === "edit") {
        this.dialogVisible = false;
      }
      this.pageConfig.current = 1;
      this.getTableData();
    },
    handleCurrentChange(val) {
      const params = {
        current: val,
      };
      this.getTableData(params);
    },
    setIsAddable() {
      if (this.userinfo.roleId == 4 || this.userinfo.roleId == 15) {
        // 重卷人员可修改
        return true;
      } else {
        // 其他
        return false;
      }
    },
    setIsEditable() {
      if (
        this.userinfo.roleId == 4 ||
        this.userinfo.roleId == 15 ||
        this.userinfo.roleId == 1
      ) {
        // 重卷人员 或者厂长 可修改
        return true;
      } else {
        // 其他
        return false;
      }
    },
    exportExcel() {
      const castId = this.castId;
      const startTime = this.searchForm.date[0];
      const endTime = this.searchForm.date[1];
      const caster = this.searchForm.caster;
      const furnace = this.searchForm.furnace;
      const roller = this.searchForm.roller;
      const params = {
        castId,
        startTime,
        endTime,
        caster,
        furnace,
        roller,
      };

      // 如果所有的条件都为空，则提示是否导出全部数据
      if (!startTime && !endTime && !caster && !furnace && !roller) {
        this.$confirm(
          "没有设置搜索条件，将导出全部数据，速度很慢，要继续导出吗?",
          "提示",
          {
            confirmButtonText: "去设置筛选条件",
            cancelButtonText: "继续导出",
            type: "warning",
            center: true,
          }
        )
          .then(() => {})
          .catch((error) => {
            const url = `${urlmap.exportRoll}?${qs.stringify(params)}`;
            window.open(url);
          });
      } else {
        const url = `${urlmap.exportRoll}?${qs.stringify(params)}`;
        window.open(url);
      }
    },
    setSelectable(row, index) {
      // 未被确认，则可选
      if (row.isRollConfirmed !== 1) {
        return true;
      } else {
        return false;
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleConfirm() {
      const selectionList = cloneDeep(this.multipleSelection);
      if (selectionList.length === 0) {
        return this.$alert("请选择带材", "提示", { type: "warning" });
      }
      // 发送请求，更新当前的数据
      this.$http("POST", urlmap.rollConfirm, {
        rollDataJson: JSON.stringify(selectionList),
      })
        .then((data) => {
          this.getTableData();
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>


