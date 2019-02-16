<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="crumb">
      <el-breadcrumb-item>检测记录</el-breadcrumb-item>
      <el-breadcrumb-item>{{castId}}号机组</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form class="search_bar" :model="searchForm" :inline="true">
      <el-form-item label="生产日期：">
        <el-date-picker
          v-model="searchForm.date"
          type="daterange"
          :default-time="['00:00:00', '23:59:59']"
          :clearable="false"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="喷带手：">
        <el-input v-model="searchForm.caster" placeholder="请输入喷带手姓名"></el-input>
      </el-form-item>
      <el-form-item label="炉号：">
        <el-input v-model="searchForm.furnace" placeholder="请输入炉号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="clickSearch">搜索</el-button>
        <el-button type="primary" icon="el-icon-refresh" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="main_bd">
      <!-- <el-col class="table_hd">
        <el-button type="primary" icon="el-icon-plus" @click="add">创建检测记录</el-button>
      </el-col> -->
      <el-table :data="tableData" stripe border style="width:100%" v-loading="loading"> 
        <el-table-column prop="furnace" label="炉号" align="center" width="170px" fixed></el-table-column>
        <el-table-column prop="coilNumber" label="盘号" align="center" width="50px" fixed></el-table-column>
        <el-table-column prop="ribbonTypeName" label="材质" align="center" width="70px"></el-table-column>
        <el-table-column prop="ribbonWidth" label="规格" align="center" width="50px"></el-table-column>
        <el-table-column prop="castDate" label="生产日期" align="center" :formatter="dateFormat" width="110px"></el-table-column>
        <el-table-column prop="caster" label="喷带手" align="center" width="70px"></el-table-column>
        <el-table-column prop="diameter" label="外径(mm)" align="center" width="90px"></el-table-column>
        <el-table-column prop="coilWeight" label="重量(kg)" align="center" width="90px"></el-table-column>
        <el-table-column prop="laminationFactor" label="叠片系数" align="center" width="80px"></el-table-column>
        <el-table-column prop="laminationLevel" label="叠片等级" align="center" width="80px"></el-table-column>
        <el-table-column prop="realRibbonWidth" label="实际带宽" align="center" width="80px">
          <template slot-scope="scope">
            <div v-if="scope.row.isEditing === false">
              {{ scope.row.realRibbonWidth }}
            </div>
            <div v-else>
              <el-input size="mini" v-model="scope.row.realRibbonWidth"></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="ribbenThickness1" label="带厚1(μm)" align="center" width="90px">
          <template slot-scope="scope">
            <div v-if="scope.row.isEditing === false">
              {{ scope.row.ribbenThickness1 }}
            </div>
            <div v-else>
              <el-input size="mini" v-model="scope.row.ribbenThickness1"></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="ribbenThickness2" label="带厚2(μm)" align="center" width="90px">
          <template slot-scope="scope">
            <div v-if="scope.row.isEditing === false">
              {{ scope.row.ribbenThickness2 }}
            </div>
            <div v-else>
              <el-input size="mini" v-model="scope.row.ribbenThickness2"></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="ribbenThickness3" label="带厚3(μm)" align="center" width="90px">
          <template slot-scope="scope">
            <div v-if="scope.row.isEditing === false">
              {{ scope.row.ribbenThickness3 }}
            </div>
            <div v-else>
              <el-input size="mini" v-model="scope.row.ribbenThickness3"></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="ribbenThickness4" label="带厚4(μm)" align="center" width="90px">
          <template slot-scope="scope">
            <div v-if="scope.row.isEditing === false">
              {{ scope.row.ribbenThickness4 }}
            </div>
            <div v-else>
              <el-input size="mini" v-model="scope.row.ribbenThickness4"></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="ribbenThickness5" label="带厚5(μm)" align="center" width="90px">
          <template slot-scope="scope">
            <div v-if="scope.row.isEditing === false">
              {{ scope.row.ribbenThickness5 }}
            </div>
            <div v-else>
              <el-input size="mini" v-model="scope.row.ribbenThickness5"></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="ribbenThickness6" label="带厚6(μm)" align="center" width="90px">
          <template slot-scope="scope">
            <div v-if="scope.row.isEditing === false">
              {{ scope.row.ribbenThickness6 }}
            </div>
            <div v-else>
              <el-input size="mini" v-model="scope.row.ribbenThickness6"></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="ribbenThickness7" label="带厚7(μm)" align="center" width="90px">
          <template slot-scope="scope">
            <div v-if="scope.row.isEditing === false">
              {{ scope.row.ribbenThickness7 }}
            </div>
            <div v-else>
              <el-input size="mini" v-model="scope.row.ribbenThickness7"></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="ribbenThickness8" label="带厚8(μm)" align="center" width="90px">
          <template slot-scope="scope">
            <div v-if="scope.row.isEditing === false">
              {{ scope.row.ribbenThickness8 }}
            </div>
            <div v-else>
              <el-input size="mini" v-model="scope.row.ribbenThickness8"></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="ribbenThickness9" label="带厚9(μm)" align="center" width="90px">
          <template slot-scope="scope">
            <div v-if="scope.row.isEditing === false">
              {{ scope.row.ribbenThickness9 }}
            </div>
            <div v-else>
              <el-input size="mini" v-model="scope.row.ribbenThickness9"></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="ribbenThicknessDeviation" label="厚度偏差(μm)" align="center" width="110px"></el-table-column>
        <el-table-column prop="ribbenThickness" label="平均厚度(μm)" align="center" width="110px"></el-table-column>
        <el-table-column prop="ribbenThicknessLevel" label="厚度级别" align="center" width="90px"></el-table-column>
        <el-table-column prop="ribbenToughness" label="韧性" align="center" width="90px">
          <template slot-scope="scope">
            <div v-if="scope.row.isEditing === false">
              {{ scope.row.ribbenToughness }}
            </div>
            <div v-else>
              <el-input size="mini" v-model="scope.row.ribbenToughness"></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="ribbenToughnessLevel" label="韧性等级" align="center" width="90px">
          <template slot-scope="scope">
            <div v-if="scope.row.isEditing === false">
              {{ scope.row.ribbenToughnessLevel }}
            </div>
            <div v-else>
              <el-input size="mini" v-model="scope.row.ribbenToughnessLevel"></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="appearence" label="外观" align="center" width="90px">
          <template slot-scope="scope">
            <div v-if="scope.row.isEditing === false">
              {{ scope.row.appearence }}
            </div>
            <div v-else>
              <el-input size="mini" v-model="scope.row.appearence"></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="appearenceLevel" label="外观等级" align="center" width="90px">
          <template slot-scope="scope">
            <div v-if="scope.row.isEditing === false">
              {{ scope.row.appearenceLevel }}
            </div>
            <div v-else>
              <el-input size="mini" v-model="scope.row.appearenceLevel"></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="ribbenTotalLevel" label="综合级别" align="center" width="90px">
          <template slot-scope="scope">
            <span :class="scope.row.ribbenTotalLevel === '不合格' ? 'text_danger' : '' ">{{scope.row.ribbenTotalLevel}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="storageRule" label="入库规则" align="center" width="90px" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="isStored" label="是否入库" align="center" width="90px">
          <template slot-scope="scope">
            <div v-if="scope.row.isEditing === false">
              {{ scope.row.isStored }}
            </div>
            <div v-else>
              <el-select v-model="scope.row.isStored" placeholder="" size="mini">
                <el-option label="是" value="是"></el-option>
                <el-option label="否" value="否"></el-option>
              </el-select>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="clients" label="去向" align="center" width="90px" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <div v-if="scope.row.isEditing === false">
              {{ scope.row.clients }}
            </div>
            <div v-else>
              <el-input size="mini" v-model="scope.row.clients"></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="150px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="edit(scope.row)" v-if="scope.row.isEditing === false">修改</el-button>
            <el-button size="mini" type="success" @click="save(scope.row)" v-else>保存</el-button>
            <el-button size="mini" type="danger" @click="del(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="total,prev,pager,next"
        :total="pageConfig.total"
        :current-page.sync="pageConfig.current"
        :page-size="pageConfig.pageSize"
        @current-change="handleCurrentChange"></el-pagination>
    </div>
  </div>
</template>

<script>
import urlmap from '@/utils/urlmap';
import { dateFormat } from '@/utils/common';

export default {
  name: 'melt',
  data () {
    return {
      castId: 6,
      searchForm: {
        caster: '',
        furnace: '',
        date: []
      },
      loading: false,
      tableData: [],
      pageConfig: {
        total: 1,
        current: 1,
        pageSize: 10
      }
    }
  },
  // 动态路由匹配
  beforeRouteUpdate(to, from, next) {
    this.castId = to.params.castId;
    this.getTableData();
    next();
  },
  created () {
    this.getTableData();
  },
  methods: {
    dateFormat(row, column) {
      return dateFormat(row.castDate);
    },
    clickSearch() {
      // 重置当前页码为1
      const params = {
        current: 1
      };
      this.pageConfig.current = 1;
      this.getTableData(params);
    },
    reset() {
      this.searchForm = { caster: '', furnace: '', date: [] };
      const params = {
        current: 1
      };
      this.pageConfig.current = 1;
      this.getTableData(params);
    },
    getTableData(params = {}) {
      const _params = {
        castId: this.castId,
        startTime: this.searchForm.date[0],
        endTime: this.searchForm.date[1],
        caster: this.searchForm.caster,
        furnace: this.searchForm.furnace
      };
      Object.assign(params, _params);
      this.$http('get', urlmap.queryMeasure, params).then(data => {
        this.pageConfig.total = data.count;
        data.list && data.list.forEach(item => {
          item.isEditing = false;
        });
        this.tableData = data.list;
      }).catch((err) => {
        console.log(err);
      }).finally(() => {
        this.loading = false;
      });
    },
    edit(row) {
      row.isEditing = true;
    },
    del(row) {
      const { _id, furnace } = row;
      this.$confirm(`确定删除 ${furnace} 吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http('delete', urlmap.delMeasure, {_id}).then(data => {
          this.getTableData();
        }).catch(error => {
          console.log(error);
        });
      }).catch(() => {});
    },
    save(row) {
      row.isEditing = false;
      // this.pageConfig.current = 1;
      // this.getTableData();
      
      // 计算叠片系数和叠片等级 realRibbonWidth diameter coilWeight
      row.laminationFactor = ((row.coilWeight - 0.09)/(Math.PI * (row.diameter * row.diameter / 4 - 95 * 95 / 4) * 7.2) * Math.pow(10, 6) / row.realRibbonWidth).toFixed(2);
      row.laminationLevel = this.calcLaminationLevel(row.laminationFactor);

      // 计算厚度最大偏差、平均厚度、厚度级别
      row.ribbenThickness1 = typeof row.ribbenThickness1 === 'string' ? Number(row.ribbenThickness1.trim()) : row.ribbenThickness1;
      row.ribbenThickness2 = typeof row.ribbenThickness2 === 'string' ? Number(row.ribbenThickness2.trim()) : row.ribbenThickness2;
      row.ribbenThickness3 = typeof row.ribbenThickness3 === 'string' ? Number(row.ribbenThickness3.trim()) : row.ribbenThickness3;
      row.ribbenThickness4 = typeof row.ribbenThickness4 === 'string' ? Number(row.ribbenThickness4.trim()) : row.ribbenThickness4;
      row.ribbenThickness5 = typeof row.ribbenThickness5 === 'string' ? Number(row.ribbenThickness5.trim()) : row.ribbenThickness5;
      row.ribbenThickness6 = typeof row.ribbenThickness6 === 'string' ? Number(row.ribbenThickness6.trim()) : row.ribbenThickness6;
      row.ribbenThickness7 = typeof row.ribbenThickness7 === 'string' ? Number(row.ribbenThickness7.trim()) : row.ribbenThickness7;
      row.ribbenThickness8 = typeof row.ribbenThickness8 === 'string' ? Number(row.ribbenThickness8.trim()) : row.ribbenThickness8;
      row.ribbenThickness9 = typeof row.ribbenThickness9 === 'string' ? Number(row.ribbenThickness9.trim()) : row.ribbenThickness9;

      row.ribbenThicknessDeviation = this.calcMaxDeviation([row.ribbenThickness1, row.ribbenThickness2, row.ribbenThickness3, row.ribbenThickness4, row.ribbenThickness5, row.ribbenThickness6, row.ribbenThickness7, row.ribbenThickness8, row.ribbenThickness9]);
      row.ribbenThickness = ((row.ribbenThickness1 + row.ribbenThickness2 + row.ribbenThickness3 + row.ribbenThickness4 + row.ribbenThickness5 + row.ribbenThickness6 + row.ribbenThickness7 + row.ribbenThickness8 + row.ribbenThickness9) / 9).toFixed(2);
      row.ribbenThicknessLevel = this.calcRibbenThicknessLevel(row.ribbenThickness);

      // 综合级别
      row.ribbenTotalLevel = row.laminationLevel === '不合格' ? '不合格' : row.ribbenThicknessLevel + row.laminationLevel + row.ribbenToughnessLevel + row.appearenceLevel;

      // 是否入库 不合格不能入库，端面有问题的不能入库，不满足入库规则的不能入库
      if (row.ribbenTotalLevel === '不合格') {
        row.isStored = '否';
      }

      // 发送请求，更新当前的数据
      this.$http('PUT', urlmap.updateMeasure, row).then(data => {

      }).catch(error => {
        console.log(error);
      });
    },
    handleCurrentChange(val) {
      const params = {
        current: val
      };
      this.getTableData(params);
    },
    calcLaminationLevel(factor) {
      if (!factor) return '';
      if (factor >= 0.84) {
        return '4';
      } else if(factor >= 0.82 && factor < 0.84) {
        return '3';
      } else if(factor >= 0.80 && factor < 0.82) {
        return '2';
      } else if(factor >= 0.78 && factor < 0.80) {
        return '1';
      } else if(factor >= 0.75 && factor < 0.78) {
        return '0';
      } else {
        return '不合格';
      }
    },
    calcMaxDeviation(arr) {
      arr.sort((a, b) => {
        return a - b;
      });
      const _len = arr.length;
      return arr[_len - 1] - arr[0];
    },
    calcRibbenThicknessLevel(thickness) {
      if (!thickness) {
        return;
      }
      if (thickness > 26) {
        return 1;
      } else if(thickness > 23 && thickness <= 26) {
        return 2;
      } else if(thickness > 20 && thickness <= 23) {
        return 3;
      } else if(thickness > 18 && thickness <= 20) {
        return 4;
      } else if(thickness > 16 && thickness <= 18) {
        return 5;
      } else if(thickness > 14 && thickness <= 16) {
        return 6;
      } else if(thickness > 12 && thickness <= 14) {
        return 7;
      } else if(thickness <= 12) {
        return 8;
      }
    }
  }
}
</script>