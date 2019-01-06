<template>
<div>
  <el-breadcrumb separator-class="el-icon-arrow-right" class="crumb">
    <el-breadcrumb-item>带材牌号管理</el-breadcrumb-item>
  </el-breadcrumb>
  <div class="main_bd">
    <el-col class="table_hd">
      <el-button type="primary" icon="el-icon-plus" @click="createRibbon">新增带材牌号</el-button>
    </el-col>
    <el-table :data="ribbonTypeList" stripe border style="width:100%" v-loading="loading">
      <el-table-column type="index" label="序号" align="center"></el-table-column>
      <el-table-column prop="ribbonTypeName" label="带材牌号名称" align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="editRibbon(scope.row)">修改</el-button>
          <el-button size="mini" type="danger" @click="delRibbon(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  
</div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'ribbon',
  data () {
    return {
      tableData: [],
      loading: false
    }
  },
  computed: {
    ...mapState([ 'ribbonTypeList' ])
  },
  created () {
    this.getRibbonTypeList();
  },
  methods: {
    ...mapActions([ 'getRibbonTypeList' ]),
    createRibbon() {

    },
    editRibbon(row) {

    },
    delRibbon(row) {
      
    }
  }
}
</script>

<style lang="scss" scoped>

</style>


