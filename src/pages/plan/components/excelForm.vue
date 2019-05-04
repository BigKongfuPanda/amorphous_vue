<template>
  <el-dialog 
  title="导出生产计划" 
  :visible.sync="exportData.exportVisible" 
  :close-on-click-modal="false"
  :close-on-press-escape="false" 
  @close="closeDialog"
  :center="true"
  width="550px">
    <el-form :model="formData" :rules="rules" ref="form" label-width="100px" @submit.native.prevent>
      <el-form-item label="日期范围：" prop="date">
        <el-date-picker
          v-model="formData.date"
          type="daterange"
          :default-time="['00:00:00', '23:59:59']"
          :clearable="false"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
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

export default {
  props: {
    exportData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      visible: false,
      formData: {
        date: null
      },
      rules: {
        date: [{ required: true, message: '请选择日期', trigger: 'blur' }]
      }
    }
  },
  methods: {
    closeDialog() {
      this.$emit('closeExport');
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const params = {
            castId: this.exportData.castId,
            startTime: this.formData.date[0],
            endTime: this.formData.date[1]
          };
          const url = `${urlmap.exportMeasure}?${qs.stringify(params)}`;
          window.open(url);
          this.$emit('submitExport');
        } else {
          return false;
        }
      })
    }
  }
}
</script>


