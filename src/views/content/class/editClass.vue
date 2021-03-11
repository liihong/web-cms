<template>
  <div style="margin:30px;">
    <el-row>
      <el-col :span="14">
        <el-form ref="form" :rules="rules" :model="form" label-width="120px">
          <el-form-item label="课程名称" prop="class_name">
            <el-input v-model="form.class_name"></el-input>
          </el-form-item>
          <el-form-item label="课程图片" prop="org_logo">
            <el-upload
              list-type="picture-card"
              ref="upload"
              class="avatar-uploader"
              action="/api/util/uploadImage"
              :show-file-list="false"
              :auto-upload="false"
              :on-success="handleAvatarSuccess"
            >
              <img v-if="form.class_img" :src="form.class_img" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="课程视频" prop="isUpload">
            <el-radio-group v-model="isUpload">
              <el-radio :label="1">上传</el-radio>
              <el-radio :label="0">输入地址</el-radio>
            </el-radio-group>
            <el-upload
              v-if="isUpload===1"
              list-type="picture-card"
              ref="uploadVideo"
              class="avatar-uploader"
              action="/api/util/uploadVideo"
              :show-file-list="false"
              :auto-upload="false"
              :on-success="handleVideoSuccess"
              :before-upload="beforeUploadVideo"
              :on-change="videoChange"
              :on-progress="uploadVideoProcess"
            >
              <video
                v-if="form.class_video !='' && videoFlag == false"
                :src="form.class_video"
                class="avatar"
                controls="controls"
              >您的浏览器不支持视频播放</video>
              <i
                v-else-if="form.class_video =='' && videoFlag == false"
                class="el-icon-plus avatar-uploader-icon"
              ></i>
              <el-progress
                v-if="videoFlag == true"
                type="circle"
                :percentage="videoUploadPercent"
                style="margin-top:30px;"
              ></el-progress>
            </el-upload>
            <el-input v-else v-model="form.class_video" />
          </el-form-item>
          <el-form-item label="所属机构" prop="class_org_id">
            <el-select v-model="form.class_org_id" placeholder="请选择所属机构">
              <el-option
                v-for="item in orgList"
                :key="item.id"
                :label="item.org_name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属类型" prop="class_type">
           <el-select v-model="form.class_type" placeholder="请选择所属类型">
              <el-option
                v-for="item in typeList"
                :key="item.id"
                :label="item.type_name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否推荐" prop="class_isHot">
            <el-radio-group v-model="form.class_isHot">
              <el-radio label="1" >是</el-radio>
              <el-radio label="0" >否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="课程简介" prop="class_desc">
            <el-input v-model="form.class_desc" type="textarea" rows="5"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="onSubmit">保存</el-button>
            <el-button @click="goCancel">取消</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import WechatEdit from "@/components/Editor/index.vue"
import classServices from "@/api/wechat/class"

export default {
  components: {
    WechatEdit,
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
      orgList: [],
      isUpload: 1,
      uploadVideoSucess: false,
      videoFlag: false,
      videoUploadPercent: 0,
      typeList:[{
        id:'',name:''
      }],
      form: {
        id: "",
        class_name: "",
        class_type: "",
        class_org_id: "",
        class_img: "",
        class_video: "",
        class_isHot: 0,
        class_desc: "",
      },
      rules: {
        class_name: [
          { required: true, message: "请输入机构名称", trigger: "blur" },
        ],
        class_org_id: [
          { required: true, message: "请选择所属机构", trigger: "blur" },
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
      classServices.getOrgList().then((res) => {
        if (res.status === 0) {
          this.orgList = res.data
        }
      })
      if (this.formType === "edit") {
        this.getFormData()
      }
    },
    //上传前回调
    beforeUploadVideo(file) {
      var fileSize = file.size / 1024 / 1024 < 50
      if (
        [
          "video/mp4",
          "video/ogg",
          "video/flv",
          "video/avi",
          "video/wmv",
          "video/rmvb",
          "video/mov",
        ].indexOf(file.type) == -1
      ) {
        this.$message.warning("请上传正确的视频格式")
        return false
      }
      if (!fileSize) {
        this.$message.warning("视频大小不能超过50MB")
        return false
      }
      this.isShowUploadVideo = false
    },
    // 进度条
    uploadVideoProcess(event, file) {
      this.videoFlag = true
      this.videoUploadPercent = file.percentage.toFixed(0) * 1
    },
    videoChange(){
      this.uploadVideoSucess = true
    },
    getContent(info) {
      this.form.org_desc = info
    },
    saveData(){
      setTimeout(()=>{
        this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.formType === "edit") {
            classServices.editClass(this.form).then((res) => {
              if (res.status === 0) {
                this.$message.success("编辑成功")
                this.$router.go(-1)
              }
            })
          } else {
            classServices.addClass(this.form).then((res) => {
              if (res.status === 0) {
                this.$message.success("添加成功")
                this.$router.go(-1)
              }
            })
          }
        }
      })
      },500)
    },
    onSubmit() {
      this.$refs.upload.submit()
      if(this.uploadVideoSucess) {
        this.$refs.uploadVideo.submit()
      }else{
        this.saveData()
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    handleAvatarSuccess(response) {
      this.form.class_img = response.data.path
      this.$set(this.form, "class_img", response.data.path)
    },
    handleVideoSuccess(response) {
      this.form.class_video = response.data.path
      this.$set(this.form, "class_video", response.data.path)
      if(this.uploadVideoSucess) {
        this.saveData()
      }
    },
    // 编辑数据回填
    getFormData() {
      classServices
        .getClassInfoById({ id: this.$route.query.id })
        .then((res) => {
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
<style >
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .el-upload--picture-card{
    width:250px;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 250px;
    height: 150px;
    line-height: 150px;
    text-align: center;
  }
  .avatar {
    width: 250px;
    height: 150px;
    display: block;
  }
</style>