import dayjs from "dayjs";

const install = function(Vue) {
  Vue.filter("number", function(value) {
    if (!value) {
      return "";
    } else {
      return Number(value);
    }
  });

  Vue.filter("date", function(value, format) {
    if (!value) return "";

    return dayjs(value).format(format);
  });
};

export default {
  install
};
