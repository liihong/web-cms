<template>
  <div style="margin:30px;">
    <el-row>
      <el-col :span="14">
        <el-form ref="form"
                 :rules="rules"
                 :model="form"
                 label-width="120px">
          <el-form-item label="课程名称"
                        prop="org_name">
            <el-input v-model="form.org_name"></el-input>
          </el-form-item>
          <el-form-item label="课程图片"
                        prop="org_logo">
            <el-upload list-type="picture-card"
                       ref="upload"
                       class="avatar-uploader"
                       action="/api/util/uploadImage"
                       :show-file-list="false"
                       :on-success="handleAvatarSuccess">
              <img v-if="form.org_logo"
                   :src="form.org_logo"
                   class="avatar">
              <i v-else
                 class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="所属机构"
                        prop="org_type">
            <el-select v-model="form.org_type"
                       placeholder="请选择机构分类">
              <el-option v-for="item in typeList"
                         :key="item.id"
                         :label="item.type_name"
                         :value="item.id"></el-option>
            </el-select>
          </el-form-item>
           <el-form-item label="所属类型"
                        prop="org_type">
            <el-select v-model="form.org_type"
                       placeholder="请选择机构分类">
              <el-option v-for="item in typeList"
                         :key="item.id"
                         :label="item.type_name"
                         :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="课程视频"
                        prop="org_tag">
            <el-input v-model="form.org_tag"></el-input>
          </el-form-item>
          <el-form-item label="是否推荐"
                        prop="org_isHot">
            <el-radio-group v-model="form.org_isHot">
              <el-radio :label=1>是</el-radio>
              <el-radio :label=0>否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="课程简介"
                        prop="org_businessHours">
            <el-input v-model="form.org_businessHours"  type="textarea" rows="5"></el-input>
          </el-form-item>
         
          <el-form-item>
            <el-button type="primary"
                       @click="onSubmit">保存</el-button>
            <el-button @click="goCancel">取消</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import WechatEdit from '@/components/Editor/index.vue'
import orgServices from '@/api/wechat/org';


export default {
  components: {
    WechatEdit,
  },
  props: {
    type: {
      type: String,
      default: 'add'
    }
  },
  data () {
    return {
      dialogVisible: false,
      position: '',
      map: {},
      typeList: [],
      form: {
        org_name: '',
        org_type: '',
        org_logo: '',
        org_desc: '',
        org_num: '',
        org_businessHours: '',
        org_manager: '',
        org_address: '',
        org_phone: '',
        org_isHot: 0,
        org_remark: '',
        org_status: ''
      },
      rules: {
        org_name: [
          { required: true, message: '请输入机构名称', trigger: 'blur' },
        ],
        org_type: [
          { required: true, message: '请选择机构类型', trigger: 'blur' }
        ],
      }
    }
  },
  computed: {
    formType () {
      return this.$route.query.type
    }
  },
  mounted () {
    this.initData()
  },
  methods: {
    initData () {
      orgServices.getOrgType().then(res => {
        if (res.status === 0) {
          this.typeList = res.data
        }
      })
      if (this.formType === 'edit') {
        this.getFormData()
      }
    },
    getPosition (val) {
      this.position = val.position.lng + ',' + val.position.lat
      this.form.org_address = val.address
    },
    setPosition () {
      this.form.org_lon = this.position.split(',')[1]
      this.form.org_lat = this.position.split(',')[0]
      this.dialogVisible = false
    },
    getContent (info) {
      this.form.org_desc = info
    },
    onSubmit () {
      this.$refs.upload.submit()
      this.$refs['form'].validate((valid) => {
        if (valid) {
           if (this.formType === 'edit') {
            orgServices.editOrg(this.form).then(res => {
              if (res.status === 0) {
                this.$message.success('编辑成功')
                this.$router.go(-1);
              }
            })
           }else{
            orgServices.addOrg(this.form).then(res => {
              if (res.status === 0) {
                this.$message.success('添加成功')
                this.$router.go(-1);
              }
            })
           }
       
        }
      });
    },
    resetForm (formName) {
      this.$refs[formName].resetFields();
    },
    handleAvatarSuccess (response) {
      this.form.org_logo = response.data.path
      this.$set(this.form,'org_logo',response.data.path)
      console.log(this.form.org_logo)
    },
    // 编辑数据回填
    getFormData () {
      orgServices.getOrgInfoById({ id: this.$route.query.id }).then(res => {
        if (res.status === 0) {
          this.form = res.data
        }
      })
    },
    goCancel(){
      this.$router.push({ name: "orgs", query: { type: "list" } });
    }
  },
  watch: {
    infos () {
      this.position = this.form.lon + ',' + this.form.lat
    }
  }
}
</script>