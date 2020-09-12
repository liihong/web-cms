<template>
  <el-dialog title="机构图片管理" :visible.sync="dialogState.show" width="80%">
    <div class="title">
      <span>
        当前机构：
        <span style="color:#42b983">{{row.org_name}} </span>
        ，请为该机构上传
      </span>
      <span v-if="tzList.length>0">
        <el-button type="primary" @click="handlerUpload">上传图片到服务器</el-button>
      </span>
    </div>
    <el-upload ref="upload" :data="params" :on-change="chooseFile" :file-list="tzList" action="/api/wechat/org/uploadImage" multiple list-type="picture-card"  :on-success="handleSuccess" :auto-upload="false">
      <i slot="default" class="el-icon-plus"></i>
      <div slot="file" slot-scope="{file}">
        <img class="el-upload-list__item-thumbnail" :src="file.url" alt="">
        <span class="el-upload-list__item-actions">
          <div>{{file.img_name}}</div>
          <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
            <i class="el-icon-zoom-in"></i>
          </span>
          <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleDownload(file)">
            <i class="el-icon-download"></i>
          </span>
          <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </div>
    </el-upload>
  </el-dialog>
</template>
<script>
import orgServices from '@/api/wechat/org'
export default {
  props: {
    dialogState: {
      type: Object
    }
  },
  data() {
    return {
      tzList: [],
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      params: {}
    }
  },
  computed: {
    row() {
      return this.dialogState.row
    }
  },
  methods: {
    chooseFile(file, fileList) {
      console.log(fileList)
      this.tzList = fileList
    },
    handleRemove(file) {
      this.$message.confirmDelete(async () => {
        let res = await this.$ajax.post(this.$api.deleteDdTz, { id: file.id })
        if (res.errno == 0) {
          this.$message.deleteSuccess()
          this.getTzData()
        } else {
          this.$message.deleteError(res.data.errmsg)
        }
      })
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
      window.open(file.url, '_blank'); 
    },
    handleDownload(file) {
      window.location.href = file.url
    },
    //上传图纸
    async handlerUpload() {
      this.params.orgId = this.row.id
      this.$refs.upload.submit()
    },
    handleSuccess(){
        this.$message.success('图纸上传成功')
    },
    // 获取图纸信息
    getTzData() {
      orgServices.getImgList({id: this.row.id})
        .then(res => {
          if (res.status == 0) {
            this.tzList = res.data
          } else {
            this.$message.error('获取订单图纸失败！')
          }
        })
    }
  },
  watch: {
    dialogState: {
      deep: true,
      handler() {
        if (this.dialogState.show) {
          this.getTzData()
        }
      }
    }
  }
}
</script>

<style>
</style>
