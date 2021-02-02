<template>
  <el-dialog
    :title="dialogData.formType === 'create' ? '新增外观' : '修改外观'"
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
      <el-form-item label="外观：" prop="appearence">
        <el-input v-model="formData.appearence"></el-input>
      </el-form-item>
      <el-form-item label="外观等级：" prop="appearenceLevel">
        <el-input v-model="formData.appearenceLevel"></el-input>
      </el-form-item>
      <!-- <el-form-item label="PLC映射码：" prop="appearenceLevelCode">
        <el-input v-model="formData.appearenceLevelCode"></el-input>
      </el-form-item> -->
    </el-form>
    <div slot="footer">
      <el-button @click="closeDialog">取消</el-button>
      <el-button type="primary" @click="submitForm">提交</el-button>
    </div>
  </el-dialog>
</template>

<script>
import urlmap from "@/utils/urlmap";
import { positiveInteger, ltNumber } from "@/utils/validate";

const formConfig = {
  appearence: "",
  appearenceLevel: ""
  // appearenceLevelCode: ''
};

export default {
  props: {
    dialogData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      formData: {
        appearence: "",
        appearenceLevel: ""
        // appearenceLevelCode: ''
      },
      rules: {
        appearence: [
          { required: true, message: "请填写外观", trigger: "blur" },
          { max: 20, message: "最多20位字符", trigger: "blur" }
        ],
        appearenceLevel: [
          { required: true, message: "请填写外观等级", trigger: "blur" },
          { max: 20, message: "最多20位字符", trigger: "blur" }
        ]
        // appearenceLevelCode: [
        //   { required: true, message: '请填写PLC映射码', trigger: 'blur' },
        //   { validator: positiveInteger, trigger: "blur" },
        //   { validator: ltNumber(99999), trigger: "blur" },
        // ],
      },
      loading: false
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
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true;

          const { method, url } =
            this.dialogData.formType === "create"
              ? { method: "post", url: urlmap.addAppearenceLevel }
              : { method: "put", url: urlmap.updateAppearenceLevel };

          this.$http(method, url, this.formData)
            .then(data => {
              this.$emit("submit");
            })
            .catch(err => {
              console.log(err);
            })
            .finally(() => {
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped></style>
