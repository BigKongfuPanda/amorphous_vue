import Vue from "vue";
import Vuex from "vuex";
import { http } from "@/utils/http";
import urlmap from "@/utils/urlmap";

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
    rollerList: [], // 重卷人员列表
    appearenceList: [], //外观列表
    linerWeightList: [] //内衬重量列表
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
    // 获取重卷人员列表
    SET_ROLLERLIST(state, list) {
      state.rollerList = list;
    },
    // 获取内衬重量列表
    SET_LINERWEIGHTLIST(state, list) {
      state.linerWeightList = list;
    }
  },
  actions: {
    // 获取带材牌号列表
    getRibbonTypeList({ commit }) {
      http("get", urlmap.queryRibbonType)
        .then(data => {
          commit("SET_RIBBONTYPELIST", data.list);
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 获取带材规格列表
    getRibbonWidthList({ commit }) {
      http("get", urlmap.queryRibbonWidth)
        .then(data => {
          commit("SET_RIBBONWIDTHLIST", data.list);
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 获取带材厚度级别列表
    getRibbonThicknessLevelList({ commit }) {
      http("get", urlmap.queryRibbonThicknessLevel)
        .then(data => {
          commit("SET_RIBBONTHICKNESSLEVELLIST", data.list);
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 获取带材叠片级别列表
    getLaminationLevelList({ commit }) {
      http("get", urlmap.queryLaminationLevel)
        .then(data => {
          commit("SET_LAMINATIONLEVELLIST", data.list);
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 获取带材韧性级别列表
    getRibbonToughnessLevelList({ commit }) {
      http("get", urlmap.queryRibbonToughnessLevel)
        .then(data => {
          commit("SET_RIBBONTOUGHNESSLEVELLIST", data.list);
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 获取带材韧性级别列表
    getAppearenceLevelList({ commit }) {
      http("get", urlmap.queryAppearenceLevel)
        .then(data => {
          commit("SET_APPERENCELEVELLIST", data.list);
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 获取客户列表
    getClientsList({ commit }) {
      http("get", urlmap.queryClients)
        .then(data => {
          commit("SET_CLIENTSLIST", data.list);
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 获取重卷人员列表
    getRollerList({ commit }) {
      http("get", urlmap.queryRoller)
        .then(data => {
          commit("SET_ROLLERLIST", data.list);
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 获取内衬重量列表
    getLinerWeightList({ commit }) {
      http("get", urlmap.queryLinerWeight)
        .then(data => {
          commit("SET_LINERWEIGHTLIST", data.list);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
});
