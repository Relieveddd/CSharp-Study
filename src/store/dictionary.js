import request from "@/utils/request";
import { fromPairs as fromEntries } from "lodash";

export default {
  namespaced: true,
  state: {
    detailList: []
  },
  getters: {
    detailIdToName(state) {
      return fromEntries(
        state.detailList.map(x => {
          return [x.F_ItemId, x.F_ItemName];
        })
      );
    }
  },
  mutations: {
    set(state, payload) {
      Object.assign(state, payload);
    }
  },
  actions: {
    async getDetailList(context) {
      let res = await request({
        url: "/HR/DataItemDetail/List",
        method: "post",
        data: {
          pageIndex: 1,
          pageSize: 9999
        }
      });

      context.commit("set", {
        detailList: res.data.data
      });
    }
  }
};
