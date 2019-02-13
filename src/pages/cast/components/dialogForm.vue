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
    <el-form :model="formData" :rules="rules" ref="form" label-width="100px" style="100%" @submit.native.prevent>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="材质" prop="ribbonTypeId" class="dialog_field">
            <el-select v-model="formData.ribbonTypeId" placeholder="请选择">
              <el-option v-for="item in ribbonTypeList" :key="item.ribbonTypeId" :value="item.ribbonTypeId" :label="item.ribbonTypeName"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="带宽" prop="ribbonWidth" class="dialog_field">
            <el-input v-model="formData.ribbonWidth"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="制带炉号" prop="furnace" class="dialog_field">
            <el-input v-model="formData.furnace"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="喷带手" prop="caster" class="dialog_field">
            <el-input v-model="formData.caster"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="在线包号" prop="tundish" class="dialog_field">
            <el-input v-model="formData.tundish"></el-input>
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
          <el-form-item label="备注" prop="remark" class="dialog_field">
            <el-input v-model="formData.remark"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
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
            <el-form-item label="喷嘴规格" prop="nozzleSize" class="dialog_field">
              <el-input v-model="item.nozzleSize"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="车修铜辊" prop="treatCoolRoller" class="dialog_field">
              <el-select v-model="item.treatCoolRoller" placeholder="">
                <el-option label="车" value="车"></el-option>
                <el-option label="修" value="修"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="铜套厚度" prop="coolRollerThickness" class="dialog_field">
              <el-input v-model="item.coolRollerThickness"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="接钢时间" prop="ReceiveMeltTime" class="dialog_field">
              <el-input v-model="item.ReceiveMeltTime"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="接钢前包温" prop="tundishTemperatureWithoutMelt" class="dialog_field">
              <el-input v-model="item.tundishTemperatureWithoutMelt"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="接钢后包温" prop="tundishTemperatureWithMelt" class="dialog_field">
              <el-input v-model="item.tundishTemperatureWithMelt"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="装杯时间" prop="installNozzleTime" class="dialog_field">
              <el-input v-model="item.installNozzleTime"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="开包时间" prop="castTimeStart" class="dialog_field">
              <el-input v-model="item.castTimeStart"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="开包压力" prop="pressure" class="dialog_field">
              <el-input v-model="item.pressure"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="开包温度" prop="tundishTemperatureCasting" class="dialog_field">
              <el-input v-model="item.tundishTemperatureCasting"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="喷带前水温" prop="coolRollerTemperatureBeforeCast" class="dialog_field">
              <el-input v-model="item.coolRollerTemperatureBeforeCast"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="喷带后水温" prop="coolRollerTemperatureAfterCast" class="dialog_field">
              <el-input v-model="item.coolRollerTemperatureAfterCast"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="喷带位置" prop="castLocation" class="dialog_field">
              <el-select v-model="item.castLocation" placeholder="">
                <el-option label="左" value="左"></el-option>
                <el-option label="中" value="中"></el-option>
                <el-option label="右" value="右"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="抓取次数" prop="coilTimes" class="dialog_field">
              <el-input v-model="item.coilTimes"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="喷带完成时间" prop="castTimeEnd" class="dialog_field">
              <el-input v-model="item.castTimeEnd"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="喷带结果描述" prop="describe" class="dialog_field">
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

