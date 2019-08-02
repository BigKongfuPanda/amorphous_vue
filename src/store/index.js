import Vue from 'vue';
import Vuex from 'vuex';
import { http } from '@/utils/http';
import urlmap from '@/utils/urlmap';

Vue.use(Vuex);

export default new Vuex.Store({
  strict: true,
  state: {
    ribbonTypeList: [], // 带材牌号列表
    ribbonWidthList: [], // 带材规格列表
    ribbonThicknessLevelList: [], // 带材厚度级别列表
    laminationLevelList: [], // 带材叠片级别列表
    ribbonToughnessLevelList: [], // 带材韧性级别列表
    clientsList: [], //客户列表
    appearenceList: [] //外观列表
  },
  mutations: {
    // 获取带材牌号列表
    SET_RIBBONTYPELIST(state, list) {
      state.ribbonTypeList = list;
    },
    // 获取带材规格列表
    SET_RIBBONWIDTHLIST(state, list) {
      state.ribbonWidthList = list;
    },
    // 获取带材厚度级别列表
    SET_RIBBONTHICKNESSLEVELLIST(state, list) {
      state.ribbonThicknessLevelList = list;
    },
    // 获取带材叠片级别列表
    SET_LAMINATIONLEVELLIST(state, list) {
      state.laminationLevelList = list;
    },
    // 获取带材韧性级别列表
    SET_RIBBONTOUGHNESSLEVELLIST(state, list) {
      state.ribbonToughnessLevelList = list;
    },
    // 获取客户列表
    SET_CLIENTSLIST(state, list) {
      state.clientsList = list;
    },
    // 获取带材外观级别列表
    SET_APPERENCELEVELLIST(state, list) {
      state.appearenceList = list;
    },
  },
  actions: {
    // 获取带材牌号列表
    getRibbonTypeList({ commit }) {
      http('get', urlmap.queryRibbonType).then(data => {
        // data.list && data.list.forEach((item, i) => {
        //   item.ribbonTypeId = i + 1;
        // });
        commit('SET_RIBBONTYPELIST', data.list);
      }).catch(err => {
        console.log(err);
      });
    },
    // 获取带材规格列表
    getRibbonWidthList({ commit }) {
      http('get', urlmap.queryRibbonWidth).then(data => {
        // data.list && data.list.forEach(item => {
        //   item.ribbonWidthId = i + 1;
        // });
        commit('SET_RIBBONWIDTHLIST', data.list);
      }).catch(err => {
        console.log(err);
      });
    },
    // 获取带材厚度级别列表
    getRibbonThicknessLevelList({ commit }) {
      http('get', urlmap.queryRibbonThicknessLevel).then(data => {
        // data.list && data.list.forEach(item => {
        //   item.ribbonThicknessLevelId = i + 1;
        // });
        commit('SET_RIBBONTHICKNESSLEVELLIST', data.list);
      }).catch(err => {
        console.log(err);
      });
    },
    // 获取带材叠片级别列表
    getLaminationLevelList({ commit }) {
      http('get', urlmap.queryLaminationLevel).then(data => {
        // data.list && data.list.forEach(item => {
        //   item.laminationLevelId = i + 1;
        // });
        commit('SET_LAMINATIONLEVELLIST', data.list);
      }).catch(err => {
        console.log(err);
      });
    },
    // 获取带材韧性级别列表
    getRibbonToughnessLevelList({ commit }) {
      http('get', urlmap.queryRibbonToughnessLevel).then(data => {
        // data.list && data.list.forEach(item => {
        //   item.ribbonToughnessLevelId = i + 1;
        // });
        commit('SET_RIBBONTOUGHNESSLEVELLIST', data.list);
      }).catch(err => {
        console.log(err);
      });
    },
    // 获取带材韧性级别列表
    getAppearenceLevelList({ commit }) {
      http('get', urlmap.queryAppearenceLevel).then(data => {
        commit('SET_APPERENCELEVELLIST', data.list);
      }).catch(err => {
        console.log(err);
      });
    },
    // 获取客户列表
    getClientsList({ commit }) {
      http('get', urlmap.queryClients).then(data => {
        commit('SET_CLIENTSLIST', data.list);
      }).catch(err => {
        console.log(err);
      });
    }
  }
});