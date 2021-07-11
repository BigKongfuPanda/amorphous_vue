<template>
  <el-dialog :title="dialogData.formType === 'create' ? '新增带材规格' : '修改带材规格'" 
  :visible.sync="dialogData.dialogVisible"
  :close-on-click-modal="false"
  :close-on-press-escape="false"
  @close="closeDialog"
  :center="true"
  v-loading="loading"
  element-loading-text="拼命加载中">
    <el-form :model="formData" :rules="rules" ref="form" label-width="100px" style="width: 100%" @keyup.enter.native="submitForm"> 
      <el-form-item label="带材规格：" prop="ribbonWidth">
        <el-input v-model="formData.ribbonWidth"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer"> 
      <el-button @click="closeDialog">取消</el-button>
      <el-button type="primary" @click="submitForm">提交</el-button>
    </div>
  </el-dialog>
</template>

<script>
import urlmap from '@/utils/urlmap';
import { decimalFormat } from '@/utils/validate';

const formConfig = {
  ribbonWidthId: '',
  ribbonWidth: ''
};

export default {
  props: {
    dialogData: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      formData: {
        ribbonWidthId: '',
        ribbonWidth: ''
      },
      rules: {
        ribbonWidth: [
          { required: true, message: '请填写带材规格', trigger: 'blur' },
          { validator: decimalFormat, trigger: 'blur' }
        ]
      },
      loading: false
    }
  },
  created () {
    if (this.dialogData.formType === 'create') {
      this.formData = Object.assign({}, formConfig);
    } else {
      this.formData = Object.assign(this.formData, this.dialogData.rowData);
    }
  },
  methods: {
    closeDialog() {
      this.$emit('close');
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true;

          const { method, url } = this.dialogData.formType === 'create' ? { method: 'post', url: urlmap.addRibbonWidth } : { method: 'put', url: urlmap.updateRibbonWidth } ;

          this.$http(method, url, this.formData).then(data => {
            this.$emit('submit');
          }).catch(err => {
            console.log(err);
          }).finally(() => {
            this.loading = false;
          }); 
        } else {
          return false;
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>

</style>