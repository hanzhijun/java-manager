<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export default{
    name: 'App'
  }
</script>

<style>
  #app .avatar{
    max-width: 176px;
    max-height: 176px;
    width: auto;
    height: auto;
    display: block;
    margin: auto;
    border: 1px dashed red;
    box-sizing: border-box;
  }

  #app .avatar-uploader .el-upload {
    width: 178px;
    height: 178px;
  }
  #app .el-upload-list__item-thumbnail{
    max-width: 145px;
    max-height: 145px;
    width: auto;
    height: auto;
    display: block;
    border: 1px dashed red;
/*    vertical-align: middle;*/
    margin: auto;

    position: absolute;
    top: 0; left: 0; bottom: 0; right: 0;
  }
  #app .el-upload-list--picture-card .el-upload-list__item{

/*
    display: flex;
    justify-content:center;
*/
    background-color: #fbfdff;
  }
  #app .w-e-text p{
    margin: 0;
    line-height: 1.3;
    /*font-size: small;*/
  }

</style>
