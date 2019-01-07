<template>
  <el-dialog :title="dialogData.formType === 'create' ? '新增带材牌号' : '修改带材牌号'" 
  :visible.sync="dialogData.dialogVisible"
  :close-on-click-modal="false"
  :close-on-press-escape="false"
  @close="closeDialog"
  :center="true"
  v-loading="loading"
  element-loading-text="拼命加载中">
    <el-form :model="formData" :rules="rules" ref="form" label-width="100px" style="width: 100%" @submit.native.prevent> 
      <el-form-item label="带材牌号：" prop="ribbonTypeName">
        <el-input v-model="formData.ribbonTypeName"></el-input>
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

const formConfig = {
  ribbonTypeId: '',
  ribbonTypeName: ''
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
      formData: {},
      rules: {
        ribbonTypeName: [
          { required: true, message: '请填写带材牌号', trigger: 'blur' },
          { max: 50, message: '长度不能超过50位', trigger: 'blur' }
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

          const { method, url } = this.dialogData.formType === 'create' ? { method: 'post', url: urlmap.addRibbonType } : { method: 'put', url: urlmap.updatePlan } ;
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

