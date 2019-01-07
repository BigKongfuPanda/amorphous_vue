import Vue from 'vue';
import Vuex from 'vuex';
import { http } from '@/utils/http';
import urlmap from '@/utils/urlmap';

Vue.use(Vuex);

export default new Vuex.Store({
  strict: true,
  state: {
    ribbonTypeList: [] // 带材牌号列表
  },
  mutations: {
    // 获取带材牌号列表
    GET_RIBBONTYPELIST(state, list) {
      state.ribbonTypeList = list;
    }
  },
  actions: {
    // 获取带材牌号列表
    getRibbonTypeList({ commit }) {
      http('get', urlmap.queryRibbonType).then(data => {
        data.list && data.list.forEach(item => {
          item.ribbonTypeId = item._id;
        });
        commit('GET_RIBBONTYPELIST', data.list);
      }).catch(err => {
        console.log(err);
      });
    }
  }
});