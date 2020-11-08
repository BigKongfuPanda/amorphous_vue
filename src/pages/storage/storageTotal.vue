<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="crumb">
      <el-breadcrumb-item>库存记录</el-breadcrumb-item>
      <el-breadcrumb-item>库存主表</el-breadcrumb-item>
    </el-breadcrumb>
    <Collapse>
      <el-form class="search_bar" :model="searchForm" :inline="true">
        <el-form-item label="机组：">
          <el-select v-model="searchForm.castIds" placeholder="请选择" multiple>
            <el-option :value="6" label="6号"></el-option>
            <el-option :value="7" label="7号"></el-option>
            <el-option :value="8" label="8号"></el-option>
            <el-option :value="9" label="9号"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="入库日期：">
          <el-date-picker
            v-model="searchForm.date"
            type="daterange"
            :default-time="['00:00:00', '23:59:59']"
            :clearable="false"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="出库日期：">
          <el-date-picker
            v-model="searchForm.outDate"
            type="daterange"
            :default-time="['00:00:00', '23:59:59']"
            :clearable="false"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
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
            :remote-method="query => remoteMethod(query, 'furnace')"
          >
            <el-option
              v-for="furnace in furnaceList"
              :key="furnace"
              :label="furnace"
              :value="furnace"
            ></el-option>
          </el-select>
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
        <el-form-item label="规格：">
          <el-select
            v-model="searchForm.ribbonWidths"
            placeholder="请选择"
            multiple
            collapse-tags
          >
            <el-option
              v-for="item in ribbonWidthList"
              :key="item.ribbonWidthId"
              :label="item.ribbonWidth"
              :value="item.ribbonWidth"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="厚度级别：">
          <el-select
            v-model="searchForm.ribbonThicknessLevels"
            placeholder="请选择"
            multiple
            collapse-tags
          >
            <el-option
              v-for="item in ribbonThicknessLevelList"
              :key="item.ribbonThicknessLevelId"
              :label="item.ribbonThicknessLevel"
              :value="item.ribbonThicknessLevel"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="叠片级别：">
          <el-select
            v-model="searchForm.laminationLevels"
            placeholder="请选择"
            multiple
            collapse-tags
          >
            <el-option
              v-for="item in laminationLevelList"
              :key="item.laminationLevelId"
              :label="item.laminationLevel"
              :value="item.laminationLevel"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="综合级别：">
          <!-- <el-input
            v-model="searchForm.ribbonTotalLevels"
            placeholder="请输入综合级别，以逗号分隔"
          ></el-input> -->
          <el-select
            v-model="searchForm.ribbonTotalLevels"
            placeholder="请输入综合级别关键字"
            multiple
            filterable
            remote
            collapse-tags
            :loading="selectLoading"
            :remote-method="query => remoteMethod(query, 'ribbonTotalLevel')"
          >
            <el-option
              v-for="ribbonTotalLevel in ribbonTotalLevelList"
              :key="ribbonTotalLevel"
              :label="ribbonTotalLevel"
              :value="ribbonTotalLevel"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="仓位：">
          <el-input
            v-model="searchForm.place"
            placeholder="请输入仓位，以逗号分隔"
          ></el-input>
        </el-form-item>
        <el-form-item label="去向：">
          <el-select
            v-model="searchForm.takebys"
            placeholder="请选择"
            multiple
            collapse-tags
          >
            <el-option label="J" value="J"></el-option>
            <el-option label="F" value="F"></el-option>
            <el-option label="Z" value="Z"></el-option>
            <el-option label="S" value="S"></el-option>
            <el-option label="G" value="G"></el-option>
            <el-option label="W" value="W"></el-option>
            <el-option label="H" value="H"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="结余：">
          <el-select v-model="searchForm.isRemain" placeholder="">
            <el-option value="" label="全部"></el-option>
            <el-option :value="0" label="=0"></el-option>
            <el-option :value="1" label=">0"></el-option>
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
      <el-col :span="6">总盘数：{{ totalCoilNum }}</el-col>
      <el-col :span="6">总重量(kg)：{{ totalWeight }}</el-col>
    </el-row>
    <div class="main_bd">
      <el-col class="table_hd">
        <el-button
          type="primary"
          icon="el-icon-download"
          @click="exportExcel"
          v-if="isExportable"
          >导出</el-button
        >
        <!-- <el-button type="primary" icon="el-icon-upload" @click="uploadExcelHandler" v-if="userinfo.roleId == 6">批量入仓</el-button>
        <el-button type="primary" icon="el-icon-menu" @click="allOutStoreHandler" v-if="isOutStoreable" class="pull_right">整托出库</el-button>
        <el-button type="primary" icon="el-icon-rank" @click="batchOutStoreHandler" v-if="isOutStoreable" class="pull_right">批量出库</el-button> -->
      </el-col>
      <el-table
        :data="tableData"
        ref="table"
        stripe
        border
        style="width:100%"
        :height="tableHeight"
        v-loading="loading"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="30"
          :selectable="setSelectable"
        ></el-table-column>
        <el-table-column
          prop="inStoreDate"
          label="入库日期"
          align="center"
          :formatter="inStoreDateFormat"
          width="110px"
        ></el-table-column>
        <el-table-column
          prop="furnace"
          label="炉号"
          align="center"
          width="170px"
          fixed
        ></el-table-column>
        <el-table-column
          prop="coilNumber"
          label="盘号"
          align="center"
          width="50px"
          fixed
        ></el-table-column>
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
          prop="ribbonThicknessLevel"
          label="带厚级别"
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
          prop="coilNetWeight"
          label="净重"
          align="center"
          width="70px"
        ></el-table-column>
        <el-table-column
          prop="isStored"
          label="入库情况"
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
          prop="outStoreDate"
          label="出库日期"
          align="center"
          :formatter="outStoreDateFormat"
          width="110px"
        ></el-table-column>
        <el-table-column
          prop="takeBy"
          label="实际去向"
          align="center"
          width="100px"
        >
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
        <el-table-column
          prop="remainWeight"
          label="结存"
          align="center"
          width="90px"
        ></el-table-column>
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
        <el-table-column
          prop="clients"
          label="检测判定去向"
          align="center"
          width="120px"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">{{ scope.row.clients }}</template>
        </el-table-column>
        <el-table-column
          prop="shipRemark"
          label="发货备注"
          align="center"
          width="100px"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.isEditing === false">
              {{ scope.row.shipRemark }}
            </div>
            <div v-else>
              <el-input size="mini" v-model="scope.row.shipRemark"></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="150px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="edit(scope.row)"
              v-if="scope.row.isEditing === false"
              :disabled="!isEditable"
              >修改</el-button
            >
            <el-button
              size="mini"
              type="success"
              @click="save(scope.row)"
              v-else
              >保存</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="del(scope.row)"
              v-if="isDeleteable"
              >退库</el-button
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
    <!-- 整托出库弹出框 -->
    <el-dialog
      title="整托出库"
      :visible.sync="allOutStoreForm.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="closeAllOutDialog"
      :center="true"
      width="30%"
      v-loading="loading"
      element-loading-text="拼命加载中"
    >
      <el-form
        :model="allOutStoreForm"
        :rules="allOutStoreFormRules"
        ref="allOutStoreForm"
        label-width="100px"
        style="100%"
        @submit.native.prevent
      >
        <el-form-item label="仓位：" prop="place">
          <el-input v-model="allOutStoreForm.place"></el-input>
        </el-form-item>
        <el-form-item label="去向：" prop="takeBy">
          <el-select v-model="allOutStoreForm.takeBy" placeholder="">
            <el-option label="J" value="J"></el-option>
            <el-option label="F" value="F"></el-option>
            <el-option label="Z" value="Z"></el-option>
            <el-option label="S" value="S"></el-option>
            <el-option label="G" value="G"></el-option>
            <el-option label="W" value="W"></el-option>
            <el-option label="H" value="H"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="closeAllOutDialog">取消</el-button>
        <el-button type="primary" @click="submitAllOutForm">提交</el-button>
      </div>
    </el-dialog>
    <!-- 批量出库弹出框 -->
    <el-dialog
      title="批量出库"
      :visible.sync="batchOutStoreForm.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="closeBatchOutDialog"
      :center="true"
      width="30%"
      v-loading="loading"
      element-loading-text="拼命加载中"
    >
      <el-form
        :model="batchOutStoreForm"
        :rules="batchOutStoreFormRules"
        ref="batchOutStoreForm"
        label-width="100px"
        style="100%"
        @submit.native.prevent
      >
        <el-form-item label="去向：" prop="takeBy">
          <el-select v-model="batchOutStoreForm.takeBy" placeholder="">
            <el-option label="J" value="J"></el-option>
            <el-option label="F" value="F"></el-option>
            <el-option label="Z" value="Z"></el-option>
            <el-option label="S" value="S"></el-option>
            <el-option label="G" value="G"></el-option>
            <el-option label="W" value="W"></el-option>
            <el-option label="H" value="H"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="closeBatchOutDialog">取消</el-button>
        <el-button type="primary" @click="submitBatchOutForm">提交</el-button>
      </div>
    </el-dialog>
    <!-- 批量添加仓位弹出框 -->
    <el-dialog
      title="批量入仓"
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
          只能上传xlsx文件，且不超过500kb
        </div>
      </el-upload>
      <div slot="footer">
        <el-button type="primary" @click="submitUploadForm">上传提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import qs from "qs";
