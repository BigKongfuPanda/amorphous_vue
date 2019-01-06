import Vue from 'vue';
import Vuex from 'vuex';
import { http } from '@/utils/http';
import urlmap from '@/utils/urlmap';
import { resolve } from 'path';
import { rejects } from 'assert';

Vue.use(Vuex);

export default new Vuex.Store({
  strict: true,
  state: {
    ribbonTypeList: []
  },
  mutations: {
    GET_RIBBONTYPELIST(state, list) {
      state.ribbonTypeList = list;
    }
  },
  actions: {
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