<template>
  <el-dialog title="新增生产记录" :visible="isCreateVisible" :close-on-click-modal="false" :show-close="false" :center="true">
    <div slot="footer">
      <el-button @click="closeDialog">取消</el-button>
      <el-button type="primary" @click="submit">确定</el-button>
    </div>
  </el-dialog>  
</template>

<script>
export default {
  props: {
    isCreateVisible: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      visible: false
    }
  },
  methods: {
    closeDialog() {
      this.$emit('close');
      console.log(111);
    },
    submit() {

    }
  }
}
</script>

<style lang="scss" scoped>

</style>


