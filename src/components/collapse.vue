<template>
  <div class="collapse">
    <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item name="1" title="筛选条件">
        <slot></slot>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
export default {
  name: 'Collapse',
  data() {
    return {
      activeNames: ['1']
    };
  },
  methods: {
    handleChange(v) {
      console.log(v);
    }
  }
}
</script>
<style lang="scss" scoped>
.collapse {
  /deep/ div[role='tab'] {
    border-bottom: 1px solid #dcdfe6;
  }
  /deep/ .el-collapse-item__header {
    padding: 5px 20px;
    height: 20px;
    line-height: 20px;
  }
  /deep/ .el-collapse-item__content {
    padding-bottom: 0;
  }
}
</style>


