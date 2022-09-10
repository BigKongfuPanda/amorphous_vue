<template>
  <el-dialog
    :title="
      dialogData.formType === 'create'
        ? `新增冶炼记录-${$route.params.castId}号机组`
        : `修改冶炼记录-${$route.params.castId}号机组`
    "
    :visible.sync="dialogData.dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="closeDialog"
    :center="true"
    width="950px"
    v-loading="loading"
    element-loading-text="拼命加载中"
  >
    <el-form
      :model="formData"
      :rules="rules"
      ref="form"
      label-width="100px"
      @submit.native.prevent
      inline
    >
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item
            label="材质:"
            prop="ribbonTypeName"
            class="dialog_field"
          >
            <el-select
              v-model="formData.ribbonTypeName"
              placeholder="请选择"
              @change="handleRibbonTypeChange"
            >
              <el-option
                v-for="item in dialogData.ribbonTypeList"
                :key="item.ribbonTypeName"
                :value="item.ribbonTypeName"
                :label="item.ribbonTypeName"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="制带炉号:" prop="planFurnace" class="dialog_field">
            <el-input v-model="formData.furnace" v-if="dialogData.formType === 'edit'"></el-input>
            <el-select
              v-model="formData.planFurnace"
              filterable
              allow-create
              placeholder="请选择"
              v-else
            >
              <el-option
                v-for="item in planFurnaceList"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="桶号:" prop="bucket" class="dialog_field">
            <!-- <span>{{ formData.bucket }}</span> -->
            <el-input v-model="formData.bucket"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="熔炼人:" prop="melter" class="dialog_field">
            <span>{{ formData.melter }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            label="冶炼炉炉号"
            prop="meltFurnace"
            class="dialog_field"
          >
            <el-select v-model="formData.meltFurnace">
              <el-option label="A炉" value="A"></el-option>
              <el-option label="B炉" value="B"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            label="新料批号:"
            prop="newAlloyNumber"
            class="dialog_field"
          >
            <el-input v-model="formData.newAlloyNumber"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item
            label="新料重量:"
            prop="newAlloyWeight"
            class="dialog_field"
          >
            <el-input v-model="formData.newAlloyWeight"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            label="加工料批号:"
            prop="oldAlloyNumber"
            class="dialog_field"
          >
            <el-input v-model="formData.oldAlloyNumber"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            label="加工料重量:"
            prop="oldAlloyWeight"
            class="dialog_field"
          >
            <el-input v-model="formData.oldAlloyWeight"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item
            label="回炉锭批号:"
            prop="mixAlloyNumber"
            class="dialog_field"
          >
            <el-input v-model="formData.mixAlloyNumber"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            label="回炉锭重量:"
            prop="mixAlloyWeight"
            class="dialog_field"
          >
            <el-input v-model="formData.mixAlloyWeight"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            label="高铌料批号:"
            prop="highNbNumber"
            class="dialog_field"
          >
            <el-input v-model="formData.highNbNumber"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item
            label="高铌料重量:"
            prop="highNbWeight"
            class="dialog_field"
          >
            <el-input v-model="formData.highNbWeight"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="硅:" prop="Si" class="dialog_field">
            <el-input v-model="formData.Si"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="镍:" prop="Ni" class="dialog_field">
            <el-input v-model="formData.Ni"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="铜:" prop="Cu" class="dialog_field">
            <el-input v-model="formData.Cu"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="硼铁:" prop="BFe" class="dialog_field">
            <el-input v-model="formData.BFe"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="铌铁:" prop="NbFe" class="dialog_field">
            <el-input v-model="formData.NbFe"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 二次续钢：开始 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item
            label="续钢1炉号:"
            prop="addMeltNumber1"
            class="dialog_field"
          >
            <el-input v-model="formData.addMeltNumber1"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            label="续钢1重量:"
            prop="addMeltWeight1"
            class="dialog_field"
          >
            <el-input v-model="formData.addMeltWeight1"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            label="续钢2炉号:"
            prop="addMeltNumber2"
            class="dialog_field"
          >
            <el-input v-model="formData.addMeltNumber2"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item
            label="续钢2重量:"
            prop="addMeltWeight2"
            class="dialog_field"
          >
            <el-input v-model="formData.addMeltWeight2"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            label="续钢3炉号:"
            prop="addMeltNumber3"
            class="dialog_field"
          >
            <el-input v-model="formData.addMeltNumber3"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            label="续钢3重量:"
            prop="addMeltWeight3"
            class="dialog_field"
          >
            <el-input v-model="formData.addMeltWeight3"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 二次续钢：结束 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item
            label="放钢重量:"
            prop="alloyOutWeight"
            class="dialog_field"
          >
            <el-input v-model="formData.alloyOutWeight"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            label="修正重量:"
            prop="alloyFixWeight"
            class="dialog_field"
          >
            <el-input v-model="formData.alloyFixWeight"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="备注:" prop="remark" class="dialog_field">
            <el-input v-model="formData.remark"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item
            label="加料时间:"
            prop="startMeltingTime"
            class="dialog_field"
          >
            <!-- <el-input v-model="formData.startMeltingTime"></el-input> -->
            <el-date-picker
              v-model="formData.startMeltingTime"
              type="datetime"
              placeholder="加料时间"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            label="浇钢时间:"
            prop="endMeltingTime"
            class="dialog_field"
          >
            <!-- <el-input v-model="formData.endMeltingTime"></el-input> -->
            <el-date-picker
              v-model="formData.endMeltingTime"
              type="datetime"
              placeholder="浇钢时间"
            >
              >
            </el-date-picker>
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
import {
  integer,
  positiveInteger,
  ltNumber,
  checkFurnace,
  checkFurnaceWithoutBucket,
  number
} from "@/utils/validate";
import urlmap from "@/utils/urlmap";

const formConfig = {
  date: "", //冶炼日期
  castId: 6, // 机组编号
  planFurnace: "", // 制带炉号  06-20181120-01/01
  ribbonTypeName: "", //材质名称
  bucket: "", // 配料桶号
  melter: "", // 熔炼人
  meltFurnace: "", // 冶炼炉炉号 A 或 B
  newAlloyNumber: "", // 新料炉号 新B-2018-12-12
  newAlloyWeight: 0, // 新料重量
  oldAlloyNumber: "", // 加工料炉号 加B-2018-12-12
  oldAlloyWeight: 0, //加工料重量
  mixAlloyNumber: "", // 回炉锭炉号 加B-2018-12-12
  mixAlloyWeight: 0, // 回炉锭重量
  highNbNumber: "", // 高铌料炉号 加B-2018-12-12
  highNbWeight: 0, // 高铌料重量
  Si: 0, //硅重量
  Ni: 0, // 镍重量
  Cu: 0, //铜重量
  BFe: 0, //硼铁重量
  NbFe: 0, //铌铁重量
  alloyTotalWeight: 0, //总重量
  alloyOutWeight: 0, //放钢重量
  alloyFixWeight: 0, // 总重量修正
  remark: "",
  createdAt: "", //创建时间
  updatedAt: "", //更新时间
  addMeltNumber1: "", //二次续钢炉号
  addMeltWeight1: 0, //二次续钢重量
  addMeltNumber2: "", //二次续钢炉号
  addMeltWeight2: 0, //二次续钢重量
  addMeltNumber3: "", //二次续钢炉号
  addMeltWeight3: 0, //二次续钢重量
  startMeltingTime: "", // 加料时间
  endMeltingTime: "" // 浇钢时间
};

export default {
  data() {
    const validateMeltingTime = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("浇钢时间不能为空"));
      }
      const startTime = this.formData.startMeltingTime;
      if (new Date(value).getTime() > new Date(startTime).getTime()) {
        callback();
      } else {
        callback(new Error("浇钢时间必须大于加料时间"));
      }
    };
    return {
      userinfo: {},
      visible: false,
      loading: false,
      planFurnaceList: [], // 生产计划的炉号
      formData: {
        date: "", //冶炼日期
        castId: 6, // 机组编号
        planFurnace: "", // 制带炉号  06-20181120-01/01
        ribbonTypeName: "", //材质名称
        bucket: "", // 配料桶号
        melter: "", // 熔炼人
        meltFurnace: "", // 冶炼炉炉号 A 或 B
        newAlloyNumber: "", // 新料炉号 新B-2018-12-12
        newAlloyWeight: 0, // 新料重量
        oldAlloyNumber: "", // 加工料炉号 加B-2018-12-12
        oldAlloyWeight: 0, //加工料重量
        mixAlloyNumber: "", // 回炉锭炉号 加B-2018-12-12
        mixAlloyWeight: 0, // 回炉锭重量
        highNbNumber: "", // 高铌料炉号 加B-2018-12-12
        highNbWeight: 0, // 高铌料重量
        Si: 0, //硅重量
        Ni: 0, // 镍重量
        Cu: 0, //铜重量
        BFe: 0, //硼铁重量
        NbFe: 0, //铌铁重量
        alloyTotalWeight: 0, //总重量
        alloyOutWeight: 0, //放钢重量
        alloyFixWeight: 0, // 总重量修正
        remark: "",
        createdAt: "", //创建时间
        updatedAt: "", //更新时间
        addMeltNumber1: "", //二次续钢炉号
        addMeltWeight1: 0, //二次续钢重量
        addMeltNumber2: "", //二次续钢炉号
        addMeltWeight2: 0, //二次续钢重量
        addMeltNumber3: "", //二次续钢炉号
        addMeltWeight3: 0, //二次续钢重量
        startMeltingTime: "", // 加料时间
        endMeltingTime: "" // 浇钢时间
      },
      rules: {
        ribbonTypeName: [
          { required: true, message: "请选择材质", trigger: "blur" }
        ],
        planFurnace: [
          { required: true, message: "请填写炉号", trigger: "blur" },
          { max: 14, message: "最多14位字符", trigger: "blur" },
          { validator: checkFurnaceWithoutBucket, trigger: "change" }
        ],
        bucket: [
          { required: true, message: "请填写桶号", trigger: "blur" },
          // { max: 2, message: "最多2位字符", trigger: "blur" }
          {
            pattern: /^[0-9]{1}[0-9]{1}$/,
            message: "格式为 01,02,...,09,10,11,...,99",
            trigger: "blur"
          }
          // { validator: integer, trigger: "blur" },
          // { validator: ltNumber(99999), trigger: "blur" }
        ],
        melter: [
          { required: true, message: "请填写熔炼人姓名", trigger: "blur" },
          { max: 10, message: "最多10位字符", trigger: "blur" }
        ],
        meltFurnace: [
          { required: true, message: "请选择冶炼炉", trigger: "blur" }
        ],
        newAlloyNumber: [{ max: 20, message: "最多20位字符", trigger: "blur" }],
        newAlloyWeight: [
          { validator: number, trigger: "blur" },
          { validator: ltNumber(99999), trigger: "blur" }
        ],
        oldAlloyNumber: [{ max: 20, message: "最多20位字符", trigger: "blur" }],
        oldAlloyWeight: [
          { validator: number, trigger: "blur" },
          { validator: ltNumber(99999), trigger: "blur" }
        ],
        mixAlloyNumber: [{ max: 20, message: "最多20位字符", trigger: "blur" }],
        mixAlloyWeight: [
          { validator: number, trigger: "blur" },
          { validator: ltNumber(99999), trigger: "blur" }
        ],
        highNbNumber: [{ max: 20, message: "最多20位字符", trigger: "blur" }],
        highNbWeight: [
          { validator: number, trigger: "blur" },
          { validator: ltNumber(99999), trigger: "blur" }
        ],
        Si: [
          { validator: number, trigger: "blur" },
          { validator: ltNumber(99999), trigger: "blur" }
        ],
        Ni: [
          { validator: number, trigger: "blur" },
          { validator: ltNumber(99999), trigger: "blur" }
        ],
        Cu: [
          { validator: number, trigger: "blur" },
          { validator: ltNumber(99999), trigger: "blur" }
        ],
        BFe: [
          { validator: number, trigger: "blur" },
          { validator: ltNumber(99999), trigger: "blur" }
        ],
        NbFe: [
          { validator: number, trigger: "blur" },
          { validator: ltNumber(99999), trigger: "blur" }
        ],
        alloyOutWeight: [
          { validator: number, trigger: "blur" },
          { validator: ltNumber(99999), trigger: "blur" }
        ],
        alloyFixWeight: [
          { validator: integer, trigger: "blur" },
          { validator: ltNumber(99999), trigger: "blur" }
        ],
        remark: [{ max: 100, message: "最多100位字符", trigger: "blur" }],
        addMeltNumber1: [{ max: 20, message: "最多20位字符", trigger: "blur" }],
        addMeltWeight1: [
          { validator: number, trigger: "blur" },
          { validator: ltNumber(99999), trigger: "blur" }
        ],
        addMeltNumber2: [{ max: 20, message: "最多20位字符", trigger: "blur" }],
        addMeltWeight2: [
          { validator: number, trigger: "blur" },
          { validator: ltNumber(99999), trigger: "blur" }
        ],
        addMeltNumber3: [{ max: 20, message: "最多20位字符", trigger: "blur" }],
        addMeltWeight3: [
          { validator: number, trigger: "blur" },
          { validator: ltNumber(99999), trigger: "blur" }
        ],
        startMeltingTime: [
          { required: true, message: "请填写加料时间", trigger: "blur" }
        ],
        endMeltingTime: [
          { required: true, message: "请填写浇钢时间", trigger: "blur" },
          { validator: validateMeltingTime, trigger: "blur" }
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
    this.userinfo = JSON.parse(localStorage.getItem("userinfo"));
    if (this.dialogData.formType === "create") {
      this.formData = Object.assign({}, formConfig, {
        castId: Number(this.$route.params.castId),
        melter: this.userinfo.adminname
      });
    } else {
      this.formData = Object.assign(this.formData, this.dialogData.rowData);
    }
  },
  methods: {
    handleRibbonTypeChange(val) {
      const params = {
        castId: this.formData.castId,
        ribbonTypeName: val,
        // dateJson: JSON.stringify(["2021-07-04", "2021-07-05"])
      };
      this.$http("get", urlmap.queryPlanDataByMelt, params)
        .then(data => {
          this.planFurnaceList = data.list.map(f => f.furnace);
        })
        .catch(error => {
          console.log(error);
          this.planFurnaceList = [];
        });
    },
    // setBucket(e) {
    //   // 根据炉号自动填充母合金桶号
    //   const furnace = e.target.value;
    //   if (furnace) {
    //     this.formData.bucket = e.target.value.split("/")[1];
    //   }
    // },
    closeDialog() {
      this.$emit("close");
    },
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true;

          if (
            new Date(this.formData.startMeltingTime).getTime() >=
            new Date(this.formData.endMeltingTime).getTime()
          ) {
            return;
          }

          // 总重量
          this.formData.alloyTotalWeight =
            parseInt(this.formData.newAlloyWeight) +
            parseInt(this.formData.oldAlloyWeight) +
            parseInt(this.formData.mixAlloyWeight) +
            parseInt(this.formData.highNbWeight) +
            parseInt(this.formData.alloyFixWeight) +
            parseInt(this.formData.addMeltWeight1) +
            parseInt(this.formData.addMeltWeight2) +
            parseInt(this.formData.addMeltWeight3);

          this.formData.roleId = this.userinfo.roleId;
          this.formData.adminname = this.userinfo.adminname;
          this.formData.furnace = `${this.formData.planFurnace}/${this.formData.bucket}`;

          const { method, url } =
            this.dialogData.formType === "create"
              ? { method: "POST", url: urlmap.addMelt }
              : { method: "PUT", url: urlmap.updateMelt };

          this.$http(method, url, this.formData)
            .then(data => {
              this.$emit("submit");
            })
            .catch(error => {
              console.log(error);
            })
            .finally(() => {
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
