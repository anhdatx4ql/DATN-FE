// Component tạo ra một autocomplete combobox từ api
// Author: Xuân Đào(05/03/2023)
<template>
  <div class="m-combobox">
    <div class="m-txt">
      <div class="m-context">{{ title }}</div>
      <span class="required" v-if="isRequired">*</span>
    </div>
    <div class="m-main">
      <input
        ref="inpValue"
        @blur="onBlur"
        @focus="onFocus"
        @input="onInput"
        type="text"
        v-model="value"
      />
      <input @click="btnClick" type="button" class="combo-icon" />
    </div>
    <div class="errMess" v-if="isError">{{ title }} không được trống</div>
    <div ref="itemList" v-show="isShow" class="m-item-list">
      <div
        @click="itemOnClick"
        class="m-item"
        v-for="(item, index) in this.data"
        :key="index"
      >
        <span> {{ item[modelName] }} </span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "MCombobox",
  data() {
    return {
      data: [],
      isShow: false,
      selectedIndex: null,
      isError: false,
      value: null,
    };
  },
  props: {
    // Dữ liệu cho combobox
    api: {
      type: String,
      required: true,
    },
    // Title của combobox
    title: {
      type: String,
      required: false,
    },
    // Có được để trống combobox không
    isRequired: {
      type: Boolean,
      required: false,
      default: false,
    },
    // Dữ liệu binding 2 chiều 
    modelValue: {
      type: [String, Number, Array, Object, Boolean],
      required: false,
    },
    // Dữ liệu mapping api
    modelName: {
      type: String,
      required: false,
    }
  },
  emits:["update:modeValue"],
  created() {
    fetch(this.api)
      .then((res) => res.json())
      .then((result) => {
        this.data = result;
      });
    this.value = this.modelValue;
  },
  methods: {
    /**
     * Set focus vào input
     * 
     * @author Xuân Đào (04/04/2023)
     */
    setFocus(){
      this.$refs.inpValue.focus();
    },
    /**
     * Hàm hiển thị các item khi focus vào input
     *
     * Author: Xuân Đào(05/03/2023)
     */
    onFocus() {
      this.isShow = true;
      for (let i = 0; i < this.$refs.itemList.children.length; i++) {
          this.$refs.itemList.children[i].style.display = "block";
        }
      window.addEventListener("keydown", this.handleEvent);
    },
    /**
     * Hàm ẩn các item khi focus out khỏi các input
     *
     * Author: Xuân Đào(05/03/2023)
     */
    onBlur() {
      setTimeout(() => {
        this.isShow = false;
        this.validate();
      }, 250);
      window.removeEventListener("keydown", this.handleEvent);
    },

    /**
     * Hàm lấy dữ liệu được chọn
     * 
     * Author: Xuân Đào (07/03/2023)
     */
    getValue(){
      return this.$refs.inpValue.value;
    },
    /**
     * Hàm set focus vào input khi nhấn vào button
     *
     * Author: Xuân Đào(05/03/2023)
     */
    btnClick() {
      this.$refs.inpValue.focus();
    },

    /**
     * Hàm handle sự kiện bàn phím khi focus vào combobox
     *
     * Author: Xuân Đào(05/03/2023)
     */
    handleEvent(event) {
      if (event.keyCode == 40) {
        // Key down
        if (
          this.selectedIndex == null ||
          this.selectedIndex == this.$refs.itemList.children.length - 1
        ) {
          this.selectedIndex = 0;
        } else {
          this.selectedIndex++;
        }
        this.updateItem();
      } else if (event.keyCode == 38) {
        // Key up
        if (this.selectedIndex == null || this.selectedIndex == 0) {
          this.selectedIndex = this.$refs.itemList.children.length - 1;
        } else {
          this.selectedIndex--;
        }
        this.updateItem();
      } else if (event.keyCode == 9 || event.keyCode == 13) {
        //Tab - enter
        this.$refs.inpValue.blur();
        this.updateItem();
      }
    },

    /**
     * Hàm cập nhật lại item đang được chọn
     *
     * Author: Xuân Đào(05/03/2023)
     */
    updateItem() {
      for (const item of this.$refs.itemList.children) {
        item.classList.remove("selected-item");
      }
      this.$refs.itemList.children[this.selectedIndex].classList.add(
        "selected-item"
      );
      this.$refs.inpValue.value =
        this.$refs.itemList.children[this.selectedIndex].textContent;
        this.value = this.$refs.itemList.children[this.selectedIndex].textContent;
        this.$emit("update:modelValue", this.$refs.itemList.children[this.selectedIndex].textContent);
    },

    /**
     * Hàm xử lý sự kiện chuột khi thao tác với combobox
     *
     * Author: Xuân Đào(05/03/2023)
     */
    itemOnClick(event) {
      this.$refs.inpValue.value = event.target.textContent;
      for (let i = 0; i < this.$refs.itemList.children.length; i++) {
        if (
          this.$refs.itemList.children[i].textContent ===
          event.target.textContent
        ) {
          this.selectedIndex = i;
          this.updateItem();
          return;
        }
      }
    },

    /**
     * Hàm validate không để trống combobox
     *
     * Author: Xuân Đào (05/03/2023)
     */
    validate() {
    let checkVal = false;
    for (const item of this.$refs.itemList.children) {
        if (item.children[0].textContent === this.$refs.inpValue.value){
            checkVal = true;
        }
    }
      if (this.isRequired && this.$refs.inpValue.value.trim() === "" || !checkVal) {
        this.isError = true;
        this.$refs.inpValue.parentElement.classList.add("input-err")
      } else {
        this.isError = false;
        this.$refs.inpValue.parentElement.classList.remove("input-err")
      }
    },

    /**
     * Hàm xử lý sự kiện khi nhập liệu vào input
     */
    onInput() {
      const inputVal = this.$refs.inpValue.value;
      let list = this.$refs.itemList.children;
      if (inputVal) {
        for (let i = 0; i < list.length; i++) {
          if (!this.removeVietnameseTones(list[i].children[0].textContent.toLowerCase()).includes(this.removeVietnameseTones(inputVal.toLowerCase()))) {
            list[i].style.display = "none";
          } else {
            list[i].style.display = "block";
          }
        }
      } else {
        for (let i = 0; i < list.length; i++) {
          list[i].style.display = "block";
        }
        
      }
    },

    /**
     * Hàm xóa các ký tự dấu và các ký tự đặc biệt
     */
    removeVietnameseTones(str) {
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a"); 
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e"); 
        str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i"); 
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o"); 
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u"); 
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y"); 
        str = str.replace(/đ/g,"d");
        str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
        str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
        str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
        str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
        str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
        str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
        str = str.replace(/Đ/g, "D");
        // Some system encode vietnamese combining accent as individual utf-8 characters
        // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
        str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
        str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
        // Remove extra spaces
        // Bỏ các khoảng trắng liền nhau
        str = str.replace(/ + /g," ");
        str = str.trim();
        return str;
    },

    /**
     * Lấy id record được chọn trong combobox
     * 
     * @author Xuân Đào (04/04/2023)
     */
    getSelectedId(modelValue){
      if (!this.selectedIndex){
        for (let i = 0; i< this.data.length; i++){
          const keys = Object.keys(this.data[i]);
          for (const key of keys) {
            if (this.data[i][`${key}`] == this.value) return this.data[i][`${modelValue}`];
          }
        }
      }
      return this.data[this.selectedIndex][`${modelValue}`];
    },

    /**
     * Lấy tên combobox
     * 
     * @author Xuân Đào (04/04/2023)
     */    
    getInputName(){
      return this.title;
    }
  },
};
</script>
<style scoped>
.m-txt {
  display: flex;
  column-gap: 4px;
  font-size: 13px;
}
.required {
  color: #e81e1e;
}
.m-combobox {
  display: flex;
  flex-direction: column;
  row-gap: 7px;
  position: relative;
}
.m-main {
  width: 100%;
  display: flex;
  border: solid 1px #b0b0b0;
  border-radius: 2px;
  position: relative;
}
input {
  border: unset !important;
  outline: unset !important;
  background-color: unset;
}
input[type="button"] {
  height: 36px;
  width: 36px;
  border-left: solid #e0e0e0 1px;
}
input[type="button"]:hover {
  background-color: unset;
  cursor: pointer;
}
input[type="text"] {
  width: calc(100% - 36px);
}
.combo-icon {
  height: 100% !important;
  position: absolute;
  background: url('@/assets/img/Sprites.64af8f61.svg') no-repeat -358px -355px;
  top: 0;
  right: 0;
  border-left: solid #b0b0b0 1px !important;
  border-radius: 0;
}
.m-item-list {
  position: absolute;
  width: 100%;
  z-index: 2;
  top: 55px;
  display: flex;
  border: solid #e0e0e0 1px;
  flex-direction: column;
  box-shadow: -1px 0px 1px 1px rgba(0, 0, 0, 0.05);
}
.m-item {
  height: 32px;
  width: calc(100% - 12px);
  font-size: 13px;
  background-color: #fff;
  color: #000;
  padding-left: 12px;
  line-height: 32px;
}

.m-item:hover {
  color: #50b83c;
  background-color: #e6e6e6;
  cursor: pointer;
}
.selected-item {
  background-color: #50b83c !important;
  color: #fff !important;
}
.errMess{
  color: red;
  font-size: 13px;
}
.input-err{
    border-color: #e81e1e;
}
.m-context{
  font-family: Opens-san-bold;
  font-weight: 600;
}
</style>