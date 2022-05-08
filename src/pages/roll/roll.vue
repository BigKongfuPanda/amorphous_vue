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
            value-format="yyyy-MM-dd HH:mm:ss"
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
        <el-form-item label="排序方式：">
          <el-select v-model="searchForm.orderBy" placeholder="请选择">
            <el-option label="按炉号降序和盘号升序" :value="2"></el-option>
            <el-option label="按更新时间" :value="1"></el-option>
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
        <!-- <el-button
          type="primary"
          icon="el-icon-success"
          v-if="isAddable"
          @click="handleConfirm"
          >确认送检</el-button
        > -->
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
          v-if="[1, 2, 3, 4, 5, 15].includes(userinfo.roleId)"
          >导出</el-button
        >
        <el-button
          type="primary"
          icon="el-icon-upload"
          @click="uploadExcelHandler"
          class="pull_right"
          v-if="[1, 2, 3, 5].includes(userinfo.roleId)"
          >导入</el-button
        >
      </el-col>
      <el-table
        :data="tableData"
        stripe
        border
        highlight-current-row
        style="width: 100%"
        v-loading="loading"
        ref="table"
        :height="tableHeight"
      >
        <!-- @selection-change="handleSelectionChange" -->
        <!-- <el-table-column
          type="selection"
          width="20"
          :selectable="setSelectable"
        ></el-table-column> -->
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
            <span>{{ scope.row.rollerName }}</span>
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
              :disabled="setIsEditable(scope.row)"
              >修改</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="del(scope.row)"
              v-if="[1, 2, 3, 4, 15].includes(userinfo.roleId)"
              :disabled="setIsEditable(scope.row)"
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
    <!-- 上传重卷excel弹出框 -->
    <el-dialog
      title="上传重卷数据"
      :visible.sync="uploadExcelForm.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="closeUploadDialog"
      :center="true"
      width="40%"
      v-loading="loading"
      element-loading-text="拼命加载中"
    >
      <el-upload
        class="upload"
        ref="upload"
        :action="uploadExcelForm.url"
        :file-list="uploadExcelForm.fileList"
        :multiple="false"
        :limit="1"
        accept=".xlsx"
        :on-error="uploadErrorHanler"
        :on-success="uploadSuccessHanler"
        :auto-upload="false"
      >
        <el-button slot="trigger" size="small" type="primary"
          >选取文件</el-button
        >
        <div slot="tip" class="el-upload__tip">
          只能上传xlsx文件，且不超过2M
        </div>
      </el-upload>
      <div slot="footer">
        <el-button type="primary" @click="submitUploadForm">上传提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import moment from "moment";
import urlmap from "@/utils/urlmap";
import { dateFormat, debounce, dateTimeFormat } from "@/utils/common";
import dialogForm from "./components/dialogForm.vue";
import Collapse from "@/components/collapse.vue";
import qs from "qs";
import { cloneDeep } from "lodash";

const defaultDateRange = [
  `${moment()
    .subtract(6, "days")
    .format("YYYY-MM-DD")} 00:00:00`,
  `${moment().format("YYYY-MM-DD")} 23:59:59`
];

