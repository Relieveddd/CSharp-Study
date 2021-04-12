<template>
  <div>
    <el-form label-width="7em" size="mini" :disabled="preview">
      <div :class="$style['form']">
        <el-form-item
          label="编号"
        >
          <el-input v-model="form.number"></el-input>
        </el-form-item>
        <el-form-item
          label="姓名"
          required
          :error="$v.form.name.$error ? '必填' : ''"
        >
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item
          label="性别"
          required
          :error="$v.form.sexType.$error ? '必填' : ''"
        >
          <el-select
            style="width:100%"
            v-model="form.sexType"
            placeholder="请选择"
          >
            <el-option label="男" value="男"></el-option>
            <el-option label="女" value="女"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="籍贯"
          required
          :error="$v.form.birthplaceType.$error ? '必填' : ''"
        >
          <el-cascader
            v-model="form.birthplaceType"
            :options="pc"
            :props="{ value: 'name', label: 'name' }"
          ></el-cascader>
        </el-form-item>
        <el-form-item
          label="民族"
          required
          :error="$v.form.nationalityType.$error ? '必填' : ''"
        >
          <el-select
            style="width:100%"
            v-model="form.nationalityType"
            placeholder="请选择"
            value-key="F_ItemDetailId"
            filterable
          >
            <el-option
              v-for="(item, index) in nationalList"
              :key="index"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="文化程度"
          required
          :error="$v.form.educationType.$error ? '必填' : ''"
        >
          <el-select
            style="width:100%"
            v-model="form.educationType"
            placeholder="请选择"
            value-key="F_ItemDetailId"
          >
            <el-option
              v-for="(item, index) in dictionaryData.whcd"
              :key="index"
              :label="item.F_ItemName"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="身份证号"
          required
          :error="$v.form.idcard.$error ? '必填,请输入正确的身份证号码' : ''"
        >
          <el-input
            v-model="form.idcard"
            @change="readBirthday"
            @blur="$v.form.idcard.$touch()"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="手机号"
          required
          :error="$v.form.phoneNumber.$error ? '必填' : ''"
        >
          <el-input v-model="form.phoneNumber"></el-input>
        </el-form-item>
        <el-form-item label="现住地址">
          <el-input v-model="form.address"></el-input>
        </el-form-item>
        <el-form-item label="户籍地址">
          <el-input v-model="form.residenceAddress"></el-input>
        </el-form-item>
        <el-form-item
          label="出生日期"
          required
          :error="$v.form.birthday.$error ? '必填' : ''"
        >
          <el-date-picker
            style="width:100%"
            v-model="form.birthday"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          label="户口类型"
          required
          :error="$v.form.accountType.$error ? '必填' : ''"
        >
          <el-select
            style="width:100%"
            v-model="form.accountType"
            placeholder="请选择"
            value-key="F_ItemDetailId"
          >
            <el-option
              v-for="(item, index) in dictionaryData.hklx"
              :key="index"
              :label="item.F_ItemName"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="婚姻状况">
          <el-select
            style="width:100%"
            v-model="form.marriageType"
            placeholder="请选择"
            value-key="F_ItemDetailId"
          >
            <el-option
              v-for="(item, index) in dictionaryData.hyzk"
              :key="index"
              :label="item.F_ItemName"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="子女人数">
          <div style="display:flex;justify-content:space-between;">
            <el-input style="width:calc(50% - 8px)" v-model="form.boyNumber">
              <template slot="suffix"
                >子</template
              >
            </el-input>
            <el-input style="width:calc(50% - 8px)" v-model="form.girlNumber">
              <template slot="suffix"
                >女</template
              >
            </el-input>
          </div>
        </el-form-item>
        <el-form-item label="政治面貌">
          <el-select
            style="width:100%"
            v-model="form.politicalType"
            placeholder="请选择"
            value-key="F_ItemDetailId"
          >
            <el-option
              v-for="(item, index) in dictionaryData.zzmm"
              :key="index"
              :label="item.F_ItemName"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="技能特长">
          <el-select
            style="width:100%"
            v-model="form.skillList"
            placeholder="请选择"
            value-key="F_ItemDetailId"
            multiple
          >
            <el-option
              v-for="(item, index) in dictionaryData.jntc"
              :key="index"
              :label="item.F_ItemName"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="身高cm"
        >
          <el-input v-model="form.high"></el-input>
        </el-form-item>

        <el-form-item
          label="头围cm"
        >
          <el-input v-model="form.headLength"></el-input>
        </el-form-item>
        <el-form-item
          label="脚长cm"
        >
          <el-input v-model="form.legLength"></el-input>
        </el-form-item>
        <el-form-item
          label="三围cm"
        >
          <div style="display:flex;justify-content:space-between;">
            <el-input style="width:calc(100% / 3 - 4px)" v-model="form.bust">
              <template slot="suffix"
                >胸</template
              ></el-input
            >
            <el-input style="width:calc(100% / 3 - 4px)" v-model="form.waist"
              ><template slot="suffix"
                >腰</template
              ></el-input
            >
            <el-input style="width:calc(100% / 3 - 4px)" v-model="form.hip"
              ><template slot="suffix"
                >臀</template
              ></el-input
            >
          </div>
        </el-form-item>
        <el-form-item label="体重kg">
          <el-input v-model="form.weight"></el-input>
        </el-form-item>
      </div>
      <div :class="$style['divider']"></div>
      <div :class="$style['form']">
        <el-form-item
          label="人员类别"
          required
          :error="$v.form.type.$error ? '必填' : ''"
        >
          <el-select
            style="width:100%"
            v-model="form.type"
            placeholder="请选择"
            value-key="F_ItemDetailId"
          >
            <el-option
              v-for="(item, index) in dictionaryData.rylb"
              :key="index"
              :label="item.F_ItemName"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="部门"
          required
          :error="$v.form.departmentId.$error ? '必填' : ''"
        >
          <el-cascader
            style="width:100%"
            v-model="form.departmentId"
            :options="departmentTree"
            :props="{
              emitPath: false,
              multiple: false,
              checkStrictly: true,
              value: 'F_DepId',
              label: 'F_DepName',
              children: 'Child',
              expandTrigger: 'hover'
            }"
          ></el-cascader>
        </el-form-item>
        <el-form-item
          label="岗位"
          required
          :error="$v.form.job.$error ? '必填' : ''"
        >
          <el-select
            style="width:100%"
            v-model="form.job"
            placeholder="请选择"
            value-key="F_PostId"
            :disabled="formType === 'edit'"
          >
            <el-option
              v-for="(item, index) in jobList"
              :key="index"
              :label="item.F_PostName"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="职务">
          <el-select
            style="width:100%"
            v-model="form.position"
            placeholder="请选择"
            value-key="F_JobId"
            :disabled="formType === 'edit'"
          >
            <el-option
              v-for="(item, index) in positionList"
              :key="index"
              :label="item.F_JobName"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="级别"
          required
          :error="$v.form.level.$error ? '必填' : ''"
        >
          <el-select
            style="width:100%"
            v-model="form.level"
            placeholder="请选择"
            value-key="F_ItemDetailId"
            :disabled="formType === 'edit'"
          >
            <el-option
              v-for="(item, index) in dictionaryData.dj"
              :key="index"
              :label="item.F_ItemName"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="入职地点"
          required
          :error="$v.form.workAddress.$error ? '必填' : ''"
        >
          <el-select
            style="width:100%"
            v-model="form.workAddress"
            placeholder="请选择"
            value-key="F_ItemDetailId"
          >
            <el-option
              v-for="(item, index) in dictionaryData.rzdd"
              :key="index"
              :label="item.F_ItemName"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色">
          <el-select
            style="width:100%"
            v-model="form.role"
            placeholder="请选择"
            value-key="F_RoleId"
          >
            <el-option
              v-for="(item, index) in roleList"
              :key="index"
              :label="item.F_RoleName"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="退伍军人">
          <el-select
            style="width:100%"
            v-model="form.veteran"
            placeholder="请选择"
            value-key="F_ItemDetailId"
          >
            <el-option
              v-for="(item, index) in dictionaryData.twjr"
              :key="index"
              :label="item.F_ItemName"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单位邮箱">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item
          label="入职前工龄"
          required
          :error="$v.form.beforeAge.$error ? '必填' : ''"
        >
          <el-input v-model="form.beforeAge"></el-input>
        </el-form-item>
        <el-form-item label="技能等级">
          <el-select
            style="width:100%"
            v-model="form.skillLev"
            placeholder="请选择"
            value-key="F_ItemDetailId"
          >
            <el-option
              v-for="(item, index) in dictionaryData.jndj"
              :key="index"
              :label="item.F_ItemName"
              :value="item.F_ItemDetailId"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </div>
      <div :class="$style['divider']"></div>
      <div :class="$style['form']">
        <el-form-item label="开户银行">
          <el-input v-model="form.bank"></el-input>
        </el-form-item>
        <el-form-item
          label="银行卡号"
          required
          :error="$v.form.bankCardId.$error ? '必填' : ''"
        >
          <el-input v-model="form.bankCardId"></el-input>
        </el-form-item>
        <el-form-item
          label="社保类型"
        >
          <el-select
            style="width:100%"
            v-model="form.socialSecurity"
            placeholder="请选择"
            value-key="F_ItemId"
          >
            <el-option
              v-for="(item, index) in socialSecurityTypeList"
              :key="index"
              :label="item.F_ItemName"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="社保卡号">
          <el-input v-model="form.socialSecurityCardId"></el-input>
        </el-form-item>
        <!-- NoSlip -->
        <el-form-item
          label="是否计薪"
        >
          <el-select
            style="width:100%"
            v-model="form.isSlip"
            placeholder="请选择"
          >
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item
          label="休息模式"
          required
          :error="$v.form.restModel.$error ? '必填' : ''"
        >
          <el-select
            style="width:100%"
            v-model="form.restModel"
            placeholder="请选择"
            value-key="F_ItemDetailId"
          >
            <el-option
              v-for="(item, index) in dictionaryData.xxms"
              :key="index"
              :label="item.F_ItemName"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item
          label="商业险"
          required
          :error="$v.form.busInsurance.$error ? '必填' : ''"
        >
          <el-select
            style="width:100%"
            v-model="form.busInsurance"
            placeholder="请选择"
            value-key="F_ItemDetailId"
          >
            <el-option
              v-for="(item, index) in dictionaryData.syx"
              :key="index"
              :label="item.F_ItemName"
              :value="item.F_ItemDetailId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="商业险到期"
          required
          :error="$v.form.busInsuranceExpire.$error ? '必填' : ''"
          v-if="busInsuranceName[form.busInsurance]==='无' ? false : true"
        >
          <el-date-picker
            style="width:100%"
            v-model="form.busInsuranceExpire"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          label="工资生成提醒"
        >
        <el-checkbox v-model="form.salarySlipTip"></el-checkbox>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import { required, idcard } from "@/utils/validator";
