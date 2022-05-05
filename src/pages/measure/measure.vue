<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="crumb">
      <el-breadcrumb-item>检测记录</el-breadcrumb-item>
      <el-breadcrumb-item>{{ castId }}号机组</el-breadcrumb-item>
    </el-breadcrumb>
    <Collapse>
      <el-form class="search_bar" :model="searchForm" :inline="true">
        <el-form-item label="生产日期：">
          <el-date-picker
            v-model="searchForm.date"
            type="daterange"
            :default-time="['00:00:00', '23:59:59']"
            value-format="yyyy-MM-dd HH:mm:ss"
            :clearable="false"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="检测日期：">
          <el-date-picker
            v-model="searchForm.measureDate"
            type="daterange"
            :default-time="['00:00:00', '23:59:59']"
            :clearable="false"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="喷带手：">
          <el-input
            v-model="searchForm.caster"
            placeholder="请输入喷带手姓名"
          ></el-input>
        </el-form-item>
        <el-form-item label="炉号：">
          <!-- <el-input
            v-model="searchForm.furnace"
            placeholder="请输入炉号"
          ></el-input> -->
          <el-select
            v-model="searchForm.furnaces"
            placeholder="请输入炉号关键字"
            multiple
            filterable
            remote
            :loading="selectLoading"
            :remote-method="remoteQueryFinance"
          >
            <el-option
              v-for="furnace in furnaceList"
              :key="furnace"
              :label="furnace"
              :value="furnace"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="材质：">
          <el-select
            v-model="searchForm.ribbonTypeNames"
            placeholder="请选择"
            multiple
            collapse-tags
          >
            <el-option
              v-for="item in ribbonTypeList"
              :key="item.ribbonTypeId"
              :value="item.ribbonTypeName"
              :label="item.ribbonTypeName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="规格：">
          <el-select
            v-model="searchForm.ribbonWidths"
            placeholder="请选择"
            multiple
            collapse-tags
          >
            <el-option
              v-for="item in ribbonWidthList"
              :key="item.ribbonWidthId"
              :label="item.ribbonWidth"
              :value="item.ribbonWidth"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="厚度级别：">
          <el-select
            v-model="searchForm.ribbonThicknessLevels"
            placeholder="请选择"
            multiple
            collapse-tags
          >
            <el-option
              v-for="item in ribbonThicknessLevelList"
              :key="item.ribbonThicknessLevelId"
              :label="item.ribbonThicknessLevel"
              :value="item.ribbonThicknessLevel"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="叠片级别：">
          <el-select
            v-model="searchForm.laminationLevels"
            placeholder="请选择"
            multiple
            collapse-tags
          >
            <el-option
              v-for="item in laminationLevelList"
              :key="item.laminationLevelId"
              :label="item.laminationLevel"
              :value="item.laminationLevel"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="韧性级别：">
          <el-select
            v-model="searchForm.ribbonToughnessLevels"
            placeholder="请选择"
            multiple
            collapse-tags
          >
            <el-option
              v-for="item in ribbonToughnessLevelList"
              :key="item.ribbonToughnessLevelId"
              :label="item.ribbonToughnessLevel"
              :value="item.ribbonToughnessLevel"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="外观级别：">
          <el-select
            v-model="searchForm.appearenceLevels"
            placeholder="请选择"
            multiple
            collapse-tags
          >
            <el-option
              v-for="(appearenceLevel, index) in uniqueAppearenceLevelList"
              :key="index"
              :label="appearenceLevel"
              :value="appearenceLevel"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="厚度偏差：">
          <el-select
            v-model="searchForm.thicknessDivation"
            placeholder="请选择"
          >
            <el-option label="<=1" :value="1"></el-option>
            <el-option label="<=2" :value="2"></el-option>
            <el-option label="<=3" :value="3"></el-option>
            <el-option label="<=4" :value="4"></el-option>
            <el-option label="<=5" :value="5"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序方式：">
          <el-select v-model="searchForm.orderBy" placeholder="请选择">
            <el-option label="按更新时间" :value="1"></el-option>
            <el-option label="按炉号和盘号" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="clickSearch"
            >搜索</el-button
          >
          <el-button type="primary" icon="el-icon-refresh" @click="reset"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </Collapse>
    <div class="main_bd">
      <el-col class="table_hd">
        <el-button
          :type="autoQueryConfig.type"
          :icon="autoQueryConfig.icon"
          @click="handleAutoQuery"
          v-if="[1, 2, 3, 5].includes(userinfo.roleId)"
          >{{ autoQueryConfig.text }}</el-button
        >
        <el-tooltip
          content="1.必须关闭自动更新，才能点击；2.点击后会计算下表中带材的综合级别"
          placement="top-end"
          ><el-button
            type="primary"
            icon="el-icon-info"
            @click="batchCalcRibbonTotalData"
            v-if="[1, 2, 3, 5].includes(userinfo.roleId)"
            :disabled="isAutoQuerying"
            >计算综合级别</el-button
          ></el-tooltip
        >
        <el-tooltip content="必须关闭自动更新，才能点击" placement="top-end"
          ><el-button
            type="primary"
            icon="el-icon-document-checked"
            @click="batchSave"
            v-if="[1, 2, 3, 5].includes(userinfo.roleId)"
            :disabled="isAutoQuerying"
            >批量保存</el-button
          ></el-tooltip
        >
        <el-tooltip
          content="请先选择筛选条件中的生产日期或者检测日期后再导出"
          placement="top-end"
          ><el-button
            type="primary"
            icon="el-icon-download"
            @click="exportExcel"
            v-if="[1, 2, 3, 5].includes(userinfo.roleId)"
            class="pull_right"
            style="margin-left: 10px"
            >导出</el-button
          ></el-tooltip
        >
        <el-button
          type="primary"
          icon="el-icon-upload"
          @click="uploadExcelHandler"
          class="pull_right"
          v-if="[1, 2, 3, 5].includes(userinfo.roleId)"
          >导入</el-button
        >
        <el-button
          type="primary"
          icon="el-icon-check"
          @click="measureConfirm"
          class="pull_right"
          v-if="[1, 2, 3, 5].includes(userinfo.roleId)"
          >申请入库</el-button
        >
      </el-col>
      <el-table
        :data="tableData"
        ref="table"
        stripe
        border
        highlight-current-row
        style="width: 100%"
        :height="tableHeight"
        v-loading="loading"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="20"
          :selectable="setSelectable"
        ></el-table-column>
        <el-table-column
          prop="furnace"
          label="炉号"
          align="center"
          width="130px"
          fixed
        ></el-table-column>
        <el-table-column
          prop="coilNumber"
          label="盘号"
          align="center"
          width="35px"
          fixed
        ></el-table-column>
        <el-table-column
          prop="ribbonTypeName"
          label="材质"
          align="center"
          min-width="50px"
        ></el-table-column>
        <el-table-column
          prop="ribbonWidth"
          label="规格"
          align="center"
          width="40px"
        ></el-table-column>
        <el-table-column
          prop="castDate"
          label="生产日期"
          align="center"
          :formatter="dateFormat"
          width="80px"
        ></el-table-column>
        <el-table-column
          prop="caster"
          label="喷带手"
          align="center"
          width="50px"
        ></el-table-column>
        <el-table-column
          prop="diameter"
          label="外径(mm)"
          align="center"
          width="70px"
        ></el-table-column>
        <el-table-column
          prop="coilWeight"
          label="重量(kg)"
          align="center"
          width="70px"
        ></el-table-column>
        <el-table-column
          prop="coilNetWeight"
          label="净重(kg)"
          align="center"
          width="70px"
        ></el-table-column>
        <el-table-column
          prop="laminationFactor"
          label="叠片系数"
          align="center"
          width="70px"
        ></el-table-column>
        <el-table-column
          prop="laminationLevel"
          label="叠片等级"
          align="center"
          width="70px"
        ></el-table-column>
        <el-table-column
          prop="realRibbonWidth"
          label="实际带宽"
          align="center"
          width="70px"
        >
          <template slot-scope="scope">
            <!-- <div v-if="scope.row.isEditing === false"> -->
            <div
              v-if="scope.row.isMeasureConfirmed === 1 || userinfo.roleId != 5"
            >
              {{ scope.row.realRibbonWidth }}
            </div>
            <div v-else>
              <el-input
                size="mini"
                v-model="scope.row.realRibbonWidth"
              ></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="ribbonThickness1"
          label="带厚1(μm)"
          align="center"
          width="70px"
        >
          <template slot-scope="scope">
            <!-- <div v-if="scope.row.isEditing === false"> -->
            <div
              v-if="scope.row.isMeasureConfirmed === 1 || userinfo.roleId != 5"
            >
              {{ scope.row.ribbonThickness1 }}
            </div>
            <div v-else>
              <el-input
                size="mini"
                v-model="scope.row.ribbonThickness1"
                @keyup.native="
                  $event => thicknessChangeHandler($event, scope.row)
                "
              ></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="ribbonThickness2"
          label="带厚2(μm)"
          align="center"
          width="70px"
        >
          <template slot-scope="scope">
            <!-- <div v-if="scope.row.isEditing === false"> -->
            <div
              v-if="scope.row.isMeasureConfirmed === 1 || userinfo.roleId != 5"
            >
              {{ scope.row.ribbonThickness2 }}
            </div>
            <div v-else>
              <el-input
                size="mini"
                v-model="scope.row.ribbonThickness2"
                @keyup.native="
                  $event => thicknessChangeHandler($event, scope.row)
                "
              ></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="ribbonThickness3"
          label="带厚3(μm)"
          align="center"
          width="70px"
        >
          <template slot-scope="scope">
            <!-- <div v-if="scope.row.isEditing === false"> -->
            <div
              v-if="scope.row.isMeasureConfirmed === 1 || userinfo.roleId != 5"
            >
              {{ scope.row.ribbonThickness3 }}
            </div>
            <div v-else>
              <el-input
                size="mini"
                v-model="scope.row.ribbonThickness3"
                @keyup.native="
                  $event => thicknessChangeHandler($event, scope.row)
                "
              ></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="ribbonThickness4"
          label="带厚4(μm)"
          align="center"
          width="70px"
        >
          <template slot-scope="scope">
            <!-- <div v-if="scope.row.isEditing === false"> -->
            <div
              v-if="scope.row.isMeasureConfirmed === 1 || userinfo.roleId != 5"
            >
              {{ scope.row.ribbonThickness4 }}
            </div>
            <div v-else>
              <el-input
                size="mini"
                v-model="scope.row.ribbonThickness4"
                @keyup.native="
                  $event => thicknessChangeHandler($event, scope.row)
                "
              ></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="ribbonThickness5"
          label="带厚5(μm)"
          align="center"
          width="70px"
        >
          <template slot-scope="scope">
            <!-- <div v-if="scope.row.isEditing === false"> -->
            <div
              v-if="scope.row.isMeasureConfirmed === 1 || userinfo.roleId != 5"
            >
              {{ scope.row.ribbonThickness5 }}
            </div>
            <div v-else>
              <el-input
                size="mini"
                v-model="scope.row.ribbonThickness5"
                @keyup.native="
                  $event => thicknessChangeHandler($event, scope.row)
                "
              ></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="ribbonThickness6"
          label="带厚6(μm)"
          align="center"
          width="70px"
        >
          <template slot-scope="scope">
            <!-- <div v-if="scope.row.isEditing === false"> -->
            <div
              v-if="scope.row.isMeasureConfirmed === 1 || userinfo.roleId != 5"
            >
              {{ scope.row.ribbonThickness6 }}
            </div>
            <div v-else>
              <el-input
                size="mini"
                v-model="scope.row.ribbonThickness6"
                @keyup.native="
                  $event => thicknessChangeHandler($event, scope.row)
                "
              ></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="ribbonThickness7"
          label="带厚7(μm)"
          align="center"
          width="70px"
        >
          <template slot-scope="scope">
            <!-- <div v-if="scope.row.isEditing === false"> -->
            <div
              v-if="scope.row.isMeasureConfirmed === 1 || userinfo.roleId != 5"
            >
              {{ scope.row.ribbonThickness7 }}
            </div>
            <div v-else>
              <el-input
                size="mini"
                v-model="scope.row.ribbonThickness7"
                @keyup.native="
                  $event => thicknessChangeHandler($event, scope.row)
                "
              ></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="ribbonThickness8"
          label="带厚8(μm)"
          align="center"
          width="70px"
        >
          <template slot-scope="scope">
            <!-- <div v-if="scope.row.isEditing === false"> -->
            <div
              v-if="scope.row.isMeasureConfirmed === 1 || userinfo.roleId != 5"
            >
              {{ scope.row.ribbonThickness8 }}
            </div>
            <div v-else>
              <el-input
                size="mini"
                v-model="scope.row.ribbonThickness8"
                @keyup.native="
                  $event => thicknessChangeHandler($event, scope.row)
                "
              ></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="ribbonThickness9"
          label="带厚9(μm)"
          align="center"
          width="70px"
        >
          <template slot-scope="scope">
            <!-- <div v-if="scope.row.isEditing === false"> -->
            <div
              v-if="scope.row.isMeasureConfirmed === 1 || userinfo.roleId != 5"
            >
              {{ scope.row.ribbonThickness9 }}
            </div>
            <div v-else>
              <el-input
                size="mini"
                v-model="scope.row.ribbonThickness9"
                @keyup.native="
                  $event => thicknessChangeHandler($event, scope.row)
                "
              ></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="ribbonThicknessDeviation"
          label="厚度偏差(μm)"
          align="center"
          width="90px"
        ></el-table-column>
        <el-table-column
          prop="ribbonThickness"
          label="平均厚度(μm)"
          align="center"
          width="90px"
        ></el-table-column>
        <el-table-column
          prop="ribbonThicknessLevel"
          label="厚度级别"
          align="center"
          width="70px"
        ></el-table-column>
        <el-table-column
          prop="ribbonToughness"
          label="韧性"
          align="center"
          width="70px"
        >
          <!-- <template slot-scope="scope">
            <div
              v-if="scope.row.isMeasureConfirmed === 1 || userinfo.roleId != 5"
            >
              {{ scope.row.ribbonToughness }}
            </div>
            <div v-else>
              <el-select
                size="mini"
                v-model="scope.row.ribbonToughness"
                placeholder
              >
                <el-option
                  v-for="item in ribbonToughnessLevelList"
                  :key="item.ribbonToughnessLevelId"
                  :label="item.ribbonToughness"
                  :value="item.ribbonToughness"
                ></el-option>
              </el-select>
            </div>
          </template> -->
        </el-table-column>
        <el-table-column
          prop="ribbonToughnessLevel"
          label="韧性等级"
          align="center"
          width="60px"
        >
          <template slot-scope="scope">
            <div
              v-if="scope.row.isMeasureConfirmed === 1 || userinfo.roleId != 5"
            >
              {{ scope.row.ribbonToughnessLevel }}
            </div>
            <div v-else>
              <el-select
                size="mini"
                v-model="scope.row.ribbonToughnessLevel"
                placeholder=""
              >
                <!-- <el-option label="A" value="A"></el-option>
                <el-option label="B" value="B"></el-option>
                <el-option label="C" value="C"></el-option>
                <el-option label="D" value="D"></el-option>
                <el-option label="E" value="E"></el-option> -->
                <el-option
                  v-for="item in ribbonToughnessLevelList"
                  :key="item.ribbonToughnessLevelId"
                  :label="item.ribbonToughnessLevel"
                  :value="item.ribbonToughnessLevel"
                ></el-option>
              </el-select>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="appearence"
          label="外观"
          align="center"
          width="70px"
        >
          <template slot-scope="scope">
            <!-- <div v-if="scope.row.isEditing === false"> -->
            <div
              v-if="scope.row.isMeasureConfirmed === 1 || userinfo.roleId != 5"
            >
              {{ scope.row.appearence ? scope.row.appearence.toString() : "" }}
            </div>
            <div v-else>
              <el-select
                size="mini"
                v-model="scope.row.appearence"
                multiple
                collapse-tags
                placeholder
              >
                <!-- <el-option label="无明显缺陷" value="无明显缺陷"></el-option>
                <el-option label="轻棱" value="轻棱"></el-option>
                <el-option label="棱" value="棱"></el-option>
                <el-option label="轻微麻点" value="轻微麻点"></el-option>
                <el-option label="麻点" value="麻点"></el-option>
                <el-option label="轻微划痕" value="轻微划痕"></el-option>
                <el-option label="划痕" value="划痕"></el-option>
                <el-option label="轻微挖心" value="轻微挖心"></el-option>
                <el-option label="挖心" value="挖心"></el-option>
                <el-option label="少量劈裂" value="少量劈裂"></el-option>
                <el-option label="大量劈裂" value="大量劈裂"></el-option>
                <el-option label="端面损坏" value="端面损坏"></el-option>-->
                <el-option
                  v-for="item in appearenceList"
                  :label="item.appearence"
                  :value="item.appearence"
                  :key="item.appearenceLevelId"
                ></el-option>
              </el-select>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="appearenceLevel"
          label="外观等级"
          align="center"
          width="60px"
        >
          <template slot-scope="scope">
            <div
              v-if="scope.row.isMeasureConfirmed === 1 || userinfo.roleId != 5"
            >
              {{ scope.row.appearenceLevel }}
            </div>
            <div v-else>
              <el-select
                size="mini"
                v-model="scope.row.appearenceLevel"
                placeholder=""
              >
                <!-- <el-option label="A" value="A"></el-option>
                <el-option label="B" value="B"></el-option>
                <el-option label="C" value="C"></el-option>
                <el-option label="不合格" value="不合格"></el-option> -->
                <el-option
                  v-for="(appearenceLevel, index) in uniqueAppearenceLevelList"
                  :key="index"
                  :label="appearenceLevel"
                  :value="appearenceLevel"
                ></el-option>
              </el-select>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="ribbonTotalLevel"
          label="综合级别"
          align="center"
          width="70px"
        >
          <template slot-scope="scope">
            <span
              :class="
                scope.row.ribbonTotalLevel === '不合格' ? 'text_danger' : ''
              "
              >{{ scope.row.ribbonTotalLevel }}</span
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="unQualifiedReason"
          label="不合格原因"
          align="center"
          width="70px"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column label="入库规则" align="center" width="60px">
          <template slot-scope="scope">
            <el-popover placement="right" trigger="hover">
              <table class="popover_table" cellpadding="0" cellspacing="0">
                <thead>
                  <th>类别</th>
                  <th>带厚</th>
                  <th>叠片</th>
                  <th>韧性</th>
                  <th>外观</th>
                </thead>
                <tbody>
                  <tr>
                    <td>计划内入库要求</td>
                    <td>{{ scope.row.storageRule.orderThickness }}</td>
                    <td>{{ scope.row.storageRule.orderLaminationFactor }}</td>
                    <td>
                      {{ scope.row.storageRule.orderRibbonToughnessLevels }}
                    </td>
                    <td>{{ scope.row.storageRule.orderAppearenceLevels }}</td>
                  </tr>
                  <!-- <tr v-if="userinfo.roleId === 1 || userinfo.roleId === 2 || userinfo.roleId === 3 || userinfo.roleId === 5 || userinfo.roleId === 6">
                    <td>计划外入库要求</td>
                    <td>{{scope.row.storageRule.qualifiedThickness}}</td>
                    <td>{{scope.row.storageRule.qualifiedLaminationFactor}}</td>
                    <td>{{scope.row.storageRule.qualifiedRibbonToughnessLevels}}</td>
                    <td>{{scope.row.storageRule.qualifiedAppearenceLevels}}</td>
                  </tr>-->
                  <tr
                    v-for="(item, index) in scope.row.storageRule
                      .qualifiedDemands"
                    :key="index"
                  >
                    <td>计划外入库要求</td>
                    <td>{{ item.qualifiedThickness }}</td>
                    <td>{{ item.qualifiedLaminationFactor }}</td>
                    <td>{{ item.qualifiedRibbonToughnessLevels.join() }}</td>
                    <td>{{ item.qualifiedAppearenceLevels.join() }}</td>
                  </tr>
                </tbody>
              </table>
              <el-button slot="reference" size="mini" type="text"
                >详情</el-button
              >
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          prop="isStorageConfirmed"
          label="是否入库"
          align="center"
          width="60px"
        >
          <template slot-scope="scope">
            <div>
              <span v-if="scope.row.isStorageConfirmed === 1">是</span>
              <span v-else class="text_danger">否</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="isStored"
          label="入库类别"
          align="center"
          width="60px"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.isStorageConfirmed === 1">
              <span v-if="scope.row.isStored === 1">计划内</span>
              <span v-if="scope.row.isStored === 2">计划外</span>
              <span v-if="scope.row.isStored === 3" class="text_danger"
                >否</span
              >
            </div>
            <!-- <div v-else>
              <el-select v-model="scope.row.isStored" placeholder="" size="mini">
                <el-option label="计划内入库" :value="1"></el-option>
                <el-option label="计划外入库" :value="2"></el-option>
                <el-option label="否" :value="3"></el-option>
              </el-select>
            </div>-->
          </template>
        </el-table-column>
        <el-table-column
          prop="unStoreReason"
          label="不入库原因"
          align="center"
          min-width="70px"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <div
              v-if="scope.row.isMeasureConfirmed === 1 || userinfo.roleId != 5"
              class="text_danger"
            >
              {{ scope.row.unStoreReason }}
            </div>
            <div v-else>
              <el-input
                size="mini"
                v-model="scope.row.unStoreReason"
              ></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="clients"
          label="判定去向"
          align="center"
          width="80px"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <div
              v-if="scope.row.isMeasureConfirmed === 1 || userinfo.roleId != 5"
            >
              {{ scope.row.clients ? scope.row.clients.toString() : "" }}
            </div>
            <div v-else>
              <el-select
                size="mini"
                v-model="scope.row.clients"
                placeholder
                multiple
                collapse-tags
              >
                <el-option
                  v-for="item in clientsList"
                  :label="item.client"
                  :value="item.client"
                  :key="item.clientsId"
                  :disabled="item.isFlat === 0 && scope.row.isFlat === 1"
                ></el-option>
              </el-select>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="measureDate"
          label="检测时间"
          align="center"
          width="100px"
          :formatter="dateTimeFormat"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          prop="rejectReason"
          label="驳回原因"
          align="center"
          width="100px"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          label="操作"
          align="center"
          v-if="userinfo.roleId == 5 || userinfo.roleId == 1"
        >
          <template slot-scope="scope">
            <!-- <el-button size="mini" type="primary" @click="edit(scope.row)" v-if="scope.row.isEditing === false" :disabled="!isEditable">修改</el-button> -->
            <!-- <el-button size="mini" type="primary" @click="edit(scope.row)" v-if="scope.row.isMeasureConfirmed === 1" :disabled="!isEditable">修改</el-button> -->
            <!-- <el-button size="mini" type="success" @click="save(scope.row)" v-else :disabled="!isEditable">保存</el-button> -->
            <el-button
              size="mini"
              type="success"
              @click="save(scope.row)"
              v-if="scope.row.isMeasureConfirmed !== 1"
              :disabled="!isEditable"
              >保存</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="total,prev,pager,next"
        :total="pageConfig.total"
        :current-page.sync="pageConfig.current"
        :page-size="pageConfig.pageSize"
        @current-change="handleCurrentChange"
      ></el-pagination>
      <ApplyInStoreModal
        :castId="Number(castId)"
        :visible="applyInStoreModalVisible"
        v-if="applyInStoreModalVisible"
        @close="() => (this.applyInStoreModalVisible = false)"
        @submit="() => (this.applyInStoreModalVisible = false)"
      />
      <!-- 上传检测excel弹出框 -->
      <el-dialog
        title="上传检测数据"
        :visible.sync="uploadExcelForm.visible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        @close="closeUploadDialog"
        :center="true"
        width="40%"
        v-loading="loading"
        element-loading-text="拼命加载中"
      >
        <el-upload
          class="upload"
          ref="upload"
          :action="uploadExcelForm.url"
          :file-list="uploadExcelForm.fileList"
          :multiple="false"
          :limit="1"
          accept=".xlsx"
          :on-error="uploadErrorHanler"
          :on-success="uploadSuccessHanler"
          :auto-upload="false"
        >
          <el-button slot="trigger" size="small" type="primary"
            >选取文件</el-button
          >
          <div slot="tip" class="el-upload__tip">
            只能上传xlsx文件，且不超过2M
          </div>
        </el-upload>
        <div slot="footer">
          <el-button type="primary" @click="submitUploadForm"
            >上传提交</el-button
          >
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import qs from "qs";
import { cloneDeep } from "lodash";
import { Message } from "element-ui";
import moment from "moment";
import urlmap from "@/utils/urlmap";
import { dateFormat, dateTimeFormat, debounce } from "@/utils/common";
import { mapState, mapActions } from "vuex";
import Collapse from "@/components/collapse.vue";
import ApplyInStoreModal from "./components/ApplyInStoreModal.vue";