const defaultCastDetail = {
  "nozzleSize": "30*0.25", //喷嘴规格
  "nozzleNum": 1, //喷嘴数量
  "heatCupNum": 1, //加热杯数量
  "treatCoolRoller": "左", //冷却辊处理方式 左中右
  "coolRollerThickness": 40, //铜套厚度
  "ReceiveMeltTime": "", //接钢时间
  "tundishTemperatureWithoutMelt": 1350, //接钢前温度 摄氏度
  "tundishTemperatureWithMelt": 1330, // 接钢后包温 摄氏度
  "installNozzleTime": "", //装杯时间
  "castTimeStart": "", //喷带开始时间
  "pressure": 18, //开包压力
  "tundishTemperatureCasting": 1350, //喷带开始时包温 摄氏度
  "coolRollerTemperatureBeforeCast": "32-32", //喷带开始时冷却辊进出水水温
  "coolRollerTemperatureAfterCast": "32-35", //喷带结束时冷却辊进出水水温
  "castLocation": "左", //喷带位置
  "coilTimes": 1, //抓取次数
  "castTimeEnd": "", // 喷带结束时间
  "describe": "抓取1次完" //喷带过程描述
};

const formConfig = {
  "castTimes": 1, //开包次数，默认为1
  "castId": 6,// 机组编号
  "furnace": "",// 制带炉号  06-20181120-01/01
  "caster": '', //喷带手
  "ribbonWidth": 30, //带宽
  "ribbonTypeId": '',//材质id
  "ribbonTypeName": "", //材质名称
  "nozzleNum": 1, //喷嘴个数
  "heatCupNum": 1, //加热杯个数
  "tundishCar": '', //包车
  "tundish": '', //在线包包号
  "isChangeTundish": '', //是否换包 1-是 0-否
  "meltOutWeight": 0, //放钢重量
  "rawWeight": 0, //大盘毛重
  "remark": '备注', //备注
  "createdAt": "", //创建时间
  "updatedAt": "", //更新时间
  record: [
    defaultCastDetail
  ]
};