import { nationalList } from "@/utils/presetData";
import pc from "@/libs/pc-code.json";
import IDValidator from "id-validator";

let Validator = new IDValidator();

export default {
  props: {
    pform: {},
    departmentList: {
      type: Array,
      default() {
        return [];
      }
    },
    departmentTree: {
      type: Array,
      default() {
        return [];
      }
    },
    positionList: {
      type: Array,
      default() {
        return [];
      }
    },
    jobList: {
      type: Array,
      default() {
        return [];
      }
    },
    roleList: {
      type: Array,
      default() {
        return [];
      }
    },
    dictionaryData: {
      type: Object,
      default() {
        return {};
      }
    },
    socialSecurityTypeList: {
      type: Array,
      default() {
        return [];
      }
    },
    preview: {
      type: Boolean,
      default: false
    },
    formType: {
      type: String,
      default: "add"
    }
  },
  data() {
    return {
      nationalList,
      pc: pc,
      busInsuranceName: {},
      busInsuranceExpire_b: 0,
      busInsuranceExpire: ''
    };
  },
  validations: {
    form: {
      number: {
      },
      name: {
        required
      },
      sexType: {
        required
      },
      birthplaceType: {
        required
      },
      nationalityType: {
        required
      },
      educationType: {
        required
      },
      restModel: {
        required
      },
      busInsurance: {
        required
      },
      busInsuranceExpire: {
        required
      },
      salarySlipTip: {
      },
      idcard: {
        required,
        idcard
      },
      phoneNumber: {
        required
      },
      birthday: {
        required
      },
      accountType: {
        required
      },
      high: {
      },
      weight: {},
      headLength: {
      },
      legLength: {
      },
      bust: {
      },
      waist: {
      },
      hip: {
      },
      departmentId: {
        required
      },
      job: {
        required
      },
      jndj: {
        
      },
      level: {
        required
      },
      type: {
        required
      },
      workAddress: {
        required
      },
      beforeAge: {
        required
      },
      bankCardId: {
        required
      },
      socialSecurity: {
      }
    }
  },
  computed: {
    form: {
      get() {
        return this.pform;
      },
      set(n) {
        this.$emit("update:pform", n);
      }
    },
  },
  methods: {
    readBirthday(value) {
      if (!this.$v.form.idcard.$error) {
        let info = Validator.getInfo(value);
        this.form.birthday = info.birth;
      }
    }
  },
  watch: {
    "form.busInsurance"(value) {
      if(!this.busInsuranceExpire) {
        this.busInsuranceExpire = this.form.busInsuranceExpire
      }
      let val = this.busInsuranceName[value]
      if (val === '无') {
        this.busInsuranceExpire_b = 0
        this.form.busInsuranceExpire = 1
      }else{
        this.busInsuranceExpire_b = 1
        if(!this.busInsuranceExpire){
          this.form.busInsuranceExpire = this.busInsuranceExpire
        }else{
          this.form.busInsuranceExpire = ''
        }
      }
    },
    "dictionaryData.syx"(val){
      val.map(x => {
        this.busInsuranceName[x.F_ItemDetailId] = x.F_ItemName
      })
      if(!this.busInsuranceExpire) {
        this.busInsuranceExpire = this.form.busInsuranceExpire
      }
      if (this.busInsuranceName[this.form.busInsurance] === '无') {
        this.busInsuranceExpire_b = 0
        this.form.busInsuranceExpire = 1
      }else{
        this.busInsuranceExpire_b = 1
        if(this.busInsuranceExpire){
          this.form.busInsuranceExpire = this.busInsuranceExpire
        }else{
          this.form.busInsuranceExpire = ''
        }
      }
    }
  }
};
</script>

<style lang="scss" module>
.form {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, auto));
  grid-column-gap: 0px;
}
.divider {
  height: 1px;
  background: #dcdfe6;
  width: 100%;
  margin: 8px 0 24px;
}
</style>
