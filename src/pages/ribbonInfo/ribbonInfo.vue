<template>
  <div class="container">
    <!-- header -->
    <mt-header fixed title="带材信息">
      <mt-button icon="more" slot="right" @click="handleMore"></mt-button>
    </mt-header>
    <!-- 带材信息 -->
    <div class="content">
      <mt-cell title="炉号" :value="info.furnace"></mt-cell>
      <mt-cell title="盘号" :value="info.coilNumber"></mt-cell>
      <mt-cell title="材质" :value="info.ribbonTypeName"></mt-cell>
      <mt-cell title="规格" :value="`${info.ribbonWidth} mm`"></mt-cell>
      <mt-cell title="重量" :value="`${info.coilWeight} kg`"></mt-cell>
      <mt-cell title="级别" :value="info.ribbonTotalLevel"></mt-cell>
      <mt-cell title="状态" :value="status"></mt-cell>
      <mt-cell
        title="入库类型"
        :value="storeType"
        v-if="info.isStorageConfirmed === 1"
      ></mt-cell>
      <p class="text_danger tip" v-if="roleId === 6">
        备注： 1. 在操作入库的流程时，要入库，则点击【确认入库】； 2.
        在操作入仓位的流程时，要继续扫下一盘，则点击【下一盘】；
      </p>
    </div>
    <!-- 按钮 -->
    <div class="btn-wrapp" v-if="roleId === 6">
      <!-- <mt-button plain @click="handleFinish">结束了</mt-button> -->
      <mt-button
        type="primary"
        @click="addStorage"
        :disabled="addDisabled"
        v-if="
          info.isMeasureConfirmed === 1 &&
            info.isStorageConfirmed === 0 &&
            info.isRollConfirmed === 1
        "
        >确认入库</mt-button
      >
      <mt-button
        type="primary"
        @click="rejectApplyStorage"
        :disabled="rejectDisabled"
        v-if="
          info.isMeasureConfirmed === 1 &&
            info.isStorageConfirmed === 0 &&
            info.isRollConfirmed === 1
        "
        >驳回</mt-button
      >
      <mt-button
        type="primary"
        @click="scanConfirm"
        :disabled="scanDisabled"
        v-if="info.isStorageConfirmed === 1 && !info.place"
        >下一盘</mt-button
      >
    </div>

    <!-- 退出登录 -->
    <mt-actionsheet :actions="actions" v-model="sheetVisible"></mt-actionsheet>
  </div>
</template>

