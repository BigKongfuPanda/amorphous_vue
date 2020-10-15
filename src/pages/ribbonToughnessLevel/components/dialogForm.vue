<template>
  <el-dialog :title="dialogData.formType === 'create' ? '新增带材韧性' : '修改带材韧性'" 
  :visible.sync="dialogData.dialogVisible"
  :close-on-click-modal="false"
  :close-on-press-escape="false"
  @close="closeDialog"
  :center="true"
  v-loading="loading"
  element-loading-text="拼命加载中">
    <el-form :model="formData" :rules="rules" ref="form" label-width="100px" style="width: 100%" @keyup.enter.native="submitForm"> 
      <el-form-item label="韧性等级：" prop="ribbonToughnessLevel">
        <el-input v-model="formData.ribbonToughnessLevel"></el-input>
      </el-form-item>
      <el-form-item label="带材韧性：" prop="ribbonToughness">
        <el-input v-model="formData.ribbonToughness"></el-input>
      </el-form-item>
      <el-form-item label="PLC映射码：" prop="ribbonToughnessLevelCode">
        <el-input v-model="formData.ribbonToughnessLevelCode"></el-input>
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
import { positiveInteger, ltNumber } from '@/utils/validate';

const formConfig = {
  ribbonToughness: '',
  ribbonToughnessLevel: '',
  ribbonToughnessLevelCode: ''
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
        ribbonToughness: '',
        ribbonToughnessLevel: '',
        ribbonToughnessLevelCode: ''
      },
      rules: {
        ribbonToughness: [
          { required: true, message: '请填写带材韧性', trigger: 'blur' },
          { maxlength: 10, message: '不能超过10个字', trigger: 'blur' }
        ],
        ribbonToughnessLevel: [
          { required: true, message: '请填写带材韧性等级', trigger: 'blur' },
          { maxlength: 1, message: '不能超过1个字母', trigger: 'blur' },
          { pattern: /^[A-Z]$/, message: '只能填写大写字母', trigger: 'blur' },
        ],
        ribbonToughnessLevelCode: [
          { required: true, message: '请填写PLC映射码', trigger: 'blur' },
          { validator: positiveInteger, trigger: "blur" },
          { validator: ltNumber(99999), trigger: "blur" },
        ],
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

          const { method, url } = this.dialogData.formType === 'create' ? { method: 'post', url: urlmap.addRibbonToughnessLevel } : { method: 'put', url: urlmap.updateRibbonToughnessLevel } ;

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