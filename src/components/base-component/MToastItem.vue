// Component build các loại toast message dùng chung cho toàn bộ project
// Props: kindOfToast - loại toast message
// Props: toastMess - nội dung toast message
// Author: Xuân Đào (15/03/2023)
<template>
  <div class="toast-mess" ref="toast">
    <div :class="toastAttribute.class">
      <div class="toast-icon"></div>
      <div class="toast-title">{{ toastAttribute.title }}</div>
      <div class="toast-message">{{ toastMess }}</div>
      <div class="toast-close" @click="this.closeToast()"></div>
    </div>
  </div>
</template>
<script>
export const ToastType = {
  Success: 1,
  Error: 2,
  Warning: 3,
  Infor: 4,
};

export default {
  name: "MToastItem",
  props: {
    // Loại thông báo toast
    kindOfToast: {
      type: Number,
      required: true,
      default: ToastType.Success,
    },
    toastMess: {
      type: String,
      required: true,
      default: " ",
    },
  },

  computed: {
    toastAttribute() {
      switch (this.kindOfToast) {
        case ToastType.Success:
          return {
            class: "success-toast",
            title: "Thành công",
          };
        case ToastType.Error:
          return {
            class: "error-toast",
            title: "Lỗi",
          };
        case ToastType.Warning:
          return {
            class: "warning-toast",
            title: "Cảnh báo",
          };
        case ToastType.Infor:
          return {
            class: "info-toast",
            title: "Thông tin",
          };
        default:
          return {
            class: "info-toast",
            title: "Thông tin",
          };
      }
    },
  },
  
  methods: {
    closeToast() {
      this.$refs.toast.remove();
    },
  },
};
</script>
<style scoped>
.toast-mess {
  height: 40px;
  width: 350px;
  background-color: #fff;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  position: fixed;
  right: 0px;
  top: 50px;
  animation-name: showToast;
  animation-duration: 1s;
  animation-fill-mode: forwards;
  z-index: 99999;
}

.success-toast,
.info-toast,
.error-toast,
.info-toast {
  display: flex;
  align-items: center;
  height: 100%;
}

.success-toast .toast-icon {
  height: 20px;
  width: 20px;
  background: url("../../assets/img/Sprites.64af8f61.svg") no-repeat -510px -406px;
  margin-left: 18px;
}

.warning-toast .toast-icon {
  height: 20px;
  width: 20px;
  background: url("../../assets/img/Sprites.64af8f61.svg") no-repeat -512px -408px;
  margin-left: 18px;
}

.error-toast .toast-icon {
  height: 20px;
  width: 20px;
  background: url("../../assets/img/Sprites.64af8f61.svg") no-repeat -538px -146px;
  margin-left: 18px;
}

.info-toast .toast-icon {
  height: 20px;
  width: 20px;
  background: url("../../assets/img/Sprites.64af8f61.svg") no-repeat -482px -146px;
  margin-left: 18px;
}

.success-toast .toast-title {
  color: #50b83c;
  height: 20px;
  font-size: 12px;
  white-space: nowrap;
  line-height: 20px;
  margin-left: 10px;
  font-weight: 600;
}

.warning-toast .toast-title {
  color: orange;
  height: 20px;
  margin-left: 10px;
  font-weight: 600;
}

.error-toast .toast-title {
  color: #ff0000;
  height: 20px;
  margin-left: 10px;
  font-weight: 600;
}

.info-toast .toast-title {
  color: rgb(52, 52, 255);
  height: 20px;
  margin-left: 10px;
  font-weight: 600;
}

.toast-message {
  height: 20px;
  width: 250px;
  font-size: 12px;
  line-height: 20px;
  overflow: hidden;
  margin-left: 5px;
}

.toast-action {
  position: absolute;
  right: calc(16px + 16px + 18px);
  font-weight: 600;
  text-decoration: underline;
  font-size: 12px;
  line-height: 20px;
}

.toast-close {
  height: 16px;
  width: 16px;
  background: url("../../assets/img/Sprites.64af8f61.svg") no-repeat -1176px -360px;
  position: absolute;
  right: 16px;
  top: 13px;
}

.toast-action,
.toast-close {
  cursor: pointer;
}

@keyframes showToast {
  from {
    right: -500px;
  }
  to {
    right: 0px;
  }
}

@keyframes closeToast {
  from {
    right: 0px;
  }
  to {
    right: -500px;
  }
}
</style>