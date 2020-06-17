<template>
  <div class="news">
    <ResList tableId='0101'>
       <template slot="type" slot-scope="scope">
         <el-tag>{{scope.row.type_TEXT}}</el-tag>
      </template>
    </ResList>
  </div>
</template>

<script>
export default {
}
</script>
