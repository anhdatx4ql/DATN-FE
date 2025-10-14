// Component tạo ra một input tự validate
// Author: pvdat(05/03/2023)
<template>
  <div class="inf-component com1">
    <div class="text-area">
      <span class="bold-text" ref="inpText" :title="tooltip">{{ inputTitle }}</span>
      <a v-if="required"> *</a>
    </div>
    <textarea
      ref="mArea"
      type="textarea"
      autocomplete="off"
      id="employeeCode"
      v-model="this.value"
      class="inp-text"
      :maxlength="maxLength"
      @focus="this.isFocus = true"
      @blur="this.validate()"
    ></textarea>
    <div v-if="isError" class="errMes">{{ inputTitle }} không được trống</div>
  </div>
</template>
<script>
export default {
  name: "MTextArea",
  props: {
    // Dữ liệu binding
    modelValue: {
      type: String,
    },

    // Tiêu đề
    inputTitle: {
      type: String,
      required: false,
    },

    // Được phép trống
    required: {
      type: Boolean,
      required: false,
      default: false,
    },

    // Có thể focus
    canFocus: {
      type: Boolean,
      required: false,
      default: false,
    },

    tooltip:{
      type: String,
      required: false
    },

    height: {
        type: Number,
        required: false,
        default: 40,
    },

    titleColor:{
      type: String,
      required: false,
      default: "000",
    },

    resizable:{
      type: Boolean,
      required: false,
      default: true,
    },

    maxLength:{
      type: Number,
      required: false,
    }
  },

  watch:{
    value(newVal){
      this.$emit("update:modelValue", newVal);
    }
  },

  created() {
    this.value = this.modelValue;
  },

  mounted() {
    this.$nextTick(() => {
      // this.focus();
        this.$refs.mArea.style.height = this.height + "px";
        this.$refs.inpText.style.color = `#${this.titleColor}`;
    });
  },

  methods: {
    /**
     * Hàm set focus vào input
     * 
     * Author: pvdat (05/03/2023)
     */
    setFocus() {
      this.$refs.mInput.focus();
    },
    /**
     * Hàm hiển thị thông báo lỗi nếu có
     */
    showErr(){
      this.isError = true;
      this.$refs.mInput.classList.add("input-err");
    },
    /**
     * Hàm xoá thông báo lỗi nếu có
     */
    hideErr(){
      this.$refs.mInput.classList.remove("input-err");
      this.isError = false;
    },
    /**Hàm thực hiện validate nếu cần */
    validate(){
      this.isFocus = false;
      if (!this.required) return;
      let value = "";
      if(this.$refs.mInput){
        value = this.$refs.mInput.value;
        if (value.trim() == "" || value == null || value == undefined){
          this.showErr();
        } else {
          this.hideErr();
        }
      }
    },

    /**
     * Hàm lấy tên input
     *
     * @author  pvdat (12/03/2023)
     */
    getInputName(){
      return this.inputTitle;
    }

  },
  data() {
    return {
      value: null,
      isError: false,
      isFocus: false,
    };
  },
};
</script>
<style scoped>

textarea{
    outline: unset;
    border-color: #b0b0b0;
    resize: none;
    padding: 8px;
}

a {
  border: unset;
  outline: unset;
  text-decoration: none;
  color: #E81E1E;
}

.text-area{
  font-size: 13px;

}

.com1 {
  width: 150px;
}
.errMes{
  font-size: 13px;
  color: red;
}
.input-err{
    border-color: #E81E1E !important;
}

.bold-text{
  font-family: opens-san-bold !important;
  font-weight: 600;
}

.inp-text{
  border-radius: 2px;
}
</style>