import urlmap from "@/utils/urlmap";
import { dateFormat, debounce } from "@/utils/common";
import { mapState, mapActions } from "vuex";
import Collapse from "@/components/collapse.vue";

export default {
  name: "storage",
  components: { Collapse },
  data() {
    return {
      userinfo: {},
      searchForm: {
        castIds: [],
        caster: "",
        furnaces: [],
        date: [],
        outDate: [],
        ribbonTypeNames: [],
        ribbonWidths: [],
        ribbonTotalLevels: [],
        ribbonThicknessLevels: [],
        laminationLevels: [],
        takebys: [],
        place: "",
        isRemain: 1
      },
      loading: false,
      selectLoading: false,
      furnaceList: [],
      ribbonTotalLevelList: [],
      totalCoilNum: null,
      totalWeight: null,
      tableData: [],
      pageConfig: {
        total: 1,
        current: 1,
        pageSize: 10
      },
      isExportable: false,
      isEditable: false,
      isDeleteable: false,
      tableHeight: 200,
      isOutStoreable: false,
      // 整托盘出库
      allOutStoreForm: {
        loading: false,
        visible: false,
        place: "",
        takeBy: ""
      },
      allOutStoreFormRules: {
        place: [
          { required: true, message: "请输入仓位", trigger: "blur" },
          {
            pattern: /^1-[0-9]{1,2}-[0-9]{1,2}$/,
            message: "格式错误",
            trigger: "blur"
          }
        ],
        takeBy: [{ required: true, message: "请填写实际去向", trigger: "blur" }]
      },
      batchOutStoreForm: {
        loading: false,
        visible: false,
        takeBy: ""
      },
      batchOutStoreFormRules: {
        takeBy: [{ required: true, message: "请填写实际去向", trigger: "blur" }]
      },
      uploadExcelForm: {
        loading: false,
        visible: false,
        url: urlmap.uploadStorage,
        // url: 'http://localhost:8080/api/storage/uploadstorage',
        fileList: []
      }
    };
  },
  computed: {
    ...mapState([
      "ribbonTypeList",
      "ribbonWidthList",
      "ribbonThicknessLevelList",
      "laminationLevelList"
    ])
  },
  // 动态路由匹配
  beforeRouteUpdate(to, from, next) {
    this.getTableData();
    this.isExportable = this.setExportable();
    this.isEditable = this.setEditable();
    this.isDeleteable = this.setDeleteable();
    next();
  },
  created() {
    this.userinfo = JSON.parse(localStorage.getItem("userinfo"));
    this.getTableData();
    this.getRibbonTypeList();
    this.getRibbonWidthList();
    this.getRibbonThicknessLevelList();
    this.getLaminationLevelList();
    this.isExportable = this.setExportable();
    this.isEditable = this.setEditable();
    this.isDeleteable = this.setDeleteable();
    this.isOutStoreable = this.setOutStoreable();
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
    ...mapActions([
      "getRibbonTypeList",
      "getRibbonWidthList",
      "getRibbonThicknessLevelList",
      "getLaminationLevelList"
    ]),
    inStoreDateFormat(row, column) {
      return row.inStoreDate ? dateFormat(row.inStoreDate) : "";
    },
    outStoreDateFormat(row, column) {
      return row.outStoreDate ? dateFormat(row.outStoreDate) : "";
    },
    setEditable() {
      if (this.userinfo.roleId == 6 || this.userinfo.roleId == 1) {
        // 检测人员 或者厂长 可修改
        return true;
      } else {
        // 其他
        return false;
      }
    },
    setDeleteable() {
      if (this.userinfo.roleId == 1 || this.userinfo.roleId == 6) {
        // 厂长和库房 可退库
        return true;
      } else {
        // 其他
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
    setOutStoreable() {
      if (this.userinfo.roleId == 6) {
        //只有库房才能够出库操作
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
      this.searchForm = {
        castIds: [],
        caster: "",
        furnaces: [],
        date: [],
        outDate: [],
        ribbonTotalLevels: [],
        ribbonTypeNames: [],
        ribbonWidths: [],
        ribbonThicknessLevels: [],
        laminationLevels: [],
        place: "",
        isRemain: 1
      };
      const params = {
        current: 1
      };
      this.pageConfig.current = 1;
      this.getTableData(params);
    },
    getTableData(params = {}) {
      const _params = {
        castIdJson: JSON.stringify(this.searchForm.castIds),
        startTime: this.searchForm.date[0],
        endTime: this.searchForm.date[1],
        outStartTime: this.searchForm.outDate[0],
        outEndTime: this.searchForm.outDate[1],
        caster: this.searchForm.caster,
        furnaceJson: JSON.stringify(this.searchForm.furnaces),
        ribbonTypeNameJson: JSON.stringify(this.searchForm.ribbonTypeNames),
        ribbonWidthJson: JSON.stringify(this.searchForm.ribbonWidths),
        ribbonThicknessLevelJson: JSON.stringify(
          this.searchForm.ribbonThicknessLevels
        ),
        laminationLevelJson: JSON.stringify(this.searchForm.laminationLevels),
        ribbonTotalLevelJson: JSON.stringify(this.searchForm.ribbonTotalLevels),
        takebyJson: JSON.stringify(this.searchForm.takebys),
        place: this.searchForm.place,
        isRemain: this.searchForm.isRemain
      };
      Object.assign(params, _params);
      this.$http("get", urlmap.queryStorage, params)
        .then(data => {
          this.pageConfig.total = data.count;
          this.pageConfig.pageSize = data.limit;
          data.list &&
            data.list.forEach(item => {
              item.isEditing = false;
            });
          this.totalCoilNum = data.totalCoilNum;
          this.totalWeight = data.totalWeight;
          this.tableData = data.list;
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
      const { storageId, furnace, coilNumber } = row;
      this.$confirm(`确定退库 ${furnace} 的第 ${coilNumber} 盘吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$http("delete", urlmap.delStorage, {
            storageId,
            furnace,
            coilNumber
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
      // this.pageConfig.current = 1;
      // this.getTableData();

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
    handleCurrentChange(val) {
      const params = {
        current: val
      };
      this.getTableData(params);
    },
    exportExcel() {
      const params = {
        castIdJson: JSON.stringify(this.searchForm.castIds),
        startTime: this.searchForm.date[0],
        endTime: this.searchForm.date[1],
        outStartTime: this.searchForm.outDate[0],
        outEndTime: this.searchForm.outDate[1],
        caster: this.searchForm.caster,
        furnaceJson: JSON.stringify(this.searchForm.furnaces),
        ribbonTypeNameJson: JSON.stringify(this.searchForm.ribbonTypeNames),
        ribbonWidthJson: JSON.stringify(this.searchForm.ribbonWidths),
        ribbonThicknessLevelJson: JSON.stringify(
          this.searchForm.ribbonThicknessLevels
        ),
        laminationLevelJson: JSON.stringify(this.searchForm.laminationLevels),
        ribbonTotalLevels: this.searchForm.ribbonTotalLevels,
        takebyJson: JSON.stringify(this.searchForm.takebys),
        place: this.searchForm.place,
        isRemain: this.searchForm.isRemain
      };
      const url = `${urlmap.exportStorage}?${qs.stringify(params)}`;
      window.open(url);
    },
    setSelectable(row, index) {
      // 合格并且已经检测过了的，才可以被选中来入库
      // if ([1, 2].includes(row.isStored) && !row.isMeasureConfirmed ) {
      //   return true;
      // }
      return true;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    allOutStoreHandler() {
      this.allOutStoreForm.visible = true;
    },
    closeAllOutDialog() {
      this.$refs.allOutStoreForm.resetFields();
      this.allOutStoreForm.visible = false;
    },
    submitAllOutForm() {
      this.$refs.allOutStoreForm.validate(valid => {
        if (valid) {
          this.allOutStoreForm.loading = true;
          let formData = {
            place: this.allOutStoreForm.place,
            takeBy: this.allOutStoreForm.takeBy,
            type: "all"
          };
          this.$http("PUT", urlmap.updateStorage, formData)
            .then(data => {
              const params = {
                current: 1
              };
              this.pageConfig.current = 1;
              this.getTableData(params);
            })
            .catch(err => {
              console.log(err);
            })
            .finally(() => {
              this.allOutStoreForm.visible = false;
              this.allOutStoreForm.loading = false;
            });
        } else {
          return false;
        }
      });
    },
    batchOutStoreHandler() {
      if (this.multipleSelection && this.multipleSelection.length > 0) {
        this.batchOutStoreForm.visible = true;
      } else {
        this.$alert("请选择要出库的带材", "提示");
      }
    },
    closeBatchOutDialog() {
      this.$refs.batchOutStoreForm.resetFields();
      this.batchOutStoreForm.visible = false;
    },
    submitBatchOutForm() {
      this.$refs.batchOutStoreForm.validate(valid => {
        if (valid) {
          this.batchOutStoreForm.loading = true;
          // this.multipleSelection && this.multipleSelection.forEach(item => {
          //   item.takeBy = this.batchOutStoreForm.takeBy,
          //   item.remainWeight = 0
          // });
          // let formData = {
          //   dataJson: JSON.stringify(this.multipleSelection),
          //   type: 'batch'
          // };
          // this.$http('PUT', urlmap.updateStorage, formData).then(data => {
          //   const params = {
          //     current: 1
          //   };
          //   this.pageConfig.current = 1;
          //   this.getTableData(params);
          // }).catch(err => {
          //   console.log(err);
          // }).finally(() => {
          //   this.batchOutStoreForm.visible = false;
          //   this.batchOutStoreForm.loading = false;
          // });
          let ids = [];
          ids =
            this.multipleSelection &&
            this.multipleSelection.map(item => {
              return item.storageId;
            });
          const formData = {
            ids: ids.join(),
            takeBy: this.batchOutStoreForm.takeBy,
            type: "batch"
          };
          this.$http("PUT", urlmap.updateStorage, formData)
            .then(data => {
              const params = {
                current: 1
              };
              this.pageConfig.current = 1;
              this.getTableData(params);
            })
            .catch(err => {
              console.log(err);
            })
            .finally(() => {
              this.batchOutStoreForm.visible = false;
              this.batchOutStoreForm.loading = false;
            });
        } else {
          return false;
        }
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
        this.$alert(html, "以下带材添加仓位失败：", {
          dangerouslyUseHTMLString: true,
          type: "warning"
        });
      }
      const params = {
        current: 1
      };
      this.pageConfig.current = 1;
      this.getTableData(params);
    },
    remoteMethod(query, type) {
      const { url, key } = {
        furnace: {
          url: urlmap.queryFurnaceList,
          key: "furnaceList"
        },
        ribbonTotalLevel: {
          url: urlmap.queryRibbonTotalLevelList,
          key: "ribbonTotalLevelList"
        }
      }[type];
      if (query !== "") {
        this.selectLoading = true;
        this.$http("GET", url, { query })
          .then(data => {
            this[key] = data.list;
          })
          .catch(err => {
            console.log(err);
          })
          .finally(() => {
            this.selectLoading = false;
          });
      } else {
        this[key] = [];
      }
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
.upload {
  height: 100px;
}
</style>
