<template>
  <el-dialog
    :title="dialogData.formType === 'create' ? '新增客户' : '修改客户'"
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
      <el-form-item label="客户：" prop="client">
        <el-input v-model="formData.client"></el-input>
      </el-form-item>
      <el-form-item label="是否必须平整：" prop="isFlat">
        <el-select v-model="formData.isFlat" placeholder>
          <el-option :value="0" label="是"></el-option>
          <el-option :value="1" label="否"></el-option>
        </el-select>
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
  client: "",
  isFlat: 0
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
        client: "",
        isFlat: 0
      },
      rules: {
        client: [
          { required: true, message: "请填写客户", trigger: "blur" },
          { max: 20, message: "最多20位字符", trigger: "blur" }
        ],
        isFlat: [
          { required: true, message: "请选择是否必须要求平整", trigger: "blur" }
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
              ? { method: "post", url: urlmap.addClients }
              : { method: "put", url: urlmap.updateClients };

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