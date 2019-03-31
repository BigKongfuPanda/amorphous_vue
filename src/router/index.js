import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Layout from '@/pages/layout.vue';
import Login from '@/pages/login.vue';
import Plan from '@/pages/plan/plan.vue';
import Melt from '@/pages/melt/melt.vue';
import Cast from '@/pages/cast/cast.vue';
import RibbonType from '@/pages/ribbonType/ribbonType.vue';
import RibbonWidth from '@/pages/ribbonWidth/ribbonWidth.vue';
import RibbonThicknessLevel from '@/pages/ribbonThicknessLevel/ribbonThicknessLevel.vue';
import RibbonToughnessLevel from '@/pages/ribbonToughnessLevel/ribbonToughnessLevel.vue';
import LaminationLevel from '@/pages/laminationLevel/laminationLevel.vue';
import User from '@/pages/user/user.vue';
import Roll from '@/pages/roll/roll.vue';
import Measure from '@/pages/measure/measure.vue';
import Storage from '@/pages/storage/storage.vue';
import StorageTotal from '@/pages/storage/storageTotal.vue';
import StatisticsOfRatio from '@/pages/statistics/statisticsOfRatio.vue';
import StatisticsQuality from '@/pages/statistics/statisticsQuality.vue';
import StatisticsOder from '@/pages/statistics/statisticsOder.vue';
import ReturnTreatment from '@/pages/return/returnTreatment.vue';
import ReturnRecord from '@/pages/return/returnRecord.vue';

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/',
      component: Layout,
      redirect: '/login',
      children: [
        {
          path: 'plan/:castId',
          name: 'plan',
          component: Plan,
          meta: { title: '生产计划', icon: 'plan' }
        },
        {
          path: 'melt/:castId',
          name: 'melt',
          component: Melt,
          meta: { title: '化钢记录表', icon: 'melt' }
        },
        {
          path: 'cast/:castId',
          name: 'cast',
          component: Cast,
          meta: { title: '喷带记录表', icon: 'cast' }
        },
        {
          path: 'ribbonType',
          name: 'ribbonType',
          component: RibbonType,
          meta: { title: '带材牌号管理', icon: 'ribbonType' }
        },
        {
          path: 'ribbonWidth',
          name: 'ribbonWidth',
          component: RibbonWidth,
          meta: { title: '带材规格管理', icon: 'ribbonWidth' }
        },
        {
          path: 'ribbonThicknessLevel',
          name: 'ribbonThicknessLevel',
          component: RibbonThicknessLevel,
          meta: { title: '带材厚度等级管理', icon: 'ribbonThicknessLevel' }
        },
        {
          path: 'ribbonToughnessLevel',
          name: 'ribbonToughnessLevel',
          component: RibbonToughnessLevel,
          meta: { title: '带材韧性等级管理', icon: 'ribbonToughnessLevel' }
        },
        {
          path: 'laminationLevel',
          name: 'laminationLevel',
          component: LaminationLevel,
          meta: { title: '带材叠片等级管理', icon: 'laminationLevel' }
        },
        {
          path: 'user',
          name: 'user',
          component: User,
          meta: { title: '用户管理', icon: 'user' }
        },
        {
          path: 'roll/:castId',
          name: 'roll',
          component: Roll,
          meta: { title: '重卷记录表', icon: 'roll' }
        },
        {
          path: 'measure/:castId',
          name: 'measure',
          component: Measure,
          meta: { title: '检测记录表', icon: 'measure' }
        },
        {
          path: 'storage/:castId',
          name: 'storage',
          component: Storage,
          meta: { title: '库房记录表', icon: 'storage' }
        },
        {
          path: 'storageTotal',
          name: 'storageTotal',
          component: StorageTotal,
          meta: { title: '库房总表', icon: 'storageTotal' }
        },
        {
          path: 'statisticsOfRatio',
          name: 'statisticsOfRatio',
          component: StatisticsOfRatio,
          meta: { title: '喷带手生产统计表', icon: 'statisticsOfRatio' }
        },
        {
          path: 'statisticsQuality',
          name: 'statisticsQuality',
          component: StatisticsQuality,
          meta: { title: '带材质量统计表', icon: 'statisticsQuality' }
        },
        {
          path: 'statisticsOder',
          name: 'statisticsOder',
          component: StatisticsOder,
          meta: { title: '订单统计表', icon: 'statisticsOder' }
        },
        {
          path: 'returnTreatment',
          name: 'returnTreatment',
          component: ReturnTreatment,
          meta: { title: '退货操作', icon: 'returnTreatment' }
        },
        {
          path: 'returnRecord',
          name: 'returnRecord',
          component: ReturnRecord,
          meta: { title: '退货记录', icon: 'returnRecord' }
        }
      ]
    }
  ]
})
