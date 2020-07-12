<template>
  <el-dialog
    :title="dialogData.formType === 'add' ? `新增重卷记录-${$route.params.castId}号机组` : `修改重卷记录-${$route.params.castId}号机组`"
    :visible.sync="dialogData.dialogVisible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="closeDialog"
    :center="true"
    width="30%"
    v-loading="loading"
    element-loading-text="拼命加载中"
  >
    <el-form
      :model="formData"
      :rules="rules"
      ref="form"
      label-width="100px"
      style="100%"
      @keyup.enter.native="submitForm"
    >
      <el-form-item label="重卷人员：" prop="roller">
        <!-- <span>{{formData.roller}}</span> -->
        <el-select v-model="formData.roller" placeholder="请选择重卷人">
          <el-option
            v-for="item in rollerList"
            :key="item.roller"
            :value="item.roller"
            :label="item.rollerName"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="重卷机器：" prop="rollMachine">
        <el-select v-model="formData.rollMachine" placeholder>
          <el-option label="#1" :value="1"></el-option>
          <el-option label="#2" :value="2"></el-option>
          <el-option label="#3" :value="3"></el-option>
          <el-option label="#4" :value="4"></el-option>
          <el-option label="#5" :value="5"></el-option>
          <el-option label="#6" :value="6"></el-option>
          <el-option label="#7" :value="7"></el-option>
          <el-option label="#8" :value="8"></el-option>
          <el-option label="#9" :value="9"></el-option>
          <el-option label="#10" :value="10"></el-option>
          <el-option label="#11" :value="11"></el-option>
          <el-option label="#12" :value="12"></el-option>
          <el-option label="#13" :value="13"></el-option>
          <el-option label="#14" :value="14"></el-option>
          <el-option label="#15" :value="15"></el-option>
          <el-option label="#16" :value="16"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="炉号：" prop="furnace">
        <el-input v-model="formData.furnace"></el-input>
      </el-form-item>
      <el-form-item label="盘号：" prop="coilNumber">
        <el-input v-model="formData.coilNumber"></el-input>
      </el-form-item>
      <el-form-item label="外径：" prop="diameter">
        <el-input v-model="formData.diameter"></el-input>
      </el-form-item>
      <el-form-item label="重量：" prop="coilWeight">
        <el-input v-model="formData.coilWeight"></el-input>
      </el-form-item>
      <el-form-item label="是否平整：" prop="isFlat">
        <el-select v-model="formData.isFlat" placeholder>
          <el-option :value="0" label="是"></el-option>
          <el-option :value="1" label="否"></el-option>
        </el-select>
      </el-form-item>
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
  number,
  decimalFormat
} from "@/utils/validate";
import urlmap from "@/utils/urlmap";

const formConfig = {
  castId: 6, // 机组编号
  roller: "", // 重卷人员
  rollMachine: null, // 重卷机器
  isFlat: 0, //是否平整, 1-否，0-是
  furnace: "", // 制带炉号  06-20181120-01/01
  coilNumber: "", // 盘号
  diameter: "", //外径,mm
  coilWeight: "" //重量,kg
};

export default {
  data() {
    return {
      userinfo: {},
      visible: false,
      loading: false,
      formData: {
        castId: 6, // 机组编号
        roller: "", // 重卷人员
        rollMachine: null, // 重卷机器
        isFlat: 0, //是否平整， 0-是，1-否
        furnace: "", // 制带炉号  06-20181120-01/01
        coilNumber: "", // 盘号
        diameter: "", //外径,mm
        coilWeight: "" //重量,kg
      },
      rules: {
        roller: [
          { required: true, message: "请选择重卷人员", trigger: "blur" }
        ],
        rollMachine: [
          { required: true, message: "请选择重卷机编号", trigger: "blur" }
        ],
        furnace: [
          { required: true, message: "请填写炉号", trigger: "blur" },
          { max: 20, message: "最多20位字符", trigger: "blur" },
          { validator: checkFurnace, trigger: "blur" }
        ],
        coilNumber: [
          { required: true, message: "请填写盘号", trigger: "blur" },
          { validator: positiveInteger, trigger: "blur" },
          { validator: ltNumber(99999), trigger: "blur" }
        ],
        diameter: [
          { required: true, message: "请填写外径", trigger: "blur" },
          { validator: number, trigger: "blur" },
          { validator: ltNumber(99999), trigger: "blur" }
        ],
        coilWeight: [
          { required: true, message: "请填写重量", trigger: "blur" },
          { validator: decimalFormat, trigger: "blur" },
          { validator: ltNumber(99999), trigger: "blur" }
        ],
        isFlat: [{ required: true, message: "请选择是否平整", trigger: "blur" }]
      }
    };
  },
  props: {
    dialogData: {
      type: Object,
      required: true
    },
    rollerList: {
      type: Array,
      required: true
    }
  },
  created() {
    this.userinfo = JSON.parse(localStorage.getItem("userinfo"));
    if (this.dialogData.formType === "add") {
      this.formData = Object.assign({}, formConfig, {
        castId: Number(this.$route.params.castId)
        // roller: this.userinfo.adminname
      });
    } else {
      this.formData = Object.assign(this.formData, this.dialogData.rowData);
    }
  },
  mounted() {},
  methods: {
    closeDialog() {
      this.$emit("close");
    },
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true;

          const params = {
            roleId: this.userinfo.roleId,
            ...this.formData
          };

          // 发送提交的请求
          const { method, url } =
            this.dialogData.formType === "add"
              ? { method: "POST", url: urlmap.addMeasure }
              : { method: "PUT", url: urlmap.updateMeasure };

          // 过滤掉值为 null 或者 undefined 的参数，以免存入数据库的时候，发生错误
          Object.keys(params).forEach(key => {
            if (params[key] == null) {
              delete params[key];
            }
          });
          this.$http(method, url, params)
            .then(data => {
              if (data.status !== -1) {
                this.formData.coilNumber++;
                this.formData.coilWeight = null;
                this.formData.diameter = null;
                this.$emit("submit");
              }
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

