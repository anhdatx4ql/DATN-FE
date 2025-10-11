// Component hiển thị cảnh báo xác nhận khi dữ liệu bị thay đổi
// Author: Xuân Đào (05/03/2023)
<template>
  <div class="dialog" id="confirmDialog">
    <div class="dialog-content">
      <div class="dialog-main">
        <div class="dialog-top">
          <div class="dialog-icon"></div>
          <div class="dialog-message">
            <div class="dialog-message__title">
              <div class="title">{{ txtData.confirmChange }}</div>
            </div>
          </div>
        </div>
        <div class="mess-line"></div>
        <div class="dialog-bottom">
          <button
            class="btn-optional"
            ref="btn1"
            id="cancelBtn"
            @click="this.closeConfirmDialog()"
          >
            {{ txtBtn.cancel }}
          </button>
          <div class="btn-group">
            <button
              class="btn-optional"
              ref="btn2"
              id="closeBtn"
              @click="this.closeAndUndo()"
            >
              {{ txtBtn.no }}
            </button>
            <button
              class="btn-default"
              id="confirmBtn"
              ref="btn3"
              @click="this.closeAndSave()"
            >
              {{ txtBtn.yes }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import resources from "@/js/resources";
export default {
  name: "ConfirmDialog",

  mounted(){
    this.$refs.btn3.focus();
    this.btnList.push(this.$refs.btn1);
    this.btnList.push(this.$refs.btn2);
    this.btnList.push(this.$refs.btn3);
    window.addEventListener("keydown", this.handleOnKeyDown)
  },

  unmounted(){
    window.removeEventListener("keydown", this.handleOnKeyDown)
  },

  methods: {

    /**
     * Hàm xử lý sự kiện bàn phím
     *
     * @author  Xuân Đào (12/03/2023)
     */
    handleOnKeyDown(){
      if(event.code === "Tab"){
        event.preventDefault();
        if (this.currentFocus == 2) this.currentFocus = 0;
        else this.currentFocus++;
        this.btnList[this.currentFocus].focus();
      }
    },

    /**
     * Hàm đóng confirm dialog
     *
     * Author: Xuân Đào (05/03/2023)
     */
    closeConfirmDialog() {
      this.$emit("hideDialog");
    },

    /**
     * Hàm đóng confirm dialog, đóng popup và hủy bỏ toàn bộ thay đổi
     *
     * Author: Xuân Đào (05/03/2023)
     */
    closeAndUndo() {
      this.$emit("hideDialogPopup");
    },

    /**
     * Hàm đóng confirm dialog, đóng popup và lưu toàn bộ thay đổi
     *
     * Author: Xuân Đào (05/03/2023)
     */
    closeAndSave() {
      this.$emit("hideAndSave");
    },
  },
  data() {
    return {
      txtData: resources.vi.dialogMessage,
      txtBtn: resources.vi.btnAction,
      btnList: [],
      currentFocus: 2,
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
  z-index: 99;
  top: 0;
  left: 0;
}

.dialog-content {
  height: 156px;
  width: 550px;
  background-color: #fff;
  position: absolute;
  top: calc((100% - 156px) / 2);
  left: calc((100% - 550px) / 2);
  border-radius: 4px;
}

.dialog-main {
  height: 116px;
  width: 510px;
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
  font-size: 16px;
  width: 100%;
  font-weight: 400;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  left: -10px;
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

.dialog-bottom button:last-child {
  margin-left: 10px;
}

</style>