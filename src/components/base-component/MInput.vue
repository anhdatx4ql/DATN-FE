// Component tạo ra một input tự validate
// Author: pvdat(05/03/2023)
<template>
  <div class="inf-component com1">
    <div class="text-area">
      <span ref="inpText" class="bold-text" :title="tooltip">{{ inputTitle }}</span>
      <a v-if="required"> *</a>
    </div>
    <input
      ref="mInput"
      :type="inputType"
      autocomplete="off"
      :id="id"
      v-model="this.value"
      @blur="this.validate()"
      @keyup="onKeyUp"
      :placeholder="placeholder"
      :title="this.errMessage"
      :maxlength="this.maximumLength"
    />
    <!-- <div v-if="isError" class="errMes">{{ inputTitle }} không được trống</div> -->
  </div>
</template>
<script>
export default {
  name: "MInput",
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

    // Được phép trống hay không
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

    titleColor: {
      type: String,
      required: false,
      dafault: "000"
    },

    placeholder:{
      type: String,
      required: false,
    },

    textAlign:{
      type: String,
      required: false,
    },
    maxLength:{
      type: Number,
      required: false,
    },

    maximumLength:{
      type: Number,
      required: false,
    },

    minLength:{
      type: Number,
      required: false,
    },

    type: {
      type: String,
      required: false
    },

    id: {
      type: String,
      required: false,
    },

    inputType: {
      type: String,
      required: false,
      default: "text"
    }
  },

  watch:{
    value(newVal, oldVal){
      this.$emit('onInput', newVal, oldVal);
      this.$emit("update:modelValue", newVal);
    },

    modelValue(newVal) {
      this.value = newVal;
    }
  },

  created(){
    this.value = this.modelValue;
  },

  mounted() {
    this.$nextTick(() => {
      // this.focus();
      this.$refs.inpText.style.color = `#${this.titleColor}`;
      if (this.textAlign){
        this.$refs.mInput.style.textAlign = this.textAlign;
      }
    });
  },

  methods: {

    /**
     * Hàm set focus vào input
     * 
     * @author pvdat (05/03/2023)
     */
    onKeyUp(){
      if (this.type && this.type == 'd-money'){
        event.target.value = this.formatMoney(event.target.value.replaceAll('.',''));
      }
    },

    /**
     * Hàm định dạng tiền
     * @author pvdat(13/05/2023)
     */
     formatMoney(amount, decimalCount = 0, decimal = ",", thousands = ".") {
      decimalCount = Math.abs(decimalCount);
      decimalCount = isNaN(decimalCount) ? 2 : decimalCount;
      const negativeSign = amount < 0 ? "-" : "";
      let i = parseInt(
        (amount = Math.abs(Number(amount) || 0).toFixed(decimalCount))
      ).toString();
      let j = i.length > 3 ? i.length % 3 : 0;
      return (
        negativeSign +
        (j ? i.substr(0, j) + thousands : "") +
        i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) +
        (decimalCount
          ? decimal +
            Math.abs(amount - i)
              .toFixed(decimalCount)
              .slice(2)
          : "")
      );
    },

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
    showErr(errMes){
      this.isError = true;
      this.$refs.mInput.classList.add("input-err");
      this.errMessage = errMes;
    },
    /**
     * Hàm xoá thông báo lỗi nếu có
     */
    hideErr(){
      this.$refs.mInput.classList.remove("input-err");
      this.isError = false;
      this.errMessage = "";
    },
    /**Hàm thực hiện validate nếu cần */
    validate(){
      let value = "";
      if(this.$refs.mInput){
        value = this.$refs.mInput.value;
        if ((value.trim() == "" || value == null || value == undefined) && this.required){
          this.showErr(this.inputTitle + " không được để trống!");
          return;
        } else {
          this.hideErr();
        }
        
        if (this.maxLength && value.length > this.maxLength){
          this.showErr(`${this.inputTitle} không được vượt quá ${this.maxLength} ký tự`);
          return;
        } else {
          this.hideErr();
        }

        if (this.maxLength && value.length < this.minLength){
          this.showErr(`${this.inputTitle} không được ít hơn ${this.minLength} ký tự`);
          return;
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
      errMessage: "",
    };
  },
};
</script>
<style scoped>
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
  flex: 1;
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
</style>