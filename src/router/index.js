import Vue from "vue";
import Router from "vue-router";
import routes from "./routes";
import store from "@/store";
import { Loading } from "element-ui";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach(async (to, from, next) => {
  if (to.meta.requireAuthorization === false) {
    return next();
  }
  if (store.state.user.token) {
		console.log(777, store.state.user.token, to.meta.requirePermissionCheck );
    if (to.meta.requirePermissionCheck === false) {
      return next();
    }
		console.log(777, store.state.user.token);
    if (!store.state.permissionStatus) {
      let loadingInstance = Loading.service()
      try {
				
        await store.dispatch("getPermission");
      } catch (error) {
        next({
          replace: true,
          name: "login"
        });
      } finally {
        loadingInstance.close();
      }
    }
    if (!store.state.SysConfig.SysConfigStatus) {
      // let loadingInstance = Loading.service()
      try {
        await store.dispatch("getSysConfig");
      } catch (error) {
        // next({
        //   replace: true,
        //   name: "login"
        // });
      } finally {
        // loadingInstance.close();
      }
    }
    if (store.state.menuPermission.includes(to.name)) {
      return next();
    } else {
      return next({
        name: "404"
      });
    }
  }

  if (from.meta.requireAuthorization === false) {
    return next(false);
  }

  next({
    name: "login"
  });
});

router.afterEach(to => {
  if (to.path.match(/^\/dashboard/) && !to.meta.isPin) {
    store.commit("tabView/addTab", {
      tab: to
    });
  }
});

export default router;
