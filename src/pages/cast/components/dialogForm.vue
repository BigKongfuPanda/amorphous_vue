<template>
  <el-dialog
  :title="dialogData.formType === 'add' ? `新增喷带记录-${$route.params.castId}号机组` : `修改喷带记录-${$route.params.castId}号机组`"
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
          <el-form-item label="材质" prop="ribbonTypeName" class="dialog_field">
            <el-select v-model="formData.ribbonTypeName" placeholder="请选择">
              <el-option v-for="item in dialogData.ribbonTypeList" :key="item.ribbonTypeId" :value="item.ribbonTypeName" :label="item.ribbonTypeName"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="规格" prop="ribbonWidth" class="dialog_field">
            <el-select v-model="formData.ribbonWidth" placeholder="请选择">
              <el-option v-for="item in dialogData.ribbonWidthList" :key="item.ribbonWidthId" :label="item.ribbonWidth" :value="item.ribbonWidth"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="制带炉号" prop="furnace" class="dialog_field">
            <el-input v-model="formData.furnace"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="喷带手:" prop="caster" class="dialog_field">
            <span>{{formData.caster}}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="在线包号" prop="tundish" class="dialog_field">
            <el-input v-model="formData.tundish" placeholder="请输入包体编号数字"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="包车编号" prop="tundishCar" class="dialog_field">
            <el-select v-model="formData.tundishCar">
              <el-option label="#1" value="1"></el-option>
              <el-option label="#2" value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="是否换包" prop="isChangeTundish" class="dialog_field">
            <el-select v-model="formData.isChangeTundish">
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="喷嘴杯个数" prop="nozzleNum" class="dialog_field">
            <el-input v-model="formData.nozzleNum"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="加热杯个数" prop="heatCupNum" class="dialog_field">
            <el-input v-model="formData.heatCupNum"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="放钢重量" prop="meltOutWeight" class="dialog_field">
            <el-input v-model="formData.meltOutWeight"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="大盘毛重" prop="rawWeight" class="dialog_field">
            <el-input v-model="formData.rawWeight"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="废带重量" prop="uselessRibbonWeight" class="dialog_field">
            <el-input v-model="formData.uselessRibbonWeight"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="备注" prop="remark" class="dialog_field">
            <el-input v-model="formData.remark"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="开包次数" prop="castTimes">
            <el-select v-model="formData.castTimes" @change="castTimesChangeHandler">
              <el-option label="1" :value="1"></el-option>
              <el-option label="2" :value="2"></el-option>
              <el-option label="3" :value="3"></el-option>
              <el-option label="4" :value="4"></el-option>
              <el-option label="5" :value="5"></el-option>
              <el-option label="6" :value="6"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <section class="cast_detail" v-for="(item, index) in formData.record" :key="index">
        <h3 class="cast_hd">第{{index+1}}次开包</h3>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="喷嘴规格" class="dialog_field" :prop="'record.' + index + '.nozzleSize'" :rules="[{ required: true, message: '请填写喷嘴规格，格式 30*0.25', trigger: 'blur' }, { max: 10, message: '最多10位字符', trigger: 'blur' }]">
              <el-input v-model="item.nozzleSize" placeholder="格式：30*0.25"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="车修铜辊" class="dialog_field" :prop="'record.' + index + '.treatCoolRoller'" :rules="[{ required: true, message: '请选择车修方式', trigger: 'blur' }]">
              <el-select v-model="item.treatCoolRoller" placeholder="请选择">
                <el-option label="车" value="车"></el-option>
                <el-option label="修" value="修"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="铜套厚度" class="dialog_field" :prop="'record.' + index + '.coolRollerThickness'" :rules="[{ required: true, message: '请填写铜套厚度，单位 mm', trigger: 'blur' }, { pattern: /^(0|[1-9]\d{0,8})$/, message: '请输入9位以内自然数, 如 0,1,2,3,...', trigger: 'blur' }]">
              <el-input v-model="item.coolRollerThickness"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="接钢时间" class="dialog_field" :prop="'record.' + index + '.ReceiveMeltTime'" :rules="[{ required: true, message: '请填写接钢时间，格式 08:30', trigger: 'blur' },{ max: 10, message: '最多10位字符', trigger: 'blur' }]">
              <el-input v-model="item.ReceiveMeltTime" placeholder="格式：08:30"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="接钢前包温" class="dialog_field" :prop="'record.' + index + '.tundishTemperatureWithoutMelt'" :rules="[{ required: true, message: '请填写接钢前包温', trigger: 'blur' }, { pattern: /^[1-9]\d{0,8}$/, message: '请输入9位以内正整数, 如 1350,...', trigger: 'blur' }]">
              <el-input v-model="item.tundishTemperatureWithoutMelt"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="接钢后包温" class="dialog_field" :prop="'record.' + index + '.tundishTemperatureWithMelt'" :rules="[{ required: true, message: '请填写接钢后包温', trigger: 'blur' }, { pattern: /^[1-9]\d{0,8}$/, message: '请输入9位以内正整数, 如 1350,...', trigger: 'blur' }]">
              <el-input v-model="item.tundishTemperatureWithMelt"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="装杯时间" class="dialog_field" :prop="'record.' + index + '.installNozzleTime'" :rules="[{ required: true, message: '请填写装杯时间，格式 08:40', trigger: 'blur' },{ max: 10, message: '最多10位字符', trigger: 'blur' }]">
              <el-input v-model="item.installNozzleTime" placeholder="格式：08:40"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="开包时间" class="dialog_field" :prop="'record.' + index + '.castTimeStart'" :rules="[{ required: true, message: '请填写开包时间，格式 08:40', trigger: 'blur' },{ max: 10, message: '最多10位字符', trigger: 'blur' }]">
              <el-input v-model="item.castTimeStart" placeholder="格式：09:20"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="开包压力" class="dialog_field" :prop="'record.' + index + '.pressure'" :rules="[{ required: true, message: '请填写开包压力', trigger: 'blur' }, { pattern: /^[1-9]\d{0,8}$/, message: '请输入9位以内正整数, 如 18,...', trigger: 'blur' }]">
              <el-input v-model="item.pressure"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="开包温度" class="dialog_field" :prop="'record.' + index + '.tundishTemperatureCasting'" :rules="[{ required: true, message: '请填写开包温度', trigger: 'blur' }, { pattern: /^[1-9]\d{0,8}$/, message: '请输入9位以内正整数, 如 1350,...', trigger: 'blur' }]">
              <el-input v-model="item.tundishTemperatureCasting"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="喷带前水温" class="dialog_field" :prop="'record.' + index + '.coolRollerTemperatureBeforeCast'" :rules="[{ required: true, message: '请填写水温', trigger: 'blur' }, { pattern: /^(\d+|\d+\.\d{1,2})-(\d+|\d+\.\d{1,2})$/, message: '格式错误, 如 32.50-32.50', trigger: 'blur' }]">
              <el-input v-model="item.coolRollerTemperatureBeforeCast" placeholder="格式：32-32"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="喷带后水温" prop="" class="dialog_field" :prop="'record.' + index + '.coolRollerTemperatureAfterCast'" :rules="[{ required: true, message: '请填写水温', trigger: 'blur' }, { pattern: /^(\d+|\d+\.\d{1,2})-(\d+|\d+\.\d{1,2})$/, message: '格式错误, 如 32.50-33.80', trigger: 'blur' }]">
              <el-input v-model="item.coolRollerTemperatureAfterCast" placeholder="格式：32-35"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="喷带位置" class="dialog_field" :prop="'record.' + index + '.castLocation'" :rules="[{ required: true, message: '请选择喷带位置', trigger: 'blur' }]">
              <el-select v-model="item.castLocation" placeholder="">
                <el-option label="左" value="左"></el-option>
                <el-option label="中" value="中"></el-option>
                <el-option label="右" value="右"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="抓取次数" class="dialog_field" :prop="'record.' + index + '.coilTimes'" :rules="[{ required: true, message: '请填写抓取次数', trigger: 'blur' }]">
              <el-select v-model="item.coilTimes">
                <el-option label="1" value="1"></el-option>
                <el-option label="2" value="2"></el-option>
                <el-option label="3" value="3"></el-option>
                <el-option label=">3" value=">3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="完成时间" class="dialog_field" :prop="'record.' + index + '.castTimeEnd'" :rules="[{ required: true, message: '请填写完成时间，格式 08:40', trigger: 'blur' },{ max: 10, message: '最多10位字符', trigger: 'blur' }]">
              <el-input v-model="item.castTimeEnd" placeholder="格式：10:30"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="结果描述" class="dialog_field" :prop="'record.' + index + '.describe'" :rules="[{ required: true, message: '请填写结果描述', trigger: 'blur' },{ max: 100, message: '最多100位字符', trigger: 'blur' }]">
              <el-input v-model="item.describe"></el-input>
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
import { integer, positiveInteger, ltNumber, checkFurnace, number } from '@/utils/validate';
import urlmap from '@/utils/urlmap';
import { mapState, mapActions } from 'vuex';
import { cloneDeep } from 'lodash';

