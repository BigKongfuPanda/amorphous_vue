<template>
  <el-dialog 
  :title="dialogData.formType === 'create' ? `新增生产计划-${$route.params.castId}号机组` : `修改生产计划-${$route.params.castId}号机组`" 
  :visible.sync="dialogData.dialogVisible" 
  :close-on-click-modal="false"
  :close-on-press-escape="false" 
  @close="closeDialog"
  :center="true"
  width="1200px"
  v-loading="loading"
  element-loading-text="拼命加载中">
    <el-form :model="formData" :rules="rules" ref="form" label-width="100px" @submit.native.prevent>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="日期" prop="date" class="dialog_field">
            <el-date-picker v-model="formData.date" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" :editable="false" :clearable="false" @change="pick"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="客户" prop="client" class="dialog_field">
            <el-input v-model="formData.client"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="班次" prop="team" class="dialog_field">
            <el-select v-model="formData.team" placeholder="请选择">
              <el-option label="早班" value="早"></el-option>
              <el-option label="中班" value="中"></el-option>
              <el-option label="夜班" value="夜"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="任务单号" prop="taskOrder" class="dialog_field">
            <el-input v-model="formData.taskOrder"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="材质" prop="ribbonTypeName" class="dialog_field">
            <el-select v-model="formData.ribbonTypeName" placeholder="请选择">
              <el-option v-for="item in ribbonTypeList" :key="item.ribbonTypeId" :label="item.ribbonTypeName" :value="item.ribbonTypeName"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="规格" prop="ribbonWidth" class="dialog_field">
            <el-select v-model="formData.ribbonWidth" placeholder="请选择">
              <el-option v-for="item in ribbonWidthList" :key="item.ribbonWidthId" :label="item.ribbonWidth" :value="item.ribbonWidth"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <!-- 新增 -->
        <el-col :span="6" v-if="dialogData.formType === 'create'">
          <el-form-item label="开始炉号" prop="theBeginfurnace" class="dialog_field">
            <el-input v-model="formData.theBeginfurnace"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" v-if="dialogData.formType === 'create'">
          <el-form-item label="计划炉次" prop="heatNum" class="dialog_field">
            <el-input v-model="formData.heatNum"></el-input>
          </el-form-item>
        </el-col>
        <!-- 新增 结束 -->
        <!-- 编辑 -->
        <el-col :span="6" v-if="dialogData.formType === 'edit'">
          <el-form-item label="制带炉号" prop="furnace" class="dialog_field">
            <el-input v-model="formData.furnace"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" v-if="dialogData.formType === 'edit'">
          <el-form-item label="喷带时间" prop="castTime" class="dialog_field">
            <el-input v-model="formData.castTime"></el-input>
          </el-form-item>
        </el-col>
        <!-- 编辑结束 -->
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="单炉投入" prop="alloyWeight" class="dialog_field">
            <el-input v-model="formData.alloyWeight"></el-input>
          </el-form-item>
        </el-col> 
        <el-col :span="6">
          <el-form-item label="文件编号" prop="fileNumber" class="dialog_field">
            <el-input v-model="formData.fileNumber"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="备注" prop="remark" class="dialog_field orign_field"> 
            <el-input v-model="formData.remark"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <section class="requirement_detail">
        <h3 class="requirement_hd">订单要求</h3>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="带厚(μm)" prop="orderThickness" class="dialog_field">
              <el-input v-model="formData.orderThickness"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="叠片系数" prop="orderLaminationFactor" class="dialog_field">
              <el-select v-model="formData.orderLaminationFactor" placeholder="">
                <el-option label="≥0.72" value="≥0.72"></el-option>
                <el-option label="≥0.75" value="≥0.75"></el-option>
                <el-option label="≥0.78" value="≥0.78"></el-option>
                <el-option label="≥0.80" value="≥0.80"></el-option>
                <el-option label="≥0.82" value="≥0.82"></el-option>
                <el-option label="≥0.84" value="≥0.84"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="韧性" prop="orderRibbonToughnessLevels" class="dialog_field">
              <el-select v-model="formData.orderRibbonToughnessLevels" placeholder="" multiple collapse-tags>
                <el-option v-for="item in ribbonToughnessLevelList" :key="item.ribbonToughnessLevelId" :label="item.ribbonToughnessLevel" :value="item.ribbonToughnessLevel"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="外观" prop="orderAppearenceLevels" class="dialog_field">
              <el-select v-model="formData.orderAppearenceLevels" placeholder="" multiple collapse-tags>
                <el-option label="A" value="A"></el-option>
                <el-option label="B" value="B"></el-option>
                <el-option label="C" value="C"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </section>
      <section class="requirement_detail">
        <h3 class="requirement_hd">此类带材入库规范<i class="el-icon-circle-plus" @click="addRequirement"></i></h3>
        <el-row :gutter="20" v-for="(item, index) in formData.qualifiedDemands" :key="index" class="requirement_row">
          <i class="el-icon-remove" @click="delRequirement"></i>
          <el-col :span="6">
            <el-form-item label="带厚(μm)" class="dialog_field" :prop="'qualifiedDemands.' + index + '.qualifiedThickness'" :rules="[{ required: true, message: '请填写带厚', trigger: 'blur' }, { max: 50, message: '最多50位字符', trigger: 'blur' }, { pattern: /^([1-3]\d-[1-3]\d|≤[1-3]\d)$/, message: '格式错误，20-23或者≤23', trigger: 'blur' }]">
              <el-input v-model="item.qualifiedThickness"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="叠片系数" class="dialog_field" :prop="'qualifiedDemands.' + index + '.qualifiedLaminationFactor'" :rules="[{ required: true, message: '请选择叠片系数', trigger: 'blur' }]">
              <el-select v-model="item.qualifiedLaminationFactor" placeholder="">
                <el-option label="≥0.72" value="≥0.72"></el-option>
                <el-option label="≥0.75" value="≥0.75"></el-option>
                <el-option label="≥0.78" value="≥0.78"></el-option>
                <el-option label="≥0.80" value="≥0.80"></el-option>
                <el-option label="≥0.82" value="≥0.82"></el-option>
                <el-option label="≥0.84" value="≥0.84"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="韧性" class="dialog_field" :prop="'qualifiedDemands.' + index + '.qualifiedRibbonToughnessLevels'" :rules="[{ required: true, message: '请选择韧性', trigger: 'blur' }]">
              <el-select v-model="item.qualifiedRibbonToughnessLevels" placeholder="" multiple collapse-tags>
                <el-option v-for="item in ribbonToughnessLevelList" :key="item.ribbonToughnessLevelId" :label="item.ribbonToughnessLevel" :value="item.ribbonToughnessLevel"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="外观" class="dialog_field" :prop="'qualifiedDemands.' + index + '.qualifiedAppearenceLevels'" :rules="[{ required: true, message: '请选择外观', trigger: 'blur' }]">
              <el-select v-model="item.qualifiedAppearenceLevels" placeholder="" multiple collapse-tags>
                <el-option label="A" value="A"></el-option>
                <el-option label="B" value="B"></el-option>
                <el-option label="C" value="C"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </section>
    </el-form>
    <div slot="footer">
      <el-button @click="closeDialog">取消</el-button>
      <el-button type="primary" @click="submitForm">提交</el-button>
    </div>
  </el-dialog>  
