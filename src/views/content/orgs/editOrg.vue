<template>
  <div style="margin:30px;">
    <!-- <el-dialog :modal-append-to-body=false
               :title="`${type == 'add' ? '新建' : '编辑'}机构`"
               v-bind="$attrs"
               width="50%"
               :close-on-click-modal="false"
    v-on="$listeners">-->
    <el-row>
      <el-col :span="14">
        <el-form ref="form" :rules="rules" :model="form" label-width="100px">
          <el-form-item label="机构名称" prop="org_name">
            <el-input v-model="form.org_name" placeholder="请选择机构名称"></el-input>
          </el-form-item>
          <el-form-item label="机构logo" prop="org_logo">
            <el-upload
              list-type="picture-card"
              ref="upload"
              class="avatar-uploader"
              action="/api/util/upload"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
            >
              <img v-if="form.org_logo" :src="form.org_logo" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="机构分类" prop="org_type">
            <el-select v-model="form.org_type" placeholder="请选择机构分类">
              <el-option
                v-for="item in typeList"
                :key="item.id"
                :label="item.type_name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="机构标签" prop="org_tag">
            <el-input v-model="form.org_tag" placeholder="请输入机构标签"></el-input>
          </el-form-item>

          <el-form-item label="营业时间" prop="org_businessHours">
            <el-input v-model="form.org_businessHours" placeholder="请选择营业时间(如08:00-18:00)"></el-input>
          </el-form-item>
          <el-form-item label="联系人" prop="org_manager">
            <el-input v-model="form.org_manager" placeholder="请输入联系人"></el-input>
          </el-form-item>
          <el-form-item label="联系方式" prop="org_phone">
            <el-input v-model="form.org_phone" placeholder="请输入联系方式"></el-input>
          </el-form-item>

          <el-form-item label="机构位置" prop="position">
            <el-input
              @focus="dialogVisible = true"
              suffix-icon="el-icon-location"
              v-model="position"
              placeholder="请选择机构位置"
            ></el-input>
          </el-form-item>
          <el-form-item label="联系地址" prop="org_address">
            <el-input v-model="form.org_address" placeholder="请输入联系地址"></el-input>
          </el-form-item>
          <el-form-item label="机构评分" prop="org_rate">
            <el-rate v-model="form.org_rate"></el-rate>
          </el-form-item>
          <el-form-item label="是否推荐" prop="org_isHot">
            <el-radio-group v-model="form.org_isHot">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="机构介绍" prop="org_desc">
            <!-- <WechatEdit @getContent="getContent"
            v-model="form.org_desc" />-->
            <el-input v-model="form.org_desc" type="textarea" placeholder="请输入机构介绍" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">保存</el-button>
            <el-button @click="goCancel">取消</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!-- </el-dialog> -->
    <el-dialog title="请拖动地图选择位置" :visible.sync="dialogVisible">
      <span>经纬度: {{position}}</span>
      <el-button type="primary" @click="setPosition">确定</el-button>
      <AMap @getPosition="getPosition" />
    </el-dialog>
  </div>
</template>

<script>
import WechatEdit from "@/components/Editor/index.vue"
import orgServices from "@/api/wechat/org"
import AMap from "@/components/Amap"

export default {
  components: {
    WechatEdit,
    AMap,
  },
  props: {
    type: {
      type: String,
      default: "add",
    },
  },
  data() {
    return {
      dialogVisible: false,
      position: "",
      map: {},
      typeList: [],
      form: {
        org_name: "",
        org_type: "",
        org_logo: "",
        org_desc: "",
        org_num: "",
        org_businessHours: "",
        org_manager: "",
        org_address: "",
        org_phone: "",
        org_isHot: 0,
        org_remark: "",
        org_status: "",
      },
      rules: {
        org_tag: [
          {
            required: true,
            trigger: "blur",
          },
        ],
        org_location: [
          { required: true, message: "请选择机构位置", trigger: "blur" },
        ],
        org_logo: [
          { required: true, message: "请上传机构图片", trigger: "blur" },
        ],
        org_name: [
          { required: true, message: "请输入机构名称", trigger: "blur" },
        ],
        org_type: [
          { required: true, message: "请选择机构类型", trigger: "blur" },
        ],
        org_businessHours: [
          { required: true, message: "请选择营业时间", trigger: "blur" },
        ],
        org_phone: [
          { required: true, message: "请输入联系方式", trigger: "blur" },
        ],
        org_address: [
          { required: true, message: "请选择机构类型", trigger: "blur" },
        ],
        org_manager: [
          { required: true, message: "请输入联系人", trigger: "blur" },
        ],
        org_rate: [
          { required: true, message: "请选择机构评分", trigger: "blur" },
        ],
      },
    }
  },
  computed: {
    formType() {
      return this.$route.query.type
    },
  },
  mounted() {
    this.initData()
  },
  methods: {
    initData() {
      orgServices.getOrgType().then((res) => {
        if (res.status === 0) {
          this.typeList = res.data
        }
      })
      if (this.formType === "edit") {
        this.getFormData()
      }
    },
    getPosition(val) {
      this.position = val.position.lng + "," + val.position.lat
      this.form.org_address = val.address
    },
    setPosition() {
      this.form.org_lon = this.position.split(",")[1]
      this.form.org_lat = this.position.split(",")[0]
      this.dialogVisible = false
    },
    getContent(info) {
      this.form.org_desc = info
    },
    onSubmit() {
      this.$refs.upload.submit()
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.formType === "edit") {
            orgServices.editOrg(this.form).then((res) => {
              if (res.status === 0) {
                this.$message.success("编辑成功")
                this.$router.push({ name: "orgs", query: { type: "list" } })
              }
            })
          } else {
            orgServices.addOrg(this.form).then((res) => {
              if (res.status === 0) {
                this.$message.success("添加成功")
                this.$router.push({ name: "orgs", query: { type: "list" } })
              }
            })
          }
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    handleAvatarSuccess(response) {
      this.form.org_logo = response.data.path
      this.$set(this.form, "org_logo", response.data.path)
      console.log(this.form.org_logo)
    },
    // 编辑数据回填
    getFormData() {
      orgServices.getOrgInfoById({ id: this.$route.query.id }).then((res) => {
        if (res.status === 0) {
          this.form = res.data
        }
      })
    },
    goCancel() {
      this.$router.push({ name: "orgs", query: { type: "list" } })
    },
  },
  watch: {
    infos() {
      this.position = this.form.lon + "," + this.form.lat
    },
  },
}
</script>