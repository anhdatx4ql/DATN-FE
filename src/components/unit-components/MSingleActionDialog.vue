// Component hiển thị cảnh báo xác nhận khi dữ liệu bị thay đổi
// Author: Xuân Đào (05/03/2023)
<template>
  <div class="dialog" v-if="showDialog" :key="dialogKey" @keydown="handleOnKeyDown" id="confirmDialog">
    <div class="dialog-content">
      <div class="dialog-main">
        <div class="dialog-top">
          <div :class="dialogIcon"></div>
          <div class="dialog-message">
            <div class="dialog-message__title">
              <div class="title">{{ message }}</div>
            </div>
          </div>
        </div>
        <div class="mess-line"></div>
        <div class="dialog-bottom">
          <button
            class="btn-default"
            id="singleBtn"
            @click="btnClick"
            ref="singleBtn"
          >
            {{ btnMsg }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

export const dialogType = {
  warning: 0,
  error: 1,
  info: 2,
  success: 3,
}

export default {
  name: "SingleActionDialog",

  created(){
    switch(this.dialogType) {
      case dialogType.warning:{
        this.dialogIcon = "warning-icon"
        break
      }
      case dialogType.error:{
        this.dialogIcon = "error-icon"
        break
      }
      case dialogType.success:{
        this.dialogIcon = "success-icon"
        break
      }
      case dialogType.info:{
        this.dialogIcon = "info-icon"
        break
      }
      default: {
        this.dialogIcon = "error-icon"
      }
    }
  },

  methods: {

    /**
     * Hàm hiển thị dialog
     *
     * @author  Xuân Đào (12/03/2023)
     */
    showDialogOn(type, msg, bMsg){
      this.dialogType = type;
      this.message = msg;
      this.btnMsg = bMsg;
      this.showDialog = true;
      window.addEventListener("keydown", this.closeOnKeyDown);
    },

    closeOnKeyDown(event){
      if (event.key === 'Enter' || event.key === 'Escape') {
        this.showDialog = false;
        this.$emit("dialogOnClose");
        window.removeEventListener("keydown", this.closeOnKeyDown);
      }
    },

    /**
     * Xử lý sự kiện bàn phím 
     *
     * @author  Xuân Đào (12/03/2023)
     */
    handleOnKeyDown(){
      if(event.key == "Escape" || event.key == "Enter"){
        this.showDialog = false;
      }
    },
    
    /**
     * Click dialog button
     *
     * @author  Xuân Đào (12/03/2023)
     */
    btnClick(){
      this.showDialog = false;
      window.removeEventListener("keydown", this.closeOnKeyDown);
      this.$emit("dialogOnClose")
    }

  },
  data() {
    return {
      dialogType: 1,
      showDialog: false,
      dialogIcon: "",
      message: "",
      btnMsg: "",
      dialogKey: 0,
    };
  },
};
</script>
<style scoped>
.dialog {
  height: 100vh;
  width: 100%;
  background-color: rgba(82, 82, 82, 0.5);
  position: fixed;
  z-index: 199;
  top: 0;
  left: 0;
}

.dialog-content {
  height: 136px;
  width: 500px;
  background-color: #fff;
  position: absolute;
  top: calc((100% - 156px) / 2);
  left: calc((100% - 500px) / 2);
  border-radius: 4px;
}

.dialog-main {
  height: 96px;
  width: 460px;
  position: absolute;
  margin: 20px;
}

.dialog-top {
  height: calc(100% - 60px - 48px);
  width: calc(100% - 48px);
  margin: 22px 24px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  column-gap: 24px;
}

.dialog-icon {
  height: 42px;
  width: 44px;
}

.dialog-message {
  width: calc(100% - 38px - 8px);
  display: flex;
  flex-direction: column;
  row-gap: 22px;
}

.dialog-message__title {
  width: 100%;
  font-weight: 400;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  left: -10px;
}

.dialog-message__title .title{
  font-size: 14px;
  margin-left: 12px;
  color: #111111;
}

.dialog-message__title .icon {
  margin: 0px;
}

.dialog .mess-line {
  height: 20px;
  width: 100%;
  border-bottom: 1px solid #b8bcc3;
  margin-bottom: 10px;
}

.dialog-bottom {
  height: 30px;
  width: 100%;
  display: flex;
  justify-content: center;
  position: relative;
  top: 2px;
}

.dialog-bottom button {
  height: 28px;
  padding: 4px 16px;
  font-family: Notosans-semibold;
}

.dialog-bottom .btn-optional {
  border: solid #e0e0e0 1px;
  color: #212121;
  border-radius: 4px;
  border: 1px solid #babec5;
  color: #111;
  background-color: transparent;
}

.dialog-bottom .btn-optional:hover {
  background-color: #e0e0e0;
  cursor: pointer;
}

.dialog-bottom button:last-child {
  margin-left: 10px;
}

#confirmBtn:focus{
  border: solid #b0b0b0 2px;
}

</style>