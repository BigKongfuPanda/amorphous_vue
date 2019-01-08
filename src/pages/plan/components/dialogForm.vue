<template>
  <el-dialog 
  :title="dialogData.formType === 'create' ? `新增生产计划-${$route.params.castId}号机组` : `修改生产计划-${$route.params.castId}号机组`" 
  :visible.sync="dialogData.dialogVisible" 
  :close-on-click-modal="false"
  :close-on-press-escape="false" 
  @close="closeDialog"
  :center="true"
  width="950px"
  v-loading="loading"
  element-loading-text="拼命加载中">
    <el-form :model="formData" :rules="rules" ref="form" label-width="100px;" style="width:100%" @submit.native.prevent inline>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="日期" prop="date" class="dialog_field">
            <el-date-picker v-model="formData.date" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" :editable="false" :clearable="false"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="机组" prop="castId" class="dialog_field">
            <el-select v-model="formData.castId" placeholder="请选择" disabled>
              <el-option label="6号机组" :value="6"></el-option>
              <el-option label="7号机组" :value="7"></el-option>
              <el-option label="8号机组" :value="8"></el-option>
              <el-option label="9号机组" :value="9"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="班组" prop="team" class="dialog_field">
            <el-select v-model="formData.team" placeholder="请选择">
              <el-option label="早班" value="早"></el-option>
              <el-option label="中班" value="中"></el-option>
              <el-option label="夜班" value="夜"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="任务单号" prop="taskOrder" class="dialog_field">
            <el-input v-model="formData.taskOrder"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="材质" prop="ribbonTypeId" class="dialog_field">
            <el-select v-model="formData.ribbonTypeId" placeholder="请选择">
              <el-option v-for="item in ribbonTypeList" :key="item.ribbonTypeId" :label="item.ribbonTypeName" :value="item.ribbonTypeId"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="规格(mm)" prop="ribbonWidth" class="dialog_field">
            <el-input v-model="formData.ribbonWidth"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="客户" prop="client" class="dialog_field">
            <el-input v-model="formData.client"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="带厚(μm)" prop="thickness" class="dialog_field">
            <el-input v-model="formData.thickness"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="叠片系数" prop="laminationFactor" class="dialog_field">
            <el-input v-model="formData.laminationFactor"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="制带炉号" prop="furnace" class="dialog_field">
            <el-input v-model="formData.furnace"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="单炉投入" prop="alloyWeight" class="dialog_field">
            <el-input v-model="formData.alloyWeight"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="喷带时间" prop="castTime" class="dialog_field">
            <el-input v-model="formData.castTime"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="文件编号" prop="fileNumber" class="dialog_field">
            <el-input v-model="formData.fileNumber"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="备注" prop="remark" class="dialog_field orign_field"> 
            <el-input v-model="formData.remark"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer">
      <el-button @click="closeDialog">取消</el-button>
      <el-button type="primary" @click="submitForm">提交</el-button>
    </div>
  </el-dialog>  
</template>

<script>
import { integer, ltNumber } from '@/utils/validate';
import urlmap from '@/utils/urlmap';
import { mapState, mapActions } from 'vuex';

const formConfig = {
  date: '',
  castId: 6,
  team: '',
  taskOrder: '',
  ribbonTypeId: '',
  ribbonTypeName: '',
  ribbonWidth: 30,
  client: '',
  thickness: '',
  laminationFactor: '',
  furnace: '',
  alloyWeight: 230,
  castTime: '',
  rawWeight: '',
  remark: '计划喷带12炉，如果有富余时间喷带按照当天最后一炉规定的要求生产。',
  fileNumber: ''
};

export default {
  props: {
    dialogData: {
      type: Object,
      required: true
    }
  },
  data() {
    const checkFurnance = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('炉号不能为空'));
      }

      const reg = /^0[1-9]-[0-9]{8}-[0-9]{2}$/;
      if (reg.test(value)) {
        callback();
      } else {
        callback(new Error('炉号格式错误'));
      }
    };

    return {
      visible: false,
      loading: false,
      formData: {
        date: '',
        castId: 6,
        team: '',
        taskOrder: '',
        ribbonTypeId: '',
        ribbonTypeName: '',
        ribbonWidth: 30,
        client: '',
        thickness: '',
        laminationFactor: '',
        furnace: '',
        alloyWeight: 230,
        castTime: '',
        rawWeight: '',
        remark: '',
        fileNumber: ''
      },
      rules: {
        date: [{ required: true, message: '请选择日期', trigger: 'blur' }],
        castId: [{ required: true, message: '请选择机组', trigger: 'blur' }],
        team: [{ required: true, message: '请选择班次', trigger: 'blur' }],
        ribbonTypeId: [{ required: true, message: '请选择材质', trigger: 'blur' }],
        ribbonWidth: [
          { required: true, message: '请填写带宽', trigger: 'blur' },
          { validator: integer, trigger: 'blur' },
          { validator: ltNumber(99999), trigger: 'blur' }
        ],
        client: [{ max: 50, message: '最多50位字符', trigger: 'blur' }],
        thickness: [
          { required: true, message: '请填写带厚', trigger: 'blur' },
          { max: 50, message: '最多50位字符', trigger: 'blur' },
        ],
        laminationFactor: [
          { required: true, message: '请填写叠片系数', trigger: 'blur' },
          { max: 50, message: '最多50位字符', trigger: 'blur' }
        ],
        furnace: [
          { required: true, message: '请填写炉号', trigger: 'blur' },
          { max: 20, message: '最多20位字符', trigger: 'blur' },
          { validator: checkFurnance, trigger: 'blur'}
        ],
        alloyWeight: [
          { validator: integer, trigger: 'blur' },
          { validator: ltNumber(99999), trigger: 'blur' }   
        ],
        castTime: [{ max: 50, message: '最多50位字符', trigger: 'blur' }],
        remark: [{ max: 100, message: '最多100位字符', trigger: 'blur' }],
        fileNumber: [{ max: 50, message: '最多50位字符', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapState([
      'ribbonTypeList'
    ])
  },
  created () {
    if (this.dialogData.formType === 'create') {
      this.formData = Object.assign({}, formConfig, { castId: Number(this.$route.params.castId) });
    } else {
      this.formData = Object.assign(this.formData, this.dialogData.rowData);
    }
    this.getRibbonTypeList();
  },
  methods: {
    ...mapActions([
      'getRibbonTypeList'
    ]),
    closeDialog() {
      this.$emit('close');
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.formData.ribbonTypeName = this.ribbonTypeList && this.ribbonTypeList.find(item => {
            return item.ribbonTypeId === this.formData.ribbonTypeId;
          }).ribbonTypeName;

          const { method, url } = this.dialogData.formType === 'create' ? { method: 'post', url: urlmap.addPlan } : { method: 'put', url: urlmap.updatePlan } ;

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
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>


