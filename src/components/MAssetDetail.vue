<template>
    <div class="alert" v-if="centerDialogVisible">
        <el-dialog v-model="centerDialogVisible" title="Warning" width="30%" center>
            <span>
                {{ message }}
            </span>
            <template #footer>
            <span class="dialog-footer">
                <el-button type="primary" @click="centerDialogVisible = false">
                Confirm
                </el-button>
            </span>
            </template>
        </el-dialog>
    </div>
  </template>
  
  <script>
    export default{
        name: "MAlert",
        props:{
            message:{
                type: String,
            }
        },
        data() {
            return {
                centerDialogVisible: false,
            }
        },
    }
  </script>
  <style scoped>
  .alert{
    height: 100vh;
    width: 100vw;
    position: fixed;
    top: 0;
    left: 0;
  }
  .dialog-footer button:first-child {
    margin-right: 10px;
  }
  </style>
  