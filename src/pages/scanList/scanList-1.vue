<template>
  <div class="container">
    <!-- header -->
    <mt-header fixed title="带材信息"> </mt-header>
    <!-- 带材信息 -->

    <div class="content">
      <el-row class="total_data">
        <el-col :span="12">总盘数：{{ totalCoilNum }}</el-col>
        <el-col :span="12">总重量(kg)：{{ totalWeight }}</el-col>
      </el-row>
      <mt-cell-swipe
        :right="[
          {
            content: 'Delete',
            style: { background: 'red', color: '#fff' },
            handler: () => this.$messagebox('delete'),
          },
        ]"
      >
        <div class="slot">
          <div>08-fdsafsdaf/01</div>
          <div>1</div>
          <div>15.8</div>
        </div>
      </mt-cell-swipe>
    </div>
    <!-- 按钮 -->
    <div class="btn-wrapp" v-if="roleId === 6">
      <mt-button plain @click="handleFinish">结束了</mt-button>
      <mt-button type="primary" @click="scanConfirm" :disabled="disabled"
        >下一盘</mt-button
      >
    </div>
  </div>
</template>

<script>
import urlmap from "@/utils/urlmap";
export default {
  name: "ribbonInfo",
  data() {
    return {
      isDisabled: false,
      adminname: "",
      roleId: 0,
      disabled: false,
      tableData: [],
      totalCoilNum: 0,
      totalWeight: 0,
    };
  },
  created() {
    const that = this;
    const userinfo = JSON.parse(localStorage.getItem("userinfo")) || {};
    this.adminname = userinfo.adminname;
    this.roleId = userinfo.roleId;
    this.getData();
  },
  methods: {
    getData() {
      this.$http("GET", urlmap.queryScanList)
        .then((data) => {
          (this.totalCoilNum = data.totalCoilNum),
            (this.totalWeight = data.totalWeight);
          this.tableData = data.list;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    scanConfirm() {
      const params = {
        furnace: this.furnace,
        coilNumber: this.coilNumber,
      };
      this.$http("POST", urlmap.scanConfirm, params)
        .then((data) => {
          data.status ? (this.disabled = false) : (this.disabled = true);
        })
        .catch((err) => {
          console.log(err);
          this.disabled = false;
        });
    },
    handleFinish() {},
  },
};
</script>

<style lang="scss" scoped>
/deep/ .mint-header-title {
  font-size: 16px;
  font-weight: bold;
}
/deep/ .mint-button {
  width: 100%;
  &:last-child {
    margin-left: 30px;
  }
}
/deep/ .mint-button--default.is-plain {
  border: 1px solid #26a2ff;
  color: #26a2ff;
}
.container {
  padding: 0 5px;
}
.content {
  margin-top: 40px;
  font-size: 16px;
}
.btn-wrapp {
  display: flex;
  margin-top: 50px;
  justify-content: space-between;
}
.tip {
  margin-top: 10px;
  line-height: 16px;
}
.total_data {
  line-height: 40px;
}
.slot {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
/deep/ .mint-cell-value {
  width: 100%;
}
</style>
