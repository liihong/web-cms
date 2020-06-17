<template>
  <div class="app-container calendar-list-container">
    <el-dialog size="small" width="70%" :title="`${type == 'add' ? '新增' : '编辑'}文章`" :visible.sync="dialogState.show" :modal-append-to-body="false">
      <el-form :model="this.dialogState.formData" ref="form" size="small" label-width="120px" class="demo-ruleForm">
        <el-form-item label="标题">
          <el-input v-model="this.dialogState.formData.title"></el-input>
        </el-form-item>
        <el-form-item label="图片">
          <el-upload class="avatar-uploader" action="/api/util/upload" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="this.dialogState.formData.cf_image" :src="this.dialogState.formData.cf_image" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="新闻类型">
          <el-select v-model="this.dialogState.formData.type" placeholder="请选择">
            <el-option v-for="item in newsTypeList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="显示类型">
          <el-radio-group v-model="this.dialogState.formData.display_type">
            <el-radio label="NONE">无图片</el-radio>
            <el-radio label="DNORMAL">标题头图片</el-radio>
            <el-radio label="DBIG">显示大图</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="发布时间">
          <el-date-picker value-format="yyyy-MM-dd hh:mm:ss" v-model="this.dialogState.formData.create_at" type="datetime" placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="this.dialogState.formData.weight"></el-input>
        </el-form-item>
         <el-form-item label="来源">
          <el-input v-model="this.dialogState.formData.source"></el-input>
        </el-form-item>
        <el-form-item label="内容">
          <editor class="editor" :value="this.dialogState.formData.content" :setting="editorSetting" @show="editors" :url="Url" :max-size="MaxSize" :accept="Accept" :with-credentials="withCredentials" @on-upload-fail="onEditorReady" @on-upload-success="onEditorUploadComplete"></editor>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">保存</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script type="text/ecmascript-6">
import editor from '@/components/Editor' // 根据editor.vue组件位置引入
import services from '@/api/article'
import dictionary from '@/api/dictionary'
export default {
  props: ['dialogState'],
  data() {
    return {
      editorSetting: {
        // 配置富文本编辑器高
        height: 300
      },
      Url: '/api/util/upload', // 图片对应的上传地址
      MaxSize: 175765, // 文件大小
      Accept: 'image/jpeg, image/png', // 文件格式
      withCredentials: true,
      newsTypeList: []
    }
  },
  computed: {
    id() {
      return this.$route.query.id
    },
    type() {
      return this.$route.query.type
    }
  },
  components: {
    // 引入组件
    editor
  },
  mounted() {
    this.getSjzdData()
  },
  methods: {
    getSjzdData() {
      dictionary.getSjzdByType('new_type').then(res => {
        if (res.data && res.errno == 0) {
          this.newsTypeList = res.data
        }
      })
    },
    onSubmit() {
      services.addArticle(this.this.dialogState.formData).then(res => {
        if (res.data && res.errno == 0) {
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          this.$router.push({ path: '/articleIndex' })
        }
      })
    },
    editors(content) {
      // editor组件传过来的值赋给content
      this.this.dialogState.formData.content = content
    },
    onEditorReady(ins, ina) {
      // 上传失败的函数
      console.log('ins')
      console.log(ins)
      console.log(ina)
    },
    onEditorUploadComplete(json) {
      // 处理上传图片后返回数据，添加img标签到编辑框内
      console.log('json')
      console.log(json)
      console.log(json[0].data.path)
      this.this.dialogState.formData.content =
        this.this.dialogState.formData.content + '<img src=' + json[0].data.path + '>'
      console.log(this.this.dialogState.formData.content)
    },
    handleAvatarSuccess(res, file) {
      this.this.dialogState.formData.cf_image = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }
  }
}
</script>
<style scoped >
.avatar-uploader >>>.el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader >>>.el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>