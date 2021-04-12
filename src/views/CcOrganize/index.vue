<!-- 组织机构 -->

<template>
  <component :is="radio" ref="page" :query="query">
    <template v-slot:action-left="slotProps">
      <div :class="$style['action-left']">
        <el-radio-group v-model="radio">
          <el-radio-button
            v-for="(item, index) in radioList"
            :key="index"
            :label="item.value"
            >{{ item.label }}</el-radio-button
          >
        </el-radio-group>
        <el-input
          v-if="radio !== 'department'"
          placeholder="关键词搜索"
          v-model="query.keyword"
          @keyup.enter.native="slotProps.onQuery"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="slotProps.onQuery"
          ></el-button>
        </el-input>
      </div>
    </template>
  </component>
</template>

<script>
import department from "./department";
import job from "./job";
import position from "./position";
import role from "./role";

export default {
  name: "companyStructure",
  components: {
    department,
    job,
    position,
    role
  },
  data() {
    return {
      radio: "department",
      radioList: [
        {
          label: "部门管理",
          value: "department"
        },
        {
          label: "岗位管理",
          value: "job"
        },
        {
          label: "职务管理",
          value: "position"
        },
        {
          label: "角色管理",
          value: "role"
        }
      ],
      query: {
        keyword: ""
      }
    };
  },
  methods: {
    onQuery() {
      this.$refs.page.onQuery(this.query.keyword);
    }
  }
};
</script>

<style lang="scss" module>
.action-left {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-column-gap: 16px;
}
</style>
