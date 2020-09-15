<template>
  <div style="margin:30px;">
    <el-card class="box-card">
      <div slot="header"
           class="clearfix">
        <span>{{formType ==='edit'? '修改商家' : '新增商家'}}</span>
      </div>
      <el-row>
        <el-col :span="14">
          <el-form ref="form"
                   :rules="rules"
                   :model="form"
                   label-width="80px">
            <el-form-item label="商家名称"
                          prop="shop_name">
              <el-input v-model="form.shop_name"></el-input>
            </el-form-item>
            <el-form-item label="商家分类"
                          prop="shop_type">
              <el-select v-model="form.shop_type"
                         placeholder="请选择商家分类">
                <el-option label="教育类"
                           value="1101"></el-option>
                <el-option label="餐饮类"
                           value="1102"></el-option>
                <el-option label="生活类"
                           value="1103"></el-option>
                <el-option label="娱乐类"
                           value="1104"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="营业时间"
                          prop="shop_time">
              <el-input v-model="form.shop_time"></el-input>
            </el-form-item>
            <el-form-item label="商家图片"
                          prop="shop_img">
              <el-upload ref="upload"
                         class="avatar-uploader"
                         action="/api/util/upload"
                         :show-file-list="false"
                         :on-success="handleAvatarSuccess">
                <img v-if="form.shop_img"
                     width="200"
                     height="200"
                     :src="form.shop_img"
                     class="avatar" />
                <i v-else
                   class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item label="联系方式"
                          prop="shop_phone">
              <el-input v-model="form.shop_phone"></el-input>
            </el-form-item>
            <el-form-item label="联系地址"
                          prop="shop_address">
              <el-input v-model="form.shop_address"></el-input>
            </el-form-item>
            <el-form-item label="是否推荐"
                          prop="shop_istop">
              <el-radio-group v-model="form.shop_istop">
                <el-radio label=1>是</el-radio>
                <el-radio label=0>否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="商家介绍"
                          prop="shop_desc">
              <!-- <WechatEdit v-model="form.shop_desc" /> -->
              <el-input type="textarea" v-model="form.shop_desc" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary"
                         @click="onSubmit">保存</el-button>
              <el-button @click="onCancel">取消</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import WechatEdit from '@/components/WechatEdit/index.vue'
import shopServices from '@/api/wechat/shop';
export default {
  components: {
    WechatEdit
  },
  props: {
    type: {
      type: String,
      default: 'add'
    }
  },
  data () {
    return {
      form: {
        shop_name: '',
        shop_type: '',
        shop_desc: '',
        shop_num: '',
        shop_img: '',
        shop_time: '',
        shop_address: '',
        shop_phone: '',
        shop_istop: '',
        shop_remark: '',
        shop_status: ''
      },
      rules: {
        shop_name: [
          { required: true, message: '请输入商家名称', trigger: 'blur' },
        ],
        shop_type: [
          { required: true, message: '请选择商家类型', trigger: 'blur' }
        ],
        shop_time: [
          { required: true, message: '请选择日期', trigger: 'blur' }
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
    if (this.formType === 'edit') {
      this.getFormData()
    }
  },
  methods: {
    onSubmit () {
      this.$refs.upload.submit()
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.formType === 'edit') {
            shopServices.editShop(this.form).then(res => {
              if (res.status === 0) {
                this.$message.success('修改成功')
              }
            })
          } else {
            shopServices.addShop(this.form).then(res => {
              if (res.status === 0) {
                this.$message.success('添加成功')
              }
            })
          }
          this.$router.push({ name: "shop", query: { type: "list", tableId: '0108' } });
        }
      });
    },
    resetForm (formName) {
      this.$refs[formName].resetFields();
    },
    handleAvatarSuccess (response) {
      this.form.shop_img = response.data.path
    },
    onCancel () {
      this.$router.push({ name: "shop", query: { type: "list", tableId: '0108' } });
    },
    getFormData () {
      console.log(this.$route.query.id)
      shopServices.getShopDetailById({ id: this.$route.query.id }).then(res => {
        if (res.status === 0) {
          this.form = res.data
        }
      })
    }
  },
  watch: {
    '$route' (val) {
      console.log(val)
    }
  }
}
</script>