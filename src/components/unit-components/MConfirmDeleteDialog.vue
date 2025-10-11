// Component hiển thị cảnh báo xác nhận khi dữ liệu bị thay đổi
// Author: Xuân Đào (05/03/2023)
<template>
    <div class="dialog" id="confirmDialog">
        <div class="dialog-content">
            <div class="dialog-main">
                <div class="dialog-top">
                    <div class="dialog-delete-icon"></div>
                    <div class="dialog-message">
                        <div class="dialog-message__title">
                            <div class="title">{{ messagse }} </div>
                        </div>
                    </div>
                </div>
                <div class="mess-line"></div>
                <div class="dialog-bottom">
                    <button ref="leftBtn" class="btn-optional" id="cancelBtn" @click="closeConfirmDialog">{{ txtBtn.no }}</button>
                    <div class="btn-group">
                        <button ref="rightBtn" class="btn-default" id="confirmBtn" @click="closeAndDelete" >{{ txtBtn.yes }}</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import resources from '@/js/resources';

export const deleteType = {
  singleDelete: 0,
  multipleDelete: 1,
}

export default {
    name: "DeleteConfirmDialog",
    props: {
      // Thông báo của dialog
        messagse: {
            type: String, 
            required: true,
            default: "",
        }
    },

    mounted(){
      this.$nextTick(() => {
        this.$refs.leftBtn.focus();
        window.addEventListener("keydown", this.handleOnKeydown)
      });
    },

    unmounted(){
      window.removeEventListener("keydown", this.handleOnKeydown)
    },

    methods:{
        /**
         * Hàm đóng confirm dialog
         * 
         * Author: Xuân Đào (05/03/2023)
         */
        closeConfirmDialog(){
            this.$emit("hideDeleteDialog");
        },

        /**
         * Hàm đóng confirm dialog, đóng popup và lưu toàn bộ thay đổi 
         * 
         * Author: Xuân Đào (05/03/2023)
         */
        closeAndDelete(){
            this.$emit("hideAndDelete", this.deleteType);
        },

        /**
         * Hàm xử lý sự kiện bàn phím
         * 
         * Author: Xuân Đào (05/03/2023)
         */
        handleOnKeydown(){
          if (event.key == "Tab"){
            event.preventDefault();
            if (this.focused == 0) {
              this.$refs.rightBtn.focus();
              this.focused = 1;
            } else {
              this.$refs.leftBtn.focus();
              this.focused = 0;
            }
          }
        },
    },
    data() {
        return {
            txtData: resources.vi.dialogMessage,
            txtBtn: resources.vi.btnAction,
            deleteType: 0,
            focused: 0,
        }
    },
}
</script>
<style scoped>
.dialog {
  height: 100%;
  width: 100%;
  background-color: rgba(82, 82, 82, 0.5);
  position: fixed;
  z-index: 999999;
  top: 0;
  left: 0;
}

.dialog-content {
  height: 156px;
  width: 500px;
  background-color: #fff;
  position: absolute;
  top: calc((100% - 156px) / 2);
  left: calc((100% - 500px) / 2);
  border-radius: 4px;
}

.dialog-main {
  height: 116px;
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
  font-size: 14px;
  width: 100%;
  font-weight: 400;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  left: -10px;
}

.dialog-message__title .title{
  font-size: 13px;
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
  justify-content: space-between;
  position: relative;
  top: 10px;
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

.dialog-bottom .btn-optional:focus {
  border: solid 1px #e0e0e0;
  background-color: #f0f0f0;
  cursor: pointer;
}

.dialog-bottom button:last-child {
  margin-left: 10px;
}
</style>