<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="crumb">
      <el-breadcrumb-item>化钢记录</el-breadcrumb-item>
      <el-breadcrumb-item>{{castId}}号机组</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form class="search_bar" :model="searchForm" :inline="true">
      <el-form-item label="冶炼日期：">
        <el-date-picker
          v-model="searchForm.date"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="冶炼人：">
        <el-input v-model="searchForm.melter" placeholder="请输入冶炼人姓名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="clickSearch">搜索</el-button>
      </el-form-item>
    </el-form>
    <div class="main_bd">
      <el-col class="table_hd">
        <el-button type="primary" icon="el-icon-plus" @click="createMelt">创建化钢记录</el-button>
      </el-col>
      <el-table :data="tableData" stripe border style="width:100%" v-loading="loading"> 
        <el-table-column prop="createdAt" label="冶炼日期" align="center" width="100px"></el-table-column>
        <el-table-column prop="ribbonTypeName" label="材质" align="center" width="60px"></el-table-column>
        <el-table-column prop="furnace" label="冶炼炉号" align="center" width="150px"></el-table-column>
        <el-table-column prop="bucket" label="桶号" align="center" width="60px"></el-table-column>
        <el-table-column prop="melter" label="化钢人" align="center" width="60px"></el-table-column>
        <el-table-column prop="meltFurnace" label="冶炼炉号" align="center" width="60px"></el-table-column>
        <el-table-column prop="newAlloyNumber" label="新料炉号" align="center" width="100px"></el-table-column>
        <el-table-column prop="newAlloyWeight" label="新料重量(kg)" align="center" width="60px"></el-table-column>
        <el-table-column prop="oldAlloyNumber" label="加工料炉号" align="center" width="100px"></el-table-column>
        <el-table-column prop="oldAlloyWeight" label="加工料重量(kg)" align="center" width="60px"></el-table-column>
        <el-table-column prop="mixAlloyNumber" label="回炉锭炉号" align="center" width="100px"></el-table-column>
        <el-table-column prop="mixAlloyWeight" label="回炉锭重量(kg)" align="center" width="60px"></el-table-column>
        <el-table-column prop="highNbNumber" label="高铌料炉号" align="center" width="100px"></el-table-column>
        <el-table-column prop="Si" label="硅(g)" align="center" width="60px"></el-table-column>
        <el-table-column prop="Ni" label="镍(g)" align="center" width="60px"></el-table-column>
        <el-table-column prop="Cu" label="铜(g)" align="center" width="60px"></el-table-column>
        <el-table-column prop="BFe" label="硼铁(g)" align="center" width="60px"></el-table-column>
        <el-table-column prop="NbFe" label="铌铁(g)" align="center" width="60px"></el-table-column>
        <el-table-column prop="alloyTotalWeight" label="总重量(kg)" align="center" width="60px"></el-table-column>
        <el-table-column prop="alloyOutWeight" label="放钢重量(kg)" align="center" width="60px"></el-table-column>
        <el-table-column prop="alloyFixWeight" label="修正重量(kg)" align="center" width="60px"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'melt',
  data () {
    return {
      castId: 6,
      searchForm: {
        melter: '',
        date: []
      },
      loading: false,
      tableData: []
    }
  },
  methods: {
    clickSearch() {
      console.log(this.searchForm);
    },
    createMelt() {

    }
  }
}
</script>

<style lang="scss" scoped>

</style>

