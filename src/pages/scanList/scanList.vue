<template>
  <div class="container">
    <!-- header -->
    <mt-header fixed title="带材信息">
      <mt-button icon="more" slot="right" @click="handleMore"></mt-button>
    </mt-header>
    <!-- 带材信息 -->

    <div class="content">
      <el-row class="total_data">
        <el-col :span="12"
          ><p class="text_center">总盘数：{{ totalCoilNum }}</p></el-col
        >
        <el-col :span="12"
          ><p class="text_center">总重量(kg)：{{ totalWeight }}</p></el-col
        >
      </el-row>
      <el-row class="table-hd">
        <el-col :span="12"><p class="text_center">炉号</p> </el-col>
        <el-col :span="6"><p class="text_center">盘号</p></el-col>
        <el-col :span="6"><p class="text_center">重量</p></el-col>
      </el-row>
      <mt-cell-swipe
        v-for="item in tableData"
        :key="item.storageId"
        :right="[
          {
            content: '删除',
            style: { background: 'red', color: '#fff' },
            handler: () => handleDelete(item),
          },
        ]"
      >
        <el-row class="slot">
          <el-col :span="12"
            ><p class="text_center">{{ item.furnace }}</p>
          </el-col>
          <el-col :span="6"
            ><p class="text_center">{{ item.coilNumber }}</p></el-col
          >
          <el-col :span="6"
            ><p class="text_center">{{ item.coilWeight }}</p></el-col
          >
        </el-row>
      </mt-cell-swipe>
    </div>
    <!-- 按钮 -->
    <div class="btn-wrapp" v-if="roleId === 6">
      <mt-button plain @click="handleOutStore">出库</mt-button>
      <mt-button
        type="primary"
        @click="handleScanListWithPlace"
        :disabled="disabled"
        >入仓</mt-button
      >
    </div>

    <!-- 退出登录 -->
    <mt-actionsheet :actions="actions" v-model="sheetVisible"></mt-actionsheet>
  </div>
</template>

<script>
import urlmap from "@/utils/urlmap";
import { MessageBox, Toast } from "mint-ui";
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
    this.actions = [
      { name: `当前登录：${this.adminname}` },
      { name: "退出登录", method: this.signout },
    ];
    this.getData();
  },
  methods: {
    handleMore() {
      this.sheetVisible = true;
    },
    signout() {
      this.isDisabled = true;
      this.$http("POST", urlmap.signout, {})
        .then((data) => {
          localStorage.removeItem("userinfo");
          const returnUrl = encodeURIComponent(window.location.href);
          this.$router.push({ path: "/login", query: { returnUrl } });
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.isDisabled = false;
        });
    },
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
    handleDelete(selected) {
      const { furnace, coilNumber } = selected;
      MessageBox.confirm(`确定删除 ${furnace}，第${coilNumber}盘吗?`).then(
        (action) => {
          this.$http("POST", urlmap.delScanConfirm, { furnace, coilNumber })
            .then((data) => {
              setTimeout(() => {
                window.location.reload();
              }, 2000);
            })
            .catch((err) => {
              console.log(err);
            });
        }
      );
    },
    async handleScanListWithPlace() {
      try {
        const { value, action } = await MessageBox.prompt("请输入仓位");
        if (!value) {
          Toast("仓位不能为空，请重新输入仓位");
        }

        const params = {
          ids: this.tableData.map((item) => item.storageId) || [],
          place: value,
        };
        await this.$http("POST", urlmap.batchUpdateRibbonWithPlace, params);
        this.getData();
      } catch (err) {
        console.log(err);
      }
    },
    async handleOutStore() {
      try {
        const { value, action } = await MessageBox.prompt("请输入实际去向");
        if (!value) {
          Toast("去向不能为空，请重新输入");
        }

        const params = {
          ids: this.tableData.map((item) => item.storageId) || [],
          takeBy: value,
        };
        await this.$http("POST", urlmap.batchOutStoreByScan, params);
        this.getData();
      } catch (err) {
        console.log(err);
      }
    },
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
.scan-item {
  display: flex;
  justify-content: space-between;
}
.total_data {
  line-height: 40px;
  font-size: 18px;
  font-weight: bold;
  border-bottom: 5px solid rgba($color: #c0c4cc, $alpha: 0.1);
}
.table-hd {
  line-height: 40px;
  height: 40px;
}
.slot {
  width: 100%;
}
/deep/ .mint-cell-value {
  width: 100%;
}
</style>
