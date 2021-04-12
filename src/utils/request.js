import axios from "axios";
import store from "@/store";
import { Message } from "element-ui";
import router from "@/router";

const request = axios.create({
  baseURL: process.env.VUE_APP_API_BASEURL
});

request.interceptors.request.use(
  function(config) {
    let token = store.state.user.token;

    if (token) {
      config.headers["Authorization"] = token;
    }
    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);

request.interceptors.response.use(
  function(response) {
    if (response.data.errcode || response.data.code >= 300) {
      Message({
        showClose: true,
        dangerouslyUseHTMLString: false,
        message:
          response.data.errmsg ||
          response.data.mes ||
          response.data.messages ||
          "网络错误",
        type: "error"
      });
      return Promise.reject(response);
    } else {
      return response;
    }
  },
  function(error) {
    if (error.response && error.response.status === 401) {
      router.replace({
        name: "login"
      });
      store.dispatch("user/reset");
      store.dispatch("tabView/reset");
      store.dispatch("reset");
      store.commit('login/set', {logonInvalidation: true})
      
      
      // Message({
      //   showClose: true,
      //   dangerouslyUseHTMLString: false,
      //   message: "授权过期，请重新登录",
      //   type: "error"
      // });

//       store.dispatch("user/reset");
//       store.dispatch("tabView/reset");
//       store.dispatch("reset");
// 
//       router.replace({
//         name: "login"
//       });
    } else {
      Message({
        showClose: true,
        dangerouslyUseHTMLString: false,
        type: "error",
        message:
          error.response && error.response.data
            ? error.response.data.title ||
              error.response.data.error_description ||
              "网络错误"
            : "网络错误"
      });
    }
    return Promise.reject(error);
  }
);

export { request };
export default request;
