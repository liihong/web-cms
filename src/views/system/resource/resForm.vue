<template>
    <div class="userForm">
        <el-dialog size="small" title="新增资源" :visible.sync="dialogState.show" :close-on-click-modal="false">
            <el-form :model="dialogState.formData" ref="ruleForm" label-width="120px" :rules="rules" class="demo-ruleForm">
                <el-form-item label="资源名称" prop="resName">
                    <el-input size="small" v-model="dialogState.formData.resName"></el-input>
                </el-form-item>
                <el-form-item label="资源图标" prop="icon">
                    <el-input size="small" v-model="dialogState.formData.icon"></el-input>
                </el-form-item>
                <el-form-item label="资源标示" prop="resKey">
                    <el-input size="small" v-model.number="dialogState.formData.resKey"></el-input>
                </el-form-item>
                <el-form-item label="资源路径" prop="path">
                    <el-input size="small" v-model.number="dialogState.formData.path"></el-input>
                </el-form-item>
                <el-form-item label="是否菜单" prop="ismenu">
                    <el-switch on-text="是否菜单" active-value="1" inactive-value="0" v-model="dialogState.formData.ismenu"></el-switch>
                </el-form-item>
                <el-form-item label="资源排序" prop="resOrder">
                   <el-input-number  v-model="dialogState.formData.resOrder" :min="1" label="资源排序"></el-input-number>
                </el-form-item>
                <el-form-item label="资源备注" prop="remark">
                    <el-input size="small" v-model.number="dialogState.formData.remark"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button size="medium" type="primary" @click="submitForm('ruleForm')">{{dialogState.type == 'edit' ? '修改' : '保存'}}</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
import ElTreeSelect from '@/components/ElTreeSelect'
import services from '@/api/resource'
export default {
  name: 'userForm',
  components: {
    ElTreeSelect
  },
  props: {
    dialogState: Object
  },
  data() {
    return {
      roleData: [],
      rules: {
        resName: [
          { required: true, message: '请输入资源名称', trigger: 'blur' }
        ],
        resKey: [
          { required: true, message: '请输入资源标示', trigger: 'blur' }
        ],
        path: [{ required: true, message: '请输入资源路径', trigger: 'blur' }]
      },
      defaultProps: {
        value: 'resId', // ID字段名
        label: 'resName', // 显示名称
        children: 'children' // 子级字段名
      }
    }
  },
  mounted() {},
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          services.addResource(this.dialogState.formData).then(res => {
            if (res && res.data == 0) {
              this.$message({
                message: '添加成功',
                type: 'success'
              })
              this.$emit('initData')

              this.dialogState.show = false
            } else {
              this.$message({
                message: res.data,
                type: 'error'
              })
            }
          })
        } else {
          this.$message({
            message: '添加失败',
            type: 'error'
          })
        }
      })
    }
  }
}
</script>
