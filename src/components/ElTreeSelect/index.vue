<template>
  <el-select :value="valueTitle" clearable @clear="clearHandle">
    <el-option :value="valueTitle" :label="valueTitle">
      <el-tree  
        accordion
        ref="selectTree"
        :data="options"
        :props="defaultProps"
        :node-key="defaultProps.value"    
        :default-expanded-keys="defaultExpandedKey"
        @node-click="handleNodeClick">
      </el-tree>
    </el-option>
  </el-select>
</template>
<script>
export default {
  name: "el-tree-select",
  // props: ['options', 'defaultProps', 'value'],
  props:{
    options:{
      type: Array,        // 必须是树形结构的对象数组
      default: ()=>{
        return []
      }
    },
    defaultProps:{
      type: Object,
      default:()=>{
        return {
          value:'id',             // ID字段名
          label: 'title',         // 显示名称
          children: 'children'    // 子级字段名
        }
      }
    },
    value:{
      type: Number,
      default: ()=>{
        return null
      }
    }
  },
  data() {
    return {
      valueId:this.value,    // 初始值
      valueTitle:'',
      defaultExpandedKey:[]    
    }
  },
  mounted(){
    this.initHandle()
  },
  methods: {
    // 初始化值
    initHandle(){
      if(this.valueId){
        this.valueTitle = this.$refs.selectTree.getNode(this.valueId).data.title     // 初始化显示
        this.$refs.selectTree.setCurrentKey(this.valueId)       // 设置默认选中
        this.defaultExpandedKey = [this.valueId]      // 设置默认展开
      } 
    },
    // 切换选项
    handleNodeClick(node){
      this.valueTitle = node[this.defaultProps.label]
      this.valueId = node[this.defaultProps.value]
      this.$emit('getValue',this.valueId)
      this.defaultExpandedKey = []
    },
    // 清除选中
    clearHandle(){
      this.valueTitle = ''
      this.valueId = null
      this.defaultExpandedKey = []
      this.$refs.selectTree.setCurrentKey(null)       // 设置默认选中
      this.$emit('getValue',null)
    }
  },
};
</script>
<style scoped>
  .el-scrollbar .el-scrollbar__view .el-select-dropdown__item{
    height: auto;
    padding: 0;
  }
  .el-select-dropdown__item.selected{
    font-weight: normal;
  }
  ul li >>>.el-tree .el-tree-node__content{
    height:auto;
  }
  .el-tree-node__label{
    font-weight: normal;
  }
  .el-tree >>>.is-current .el-tree-node__label{
    color: #409EFF;
    font-weight: 700;
  }
  .el-tree >>>.is-current .el-tree-node__children .el-tree-node__label{
    color:#606266;
    font-weight: normal;
  }
</style>