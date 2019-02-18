import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

function _import (path) {
  return () => import(`@/pages/${path}.vue`);
}

import Layout from '@/pages/layout.vue';
import Login from '@/pages/login.vue';
import Plan from '@/pages/plan/plan.vue';
import Melt from '@/pages/melt/melt.vue';
import Cast from '@/pages/cast/cast.vue';
import RibbonType from '@/pages/ribbonType/ribbonType.vue';
import RibbonWidth from '@/pages/ribbonWidth/ribbonWidth.vue';
import RibbonThicknessLevel from '@/pages/ribbonThicknessLevel/ribbonThicknessLevel.vue';
import LaminationLevel from '@/pages/laminationLevel/laminationLevel.vue';
import User from '@/pages/user/user.vue';
import Roll from '@/pages/roll/roll.vue';
import Measure from '@/pages/measure/measure.vue';
import Storage from '@/pages/storage/storage.vue';
import StatisticsWeiht from '@/pages/statisticsWeiht/statisticsWeiht.vue';
import StatisticsStorage from '@/pages/statisticsStorage/statisticsStorage.vue';
import StatisticsOder from '@/pages/statisticsOder/statisticsOder.vue';

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
          path: '/data',
          redirect: '/data/statisticsWeiht',
          meta: { title: '统计中心', icon: 'data' },
          children: [
            {
              path: 'statisticsWeiht',
              name: 'statisticsWeiht',
              component: StatisticsWeiht,
              meta: { title: '大盘毛重统计表', icon: 'statisticsWeiht' }
            },
            {
              path: 'statisticsStorage',
              name: 'statisticsStorage',
              component: StatisticsStorage,
              meta: { title: '带材库存统计表', icon: 'statisticsStorage' }
            },
            {
              path: 'statisticsOder',
              name: 'statisticsOder',
              component: StatisticsOder,
              meta: { title: '订单统计表', icon: 'statisticsOder' }
            }
          ]
        }
      ]
    }
  ]
})
