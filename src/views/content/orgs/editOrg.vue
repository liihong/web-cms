<template>
  <div style="margin:30px;">
    <el-dialog :modal-append-to-body=false
               :title="`${type == 'add' ? '新建' : '编辑'}机构`"
               v-bind="$attrs"
               width="50%"
               :close-on-click-modal="false"
               v-on="$listeners">
      <el-row>
        <el-col :span="14">
          <el-form ref="form"
                   :rules="rules"
                   :model="form"
                   label-width="120px">
            <el-form-item label="机构名称"
                          prop="org_name">
              <el-input v-model="form.org_name"></el-input>
            </el-form-item>
            <el-form-item label="机构logo"
                          prop="org_name">
              <el-input v-model="form.org_name"></el-input>
            </el-form-item>
            <el-form-item label="机构分类"
                          prop="org_type">
              <el-select v-model="form.org_type"
                         placeholder="请选择机构分类">
                <el-option v-for="item in typeList" :key="item.id" :label="item.type_name"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="营业时间"
                          prop="org_time">
              <el-input v-model="form.org_time"></el-input>
            </el-form-item>
            <el-form-item label="机构图片"
                          prop="org_img">
              <el-upload list-type="picture-card"
                         ref="upload"
                         class="avatar-uploader"
                         action="/api/util/upload"
                         :show-file-list="false"
                         :on-success="handleAvatarSuccess">
                <img v-if="form.org_img"
                     :src="form.org_img"
                     class="avatar">
                <i v-else
                   class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item label="联系方式"
                          prop="org_phone">
              <el-input v-model="form.org_phone"></el-input>
            </el-form-item>
            <el-form-item label="联系地址"
                          prop="org_address">
              <el-input v-model="form.org_address"></el-input>
            </el-form-item>
            <el-form-item label="经纬度"
                          prop="org_address">
              <el-input @focus="dialogVisible = true"
                        suffix-icon="el-icon-location"
                        v-model="position"
                        placeholder="机构经纬度">
              </el-input>
            </el-form-item>
            <el-form-item label="机构评分" prop="org_rate"></el-form-item>
            <el-form-item label="是否推荐"
                          prop="org_istop">
              <el-radio-group v-model="form.org_istop">
                <el-radio label="是"
                          value=1></el-radio>
                <el-radio label="否"
                          value=0></el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="机构介绍"
                          prop="org_desc">
              <WechatEdit v-model="form.org_desc" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary"
                         @click="onSubmit">立即创建</el-button>
              <el-button>取消</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-dialog>
    <el-dialog title="请拖动地图选择位置"
               :visible.sync="dialogVisible">
      <span>经纬度: {{position}}</span>
      <el-button type="primary"
                 @click="setPosition">确定</el-button>
      <AMap @getPosition="getPosition" />
    </el-dialog>
  </div>
</template>

<script>
import WechatEdit from '@/components/WechatEdit/index.vue'
import orgServices from '@/api/wechat/org';
import AMap from '@/components/Amap'


export default {
  components: {
    WechatEdit,
    AMap
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
        org_desc: '',
        org_num: '',
        org_time: '',
        org_address: '',
        org_phone: '',
        org_istop: '',
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
        org_time: [
          { required: true, message: '请选择日期', trigger: 'blur' }
        ],
      }
    }
  },
  computed: {
    formType () {
      return this.di
    }
  },
  mounted(){
    this.initData()
  },
  methods: {
    initData(){
      orgServices.getOrgType().then(res=>{
        if(res.status === 0){
          this.typeList = res.data
        }
      })
    },
    getPosition (val) {
      this.position = val.lng + ',' + val.lat
    },
    setPosition () {
      this.form.org_lon = this.position.split(',')[1]
      this.form.org_lat = this.position.split(',')[0]
      this.dialogVisible = false
    },
    onSubmit () {
      this.$refs.upload.submit()
      this.$refs['form'].validate((valid) => {
        if (valid) {
          orgServices.addOrg(this.form).then(res => {
            if (res.status === 0) {
              this.$message.success('添加成功')

            }
          })
        }
      });
    },
    resetForm (formName) {
      this.$refs[formName].resetFields();
    },
    handleAvatarSuccess (response) {
      this.form.org_img = response.data.path
    }
  },
  watch: {
    infos () {
      this.position = this.form.lon + ',' + this.form.lat
    }
  }
}
</script>