const defaultDateRange = [
  `${moment()
    .subtract(6, "days")
    .format("YYYY-MM-DD")} 00:00:00`,
  `${moment().format("YYYY-MM-DD")} 23:59:59`
];

export default {
  name: "melt",
  components: {
    Collapse,
    ApplyInStoreModal
  },
  data() {
    return {
      userinfo: {},
      castId: 6,
      searchForm: {
        caster: "",
        // furnace: "",
        furnaces: [],
        date: [...defaultDateRange],
        measureDate: [],
        ribbonTypeNames: [],
        ribbonWidths: [],
        ribbonThicknessLevels: [],
        laminationLevels: [],
        ribbonToughnessLevels: [],
        appearenceLevels: [],
        thicknessDivation: "",
        orderBy: 1
      },
      selectLoading: false,
      furnaceList: [],
      loading: false,
      tableData: [],
      pageConfig: {
        total: 1,
        current: 1,
        pageSize: 10
      },
      isExportable: false,
      isEditable: false,
      isDeleteable: false,
      tableHeight: 550,
      multipleSelection: [],
      isBatchInStored: false,
      isAutoQuerying: false,
      pollTimer: null,
      // uniqueAppearenceLevelList: []
      applyInStoreModalVisible: false,
      uploadExcelForm: {
        loading: false,
        visible: false,
        url: urlmap.uploadMeasure,
        // url: "http://192.168.1.8:8080/api/measure/uploadMeasure",
        fileList: []
      }
    };
  },
  computed: {
    autoQueryConfig() {
      return {
        icon: this.isAutoQuerying
          ? "el-icon-video-pause"
          : "el-icon-video-play",
        text: this.isAutoQuerying ? "停止自动更新" : "启动自动更新",
        type: this.isAutoQuerying ? "danger" : "primary"
      };
    },
    ...mapState([
      "ribbonToughnessLevelList",
      "ribbonTypeList",
      "ribbonWidthList",
      "ribbonThicknessLevelList",
      "laminationLevelList",
      "clientsList",
      "appearenceList",
      "linerWeightList"
    ]),
    uniqueAppearenceLevelList() {
      return this.appearenceList.reduce((acc, cur) => {
        if (!acc.includes(cur.appearenceLevel)) {
          acc.push(cur.appearenceLevel);
        }
        return acc;
      }, []);
    }
  },
  // 动态路由匹配
  beforeRouteUpdate(to, from, next) {
    this.castId = to.params.castId;
    this.getTableData();
    this.isExportable = this.setExportable();
    this.isEditable = this.setEditable();
    this.isDeleteable = this.setDeleteable();
    this.isBatchInStored = this.setBatchInStored();
    next();
  },
  async created() {
    this.castId = this.$route.params.castId;
    this.userinfo = JSON.parse(localStorage.getItem("userinfo"));
    this.isExportable = this.setExportable();
    this.isEditable = this.setEditable();
    this.isDeleteable = this.setDeleteable();
    this.isBatchInStored = this.setBatchInStored();
    await this.getLinerWeightList();
    await this.getRibbonToughnessLevelList();
    await this.getRibbonTypeList();
    await this.getRibbonWidthList();
    await this.getRibbonThicknessLevelList();
    await this.getLaminationLevelList();
    await this.getClientsList();
    await this.getAppearenceLevelList();
    this.getTableData();
  },
  mounted() {
    const self = this;
    self.$nextTick(() => {
      // self.tableHeight = window.innerHeight - self.$refs.table.$el.getBoundingClientRect().top;
      self.tableHeight = window.innerHeight - 80;
    });
    window.onresize = debounce(() => {
      // self.tableHeight = window.innerHeight - self.$refs.table.$el.getBoundingClientRect().top;
      self.tableHeight = window.innerHeight - 80;
    }, 1000);
  },
  beforeDestroy() {
    clearInterval(this.pollTimer);
    this.pollTimer = null;
  },
  methods: {
    remoteQueryFinance(query) {
      if (query !== "") {
        this.selectLoading = true;
        const params = {
          castId: this.castId,
          startTime: this.searchForm.date[0],
          endTime: this.searchForm.date[1],
          query
        };
        this.$http("GET", urlmap.queryMeasureFurnaceList, { ...params })
          .then(data => {
            this.furnaceList = data.list;
          })
          .catch(err => {
            console.log(err);
          })
          .finally(() => {
            this.selectLoading = false;
          });
      } else {
        this.furnaceList = [];
      }
    },
    handleAutoQuery() {
      const curStatus = this.isAutoQuerying;
      this.isAutoQuerying = !curStatus;
      if (!this.isAutoQuerying) {
        this.pollTimer && clearInterval(this.pollTimer);
      } else {
        clearInterval(this.pollTimer);
        this.getTableData();
        this.pollTimer = setInterval(() => {
          this.getTableData();
        }, 5000);
      }
    },
    batchCalcRibbonTotalData() {
      /**
       * 筛选出从PLC传入的数据。特征：1.没有综合级别，2.有带材厚度，韧性等级code，外观等级code
       */
      let list = this.tableData.filter(
        item =>
          !item.ribbonTotalLevel &&
          [
            item.ribbonThickness1,
            item.ribbonThickness2,
            item.ribbonThickness3,
            item.ribbonThickness4,
            item.ribbonThickness5,
            item.ribbonThickness6,
            item.ribbonThickness7,
            item.ribbonThickness8,
            item.ribbonThickness9,
            item.realRibbonWidth,
            item.ribbonToughnessLevel,
            item.appearenceLevel
          ].every(el => !!el)
      );
      if (!Array.isArray(list) || list.length === 0)
        return Message({
          message: `没有找到需要计算综合级别的带材，请确认 带材厚度/带宽/韧性等级/外观等级 等数据是否完整`,
          type: "error"
        });
      /**
       * 计算：
       * 1.平均厚度，最大偏差，厚度等级
       * 2.叠片系数，叠片等级
       * 3.韧性等级，韧性描述
       * 4.外观等级，外观描述
       * 5.综合等级
       * 6.合格情况
       *
       */
      list = list.map(item => {
        // 根据PLC数据获取韧性等级
        // const ribbonToughnessItem = this.ribbonToughnessLevelList.find(ribbon => ribbon.ribbonToughnessLevelCode === item.ribbonToughnessLevelCode) || {}
        // item.ribbonToughnessLevel = ribbonToughnessItem.ribbonToughnessLevel;
        // 根据PLC数据获取外观等级
        // const appearenceItem = this.appearenceList.find(a => a.appearenceLevelCode === item.appearenceLevelCode) || {}
        // item.appearenceLevel = appearenceItem.appearenceLevel;
        const result = this.calcRibbonTotalData(item);
        return {
          ...item,
          ...result
        };
      });

      this.$http("PUT", urlmap.updateMeasureByBatch, {
        listJson: JSON.stringify(list)
      })
        .then(res => {
          this.getTableData({ current: this.pageConfig.current || 1 });
        })
        .catch(err => console.log(err));
    },
    thicknessChangeHandler(e, row) {
      let ribbonThicknessList = [
        row.ribbonThickness1,
        row.ribbonThickness2,
        row.ribbonThickness3,
        row.ribbonThickness4,
        row.ribbonThickness5,
        row.ribbonThickness6,
        row.ribbonThickness7,
        row.ribbonThickness8,
        row.ribbonThickness9
      ];
      ribbonThicknessList = ribbonThicknessList
        .map(item => {
          if (item !== "") {
            return Number(item);
          }
        })
        .filter(item => item !== undefined);
      row.ribbonThicknessDeviation = this.calcMaxDeviation(ribbonThicknessList);
      row.ribbonThickness =
        ribbonThicknessList.length > 0
          ? Number(
              (
                ribbonThicknessList.reduce((acc, cur) => acc + cur, 0) /
                ribbonThicknessList.length
              ).toFixed(2)
            )
          : 0;
      row.ribbonThicknessLevel = this.calcribbonThicknessLevel(
        row.ribbonThickness
      );
    },
    ...mapActions([
      "getRibbonToughnessLevelList",
      "getRibbonTypeList",
      "getRibbonWidthList",
      "getRibbonThicknessLevelList",
      "getLaminationLevelList",
      "getClientsList",
      "getAppearenceLevelList",
      "getLinerWeightList"
    ]),
    dateFormat(row, column) {
      return dateFormat(row.castDate);
    },
    dateTimeFormat(row, column) {
      return row.measureDate ? dateTimeFormat(row.measureDate) : "";
    },
    setEditable() {
      if (this.userinfo.roleId == 5) {
        // 检测人员可修改
        return true;
      } else {
        // 其他
        return false;
      }
    },
    setDeleteable() {
      if (this.userinfo.roleId == 1) {
        // 厂长 可删除
        return true;
      } else {
        // 其他
        return false;
      }
    },
    setExportable() {
      if ([1, 2, 3, 5].includes(this.userinfo.roleId)) {
        return true;
      } else {
        return false;
      }
    },
    setBatchInStored() {
      if ([1, 5].includes(this.userinfo.roleId)) {
        return true;
      } else {
        return false;
      }
    },
    // 计算内衬的重量
    calcLinerWeight(ribbonWidth) {
      /** 
       * 计算单盘净重，不同规格的内衬重量不同
       * 内衬的规格和重量对应表
       * 20.5: 0.05,
        25.5: 0.06,
        30: 0.08,
        40: 0.12,
        50: 0.12
       */
      ribbonWidth = Number(ribbonWidth);
      const { linerWeight } =
        this.linerWeightList.find(item => item.ribbonWidth === ribbonWidth) ||
        {};

      if (!linerWeight) {
        Message({
          message: `带材宽度${ribbonWidth}没有配置所用内衬重量，请联系管理员进行配置！`,
          type: "error"
        });
        return 0;
      }

      // if (ribbonWidth < 25) {
      //   linerWeight = 0.05;
      // } else if (ribbonWidth >= 25 && ribbonWidth < 30) {
      //   linerWeight = 0.06;
      // } else if (ribbonWidth >= 30 && ribbonWidth < 40) {
      //   linerWeight = 0.08;
      // } else if (ribbonWidth >= 40 && ribbonWidth < 50) {
      //   linerWeight = 0.12;
      // } else if (ribbonWidth >= 50 && ribbonWidth < 58) {
      //   linerWeight = 0.12;
      // } else if (ribbonWidth >= 58) {
      //   // 58mm 以上的使用两个 30 的内衬拼接起来
      //   linerWeight = 0.08 * 2;
      // }
      return linerWeight;
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
      this.searchForm = {
        caster: "",
        // furnace: "",
        furnaces: [],
        date: [...defaultDateRange],
        measureDate: [],
        ribbonTypeNames: [],
        ribbonWidths: [],
        ribbonThicknessLevels: [],
        laminationLevels: [],
        ribbonToughnessLevels: [],
        appearenceLevels: [],
        thicknessDivation: "",
        orderBy: 1
      };
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
        startMeasureTime: this.searchForm.measureDate[0],
        endMeasureTime: this.searchForm.measureDate[1],
        caster: this.searchForm.caster,
        // furnace: this.searchForm.furnace,
        furnaceJson: JSON.stringify(this.searchForm.furnaces),
        ribbonTypeNameJson: JSON.stringify(this.searchForm.ribbonTypeNames),
        ribbonWidthJson: JSON.stringify(this.searchForm.ribbonWidths),
        ribbonThicknessLevelJson: JSON.stringify(
          this.searchForm.ribbonThicknessLevels
        ),
        laminationLevelJson: JSON.stringify(this.searchForm.laminationLevels),
        ribbonToughnessLevelJson: JSON.stringify(
          this.searchForm.ribbonToughnessLevels
        ),
        appearenceLevelJson: JSON.stringify(this.searchForm.appearenceLevels),
        thicknessDivation: this.searchForm.thicknessDivation,
        orderBy: this.searchForm.orderBy
      };
      console.log(params);
      Object.assign(params, _params);
      this.loading = true;
      this.$http("get", urlmap.queryMeasure, params)
        .then(data => {
          this.pageConfig.total = data.count;
          this.pageConfig.pageSize = data.limit;
          data.list &&
            data.list.forEach(item => {
              this.userinfo.roleId == 5
                ? (item.isEditing = true)
                : (item.isEditing = false);
              item.storageRule = {
                orderThickness: item.orderThickness,
                orderLaminationFactor: item.orderLaminationFactor,
                orderRibbonToughnessLevels: item.orderRibbonToughnessLevels,
                orderAppearenceLevels: item.orderAppearenceLevels,
                // qualifiedThickness: item.qualifiedThickness,
                // qualifiedLaminationFactor: item.qualifiedLaminationFactor,
                // qualifiedRibbonToughnessLevels: item.qualifiedRibbonToughnessLevels,
                // qualifiedAppearenceLevels: item.qualifiedAppearenceLevels,
                qualifiedDemands: [1, 2, 3, 5, 6, 15].includes(
                  Number(this.userinfo.roleId)
                )
                  ? JSON.parse(item.qualifiedDemands)
                  : []
              };
              item.clients = item.clients ? item.clients.split(",") : [];
              item.appearence = item.appearence
                ? item.appearence.split(",")
                : [];

              const coilNetWeight = (
                item.coilWeight - this.calcLinerWeight(item.ribbonWidth)
              ).toFixed(2);
              item.coilNetWeight = Number(coilNetWeight);
              item.remainWeight = item.coilNetWeight;
            });
          this.tableData = data.list;
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    edit(row) {
      if (
        (row.isStored == 1 || row.isStored == 2) &&
        row.isMeasureConfirmed == 1
      ) {
        // 已经入库
        return this.$message({
          message: "该带材已经入库，您无权限操作，请联系库房主管人员！",
          type: "error"
        });
      }
      // row.isEditing = true;
    },
    formatToNumber(value) {
      return typeof value === "string" ? Number(value.trim()) : value;
    },
    calcRibbonTotalData(row) {
      // 计算叠片系数和叠片等级 realRibbonWidth diameter coilWeight
      // row.laminationFactor = ((row.coilWeight - 0.09)/(Math.PI * (row.diameter * row.diameter / 4 - 95 * 95 / 4) * 7.2) * Math.pow(10, 6) / row.realRibbonWidth).toFixed(2);
      row.laminationFactor = this.calcLaminationFactor(
        row.coilNetWeight,
        row.diameter,
        row.realRibbonWidth
      );
      row.laminationLevel = this.calcLaminationLevel(row.laminationFactor);

      // 根据韧性描述判定韧性等级 ribbonToughnessLevel
      // row.ribbonToughnessLevel = this.ribbonToughnessLevelList.reduce(
      //   (acc, cur) => {
      //     acc[cur.ribbonToughness] = cur.ribbonToughnessLevel;
      //     return acc;
      //   },
      //   {}
      // )[row.ribbonToughness];

      // 根据韧性等级来获取韧性描述
      row.ribbonToughness =
        this.ribbonToughnessLevelList.reduce((acc, cur) => {
          acc[cur.ribbonToughnessLevel] = cur.ribbonToughness;
          return acc;
        }, {})[row.ribbonToughnessLevel] || "";

      // 根据外观描述判定外观等级 appearenceLevel
      // row.appearenceLevel = this.appearenceList.reduce((acc, cur) => {
      //   acc[cur.appearence] = cur.appearenceLevel;
      //   return acc;
      // }, {})[row.appearence];

      // 计算厚度最大偏差、平均厚度、厚度级别
      row.ribbonThickness1 = this.formatToNumber(row.ribbonThickness1);
      row.ribbonThickness2 = this.formatToNumber(row.ribbonThickness2);
      row.ribbonThickness3 = this.formatToNumber(row.ribbonThickness3);
      row.ribbonThickness4 = this.formatToNumber(row.ribbonThickness4);
      row.ribbonThickness5 = this.formatToNumber(row.ribbonThickness5);
      row.ribbonThickness6 = this.formatToNumber(row.ribbonThickness6);
      row.ribbonThickness7 = this.formatToNumber(row.ribbonThickness7);
      row.ribbonThickness8 = this.formatToNumber(row.ribbonThickness8);
      row.ribbonThickness9 = this.formatToNumber(row.ribbonThickness9);

      row.ribbonThicknessDeviation = this.calcMaxDeviation([
        row.ribbonThickness1,
        row.ribbonThickness2,
        row.ribbonThickness3,
        row.ribbonThickness4,
        row.ribbonThickness5,
        row.ribbonThickness6,
        row.ribbonThickness7,
        row.ribbonThickness8,
        row.ribbonThickness9
      ]);
      const ribbonThickness = (
        (row.ribbonThickness1 +
          row.ribbonThickness2 +
          row.ribbonThickness3 +
          row.ribbonThickness4 +
          row.ribbonThickness5 +
          row.ribbonThickness6 +
          row.ribbonThickness7 +
          row.ribbonThickness8 +
          row.ribbonThickness9) /
        9
      ).toFixed(2);
      row.ribbonThickness = Number(ribbonThickness);
      row.ribbonThicknessLevel = this.calcribbonThicknessLevel(
        row.ribbonThickness
      );

      // 综合级别
      const [ribbonTotalLevel, unQualifiedReason] = this.calcRibbonTotalLevel(
        row
      );
      row.ribbonTotalLevel = ribbonTotalLevel;
      row.unQualifiedReason = unQualifiedReason;

      // 是否入库：不合格不能入库，端面有问题的不能入库，不满足入库规则的不能入库
      if (row.ribbonTotalLevel === "不合格") {
        row.isStored = 3;
        // row.isMeasureConfirmed = 1;
      } else {
        // 入库分为：计划内入库和计划外入库
        row.isStored = this.setStoredType(row);
        if (row.isStored === 1) {
          row.inPlanStoredWeight = row.coilNetWeight;
          // 符合订单非薄带重量：满足订单要求且厚度为2级别的带材重量
          if (row.ribbonThicknessLevel === 2) {
            row.inPlanThickRibbonWeight = row.coilNetWeight;
          }
        } else if (row.isStored === 2) {
          row.outPlanStoredWeight = row.coilNetWeight;
        }

        // 总入库重量
        const totalStoredWeight = (
          row.inPlanStoredWeight + row.outPlanStoredWeight
        ).toFixed(2);
        row.totalStoredWeight = Number(totalStoredWeight);

        // 计算各质量等级的重量
        this.calcQualityOfABCDE(row);
        // 计算薄带和高叠片薄带的重量
        this.calcThinRibbonWeight(row);
        // // 质量等级为好的带材质量：A + 符合订单非薄带
        // row.qualityOfGood = (row.qualityOfA + row.inPlanThickRibbonWeight).toFixed(2);
        // // 质量等级为良的带材质量：B
        // row.qualityOfFine = row.qualityOfB;
        // // 质量等级为中的带材质量：30**、40**+ 计划外入库
        // if (/^[3-4]0[A-Z]{2,3}$/.test(row.ribbonTotalLevel)) {
        //   row.qualityOfNormal = row.coilNetWeight;
        // } else if(row.isStored === 2) {
        //   row.qualityOfNormal = row.outPlanStoredWeight;
        // }

        // 质量等级为好的带材质量：符合订单的带材
        row.qualityOfGood = row.inPlanStoredWeight;
        // 质量等级为良的带材质量：除去符合任务单要求的薄带（31**41**51**61**71**81**32**42**52**62**72**82**33**43**53**63**73**83**34**44**54**64**74**84**）还有德国法国的（22*B、23*B）
        // 质量等级为中的带材质量：除去好和良的其他入库。
        if (row.isStored === 2) {
          if (
            /^[3-8][1-4][A-E][A-C]G?([+-]E)?F?$/.test(row.ribbonTotalLevel) ||
            /^2[2-3][A-C]BL?([+-]E)?F?$/.test(row.ribbonTotalLevel)
          ) {
            row.qualityOfFine = row.coilNetWeight;
          } else {
            row.qualityOfNormal = row.coilNetWeight;
          }
        }
      }

      const clone = cloneDeep(row);
      clone.clients = clone.clients.join();
      clone.appearence = clone.appearence.join();

      // 去掉值为null或者undefined的参数
      Object.keys(clone).forEach(key => {
        if (clone[key] == null) {
          delete clone[key];
        }
      });
      return clone;
    },
    batchSave() {
      const shouldSaveList = this.tableData.filter(
        item => item.isMeasureConfirmed !== 1
      );
      shouldSaveList.forEach(row => this.save(row));
    },
    save(row) {
      // row.isEditing = false;
      // this.pageConfig.current = 1;
      // this.getTableData();
      const clone = this.calcRibbonTotalData(row);
      // 发送请求，更新当前的数据
      this.$http("PUT", urlmap.updateMeasure, clone)
        .then(data => {})
        .catch(error => {
          console.log(error);
        });
    },
    handleCurrentChange(val) {
      const params = {
        current: val
      };
      this.getTableData(params);
    },
    calcRibbonTotalLevel(row) {
      let ribbonTotalLevel = "";
      let unQualifiedReason = "";
      // 带材是否脆
      const isFragile = ["D", "E"].includes(row.ribbonToughnessLevel);
      let _width = row.realRibbonWidth - row.ribbonWidth;
      _width = Number(_width.toFixed(1));

      /* ~~~~~~~~~~~首先判定不合格的情况~~~~~~~~~~~~~~ */

      /** 叠片不合格 */
      if (row.laminationLevel === "不合格") {
        ribbonTotalLevel = "不合格";
        unQualifiedReason = "叠片不合格";
        return [ribbonTotalLevel, unQualifiedReason];
      }

      /** 带面不合格 */

      if (row.appearenceLevel === "不合格") {
        ribbonTotalLevel = "不合格";
        unQualifiedReason = "外观不合格";
        return [ribbonTotalLevel, unQualifiedReason];
      }

      /**
       * 针对1K107B：
       */

      if (row.ribbonTypeName == "1K107B") {
        // d＞32μm，判定为不合格;
        if (row.ribbonThickness > 32) {
          ribbonTotalLevel = "不合格";
          unQualifiedReason = "1K107B，厚度大于32μm，不合格";
          return [ribbonTotalLevel, unQualifiedReason];
        }

        // 规格 为 32，材质为 1K107B 的带材，如果韧性为D或E，则综合级别为不合格
        if ([32].includes(row.ribbonWidth) && isFragile) {
          ribbonTotalLevel = "不合格";
          unQualifiedReason = "1K107B，规格为32mm，韧性为D/E，不合格";
          return [ribbonTotalLevel, unQualifiedReason];
        }

        // 如果规格<50mm，带材韧性为D/E，同时带材宽度超出规格±0.2mm，此带材为不合格，否则加E，正偏差为+E,负偏差为-E
        if (row.ribbonWidth < 50 && isFragile && Math.abs(_width) > 0.2) {
          ribbonTotalLevel = "不合格";
          unQualifiedReason =
            "1K107B，规格<50mm，带材宽度超出规格±0.2mm，同时韧性为D/E，不合格";
          return [ribbonTotalLevel, unQualifiedReason];
        }
        if (row.ribbonWidth >= 50 && isFragile && Math.abs(_width) > 0.5) {
          ribbonTotalLevel = "不合格";
          unQualifiedReason =
            "1K107B，规格>=50mm，带材宽度超出规格±0.5mm，同时韧性为D/E，不合格";
          return [ribbonTotalLevel, unQualifiedReason];
        }

        //带材厚度偏差大于3，同时韧性为D/E,此带材为不合格，否则加F
        if (row.ribbonThicknessDeviation > 3 && isFragile) {
          ribbonTotalLevel = "不合格";
          unQualifiedReason =
            "1K107B，带材厚度偏差大于3，同时韧性为D/E，不合格";
          return [ribbonTotalLevel, unQualifiedReason];
        }

        // 针对规格为55mm/60mm/65mm、韧性为D/E级别且叠片≥0.75的带材若无法判定为信维带面（带面B级别以上）直接判定为不合格
        if (
          [55, 60, 65].includes(row.ribbonWidth) &&
          isFragile &&
          row.laminationFactor >= 0.75 &&
          !["A", "B"].includes(row.appearenceLevel)
        ) {
          ribbonTotalLevel = "不合格";
          unQualifiedReason =
            "1K107B，规格为55mm/60mm/65mm、韧性为D/E级别且叠片≥0.75的带材若无法判定为信维带面（带面B级别以上），不合格";
          return [ribbonTotalLevel, unQualifiedReason];
        }

        // 针对规格为20mm/25mm/30mm/35mm/40mm/42mm/43mm/45mm/50mm、韧性为D/E级别且叠片＜0.75的带材直接判定为不合格
        if (
          [20, 25, 30, 35, 40, 42, 43, 45, 50].includes(row.ribbonWidth) &&
          isFragile &&
          row.laminationFactor < 0.75
        ) {
          ribbonTotalLevel = "不合格";
          unQualifiedReason =
            "1K107B，规格为20mm/25mm/30mm/35mm/40mm/42mm/43mm/45mm/50mm，韧性为D/E级别且叠片＜0.75，不合格";
          return [ribbonTotalLevel, unQualifiedReason];
        }
      }

      /**
       * 针对1K107BW：
       */

      if (row.ribbonTypeName == "1K107BW") {
        // d＞32μm，判定为不合格;
        if (row.ribbonThickness > 32) {
          ribbonTotalLevel = "不合格";
          unQualifiedReason = "1K107BW，厚度大于32μm，不合格";
          return [ribbonTotalLevel, unQualifiedReason];
        }

        // 规格 为 32，材质为 1K107BW 的带材，如果韧性为D或E，则综合级别为不合格
        if ([32].includes(row.ribbonWidth) && isFragile) {
          ribbonTotalLevel = "不合格";
          unQualifiedReason = "1K107BW，规格为32mm，韧性为D/E，不合格";
          return [ribbonTotalLevel, unQualifiedReason];
        }

        // 如果规格<50mm，带材韧性为D/E，同时带材宽度超出规格±0.2mm，此带材为不合格，否则加E，正偏差为+E,负偏差为-E
        if (row.ribbonWidth < 50 && isFragile && Math.abs(_width) > 0.2) {
          ribbonTotalLevel = "不合格";
          unQualifiedReason =
            "1K107BW，规格<50mm，带材宽度超出规格±0.2mm，同时韧性为D/E，不合格";
          return [ribbonTotalLevel, unQualifiedReason];
        }
        if (row.ribbonWidth >= 50 && isFragile && Math.abs(_width) > 0.5) {
          ribbonTotalLevel = "不合格";
          unQualifiedReason =
            "1K107BW，规格>=50mm，带材宽度超出规格±0.5mm，同时韧性为D/E，不合格";
          return [ribbonTotalLevel, unQualifiedReason];
        }

        //带材厚度偏差大于3，同时韧性为D/E,此带材为不合格，否则加F
        if (row.ribbonThicknessDeviation > 3 && isFragile) {
          ribbonTotalLevel = "不合格";
          unQualifiedReason =
            "1K107BW，带材厚度偏差大于3，同时韧性为D/E，不合格";
          return [ribbonTotalLevel, unQualifiedReason];
        }

        // 针对规格为20mm/25mm/30mm/35mm/40mm/42mm/43mm/45mm/50mm、韧性为D/E级别且叠片＜0.75的带材直接判定为不合格
        if (
          [20, 25, 30, 35, 40, 42, 43, 45, 50].includes(row.ribbonWidth) &&
          isFragile &&
          row.laminationFactor < 0.75
        ) {
          ribbonTotalLevel = "不合格";
          unQualifiedReason =
            "1K107BW，规格为20mm/25mm/30mm/35mm/40mm/42mm/43mm/45mm/50mm，韧性为D/E级别且叠片＜0.75，不合格";
          return [ribbonTotalLevel, unQualifiedReason];
        }
      }

      /**
       * 针对1K107E：
       */

      if (row.ribbonTypeName == "1K107E") {
        // 韧性为D/E为不合格
        if (isFragile) {
          ribbonTotalLevel = "不合格";
          unQualifiedReason = "1K107E，韧性为D/E级别，不合格";
          return [ribbonTotalLevel, unQualifiedReason];
        }

        // 叠片＜0.78的带材直接判定为不合格
        if (row.laminationFactor < 0.78) {
          ribbonTotalLevel = "不合格";
          unQualifiedReason = "1K107E，叠片＜0.78，不合格";
          return [ribbonTotalLevel, unQualifiedReason];
        }
      }

      /**
       * 针对AD25/ND25/1K107A/FN-300
       */

      // 针对成分为 AD25、ND25、1K107A、FN-300的直喷带材，任意规格, 叠片＜0.75，判定为不合格；
      if (["AD25", "ND25", "1K107A", "FN-300"].includes(row.ribbonTypeName)) {
        // d＞32μm，判定为不合格;
        if (row.ribbonThickness > 32) {
          ribbonTotalLevel = "不合格";
          unQualifiedReason =
            "成分为 AD25、ND25、1K107A、FN-300的直喷带材，厚度大于32μm，不合格";
          return [ribbonTotalLevel, unQualifiedReason];
        }
        if (row.laminationFactor < 0.75) {
          ribbonTotalLevel = "不合格";
          unQualifiedReason =
            "成分为 AD25、ND25、1K107A、FN-300的直喷带材，任意规格, 叠片＜0.75，不合格";
          return [ribbonTotalLevel, unQualifiedReason];
        }
      }

      // 针对成分为 1K107O的直喷带材，任意规格:
      // 客户要求：22-28，>0.78，带偏≤2，带宽≤0.3，韧性无要求，其余判定不合格
      // 1. 厚度>28μm 或 厚度<22μm判定为不合格；
      // 2. 叠片＜0.78，判定为不合格；
      // 3. 带偏>2μm直接判定为不合格；
      // 4. 带宽>0.3mm 或 带宽 <-0.3mm，判定不合格
      if (["1K107O"].includes(row.ribbonTypeName)) {
        if (row.ribbonThickness < 22 || row.ribbonThickness > 28) {
          ribbonTotalLevel = "不合格";
          unQualifiedReason =
            "成分为1K107O的带材，带厚<22μm或者带厚>28μm，不合格";
          return [ribbonTotalLevel, unQualifiedReason];
        }
        if (row.laminationFactor < 0.78) {
          ribbonTotalLevel = "不合格";
          unQualifiedReason = "成分为1K107O的带材，叠片系数<0.78，不合格";
          return [ribbonTotalLevel, unQualifiedReason];
        }
        if (row.ribbonThicknessDeviation > 2) {
          ribbonTotalLevel = "不合格";
          unQualifiedReason = "成分为1K107O的带材，厚度偏差>2，不合格";
          return [ribbonTotalLevel, unQualifiedReason];
        }
        if (_width > 0.3 || _width < -0.3) {
          ribbonTotalLevel = "不合格";
          unQualifiedReason = "成分为1K107O的带材，宽度偏差超过0.3mm，不合格";
          return [ribbonTotalLevel, unQualifiedReason];
        }
      }

      /**
       * 针对FN-035/FN-080/FN-100/FN-200/FCNC-010/FCNC-020
       */

      // 厚度>23μm或叠片＜0.78或韧性为D/E，判定为不合格
      if (
        [
          "FN-035",
          "FN-080",
          "FN-100",
          "FN-200",
          "FCNC-010",
          "FCNC-020"
        ].includes(row.ribbonTypeName)
      ) {
        // d＞32μm，判定为不合格;
        if (row.ribbonThickness > 23) {
          ribbonTotalLevel = "不合格";
          unQualifiedReason =
            "成分为FN-035/FN-080/FN-100/FN-200/FCNC-010/FCNC-020的直喷带材，厚度大于23μm，不合格";
          return [ribbonTotalLevel, unQualifiedReason];
        }
        // 叠片＜0.78
        if (row.laminationFactor < 0.78) {
          ribbonTotalLevel = "不合格";
          unQualifiedReason =
            "成分为FN-035/FN-080/FN-100/FN-200/FCNC-010/FCNC-020的直喷带材，叠片＜0.78，不合格";
          return [ribbonTotalLevel, unQualifiedReason];
        }
        // 韧性为D/E为不合格
        if (isFragile) {
          ribbonTotalLevel = "不合格";
          unQualifiedReason =
            "成分为FN-035/FN-080/FN-100/FN-200/FCNC-010/FCNC-020的直喷带材，韧性为D/E级别，不合格";
          return [ribbonTotalLevel, unQualifiedReason];
        }
      }

      /* ~~~~~~~~~~~判定等级不全的情况~~~~~~~~~~~~~~ */
      if (
        ["", undefined, null].includes(row.ribbonThicknessLevel) ||
        ["", undefined, null].includes(row.laminationLevel) ||
        ["", undefined, null].includes(row.ribbonToughnessLevel) ||
        ["", undefined, null].includes(row.appearenceLevel)
      ) {
        return "";
      }

      /* ~~~~~~~~~~~正式计算完整的等级~~~~~~~~~~~~~~ */
      ribbonTotalLevel =
        row.ribbonThicknessLevel +
        row.laminationLevel +
        row.ribbonToughnessLevel +
        row.appearenceLevel;

      /**
       * 针对所有带材：
       * 1.1任意规格，厚度等级为2级别(23μm<d≤26μm)的带材判定修改如下：
       * 1）24μm<d≤25μm，在综合级别最后加注“S”。
       * 2）23μm<d≤24μm，在综合级别最后加注“L”。
       * 1.2任意规格，厚度等级为3级别(20μm<d≤23μm)的带材判定修改如下：
       * 1）21μm<d≤22μm，在综合级别最后加注“S”，
       * 2）20μm<d≤21μm，在综合级别最后加注“L”，
       * * 1.3 任意规格，厚度等级为4级别(18μm<d≤20μm)的带材判定修改如下：
       * 1）18μm<d≤19μm，在综合级别最后加注“G”，
       */
      if (row.ribbonThickness > 24 && row.ribbonThickness <= 25) {
        ribbonTotalLevel = ribbonTotalLevel + "S";
      }
      if (row.ribbonThickness > 23 && row.ribbonThickness <= 24) {
        ribbonTotalLevel = ribbonTotalLevel + "L";
      }

      if (row.ribbonThickness > 21 && row.ribbonThickness <= 22) {
        ribbonTotalLevel = ribbonTotalLevel + "S";
      }
      if (row.ribbonThickness > 20 && row.ribbonThickness <= 21) {
        ribbonTotalLevel = ribbonTotalLevel + "L";
      }
      if (row.ribbonThickness > 18 && row.ribbonThickness <= 19) {
        ribbonTotalLevel = ribbonTotalLevel + "G";
      }

      // 如果带材厚度偏差大于3，同时韧性为A,B,C,此带材加F
      if (
        row.ribbonThicknessDeviation > 3 &&
        ["A", "B", "C"].includes(row.ribbonToughnessLevel)
      ) {
        ribbonTotalLevel = ribbonTotalLevel + "F";
      }
      // 如果带材韧性为A/B/C，同时带材宽度超出指定标准值，正偏差为+E,负偏差为-E
      // 1. <=50mm：标准为±0.2mm
      // 2. >50mm：标准为±0.5mm
      // let _width = row.realRibbonWidth - row.ribbonWidth;
      // _width = _width.toFixed(1);
      if (row.ribbonWidth < 50) {
        if (
          Math.abs(_width) > 0.2 &&
          ["A", "B", "C"].includes(row.ribbonToughnessLevel)
        ) {
          if (_width < -0.2) {
            ribbonTotalLevel = ribbonTotalLevel + "-E";
          } else if (_width > 0.2) {
            ribbonTotalLevel = ribbonTotalLevel + "+E";
          }
        }
      } else if (row.ribbonWidth >= 50) {
        if (
          Math.abs(_width) > 0.5 &&
          ["A", "B", "C"].includes(row.ribbonToughnessLevel)
        ) {
          if (_width < -0.5) {
            ribbonTotalLevel = ribbonTotalLevel + "-E";
          } else if (_width > 0.5) {
            ribbonTotalLevel = ribbonTotalLevel + "+E";
          }
        }
      }

      /**
       * 针对1K107BW和1K107B：规格为20mm/25mm/30mm/40mm/50mm带材厚度为28μm≤d≤32μm，且叠片≥0.75的带材级别最后加“H”标识
       */

      if (["1K107BW", "1K107B"].includes(row.ribbonTypeName)) {
        if (
          [20, 25, 30, 40, 50].includes(row.ribbonWidth) &&
          row.ribbonThickness >= 28 &&
          row.ribbonThickness <= 32 &&
          row.laminationFactor >= 0.75
        ) {
          ribbonTotalLevel = ribbonTotalLevel + "H";
        }
      }

      /**
       * 针对AD25/ND25/1K107A/FN-300：带材厚度为28μm≤d≤32μm，且叠片≥0.75的带材级别最后加“H”标识
       */

      if (["AD25", "ND25", "1K107A", "FN-300"].includes(row.ribbonTypeName)) {
        if (
          [20, 25, 30, 40, 50].includes(row.ribbonWidth) &&
          row.ribbonThickness >= 28 &&
          row.ribbonThickness <= 32 &&
          row.laminationFactor >= 0.75
        ) {
          ribbonTotalLevel = ribbonTotalLevel + "H";
        }
      }

      /**
       * 判定检测去向
       * 1.德国: 1K107B, 30mm, 韧性 ABC，厚度 2/3 级别，带面等级 A/B，叠片系数>=0.78，带厚偏差<2，带宽偏差<0.2，盘径330-350
       * 2.法国: 1K107B, <50mm, 韧性 ABC，
       * 2.1 厚度 2/3 级别，带面等级 A/B，叠片系数>=0.78
       * 2.2 厚度 4 级别，叠片系数>=0.78
       * 3.信维：1K107B, >=55mm, 韧性 ABCD，厚度18-26, 叠片系数>=0.75，带面等级 A/B, C: 轻微鱼鳞纹、轻微凹心、小凹心、轻微荷叶边、轻微劈裂、粗糙的都可以给
       */
      row.clients = [];
      if (["1K107B"].includes(row.ribbonTypeName)) {
        // 德国
        if (
          [30].includes(row.ribbonWidth) &&
          ["A", "B", "C"].includes(row.ribbonToughnessLevel) &&
          ["A", "B"].includes(row.appearenceLevel) &&
          [2, 3].includes(row.ribbonThicknessLevel) &&
          row.laminationFactor >= 0.78 &&
          !ribbonTotalLevel.includes("E") &&
          !ribbonTotalLevel.includes("F") &&
          row.diameter >= 330 &&
          row.diameter <= 350
        ) {
          row.clients.push("D");
        }
        // 法国
        if (
          row.ribbonWidth < 50 &&
          ["A", "B", "C"].includes(row.ribbonToughnessLevel) &&
          row.laminationFactor >= 0.78 &&
          (([2, 3].includes(row.ribbonThicknessLevel) &&
            ["A", "B"].includes(row.appearenceLevel)) ||
            ([4].includes(row.ribbonThicknessLevel) &&
              ["A", "B", "C"].includes(row.appearenceLevel)))
        ) {
          row.clients.push("F");
        }
        // 信维 信维：1K107B, >=55mm, 韧性 ABCD，厚度18-26, 叠片系数>=0.75，带面等级 A/B, C: 轻微鱼鳞纹、轻微凹心、小凹心、轻微荷叶边、轻微劈裂、粗糙的都可以给
        if (
          row.ribbonWidth >= 55 &&
          ["A", "B", "C", "D"].includes(row.ribbonToughnessLevel) &&
          [2, 3, 4].includes(row.ribbonThicknessLevel) &&
          row.laminationFactor >= 0.75 &&
          !ribbonTotalLevel.includes("E") &&
          !ribbonTotalLevel.includes("F") &&
          ["A", "B"].includes(row.appearenceLevel)
        ) {
          row.clients.push("XW");
        }
      }

      if (row.clients.length === 0) {
        row.clients.push("GN");
      }

      return [ribbonTotalLevel, unQualifiedReason];
    },
    calcThinRibbonWeight(row) {
      if (row.ribbonThickness > 23) {
        return;
      }
      // 高叠片薄带重量 ≤23, >=0.78
      if (row.laminationFactor >= 0.78) {
        return (row.highFactorThinRibbonWeight = row.coilNetWeight);
      }
      // 薄带重量 ≤23, >=0.75
      if (row.laminationFactor >= 0.75) {
        row.thinRibbonWeight = row.coilNetWeight;
      }
    },
    calcQualityOfABCDE(row) {
      // 计算各质量等级的重量
      // A: 32**,42**,52**,62**,72**,82**,33**,43**,53**,63**,73**,83**,34**,44**,54**,64**,74**,84**
      const requireMentOfA = /^[3-8][2-4][A-E][A-C]G?([+-]E)?F?$/;
      // B: 31**,41**,51**,61**,71**,81**
      const requireMentOfB = /^[3-8]1[A-E][A-C]G?([+-]E)?F?$/;
      // C: 30**,40**,50**,60**,70**,80**
      const requireMentOfC = /^[3-8]0[A-E][A-C]G?([+-]E)?F?$/;
      // D: 21**,22**,23**,24**
      const requireMentOfD = /^2[1-4][A-E][A-C]L?([+-]E)?F?$/;
      // E: 11**,12**,13**,14**
      const requireMentOfE = /^1[1-4][A-E][A-C]([+-]E)?F?$/;
      const ribbonTotalLevel = row.ribbonTotalLevel;
      if (requireMentOfA.test(ribbonTotalLevel)) {
        row.qualityOfA = row.coilNetWeight;
      } else if (requireMentOfB.test(ribbonTotalLevel)) {
        row.qualityOfB = row.coilNetWeight;
      } else if (requireMentOfC.test(ribbonTotalLevel)) {
        row.qualityOfC = row.coilNetWeight;
      } else if (requireMentOfD.test(ribbonTotalLevel)) {
        row.qualityOfD = row.coilNetWeight;
      } else if (requireMentOfE.test(ribbonTotalLevel)) {
        row.qualityOfE = row.coilNetWeight;
      }
    },
    calcLaminationFactor(coilNetWeight, diameter, realRibbonWidth) {
      // const res =
      //   (
      //     (((coilWeight - 0.09) /
      //       (Math.PI * ((diameter * diameter) / 4 - (95 * 95) / 4) * 7.2)) *
      //       Math.pow(10, 6)) /
      //     realRibbonWidth
      //   ).toFixed(2) || 0;
      const res =
        (
          ((coilNetWeight /
            (Math.PI * ((diameter * diameter) / 4 - (95 * 95) / 4) * 7.2)) *
            Math.pow(10, 6)) /
          realRibbonWidth
        ).toFixed(2) || 0;
      return Number(res);
    },
    calcLaminationLevel(factor) {
      if (!factor) return "";
      if (factor >= 0.84) {
        return "4";
      } else if (factor >= 0.82 && factor < 0.84) {
        return "3";
      } else if (factor >= 0.8 && factor < 0.82) {
        return "2";
      } else if (factor >= 0.78 && factor < 0.8) {
        return "1";
      } else if (factor >= 0.75 && factor < 0.78) {
        return "0";
      } else if (factor >= 0.72 && factor < 0.75) {
        return "8";
      } else if (factor >= 0.68 && factor < 0.72) {
        return "9";
      } else {
        return "不合格";
      }
    },
    calcMaxDeviation(arr) {
      const _len = arr.length;
      if (_len < 9) {
        return null;
      }
      const _arr = arr.map(item => Number(item));
      const a1 = [_arr[0], _arr[1], _arr[2]];
      const a2 = [_arr[3], _arr[4], _arr[5]];
      const a3 = [_arr[6], _arr[7], _arr[8]];
      a1.sort((a, b) => {
        return a - b;
      });
      a2.sort((a, b) => {
        return a - b;
      });
      a3.sort((a, b) => {
        return a - b;
      });

      const d1 = Number((a1[2] - a1[0]).toFixed(2));
      const d2 = Number((a2[2] - a2[0]).toFixed(2));
      const d3 = Number((a3[2] - a3[0]).toFixed(2));

      const dArr = [d1, d2, d3];
      dArr.sort((a, b) => {
        return a - b;
      });
      console.log({
        a1,
        a2,
        a3,
        d1,
        d2,
        d3,
        dArr
      });
      return Number((dArr[2] - dArr[0]).toFixed(2));
    },
    calcribbonThicknessLevel(thickness) {
      if (!thickness) {
        return;
      }
      if (thickness > 26) {
        return 1;
      } else if (thickness > 23 && thickness <= 26) {
        return 2;
      } else if (thickness > 20 && thickness <= 23) {
        return 3;
      } else if (thickness > 18 && thickness <= 20) {
        return 4;
      } else if (thickness > 16 && thickness <= 18) {
        return 5;
      } else if (thickness > 14 && thickness <= 16) {
        return 6;
      } else if (thickness > 12 && thickness <= 14) {
        return 7;
      } else if (thickness <= 12) {
        return 8;
      }
    },
    setStoredType(row) {
      let inPlanFlag = true;
      // let outPlanFlag = true;
      // 计划内：厚度
      const ribbonThickness = row.ribbonThickness;
      const orderThickness = row.orderThickness;
      if (orderThickness.indexOf("≤") > -1) {
        // ≤23
        const maxThickness = parseInt(orderThickness.substr(1));
        if (ribbonThickness > maxThickness) {
          // 厚度不符合符合计划内入库的要求
          inPlanFlag = false;
        }
      } else if (orderThickness.indexOf("-") > -1) {
        const maxThickness = orderThickness.split("-")[1];
        const minThickness = orderThickness.split("-")[0];
        if (ribbonThickness < minThickness || ribbonThickness > maxThickness) {
          inPlanFlag = false;
        }
      }
      // 计划内：叠片
      const laminationFactor = row.laminationFactor;
      const orderLaminationFactor = row.orderLaminationFactor;
      if (orderLaminationFactor.indexOf("≥") > -1) {
        // ≥0.78
        const minLaminationFactor = parseInt(orderLaminationFactor.substr(1));
        if (laminationFactor < minLaminationFactor) {
          // 叠片不符合符合计划内入库的要求
          inPlanFlag = false;
        }
      } else if (orderLaminationFactor.indexOf("-") > -1) {
        const maxLaminationFactor = orderLaminationFactor.split("-")[1];
        const minLaminationFactor = orderLaminationFactor.split("-")[0];
        if (
          laminationFactor < minLaminationFactor ||
          laminationFactor > maxLaminationFactor
        ) {
          inPlanFlag = false;
        }
      }
      // 计划内：韧性
      const ribbonToughnessLevel = row.ribbonToughnessLevel;
      const orderRibbonToughnessLevels = row.orderRibbonToughnessLevels.split(
        ","
      );
      if (!orderRibbonToughnessLevels.includes(ribbonToughnessLevel)) {
        inPlanFlag = false;
      }
      // 计划内：外观
      const appearenceLevel = row.appearenceLevel;
      const orderAppearenceLevels = row.orderAppearenceLevels.split(",");
      if (!orderAppearenceLevels.includes(appearenceLevel)) {
        inPlanFlag = false;
      }

      if (inPlanFlag) {
        return 1;
      }

      // // 计划外：厚度
      // const qualifiedThickness = row.qualifiedThickness;
      // if (qualifiedThickness.indexOf('≤') > -1) { // ≤23
      //   const maxThickness = parseInt(qualifiedThickness.substr(1));
      //   if (ribbonThickness > maxThickness) {
      //     // 厚度不符合符合计划外入库的要求
      //     outPlanFlag = false;
      //   }
      // } else if (qualifiedThickness.indexOf('-') > -1) {
      //   const maxThickness = qualifiedThickness.split('-')[1];
      //   const minThickness = qualifiedThickness.split('-')[0];
      //   if (ribbonThickness < minThickness || ribbonThickness > maxThickness) {
      //     outPlanFlag = false;
      //   }
      // }
      // // 计划外：叠片
      // const qualifiedLaminationFactor = row.qualifiedLaminationFactor;
      // if (qualifiedLaminationFactor.indexOf('≥') > -1) { // ≥0.78
      //   const minLaminationFactor = parseInt(qualifiedLaminationFactor.substr(1));
      //   if (laminationFactor < minLaminationFactor) {
      //     // 叠片不符合符合计划外入库的要求
      //     outPlanFlag = false;
      //   }
      // } else if (qualifiedLaminationFactor.indexOf('-') > -1) {
      //   const maxLaminationFactor = qualifiedLaminationFactor.split('-')[1];
      //   const minLaminationFactor = qualifiedLaminationFactor.split('-')[0];
      //   if (laminationFactor < minLaminationFactor || laminationFactor > maxLaminationFactor) {
      //     outPlanFlag = false;
      //   }
      // }
      // // 计划外：韧性
      // const qualifiedRibbonToughnessLevels = row.qualifiedRibbonToughnessLevels.split(',');
      // if (!qualifiedRibbonToughnessLevels.includes(ribbonToughnessLevel)) {
      //   outPlanFlag = false;
      // }
      // // 计划外：外观
      // const qualifiedAppearenceLevels = row.qualifiedAppearenceLevels.split(',');
      // if (!qualifiedAppearenceLevels.includes(appearenceLevel)) {
      //   outPlanFlag = false;
      // }

      const qualifiedDemands = JSON.parse(row.qualifiedDemands) || [];
      for (const item of qualifiedDemands) {
        let outPlanFlag = true;
        // 计划外：厚度
        const qualifiedThickness = item.qualifiedThickness;
        if (qualifiedThickness.indexOf("≤") > -1) {
          // ≤23
          const maxThickness = parseInt(qualifiedThickness.substr(1));
          if (ribbonThickness > maxThickness) {
            // 厚度不符合符合计划外入库的要求
            outPlanFlag = false;
          }
        } else if (qualifiedThickness.indexOf("-") > -1) {
          const maxThickness = qualifiedThickness.split("-")[1];
          const minThickness = qualifiedThickness.split("-")[0];
          if (
            ribbonThickness < minThickness ||
            ribbonThickness > maxThickness
          ) {
            // 厚度不符合符合计划外入库的要求
            outPlanFlag = false;
          }
        }
        // 计划外：叠片
        const qualifiedLaminationFactor = item.qualifiedLaminationFactor;
        if (qualifiedLaminationFactor.indexOf("≥") > -1) {
          // ≥0.78
          const minLaminationFactor = parseInt(
            qualifiedLaminationFactor.substr(1)
          );
          if (laminationFactor < minLaminationFactor) {
            // 叠片不符合符合计划外入库的要求
            outPlanFlag = false;
          }
        } else if (qualifiedLaminationFactor.indexOf("-") > -1) {
          const maxLaminationFactor = qualifiedLaminationFactor.split("-")[1];
          const minLaminationFactor = qualifiedLaminationFactor.split("-")[0];
          if (
            laminationFactor < minLaminationFactor ||
            laminationFactor > maxLaminationFactor
          ) {
            // 叠片不符合符合计划外入库的要求
            outPlanFlag = false;
          }
        }
        // 计划外：韧性
        const qualifiedRibbonToughnessLevels =
          item.qualifiedRibbonToughnessLevels;
        if (!qualifiedRibbonToughnessLevels.includes(ribbonToughnessLevel)) {
          // 韧性不符合符合计划外入库的要求
          outPlanFlag = false;
        }
        // 计划外：外观
        const qualifiedAppearenceLevels = item.qualifiedAppearenceLevels;
        if (!qualifiedAppearenceLevels.includes(appearenceLevel)) {
          // 外观不符合符合计划外入库的要求
          outPlanFlag = false;
        }

        if (outPlanFlag) {
          return 2;
        }
      }

      return 3;
    },
    exportExcel() {
      const params = {
        castId: this.castId,
        startTime: this.searchForm.date[0],
        endTime: this.searchForm.date[1],
        startMeasureTime: this.searchForm.measureDate[0],
        endMeasureTime: this.searchForm.measureDate[1],
        furnaceJson: JSON.stringify(this.searchForm.furnaces)
        // caster: this.searchForm.caster,
        // furnace: this.searchForm.furnace,
        // ribbonTypeNameJson: JSON.stringify(this.searchForm.ribbonTypeNames),
        // ribbonWidthJson: JSON.stringify(this.searchForm.ribbonWidths),
        // ribbonThicknessLevelJson: JSON.stringify(
        //   this.searchForm.ribbonThicknessLevels
        // ),
        // laminationLevelJson: JSON.stringify(this.searchForm.laminationLevels),
        // ribbonToughnessLevelJson: JSON.stringify(
        //   this.searchForm.ribbonToughnessLevels
        // ),
        // appearenceLevelJson: JSON.stringify(this.searchForm.appearenceLevels)
      };
      if (!params.startTime && !params.startMeasureTime) {
        return this.$message({
          message: "请选择生产日期或者检测日期",
          type: "error"
        });
      }
      const url = `${urlmap.exportMeasure}?${qs.stringify(params)}`;
      window.open(url);
    },
    setSelectable(row, index) {
      // 合格并且已经检测过了的，才可以被选中来入库
      if ([1, 2].includes(row.isStored) && !row.isMeasureConfirmed) {
        return true;
      } else {
        return false;
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    measureConfirm() {
      // this.applyInStoreModalVisible = true;
      const selectionList = cloneDeep(this.multipleSelection);
      if (selectionList.length === 0) {
        return this.$alert("请选择要入库的带材", "提示", { type: "warning" });
      }
      if (
        selectionList.some(item => !item.clients || item.clients.length === 0)
      ) {
        return this.$alert(
          "申请入库的带材没有填写检测去向，请检查后再提交",
          "提示",
          { type: "warning" }
        );
      }
      selectionList.forEach(row => {
        row.isMeasureConfirmed = 1; // 1-检测确认申请入库，0-还没有确认
        row.clients = row.clients.join();
        row.appearence = row.appearence.join();
      });
      // 发送请求，更新当前的数据
      this.$http("POST", urlmap.measureConfirm, {
        dataJson: JSON.stringify(selectionList)
      })
        .then(data => {
          this.getTableData();
        })
        .catch(error => {
          console.log(error);
        });
    },
    uploadExcelHandler() {
      this.uploadExcelForm.visible = true;
      this.uploadExcelForm.fileList = [];
    },
    closeUploadDialog() {
      this.uploadExcelForm.visible = false;
    },
    submitUploadForm() {
      // if (this.uploadExcelForm.fileList.length === 0) {
      //   return this.$message({
      //   message: '请选择excel表格',
      //   type: "warning"
      // });
      // }
      this.$refs.upload.submit();
      this.uploadExcelForm.visible = false;
      const params = {
        current: 1
      };
      this.pageConfig.current = 1;
      this.getTableData(params);
    },
    uploadErrorHanler(error, file, fileList) {
      this.$message({
        message: `上传失败：${error.message}`,
        type: "error"
      });
    },
    uploadSuccessHanler(res, file, fileList) {
      if (res.status === 0) {
        this.$message({
          message: res.message,
          type: "success"
        });
      } else {
        let html = "";
        res.data.forEach(item => {
          html += `<p>炉号：${item.furnace}，盘号：${item.coilNumber}</p>`;
        });
        this.$alert(html, "以下带材更新检测数据失败：", {
          dangerouslyUseHTMLString: true,
          type: "warning"
        });
      }
      const params = {
        current: 1
      };
      this.pageConfig.current = 1;
      this.getTableData(params);
    }
  }
};
</script>
<style lang="scss" scoped>
.popover_table {
  text-align: center;
  th,
  td {
    border-bottom: 1px solid #dcdfe6;
  }
  td {
    padding: 5px 8px;
  }
}
.upload {
  height: 100px;
}
</style>