</template>

<script>
import { positiveInteger, ltNumber } from '@/utils/validate';
import urlmap from '@/utils/urlmap';
import { mapState, mapActions } from 'vuex';
import { cloneDeep } from 'lodash';

const formConfig = {
  date: '',
  castId: null,
  team: '',
  taskOrder: '',
  ribbonTypeName: '',
  ribbonWidth: null,
  client: '',
  furnace: '',
  theBeginfurnace: '',
  heatNum: null,
  alloyWeight: null,
  castTime: '',
  rawWeight: null,
  remark: '计划喷带12炉，如果有富余时间喷带按照当天最后一炉规定的要求生产。',
  fileNumber: '',
  orderThickness: '', // 订单要求：厚度
  orderLaminationFactor: '', // 订单要求：叠片系数
  orderRibbonToughnessLevels: [], // 订单要求：韧性
  orderAppearenceLevels: [], // 订单要求：外观
  qualifiedDemands: [
    {
      qualifiedThickness: '', // 入库要求：厚度
      qualifiedLaminationFactor: '', // 入库要求：叠片系数
      qualifiedRibbonToughnessLevels: [], // 入库要求：韧性
      qualifiedAppearenceLevels: [], // 入库要求：外观
    }
  ]
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
      roleId: null,
      visible: false,
      loading: false,
      formData: {
        date: '',
        castId: null,
        team: '',
        taskOrder: '',
        ribbonTypeName: '',
        ribbonWidth: null,
        client: '',
        furnace: '',
        theBeginfurnace: '',
        heatNum: null,
        alloyWeight: null,
        castTime: '',
        rawWeight: null,
        remark: '',
        fileNumber: '',
        orderThickness: '', // 订单要求：厚度
        orderLaminationFactor: '', // 订单要求：叠片系数
        orderRibbonToughnessLevels: [], // 订单要求：韧性
        orderAppearenceLevels: [], // 订单要求：外观
        // qualifiedThickness: '', // 入库要求：厚度
        // qualifiedLaminationFactor: '', // 入库要求：叠片系数
        // qualifiedRibbonToughnessLevels: [], // 入库要求：韧性
        // qualifiedAppearenceLevels: [], // 入库要求：外观
        qualifiedDemands: [
          {
            qualifiedThickness: '', // 入库要求：厚度
            qualifiedLaminationFactor: '', // 入库要求：叠片系数
            qualifiedRibbonToughnessLevels: [], // 入库要求：韧性
            qualifiedAppearenceLevels: [], // 入库要求：外观
          }
        ]
      },
      rules: {
        date: [{ required: true, message: '请选择日期', trigger: 'blur' }],
        castId: [{ required: true, message: '请选择机组', trigger: 'blur' }],
        team: [{ required: true, message: '请选择班次', trigger: 'blur' }],
        ribbonTypeName: [{ required: true, message: '请选择材质', trigger: 'blur' }],
        ribbonWidth: [
          { required: true, message: '请填写带宽', trigger: 'blur' },
          { validator: positiveInteger, trigger: 'blur' },
          { validator: ltNumber(99999), trigger: 'blur' }
        ],
        client: [{ max: 50, message: '最多50位字符', trigger: 'blur' }],
        furnace: [
          { required: true, message: '请填写炉号', trigger: 'blur' },
          { max: 20, message: '最多20位字符', trigger: 'blur' },
          { validator: checkFurnance, trigger: 'blur'}
        ],
        theBeginfurnace: [
          { required: true, message: '请填写开始炉号', trigger: 'blur' },
          { max: 20, message: '最多20位字符', trigger: 'blur' },
          { validator: checkFurnance, trigger: 'blur'}
        ],
        heatNum: [
          { required: true, message: '请填写计划炉次', trigger: 'blur' },
          { validator: positiveInteger, trigger: 'blur' },
          { validator: ltNumber(99999), trigger: 'blur' }   
        ],
        alloyWeight: [
          { required: true, message: '请填写单炉投入重量', trigger: 'blur' },
          { validator: positiveInteger, trigger: 'blur' },
          { validator: ltNumber(99999), trigger: 'blur' }   
        ],
        castTime: [{ max: 50, message: '最多50位字符', trigger: 'blur' }],
        remark: [{ max: 100, message: '最多100位字符', trigger: 'blur' }],
        fileNumber: [{ max: 50, message: '最多50位字符', trigger: 'blur' }],
        orderThickness: [
          { required: true, message: '请填写带厚', trigger: 'blur' },
          { max: 50, message: '最多50位字符', trigger: 'blur' },
          { pattern: /^([1-3]\d-[1-3]\d|≤[1-3]\d)$/, message: '格式错误，20-23或者≤23', trigger: 'blur' },
        ],
        orderLaminationFactor: [
          { required: true, message: '请选择叠片系数', trigger: 'blur' }
        ],
        orderRibbonToughnessLevels: [
          { required: true, message: '请选择韧性等级', trigger: 'blur' }
        ],
        orderAppearenceLevels: [
          { required: true, message: '请选择外观等级', trigger: 'blur' }
        ],
        // qualifiedThickness: [
        //   { required: true, message: '请填写带厚', trigger: 'blur' },
        //   { max: 50, message: '最多50位字符', trigger: 'blur' },
        //   { pattern: /^([1-3]\d-[1-3]\d|≤[1-3]\d)$/, message: '格式错误，20-23或者≤23', trigger: 'blur' },
        // ],
        // qualifiedLaminationFactor: [
        //   { required: true, message: '请选择叠片系数', trigger: 'blur' }
        // ],
        // qualifiedRibbonToughnessLevels: [
        //   { required: true, message: '请选择韧性等级', trigger: 'blur' }
        // ],
        // qualifiedAppearenceLevels: [
        //   { required: true, message: '请选择外观等级', trigger: 'blur' }
        // ]
      }
    }
  },
  computed: {
    ...mapState([
      'ribbonTypeList', 'ribbonWidthList', 'ribbonToughnessLevelList'
    ])
  },
  created () {
    if (this.dialogData.formType === 'create') {
      this.formData = Object.assign({}, formConfig, { castId: Number(this.$route.params.castId) });
    } else {
      this.formData = Object.assign(this.formData, this.dialogData.rowData);
    }
    this.roleId = JSON.parse(localStorage.getItem('userinfo')).roleId;
    this.getRibbonTypeList();
    this.getRibbonWidthList();
    this.getRibbonToughnessLevelList();
  },
  methods: {
    pick() {
      let date = this.formData.date.replace(/-/g, '');
      this.formData.theBeginfurnace = `0${this.formData.castId}-${date}-01`;
    },
    ...mapActions([
      'getRibbonTypeList', 'getRibbonWidthList', 'getRibbonToughnessLevelList'
    ]),
    closeDialog() {
      this.$emit('close');
    },
    addRequirement() {
      this.formData.qualifiedDemands.length < 2 && this.formData.qualifiedDemands.push({
        qualifiedThickness: '', // 入库要求：厚度
        qualifiedLaminationFactor: '', // 入库要求：叠片系数
        qualifiedRibbonToughnessLevels: [], // 入库要求：韧性
        qualifiedAppearenceLevels: [] // 入库要求：外观
      });
    },
    delRequirement() {
      this.formData.qualifiedDemands.length === 2 && this.formData.qualifiedDemands.pop();
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true;
          let method = '';
          let url = '';
          let params = null;

          if (this.dialogData.formType === 'create') { // 新增
            method = 'post';
            url = urlmap.addPlan;
            let formData = [];
            let _heatNum = this.formData.heatNum;
            let fHead = this.formData.theBeginfurnace.substring(0, 12);
            let fEnd = this.formData.theBeginfurnace.substring(12, 14);
            while(_heatNum > 0) {
              _heatNum--;
              let clone = cloneDeep(this.formData);
              clone.furnace = fHead + fEnd;
              clone.castTime = this.setCastTime(fEnd);
              clone.roleId = this.roleId;
              //将数组转成字符串
              clone.orderRibbonToughnessLevels = clone.orderRibbonToughnessLevels.join();
              clone.orderAppearenceLevels = clone.orderAppearenceLevels.join();
              // clone.qualifiedRibbonToughnessLevels = clone.qualifiedRibbonToughnessLevels.join();
              // clone.qualifiedAppearenceLevels = clone.qualifiedAppearenceLevels.join();
              clone.qualifiedDemands = JSON.stringify(clone.qualifiedDemands);
              formData.push(clone);
              fEnd = (Number(fEnd) + 1) < 10 ? '0' + (Number(fEnd) + 1) : (Number(fEnd) + 1);
            }
            
            params = { formDataJson: JSON.stringify(formData) };
          } else { // 编辑
            method = 'put';
            url = urlmap.updatePlan;
            const clone = cloneDeep(this.formData);
            clone.roleId = this.roleId;
            // this.formData.orderRibbonToughnessLevelsJson = JSON.stringify(this.formData.orderRibbonToughnessLevels);
            // this.formData.orderAppearenceLevelsJson = JSON.stringify(this.formData.orderAppearenceLevels);
            // this.formData.qualifiedRibbonToughnessLevelsJson = JSON.stringify(this.formData.qualifiedRibbonToughnessLevels);
            // this.formData.qualifiedAppearenceLevelsJson = JSON.stringify(this.formData.qualifiedAppearenceLevels);

            clone.orderRibbonToughnessLevels = clone.orderRibbonToughnessLevels.join();
            clone.orderAppearenceLevels = clone.orderAppearenceLevels.join();
            // clone.qualifiedRibbonToughnessLevels = clone.qualifiedRibbonToughnessLevels.join();
            // clone.qualifiedAppearenceLevels = clone.qualifiedAppearenceLevels.join();
            clone.qualifiedDemands = JSON.stringify(clone.qualifiedDemands);
            params = clone;
          }

          this.$http(method, url, params).then(data => {
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
    },
    setCastTime(fEnd) {
      let time = '';
      switch (Number(fEnd)) {
        case 1:
          time = '08:00-10:00';
          break;
        case 2:
          time = '10:00-12:00';
          break;
        case 3:
          time = '12:00-14:00';
          break;
        case 4:
          time = '14:00-16:00';
          break;
        case 5:
          time = '16:00-18:00';
          break;
        case 6:
          time = '18:00-20:00';
          break;
        case 7:
          time = '20:00-22:00';
          break;
        case 8:
          time = '22:00-24:00';
          break;
        case 9:
          time = '00:00-02:00';
          break;
        case 10:
          time = '02:00-04:00';
          break;
        case 11:
          time = '04:00-06:00';
          break;
        case 12:
          time = '06:00-08:00';
          break;
        default:
          break;
      }
      return time;
    }
  }
}
</script>

<style lang="scss" scoped>
.requirement_detail {
  border-top: 1px solid #dcdfe6;
  position: relative;
  padding: 20px 0 10px;
  .requirement_hd {
    position: absolute;
    left: 50%;
    top: -10px;
    transform: translateX(-50%);
    background-color: #fff;
    padding: 0 10px;
    .el-icon-circle-plus {
      position: absolute;
      top: 2px;
      margin-left: 5px;
      &:hover {
        color: #fff;
        background: #409EFF;
        cursor: pointer;
      }
    }
  }
  .requirement_row {
    position: relative;
    .el-icon-remove {
      position: absolute;
      top: 10px;
      left: 10px;
      &:hover {
        color: #fff;
        background: #409EFF;
        cursor: pointer;
      }
    }
  }
}
</style>


