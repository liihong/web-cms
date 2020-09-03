<template>
  <div style="margin:30px;">
    <el-col :span="14">
      <el-form ref="form"
               :model="form"
               label-width="80px">
        <el-form-item label="项目名称">
          <el-input v-model="form.item_name"></el-input>
        </el-form-item>
        <el-form-item label="项目分类">
          <el-select v-model="form.item_type"
                     placeholder="请选择项目分类">
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
        <el-form-item label="活动时间">
          <el-col :span="11">
            <el-date-picker type="date"
                            placeholder="选择日期"
                            v-model="form.item_start_time"
                            style="width: 100%;"></el-date-picker>
          </el-col>
          <el-col class="line"
                  :span="2">-</el-col>
          <el-col :span="11">
            <el-time-picker placeholder="选择时间"
                            v-model="form.item_end_time"
                            style="width: 100%;"></el-time-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="项目图片">
          <el-upload class="avatar-uploader"
                     action="https://jsonplaceholder.typicode.com/posts/"
                     :show-file-list="false"
                     :on-success="handleAvatarSuccess"
                     :before-upload="beforeAvatarUpload">
            <img v-if="form.item_img"
                 :src="form.item_img"
                 class="avatar">
            <i v-else
               class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item label="联系地址">
          <el-input v-model="form.address"></el-input>
        </el-form-item>
        <el-form-item label="是否热推">
          <el-radio-group v-model="form.item_istop">
            <el-radio label="是"></el-radio>
            <el-radio label="否"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="商家介绍">
          <el-input v-model="form.item_shop"></el-input>
        </el-form-item>
        <el-form-item label="图文详情">
          <el-input v-model="form.item_desc"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     @click="onSubmit">立即创建</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </div>
</template>

<script>
export default {
  data () {
    return {
      form: {
        item_name: '',
        item_old_price: 0,
        item_new_price: 0,
        item_type: '',
        item_desc: '',
        item_num: '',
        item_img: '',
        item_shop: '',
        item_start_time: '',
        item_end_time: '',
        item_address: '',
        item_phone: '',
        item_istop: '',
        item_remark: '',
        item_status: ''
      }
    }
  },
  methods: {
    onSubmit () {
      console.log('submit!');
    }
  }
}
</script>