export default {
  data() {
    return {
      visible: false,
      loading: false,
      formData: {
        "castTimes": 1, //开包次数，默认为1
        "castId": 6,// 机组编号
        "furnace": "",// 制带炉号  06-20181120-01/01
        "caster": '', //喷带手
        "ribbonWidth": 30, //带宽
        "ribbonTypeId": '',//材质id
        "ribbonTypeName": "", //材质名称
        "nozzleNum": 1, //喷嘴个数
        "heatCupNum": 1, //加热杯个数
        "tundishCar": '', //包车
        "tundish": '', //在线包包号
        "isChangeTundish": '', //是否换包 1-是 0-否
        "meltOutWeight": 0, //放钢重量
        "rawWeight": 0, //大盘毛重
        "remark": '备注', //备注
        "createdAt": "", //创建时间
        "updatedAt": "", //更新时间
        record: [
          {
            "nozzleSize": "30*0.25", //喷嘴规格
            "nozzleNum": 1, //喷嘴数量
            "heatCupNum": 1, //加热杯数量
            "treatCoolRoller": "左", //冷却辊处理方式 左中右
            "coolRollerThickness": 40, //铜套厚度
            "ReceiveMeltTime": "", //接钢时间
            "tundishTemperatureWithoutMelt": 1350, //接钢前温度 摄氏度
            "tundishTemperatureWithMelt": 1330, // 接钢后包温 摄氏度
            "installNozzleTime": "", //装杯时间
            "castTimeStart": "", //喷带开始时间
            "pressure": 18, //开包压力
            "tundishTemperatureCasting": 1350, //喷带开始时包温 摄氏度
            "coolRollerTemperatureBeforeCast": "32-32", //喷带开始时冷却辊进出水水温
            "coolRollerTemperatureAfterCast": "32-35", //喷带结束时冷却辊进出水水温
            "castLocation": "左", //喷带位置
            "coilTimes": 1, //抓取次数
            "castTimeEnd": "", // 喷带结束时间
            "describe": "抓取1次完" //喷带过程描述
          }
        ]
      },
      rules: {
        ribbonTypeId: [{ required: true, message: '请选择材质', trigger: 'blur' }],
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
          { validator: ltNumber(99999), trigger: 'blur' }
        ],
        rawWeight: [
          { required: true, message: '请填写大盘毛重', trigger: 'blur' },
          { validator: number, trigger: 'blur' },
          { validator: ltNumber(99999), trigger: 'blur' }
        ],
        remark: [
          { max: 50, message: '最多50位字符', trigger: 'blur' }
        ],
        castTimes: [{ required: true, message: '请选择开包次数', trigger: 'blur' }],

        newAlloyNumber: [
          { max: 20, message: '最多20位字符', trigger: 'blur' }
        ],
        newAlloyWeight: [
          { validator: number, trigger: 'blur' },
          { validator: ltNumber(99999), trigger: 'blur' }
        ],
        oldAlloyNumber: [
          { max: 20, message: '最多20位字符', trigger: 'blur' }
        ],
        oldAlloyWeight: [
          { validator: number, trigger: 'blur' },
          { validator: ltNumber(99999), trigger: 'blur' }
        ],
        mixAlloyNumber: [
          { max: 20, message: '最多20位字符', trigger: 'blur' }
        ],
        mixAlloyWeight: [
          { validator: number, trigger: 'blur' },
          { validator: ltNumber(99999), trigger: 'blur' }
        ],
        highNbNumber: [
          { max: 20, message: '最多20位字符', trigger: 'blur' }
        ],
        highNbWeight: [
          { validator: number, trigger: 'blur' },
          { validator: ltNumber(99999), trigger: 'blur' }
        ],
        Si: [
          { validator: number, trigger: 'blur' },
          { validator: ltNumber(99999), trigger: 'blur' }
        ],
        Ni: [
          { validator: number, trigger: 'blur' },
          { validator: ltNumber(99999), trigger: 'blur' }
        ],
        Cu: [
          { validator: number, trigger: 'blur' },
          { validator: ltNumber(99999), trigger: 'blur' }
        ],
        BFe: [
          { validator: number, trigger: 'blur' },
          { validator: ltNumber(99999), trigger: 'blur' }
        ],
        NbFe: [
          { validator: number, trigger: 'blur' },
          { validator: ltNumber(99999), trigger: 'blur' }
        ],
        alloyOutWeight: [
          { validator: number, trigger: 'blur' },
          { validator: ltNumber(99999), trigger: 'blur' }
        ],
        alloyFixWeight: [
          { validator: integer, trigger: 'blur' },
          { validator: ltNumber(99999), trigger: 'blur' }
        ],
        remark: [
          { max: 100, message: '最多100位字符', trigger: 'blur' }
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
  computed: {
    ...mapState([
      'ribbonTypeList'
    ])
  },
  created() {
    if (this.dialogData.formType === 'add') {
      this.formData = Object.assign({}, formConfig, {castId: Number(this.$route.params.castId)});
    } else {
      this.formData = Object.assign(this.formData, this.dialogData.rowData);
      this.formData.castTimes = this.formData.record.length;
    }
    this.getRibbonTypeList();
  },
  mounted() {},
  methods: {
    ...mapActions([
      'getRibbonTypeList'
    ]),
    closeDialog() {
      this.$emit('close');
    },
    castTimesChangeHandler(val) { // 开包次数的改变
      const _length = this.formData.record.length;
      if (val > _length) {
        for(let i = 0; i < val - _length; i++) {
          this.formData.record.push(defaultCastDetail);
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
          this.formData.ribbonTypeName = this.ribbonTypeList && this.ribbonTypeList.find(item => {
            return item.ribbonTypeId === this.formData.ribbonTypeId;
          }).ribbonTypeName;

          // 总重量
          this.formData.alloyTotalWeight = parseInt(this.formData.newAlloyWeight) + parseInt(this.formData.oldAlloyWeight) + parseInt(this.formData.mixAlloyWeight) + parseInt(this.formData.highNbWeight) + parseInt(this.formData.alloyFixWeight);

          const { method, url } = this.dialogData.formType === 'add' ? { method: 'POST', url: urlmap.addMelt } : { method: 'PUT', url: urlmap.updateMelt };

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
  padding: 10px 0;
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
