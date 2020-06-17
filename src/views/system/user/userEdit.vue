<template>
  <div class="userForm">
    <el-dialog size="small" title="用户管理" :visible.sync="dialogState.show" :close-on-click-modal="false">
      <el-form :model="dialogState.formData" ref="ruleForm" label-width="120px" :rules="rules" class="demo-ruleForm">
        <el-form-item label="用户名" prop="userName">
          <el-input size="small" v-model="dialogState.formData.userName"></el-input>
        </el-form-item>
        <!-- <el-form-item label="密码" prop="userPassword">
                    <el-input size="small" v-model="dialogState.formData.userPassword"></el-input>
                </el-form-item> -->
        <el-form-item label="真实姓名" prop="name">
          <el-input size="small" v-model="dialogState.formData.name"></el-input>
        </el-form-item>
        <el-form-item label="所属角色" prop="roleName">
          <el-select v-model="dialogState.formData.roleName" placeholder="请选择">
            <el-option v-for="item in dialogState.roleData" :key="item.roleId" :label="item.roleName" :value="item.roleName">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属机构" prop="userCompany">
          <el-input size="small" v-model.number="dialogState.formData.userCompany"></el-input>
        </el-form-item>
        <el-form-item label="是否启用" prop="status">
          <el-switch on-text="是否启用" v-model="dialogState.formData.status"></el-switch>
        </el-form-item>
        <el-form-item>
          <el-button size="medium" type="primary" @click="submitForm('ruleForm')">{{dialogState.type == 'edit' ? '修改' : '保存'}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import services from '@/api/user'

export default {
  name: 'userForm',
  components: {},
  props: {
    dialogState: Object
  },
  data() {
    return {
      roleData: [],
      rules: {
        userName: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        roleName: [{ required: true, message: '请选择角色', trigger: 'blur' }],
        name: [{ required: true, message: '请输入真实姓名', trigger: 'blur' }]
      }
    }
  },
  mounted() {},
  methods: {
    initData() {
      this.$ajax.post(this.$adminApi.getRole).then(res => {
        if (res && res.data && res.data.data) {
          let data = res.data.data
          this.roleData = data
        }
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.dialogState.type == 'edit') {
            services.addUser(this.dialogState.formData).then(res => {
              if (res.data && res.errno == 0) {
                this.$message({
                  message: '添加成功',
                  type: 'success'
                })
                this.dialogState.show = false
              }else{
                 this.$message({
                  message: '添加失败',
                  type: 'success'
                })
              }
            })
          } else {
            services.editUser(this.dialogState.formData).then(res => {
              if (res.data && res.errno == 0) {
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
                this.dialogState.show = false
              }else{
                 this.$message({
                  message: '修改失败',
                  type: 'success'
                })
              }
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