<script>
import urlmap from "@/utils/urlmap";
import { MessageBox } from "mint-ui";
export default {
  name: "ribbonInfo",
  data() {
    return {
      isDisabled: false,
      sheetVisible: false,
      adminname: "",
      roleId: 0,
      text: "",
      actions: [],
      info: {},
      furnace: this.$route.query.f,
      coilNumber: this.$route.query.c,
      addDisabled: false,
      scanDisabled: false,
      rejectDisabled: false
    };
  },
  computed: {
    status() {
      let text = "重卷完";
      const {
        isRollConfirmed,
        isMeasureConfirmed,
        isStorageConfirmed,
        isStored
      } = this.info;
      if (isRollConfirmed === 1) {
        text = "已送检";
      }
      if (isMeasureConfirmed === 1) {
        text = "申请入库";
      }
      if (isStorageConfirmed === 1) {
        text = "已入库";
      }
      return text;
    },
    storeType() {
      let type = "";
      const { isStored } = this.info;
      if (isStored === 1) {
        type = "计划内入库";
      }
      if (isStored === 2) {
        type = "计划外入库";
      }
      return type;
    }
  },
  watch: {
    $route: {
      // 亲测有效,我是用来监听query参数变化
      handler() {
        (this.furnace = this.$route.query.f),
          (this.coilNumber = this.$route.query.c),
          this.$message({
            message: "我刷新了",
            type: "success"
          });
        this.getData();
      },
      deep: true,
      immediate: true
    }
  },
  async created() {
    // this.getData();
    let userinfo = (await this.getUserInfo()) || {};
    this.adminname = userinfo.adminname;
    this.roleId = userinfo.roleId;
    this.actions = [
      { name: `当前登录：${this.adminname}` },
      { name: "退出登录", method: this.signout }
    ];
  },
  methods: {
    async getUserInfo() {
      const type = window && window.localStorage ? "local" : "ajax";
      const fn = {
        local: () => JSON.parse(window.localStorage.getItem("userinfo")) || {},
        ajax: () =>
          this.$http("get", urlmap.getUserInfo, {})
            .then(data => data)
            .catch(err => console.log(err))
      }[type];
      const userinfo = (await fn()) || {};
      return userinfo;
    },

    handleMore() {
      this.sheetVisible = true;
    },
    signout() {
      this.isDisabled = true;
      this.$http("POST", urlmap.signout, {})
        .then(data => {
          try {
            window.localStorage.removeItem("userinfo");
          } catch (error) {
            this.$message({
              message: error.message || "localStorage 错误",
              type: "error"
            });
          }
          const returnUrl = encodeURIComponent(window.location.href);
          this.$router.push({ path: "/login", query: { returnUrl } });
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          this.isDisabled = false;
        });
    },
    getData() {
      const furnace = this.furnace;
      const coilNumber = parseInt(this.coilNumber);
      this.$http("GET", urlmap.queryRibbonInfo, { furnace, coilNumber })
        .then(data => {
          const info = (data.list && data.list[0]) || {};
          this.info = info;
        })
        .catch(err => {
          this.$message({
            message: error.message || "数据请求错误",
            type: "error"
          });
        });
    },
    scanConfirm() {
      const params = {
        furnace: this.furnace,
        coilNumber: this.coilNumber
      };
      this.scanDisabled = true;
      this.$http("POST", urlmap.scanConfirm, params)
        .then(data => {
          window.location.reload();
        })
        .catch(err => {
          this.$message({
            message: error.message || "下一盘确认失败",
            type: "error"
          });
        })
        .finally(() => (this.scanDisabled = false));
    },
    addStorage() {
      this.$message({
        message: "点击了",
        type: "success"
      });
      this.addDisabled = true;
      this.$http("POST", urlmap.addStorage, { data: this.info })
        .then(data => {
          window.location.reload();
        })
        .catch(err => {
          this.$message({
            message: error.message || "确认入库失败",
            type: "error"
          });
        })
        .finally(() => (this.addDisabled = false));
    },
    rejectApplyStorage() {
      const { measureId, furnace, coilNumber } = this.info;
      MessageBox.prompt("请输入驳回原因")
        .then(({ value, action }) => {
          console.log("输入的值", value);
          console.log("action", action);
          this.rejectDisabled = true;
          this.$http("post", urlmap.rejectApplyStorage, {
            measureId,
            rejectReason: value
          })
            .then(data => {
              window.location.reload();
            })
            .catch(error => {
              console.log(error);
            })
            .finally(() => (this.rejectDisabled = false));
        })
        .catch(() => {});
    },
    handleFinish() {
      this.$router.push({ path: "/scanList" });
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/ .mint-header-title {
  font-size: 16px;
  font-weight: bold;
}
/deep/ .mint-button {
  width: 100%;
  // &:last-child {
  //   margin-left: 30px;
  // }
}
/deep/ .mint-button--default.is-plain {
  border: 1px solid #26a2ff;
  color: #26a2ff;
}
/deep/ .mint-cell {
  min-height: 40px;
}
.container {
  padding: 0 5px;
}
.content {
  margin-top: 40px;
}
.btn-wrapp {
  display: flex;
  margin-top: 10px;
  justify-content: space-between;
  .mint-button {
    &:nth-child(2) {
      margin-left: 5px;
    }
  }
}
.tip {
  margin-top: 5px;
  line-height: 16px;
}
</style>