const defaultCastDetail = {
  "nozzleSize": "", //喷嘴规格
  "nozzleNum": 1, //喷嘴数量
  "heatCupNum": 1, //加热杯数量
  "treatCoolRoller": "", //冷却辊处理方式 车，修
  "coolRollerThickness": null, //铜套厚度
  "ReceiveMeltTime": "", //接钢时间
  "tundishTemperatureWithoutMelt": null, //接钢前温度 摄氏度
  "tundishTemperatureWithMelt": null, // 接钢后包温 摄氏度
  "installNozzleTime": "", //装杯时间
  "castTimeStart": "", //喷带开始时间
  "pressure": null, //开包压力
  "tundishTemperatureCasting": null, //喷带开始时包温 摄氏度
  "coolRollerTemperatureBeforeCast": "", //喷带开始时冷却辊进出水水温
  "coolRollerTemperatureAfterCast": "", //喷带结束时冷却辊进出水水温
  "castLocation": "", //喷带位置
  "coilTimes": null, //抓取次数
  "castTimeEnd": "", // 喷带结束时间
  "describe": "" //喷带过程描述
};

const formConfig = {
  "castTimes": 1, //开包次数，默认为1
  "castId": 6,// 机组编号
  "furnace": "",// 制带炉号  06-20181120-01/01
  "caster": '', //喷带手
  "ribbonWidth": null, //带宽
  "ribbonTypeId": '',//材质id
  "ribbonTypeName": "", //材质名称
  "nozzleNum": 1, //喷嘴个数
  "heatCupNum": 0, //加热杯个数
  "tundishCar": '', //包车
  "tundish": '', //在线包包号
  "isChangeTundish": '', //是否换包 1-是 0-否
  "meltOutWeight": 0, //放钢重量
  "rawWeight": null, //大盘毛重
  "remark": '', //备注
  "createdAt": "", //创建时间
  "updatedAt": "", //更新时间
  "uselessRibbonWeight": null, // 废带重量
  record: [
    defaultCastDetail
  ]
};

