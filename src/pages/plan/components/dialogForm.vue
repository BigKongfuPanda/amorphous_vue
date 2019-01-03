<template>
  <el-dialog 
  :title="this.dialogData.formType === 'create' ? '新增生产记录' : '修改生产记录'" 
  :visible.sync="dialogData.dialogVisible" 
  :close-on-click-modal="false"
  :close-on-press-escape="false" 
  @close="closeDialog"
  :center="true"
  width="950px">
    <el-form :model="formData" :rules="rules" ref="form" label-width="100px;" style="width:100%" @submit.native.prevent inline>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="日期" prop="date" class="dialog_field">
            <el-date-picker v-model="formData.date" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" :editable="false" :clearable="false"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="机组" prop="castId" class="dialog_field">
            <el-select v-model="formData.castId" placeholder="请选择">
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
      <el-button type="primary" @click="submit">确定</el-button>
    </div>
  </el-dialog>  
</template>

<script>
const ribbonTypeList = [
  {
    "ribbonTypeId": 1,
    "ribbonTypeName": "1k107B"
  },
  {
    "ribbonTypeId": 2,
    "ribbonTypeName": "AD25"
  },
  {
    "ribbonTypeId": 3,
    "ribbonTypeName": "ND25"
  },
  {
    "ribbonTypeId": 4,
    "ribbonTypeName": "FN200"
  },
  {
    "ribbonTypeId": 5,
    "ribbonTypeName": "FN035"
  },
  {
    "ribbonTypeId": 6,
    "ribbonTypeName": "FN080"
  },
  {
    "ribbonTypeId": 7,
    "ribbonTypeName": "FN100"
  },
  {
    "ribbonTypeId": 8,
    "ribbonTypeName": "FCNC020"
  },
  {
    "ribbonTypeId": 9,
    "ribbonTypeName": "FCNC010"
  },
  {
    "ribbonTypeId": 10,
    "ribbonTypeName": "FCN020"
  },
  {
    "ribbonTypeId": 11,
    "ribbonTypeName": "152"
  }
];

const formConfig = {
  date: '',
  castId: 6,
  team: '',
  taskOrder: '',
  ribbonTypeId: 1,
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
    return {
      visible: false,
      formData: {},
      ribbonTypeList: ribbonTypeList,
      rules: {
        date: [{ required: true, message: '请选择日期', trigger: 'blur' }],
        castId: [{ required: true, message: '请选择机组', trigger: 'blur' }],
        team: [{ required: true, message: '请选择班次', trigger: 'blur' }],
        ribbonTypeId: [{ required: true, message: '请选择材质', trigger: 'blur' }],
        ribbonWidth: [
          { required: true, message: '请填写带宽', trigger: 'blur' },
          { type: 'number', message: '带宽必须为数字', trigger: 'blur' }
        ],
        castId: [{ required: true, message: '请选择机组', trigger: 'blur' }],
      }
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
    submit() {
      console.log(this.formData);
      this.$refs.form.validate((valid) => {
        if (valid) {
          
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


