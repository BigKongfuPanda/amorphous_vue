<template>
  <el-dialog
    :title="
      dialogData.formType === 'create' ? '新增内衬重量数据' : '修改内衬重量数据'
    "
    :visible.sync="dialogData.dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="closeDialog"
    :center="true"
    v-loading="loading"
    element-loading-text="拼命加载中"
  >
    <el-form
      :model="formData"
      :rules="rules"
      ref="form"
      label-width="150px"
      style="width: 100%"
      @keyup.enter.native="submitForm"
    >
      <el-form-item label="带材宽度：" prop="ribbonWidth">
        <el-input v-model="formData.ribbonWidth"></el-input>
      </el-form-item>
      <el-form-item label="内衬重量：" prop="linerWeight">
        <el-input v-model="formData.linerWeight"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="closeDialog">取消</el-button>
      <el-button type="primary" @click="submitForm">提交</el-button>
    </div>
  </el-dialog>
</template>

<script>
import urlmap from "@/utils/urlmap";
import { positiveInteger, ltNumber, decimalFormat } from "@/utils/validate";

const formConfig = {
  ribbonWidth: "",
  linerWeight: "",
};

export default {
  props: {
    dialogData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      formData: {
        ...formConfig,
      },
      rules: {
        ribbonWidth: [
          { required: true, message: "请填写带宽", trigger: "blur" },
          { validator: positiveInteger, trigger: "blur" },
          { validator: ltNumber(99999), trigger: "blur" },
        ],
        linerWeight: [
          { required: true, message: "请填写内衬重量", trigger: "blur" },
          { validator: decimalFormat, trigger: "blur" },
          { validator: ltNumber(99999), trigger: "blur" },
        ],
      },
      loading: false,
    };
  },
  created() {
    if (this.dialogData.formType === "create") {
      this.formData = Object.assign({}, formConfig);
    } else {
      this.formData = Object.assign(this.formData, this.dialogData.rowData);
    }
  },
  methods: {
    closeDialog() {
      this.$emit("close");
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true;

          const { method, url } =
            this.dialogData.formType === "create"
              ? { method: "post", url: urlmap.addLinerWeight }
              : { method: "put", url: urlmap.updateLinerWeight };

          this.$http(method, url, this.formData)
            .then((data) => {
              this.$emit("submit");
            })
            .catch((err) => {
              console.log(err);
            })
            .finally(() => {
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>