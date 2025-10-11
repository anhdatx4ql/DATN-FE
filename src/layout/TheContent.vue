// Component hiển thị màn hình danh sách nhân viên
// Author: Xuân Đào (05/03/2023)
<template>
<div class="m-content">
      <router-view></router-view>
  </div>
</template>
<script>


export default {

  name: "TheContent",

  components: {
  },
};
</script>
<style scoped>
  .m-content{
    position: absolute;
    height: calc(100vh - 49px);
    width: calc(100% - 178px);
    top: 48px;
    left: 178px;
  }
</style>