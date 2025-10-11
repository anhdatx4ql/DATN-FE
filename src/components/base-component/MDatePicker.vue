// Component tạo ra một input datepicker
// Props gồm title: Tiêu đề, modelValue: Dữ liệu binding
// Author: Xuân Đào(05/03/2023)
<template>
  <div class="dp-main">
    <div class="title">{{ title }}</div>
    <input
      type="date"
      class="pop-input date-time"
      v-model="this.value"
      @blur="onBlur"
      ref="mInput"
      :title="this.tooltip"
    />
  </div>
</template>
<script>

export default {
  name: "MDatePicker",
  props: {
    // Tiêu đề datepicker
    title: {
      type: String,
      required: false,
    },

    // Dữ liệu binding
    modelValue: {
      type: Date,
      required: false,
    },

    // Giá trị mặc định
    defaultDate: {
      type: String,
      required: false,
    },

    required: {
      type: Boolean,
      required: false,
    }
  },
  data() {
    return {
      value: null,
      datePicked: null,
      inValid: false,
      tooltip: "",
    };
  },
  created(){
    this.value = this.modelValue;
  },

  mounted() {
    if(this.defaultDate) {
      /*eslint-disable no-debugger */
      // debugger
      this.$refs.mInput.value = this.defaultDate;
    }
  },

  watch:{
    value: function(newVal){
      this.$emit("update:modelValue", newVal);
    },

    defaultDate: function(newVal){
      this.value = newVal;
    }
  },
  methods: {
    /**
     * Set focus vào combobox 
     * 
     * @author Xuân Đào (14/05/2023)
     * */
    setFocus(){
      this.$refs.mInput.focus();
    },

     /**
     * Set giá trị cho combobox 
     * 
     * @author Xuân Đào (14/05/2023)
     * */
    setValue(value){
      this.$refs.mInput.value = value;
    },

     /**
     * Xử lý khi blur ra khỏi input 
     * 
     * @author Xuân Đào (14/05/2023)
     * */
    onBlur(){
      this.$emit("valueChange", this.$refs.mInput.value);
      this.validate();
    },
    /**
     * Hàm validate dữ liệu hợp lệ 
     * 
     * @author Xuân Đào (04/04/2023)
     */
    validate() {
      const value = this.$refs.mInput.value;
      if (value) {
        this.inValid = false;
        this.$refs.mInput.classList.remove("input-err");
        this.tooltip = "";
      } else {
        this.$refs.mInput.classList.add("input-err");
        this.inValid = true;
        this.tooltip = this.title + " không hợp lệ"
      }
    },
  },
};
</script>
<style scoped>

.pop-input{
  border-radius: 2px;
  border: solid 1px #d0d0d0;
  outline: unset;
  font-size: 13px;
  height: 26px;
  min-width: 150px;
  padding: 0 8px;
}

.pop-input:focus{
  border-color: #2ca01c;
}

.dp-main{
  display: flex;
  flex-direction: column;
  row-gap: 4px;
}

.errMes {
  color: red;
  font-size: 13px;
}
.input-err {
  border-color: #e81e1e !important;
}
.title{
  font-weight: 600;
  font-family: opens-san-bold;
  font-size: 13px;
}

</style>