export default {
  data() {
    return {
      userinfo: {},
      visible: false,
      loading: false,
      formData: {
        "castTimes": 1, //开包次数，默认为1
        "castId": 6,// 机组编号
        "furnace": "",// 制带炉号  06-20181120-01/01
        "caster": '', //喷带手
        "ribbonWidth": null, //带宽
        "ribbonTypeId": '',//材质id
        "ribbonTypeName": "", //材质名称
        "nozzleNum": 1, //喷嘴个数
        "heatCupNum": 1, //加热杯个数
        "tundishCar": '', //包车
        "tundish": '', //在线包包号
        "isChangeTundish": '', //是否换包 1-是 0-否
        "meltOutWeight": 0, //放钢重量
        "rawWeight": null, //大盘毛重
        "remark": '', //备注
        "createdAt": "", //创建时间
        "updatedAt": "", //更新时间
        "uselessRibbonWeight": null, // 废带重量
        record: [
          {
            "nozzleSize": "", //喷嘴规格
            "nozzleNum": 1, //喷嘴数量
            "heatCupNum": 1, //加热杯数量
            "treatCoolRoller": "", //冷却辊处理方式 车、修
            "coolRollerThickness": null, //铜套厚度
            "ReceiveMeltTime": "", //接钢时间
            "tundishTemperatureWithoutMelt": null, //接钢前温度 摄氏度
            "tundishTemperatureWithMelt": null, // 接钢后包温 摄氏度
            "installNozzleTime": "", //装杯时间
            "castTimeStart": "", //喷带开始时间
            "pressure": null, //开包压力
            "tundishTemperatureCasting": null, //喷带开始时包温 摄氏度
            "coolRollerTemperatureBeforeCast": "", //喷带开始时冷却辊进出水水温
            "coolRollerTemperatureAfterCast": "", //喷带结束时冷却辊进出水水温
            "castLocation": "", //喷带位置
            "coilTimes": null, //抓取次数
            "castTimeEnd": "", // 喷带结束时间
            "describe": "" //喷带过程描述
          }
        ]
      },
      rules: {
        ribbonTypeName: [{ required: true, message: '请选择材质', trigger: 'blur' }],
        ribbonWidth: [
          { required: true, message: '请填写带宽', trigger: 'blur' },
          { validator: positiveInteger, trigger: 'blur' },
          { validator: ltNumber(99999), trigger: 'blur' }
        ],
        furnace: [
          { required: true, message: '请填写炉号', trigger: 'blur' },
          { max: 20, message: '最多20位字符', trigger: 'blur' },
          { validator: checkFurnace, trigger: 'blur'}
        ],
        caster: [
          { required: true, message: '请填写熔炼人姓名', trigger: 'blur' },
          { max: 10, message: '最多10位字符', trigger: 'blur' }
        ],
        tundish: [
          { required: true, message: '请填写在线包号', trigger: 'blur' },
          { validator: number, trigger: 'blur' },
          { validator: ltNumber(99999), trigger: 'blur' }
        ],
        tundishCar: [{ required: true, message: '请选择包车编号', trigger: 'blur' }],
        isChangeTundish: [{ required: true, message: '请选择是否换包', trigger: 'blur' }],
        nozzleNum: [
          { required: true, message: '请填写喷嘴杯个数', trigger: 'blur' },
          { validator: number, trigger: 'blur' },
          { validator: ltNumber(99999), trigger: 'blur' }
        ],
        heatCupNum: [
          { required: true, message: '请填写加热杯个数', trigger: 'blur' },
          { validator: number, trigger: 'blur' },
          { validator: ltNumber(99999), trigger: 'blur' }
        ],
        meltOutWeight: [
          { required: true, message: '请填写放钢重量', trigger: 'blur' },
          { validator: number, trigger: 'blur' },
          { validator: ltNumber(300), trigger: 'blur' }
        ],
        rawWeight: [
          { required: true, message: '请填写大盘毛重', trigger: 'blur' },
          { validator: number, trigger: 'blur' },
          { validator: ltNumber(300), trigger: 'blur' }
        ],
        remark: [
          { max: 50, message: '最多50位字符', trigger: 'blur' }
        ],
        castTimes: [{ required: true, message: '请选择开包次数', trigger: 'blur' }],
        uselessRibbonWeight: [
          { required: true, message: '请填写大盘毛重', trigger: 'blur' },
          { validator: number, trigger: 'blur' },
          { validator: ltNumber(300), trigger: 'blur' }
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
    this.userinfo = JSON.parse(localStorage.getItem('userinfo'));
    if (this.dialogData.formType === 'add') {
      const _formConfig = cloneDeep(formConfig);
      this.formData = Object.assign({}, _formConfig, {castId: Number(this.$route.params.castId), caster: this.userinfo.adminname});
    } else {
      this.formData = Object.assign(this.formData, this.dialogData.rowData);
      this.formData.castTimes = this.formData.record.length;
    }
  },
  mounted() {},
  methods: {
    closeDialog() {
      this.$emit('close');
    },
    castTimesChangeHandler(val) { // 开包次数的改变
      const _length = this.formData.record.length;
      if (val > _length) {
        const clone = cloneDeep(defaultCastDetail);
        for(let i = 0; i < val - _length; i++) {
          this.formData.record.push(clone);
        }
      } else if (val < _length) {
        for(let i = 0; i < _length - val; i++) {
          this.formData.record.pop();
        }
      }
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if(valid) {
          this.loading = true;

          this.formData.recordJson = JSON.stringify(this.formData.record);
          this.formData.roleId = this.userinfo.roleId;
          this.formData.adminname = this.userinfo.adminname;

          const { method, url } = this.dialogData.formType === 'add' ? { method: 'POST', url: urlmap.addCast } : { method: 'PUT', url: urlmap.updateCast };

          this.$http(method, url, this.formData).then(data => {
            this.$emit('submit');
          }).catch((error) => {
            console.log(error);
          }).finally(() => {
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
<style lang='scss' scoped>
/deep/ .el-dialog__body {
  height: 500px;
  overflow: auto;
}
.cast_detail {
  border-top: 1px solid #dcdfe6;
  position: relative;
  padding: 20px 0 10px;
  .cast_hd {
    position: absolute;
    left: 50%;
    top: -10px;
    transform: translateX(-50%);
    background-color: #fff;
    padding: 0 10px;
  }
}
</style>
