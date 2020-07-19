<template>
  <div class="types">
    <ResList tableId='0104'>
      <template slot="org_img" slot-scope="scope">
        <img width="200" height="100" :src="scope.row.org_img" />
      </template>
    </ResList>
  </div>
</template>

<script>
export default {
}
</script>
