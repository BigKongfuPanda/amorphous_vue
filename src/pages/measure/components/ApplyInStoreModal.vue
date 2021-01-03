<template>
  <el-dialog
    title="申请入库"
    :visible.sync="visible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="closeDialog"
    :center="true"
    v-loading="loading"
    element-loading-text="拼命加载中"
  >
    <el-table
      :data="tableData"
      ref="table"
      stripe
      border
      highlight-current-row
      style="width: 100%"
      v-loading="loading"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="20"></el-table-column>
      <el-table-column
        prop="furnace"
        label="炉号"
        align="center"
        fixed
      ></el-table-column>
      <el-table-column
        prop="totalCount"
        label="可入库盘数合计"
        align="center"
        fixed
      ></el-table-column>
      <el-table-column
        prop="totalWeight"
        label="可入库净重合计(kg)"
        align="center"
        fixed
      ></el-table-column>
    </el-table>
    <div slot="footer">
      <el-button @click="closeDialog">取消</el-button>
      <el-button type="primary" @click="submitForm">提交</el-button>
    </div>
  </el-dialog>
</template>

<script>
import urlmap from "@/utils/urlmap";
import { positiveInteger, ltNumber, decimalFormat } from "@/utils/validate";

export default {
  name: "ApplyInStoreModal",
  props: {
    castId: {
      type: Number,
      required: true
    },
    visible: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      multipleSelection: [],
      tableData: [],
      loading: false
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    getTableData() {
      this.loading = true;
      this.$http("get", urlmap.queryApplyStorageByFurnace, {
        castId: this.castId
      })
        .then(data => {
          this.tableData = data.list;
        })
        .catch(err => console.log(err))
        .finally(() => (this.loading = false));
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    closeDialog() {
      this.$emit("close");
    },
    submitForm() {
      const selectionList = cloneDeep(this.multipleSelection);
      if (selectionList.length === 0) {
        return this.$alert("请选择要入库的带材", "提示", { type: "warning" });
      }
      if (
        selectionList.some(item => !item.clients || item.clients.length === 0)
      ) {
        return this.$alert(
          "申请入库的带材没有填写检测去向，请检查后再提交",
          "提示",
          { type: "warning" }
        );
      }
      selectionList.forEach(row => {
        row.isMeasureConfirmed = 1; // 1-检测确认入库，0-还没有确认
        row.clients = row.clients.join();
        row.appearence = row.appearence.join();
      });
      // 发送请求，更新当前的数据
      this.$http("POST", urlmap.measureConfirm, {
        dataJson: JSON.stringify(selectionList)
      })
        .then(data => {
          this.$router.push({ path: "/applyStore" });
          this.$emit("submit");
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>

<style lang="scss" scoped></style>
