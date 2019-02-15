<template>
  <el-dialog
  :title="dialogData.formType === 'add' ? `新增重卷记录-${$route.params.castId}号机组` : `修改重卷记录-${$route.params.castId}号机组`"
  :visible.sync="dialogData.dialogVisible"
  :close-on-click-modal="false"
  :close-on-press-escape="false" 
  @close="closeDialog"
  :center="true"
  width="380px"
  v-loading="loading"
  element-loading-text="拼命加载中">
    <el-form :model="formData" :rules="rules" ref="form" label-width="100px" style="100%" @submit.native.prevent>
      <el-form-item label="炉号：" prop="furnace" class="dialog_field">
        <el-input v-model="formData.furnace"></el-input>
      </el-form-item>
      <el-form-item label="盘号：" prop="coilNumber" class="dialog_field">
        <el-input v-model="formData.coilNumber"></el-input>
      </el-form-item>
      <el-form-item label="外径：" prop="diameter" class="dialog_field">
        <el-input v-model="formData.diameter"></el-input>
      </el-form-item>
      <el-form-item label="重量：" prop="coilWeight" class="dialog_field">
        <el-input v-model="formData.coilWeight"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="closeDialog">取消</el-button>
      <el-button type="primary" @click="submitForm">提交</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { integer, positiveInteger, ltNumber, checkFurnace, number, decimalFormat } from '@/utils/validate';
import urlmap from '@/utils/urlmap';

const formConfig = {
  castId: 6,// 机组编号
  furnace: '',// 制带炉号  06-20181120-01/01
  coilNumber: '',// 盘号
  diameter: '', //外径,mm
  coilWeight: '' //重量,kg
};

export default {
  data() {
    return {
      visible: false,
      loading: false,
      formData: {
        castId: 6,// 机组编号
        furnace: '',// 制带炉号  06-20181120-01/01
        coilNumber: '',// 盘号
        diameter: '', //外径,mm
        coilWeight: '' //重量,kg
      },
      rules: {
        furnace: [
          { required: true, message: '请填写炉号', trigger: 'blur' },
          { max: 20, message: '最多20位字符', trigger: 'blur' },
          { validator: checkFurnace, trigger: 'blur'}
        ],
        coilNumber: [
          { required: true, message: '请填写盘号', trigger: 'blur' },
          { validator: positiveInteger, trigger: 'blur' },
          { validator: ltNumber(99999), trigger: 'blur' }
        ],
        diameter: [
          { required: true, message: '请填写外径', trigger: 'blur' },
          { validator: number, trigger: 'blur' },
          { validator: ltNumber(99999), trigger: 'blur' }
        ],
        coilWeight: [
          { required: true, message: '请填写重量', trigger: 'blur' },
          { validator: decimalFormat, trigger: 'blur' },
          { validator: ltNumber(99999), trigger: 'blur' }
        ]
      }
    };
  },
  props: {
    dialogData: {
      type: Object,
      required: true
    }
  },
  created() {
    if (this.dialogData.formType === 'add') {
      this.formData = Object.assign({}, formConfig, {castId: Number(this.$route.params.castId)});
    } else {
      this.formData = Object.assign(this.formData, this.dialogData.rowData);
    }
  },
  mounted() {},
  methods: {
    closeDialog() {
      this.$emit('close');
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if(valid) {
          this.loading = true;

          // 根据炉号从喷带记录表中获取其他的信息
          this.$http('GET', urlmap.queryCast, {castId: this.formData.castId, furnace: this.formData.furnace}).then(data => {
            const { ribbonTypeName, ribbonWidth, createdAt, caster } = data.list[0];
            const params = {
              ribbonTypeName, ribbonWidth, castDate: createdAt, caster,
              ...this.formData
            };

            // 发送提交的请求
            const { method, url } = this.dialogData.formType === 'add' ? { method: 'POST', url: urlmap.addMeasure } : { method: 'PUT', url: urlmap.updateMeasure };

            this.$http(method, url, params).then(data => {
              this.$emit('submit');
            }).catch((error) => {
              console.log(error);
            }).finally(() => {
              this.loading = false;
            });
          }).catch((error) => {
            this.loading = false;
            console.log(error);
          });
        } else {
          return false;
        }
      });
    }
  }
};
</script>
<style lang='scss' scoped>
</style>
