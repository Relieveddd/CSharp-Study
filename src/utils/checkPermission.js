export default {
  computed: {
    buttonHash() {
      return this.$store.state.buttonPermission;
    }
  },
  methods: {
    checkButton(code = "", pageName = "") {
      let page = this.$options.name || pageName;
      if (!code || !page) return false;
      let list = this.buttonHash[page];
      if (!list) return false;
      return list.includes(code);
    }
  }
};