export default {
  name: "melt",
  components: {
    dialogForm,
    Collapse
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
        orderBy: 2, // 默认按照炉号和盘号的顺序
        date: [...defaultDateRange]
      },
      loading: false,
      tableData: [],
      dialogVisible: false,
      formType: "add",
      rowData: {},
      pageConfig: {
        total: 1,
        current: 1,
        pageSize: 10
      },
      tableHeight: 200,
      multipleSelection: [],
      uploadExcelForm: {
        loading: false,
        visible: false,
        url: urlmap.uploadRoll,
        // url: "http://192.168.1.8:8080/api/measure/uploadRoll",
        fileList: []
      }
    };
  },
  // 动态路由匹配
  beforeRouteUpdate(to, from, next) {
    this.castId = to.params.castId;
    this.getTableData();
    // 判断当前用户角色是否有操作权限
    this.isAddable = this.setIsAddable();
    // this.isEditable = this.setIsEditable();
    next();
  },
  computed: {
    ...mapState(["rollerList"])
  },
  async created() {
    this.castId = this.$route.params.castId;
    this.userinfo = JSON.parse(localStorage.getItem("userinfo"));
    // 判断当前用户角色是否有操作权限
    this.isAddable = this.setIsAddable();
    // this.isEditable = this.setIsEditable();
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
        this.rollerList.find(item => item.roller === roller) || {};
      return rollerName || "";
    },
    dateFormat(row, column) {
      console.log(row.castDate);
      return dateFormat(row.castDate);
    },
    rollDateFormat(row, column) {
      return dateTimeFormat(row.createdAt);
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
        caster: "",
        furnace: "",
        roller: "",
        orderBy: 2,
        date: [...defaultDateRange]
      };
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
        furnace: this.searchForm.furnace,
        roller: this.searchForm.roller,
        orderBy: this.searchForm.orderBy
      };
      Object.assign(params, _params);
      this.loading = true;
      this.$http("get", urlmap.queryRollData, params)
        .then(data => {
          this.pageConfig.total = data.count;
          this.pageConfig.pageSize = data.limit;
          data.list &&
            data.list.forEach(item => {
              item.clients = item.clients ? item.clients.split(",") : [];
              item.rollerName = item.rollerName
                ? item.rollerName
                : this.getRollerName(item.roller);
            });
          this.tableData = data.list;
        })
        .catch(err => {
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
          type: "warning"
        }
      )
        .then(() => {
          this.$http("delete", urlmap.delRoll, { measureId })
            .then(data => {
              this.getTableData();
            })
            .catch(error => {
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
        current: val
      };
      this.getTableData(params);
    },
    setIsAddable() {
      if ([1, 2, 3, 4, 15].includes(this.userinfo.roleId)) {
        // 重卷人员可修改
        return true;
      } else {
        // 其他
        return false;
      }
    },
    setIsEditable(row) {
      /**
       * 重卷组员：能够修改自己的，不能修改其他人的。
       * 重卷组长，管理员：能够修改所有人
       */
      if (
        [1, 2, 3, 15].includes(this.userinfo.roleId) ||
        (this.userinfo.roleId === 4 &&
          row.rollerName === this.userinfo.adminname)
      ) {
        return false;
      } else {
        // 其他
        return true;
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
        roller
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
            center: true
          }
        )
          .then(() => {})
          .catch(error => {
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
    uploadExcelHandler() {
      this.uploadExcelForm.visible = true;
      this.uploadExcelForm.fileList = [];
    },
    closeUploadDialog() {
      this.uploadExcelForm.visible = false;
    },
    submitUploadForm() {
      // if (this.uploadExcelForm.fileList.length === 0) {
      //   return this.$message({
      //   message: '请选择excel表格',
      //   type: "warning"
      // });
      // }
      this.$refs.upload.submit();
      this.uploadExcelForm.visible = false;
      const params = {
        current: 1
      };
      this.pageConfig.current = 1;
      this.getTableData(params);
    },
    uploadErrorHanler(error, file, fileList) {
      this.$message({
        message: `上传失败：${error.message}`,
        type: "error"
      });
    },
    uploadSuccessHanler(res, file, fileList) {
      if (res.status === 0) {
        this.$message({
          message: res.message,
          type: "success"
        });
      } else {
        let html = "";
        res.data.forEach(item => {
          html += `<p>炉号：${item.furnace}，盘号：${item.coilNumber}</p>`;
        });
        this.$alert(html, "以下带材更新数据失败，请检查炉号是否正确：", {
          dangerouslyUseHTMLString: true,
          type: "warning"
        });
      }
      const params = {
        current: 1
      };
      this.pageConfig.current = 1;
      this.getTableData(params);
    }
  }
};
</script>
