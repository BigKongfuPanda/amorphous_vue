<template>
  <el-dialog
    :title="dialogData.formType === 'create' ? '新增重卷人员' : '修改重卷人员'"
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
      <el-form-item label="姓名：" prop="rollerName">
        <el-input v-model="formData.rollerName"></el-input>
      </el-form-item>
      <el-form-item label="编号：" prop="roller">
        <el-input v-model="formData.roller"></el-input>
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
import { number } from "@/utils/validate";

const formConfig = {
  rollerName: "",
  roller: ""
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
        rollerName: "",
        roller: ""
      },
      rules: {
        rollerName: [
          { required: true, message: "请填写姓名", trigger: "blur" },
          { max: 20, message: "最多20位字符", trigger: "blur" }
        ],
        roller: [
          { required: true, message: "请填写编号", trigger: "blur" },
          { validator: number, trigger: "blur" }
        ]
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
              ? { method: "post", url: urlmap.addRoller }
              : { method: "put", url: urlmap.updateRoller };

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

<style lang="scss" scoped>
</style>