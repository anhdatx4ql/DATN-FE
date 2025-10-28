// Component tạo ra một autocomplete combobox từ api
// Author: pvdat(05/03/2023)
<template>
  <div class="m-combobox">
    <div class="m-txt">
      <div class="m-context">{{ title }}</div>
      <span class="required" v-if="isRequired">*</span>
    </div>
    <div class="m-main" :class="{ 'input-err': isError }">
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
    <div class="errMess" v-if="isError">{{ title }} không được để trống</div>
    <div ref="itemList" v-show="isShow" class="m-item-list">
      <div
        @click="itemOnClick"
        class="m-item"
        v-for="(item, index) in data"
        :key="index"
      >
        <span>{{ item[modelName] }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MCombobox",
  props: {
    // API để lấy dữ liệu cho combobox
    api: {
      type: String,
      required: true,
    },
    // Tiêu đề của combobox
    title: {
      type: String,
      required: false,
    },
    // Bắt buộc nhập hay không
    isRequired: {
      type: Boolean,
      required: false,
      default: false,
    },
    // Dữ liệu binding 2 chiều (v-model)
    modelValue: {
      type: [String, Number, Array, Object, Boolean],
      required: false,
    },
    // Tên trường trong object dữ liệu để hiển thị
    modelName: {
      type: String,
      required: true,
    },

    // ID của department để hiển thị tên tương ứng
    selectedId: {
      type: [String, Number],
      required: false,
      default: null
    },
    
    // Tên trường ID trong dữ liệu
    idField: {
      type: String,
      required: false,
      default: 'id'
    }
  },
  emits: ["update:modelValue", "item-selected"],
  data() {
    return {
      data: [],
      isShow: false,
      selectedIndex: null,
      isError: false,
      value: null,
    };
  },
  watch: {
    // Cập nhật giá trị nội bộ khi modelValue thay đổi từ bên ngoài
    modelValue(newValue) {
      this.value = newValue;
    },
    // Watch mới để cập nhật khi dữ liệu được tải
    data: {
      handler(newData) {
        // Nếu có selectedId và data đã được tải
        if (this.selectedId && newData && newData.length > 0) {
          this.setValueById(this.selectedId);
        }
      },
      immediate: true
    },
    
    // Watch khi selectedId thay đổi
    selectedId(newId) {
      if (newId && this.data && this.data.length > 0) {
        this.setValueById(newId);
      }
    }
  },
  created() {
    // Lấy dữ liệu từ API khi component được tạo (bảo vệ lỗi mạng)
    (async () => {
      try {
        const res = await fetch(this.api);
        if (!res.ok) {
          console.error(`MCombobox: failed to fetch ${this.api} - status ${res.status}`);
          this.data = [];
          return;
        }
        const result = await res.json();
        this.data = result;
      } catch (err) {
        // Bắt lỗi mạng hoặc lỗi parse
        console.error('MCombobox: error fetching data from', this.api, err);
        this.data = [];
      }
    })();
    // Gán giá trị ban đầu từ v-model
    this.value = this.modelValue || '';
  },
  methods: {
    /**
     * Set focus vào input, có thể gọi từ component cha
     * @author pvdat (04/04/2023)
     */
    setFocus() {
      this.$refs.inpValue.focus(); 
    }, 
    
    /** * Hiển thị danh sách item khi focus vào input 
     * @author pvdat(05/03/2023) 
    */ 
   onFocus() { this.isShow = true; 
      // Hiển thị lại tất cả các item (nếu đã bị ẩn do tìm kiếm) 
      if (this.$refs.itemList) {
        for (let i = 0; i < this.$refs.itemList.children.length; i++) { this.$refs.itemList.children[i].style.display = "block";
        }
      }
      window.addEventListener("keydown", this.handleEvent);
    },

    /**
     * Ẩn danh sách item khi focus ra ngoài
     * @author pvdat(05/03/2023)
     */
    onBlur() {
      // Dùng setTimeout để sự kiện click vào item kịp thực thi trước khi dropdown bị ẩn
      setTimeout(() => {
        this.isShow = false;
        this.validate();
      }, 250);
      window.removeEventListener("keydown", this.handleEvent);
    },

    /**
     * Lấy giá trị hiện tại của input
     * @author pvdat (07/03/2023)
     */
    getValue() {
      return this.$refs.inpValue.value; 
    }, 
    /** * Focus vào input khi nhấn vào button icon 
     * @author pvdat(05/03/2023) 
    */ 
    btnClick() 
    { 
      this.$refs.inpValue.focus();
    },

    /**
     * Xử lý sự kiện bàn phím (lên, xuống, enter, tab)
     * @author pvdat(05/03/2023)
     */
    handleEvent(event) {
      const items = this.$refs.itemList.children; if (!items || items.length === 0) return; if (event.key === "ArrowDown") { event.preventDefault(); if (this.selectedIndex === null || this.selectedIndex >= items.length - 1) { this.selectedIndex = 0; } else { this.selectedIndex++; } this.updateItem(); } else if (event.key === "ArrowUp") { event.preventDefault(); if (this.selectedIndex === null || this.selectedIndex <= 0) { this.selectedIndex = items.length - 1; } else { this.selectedIndex--; } this.updateItem(); } else if (event.key === "Enter" || event.key === "Tab") { event.preventDefault(); if (this.selectedIndex !== null) { this.updateItem(); } this.$refs.inpValue.blur();
      }
    },

    /**
     * Cập nhật item đang được chọn (highlight và gán giá trị)
     * @author pvdat(05/03/2023)
     */
    updateItem() {
      const items = this.$refs.itemList.children; 
      if (!items[this.selectedIndex]) return; 
      
      // Bỏ highlight tất cả các item 
      for (const item of items) { 
        item.classList.remove("selected-item"); 
      } 
      
      // Highlight item được chọn 
      items[this.selectedIndex].classList.add("selected-item"); 
      const selectedValue = items[this.selectedIndex].textContent.trim(); 
      this.value = selectedValue; 
      this.$emit("update:modelValue", selectedValue);
      
      // Tìm và emit item được chọn
      const selectedItem = this.data.find(item => item[this.modelName] === selectedValue);
      if (selectedItem) {
        this.$emit("item-selected", selectedItem);
      }
    },

    /**
     * Xử lý sự kiện khi click chuột vào một item
     * @author pvdat(05/03/2023)
     */
    itemOnClick(event) {
      const selectedText = event.currentTarget.textContent.trim();
      this.value = selectedText;
      this.$emit("update:modelValue", selectedText); 
      // Tìm index của item được click để highlight 
      for (let i = 0; i < this.$refs.itemList.children.length; i++) {
        if (this.$refs.itemList.children[i].textContent.trim() === selectedText) 
        { 
          this.selectedIndex = i; this.updateItem(); break; 
        } 
      }
      
      // Tìm index của item được click để highlight 
      for (let i = 0; i < this.$refs.itemList.children.length; i++) {
        if (this.$refs.itemList.children[i].textContent.trim() === selectedText) { 
          this.selectedIndex = i; 
          this.updateItem(); 
          break; 
        } 
      } 

      // Đóng dropdown sau khi chọn 
      this.isShow = false; 
    }, 
    
    /** * Kiểm tra tính hợp lệ của combobox 
     * @author pvdat (05/03/2023) 
    */ 
    validate() { 
      let isValid = false; 
      // Kiểm tra xem giá trị nhập vào có tồn tại trong danh sách dữ liệu không 
      if (this.value) 
      { 
        for (const item of this.data) 
        { 
          if (item[this.modelName] === this.value.trim()) 
          { 
            isValid = true; break; 
          } 
        } 
      } 
      
      // Nếu bắt buộc nhập và giá trị không hợp lệ (rỗng hoặc không có trong danh sách) 
      if (this.isRequired && !isValid) 
      { 
        this.isError = true; 
      } else {
         this.isError = false; 
        } 
    }, 
      
      /** 
       * Lọc danh sách khi người dùng nhập liệu vào input 
      */
    onInput() { 
      const inputVal = this.value || ""; 
      const list = this.$refs.itemList.children;
      if (!list) return;

      const normalizedInput = this.removeVietnameseTones(inputVal.toLowerCase());
      
      for (let i = 0; i < list.length; i++) {
        const itemText = list[i].textContent;
        const normalizedItemText = this.removeVietnameseTones(itemText.toLowerCase());

        if (normalizedItemText.includes(normalizedInput)) {
          list[i].style.display = "block";
        } else {
          list[i].style.display = "none";
        }
      }
    },

    /**
     * Hàm xóa dấu tiếng Việt để tìm kiếm
     */
    removeVietnameseTones(str) {
      str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
      str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
      str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
      str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
      str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
      str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
      str = str.replace(/đ/g, "d");
      str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
      str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
      str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
      str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
      str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
      str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
      str = str.replace(/Đ/g, "D");
      str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); //  ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
      str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
      str = str.replace(/ +/g, " ").trim();
      return str;
    },

    /**
     * Lấy ID của record được chọn
     * @author pvdat (04/04/2023)
     */
    getSelectedId(idKey) {
      const selectedItem = this.data.find(item => item[this.modelName] === this.value);
      return selectedItem ? selectedItem[idKey] : null;
    },

    /**
     * Lấy tên của combobox
     * @author pvdat (04/04/2023)
     */
    getInputName() {
      return this.title;
    },
     /**
     * Thiết lập giá trị hiển thị dựa trên ID
     * @param {String|Number} id - ID của item cần hiển thị
     * @author pvdat (29/10/2025)
     */
    setValueById(id) {
      const item = this.data.find(item => item[this.idField] == id);
      if (item) {
        this.value = item[this.modelName];
        this.$emit("update:modelValue", this.value);
      }
    }
  },
};
</script>
<style scoped>
.m-combobox {
  display: flex;
  flex-direction: column;
  row-gap: 7px;
  position: relative;
  font-family: sans-serif; /* Thêm font chữ cơ bản để dễ nhìn */
}

.m-txt {
  display: flex;
  column-gap: 4px;
  font-size: 14px;
  margin-bottom: 4px; /* Thêm khoảng cách dưới tiêu đề */
}

.m-context {
  font-weight: 600;
}

.required {
  color: #e81e1e;
}

.m-main {
  width: 100%;
  display: flex;
  border: solid 1px #b0b0b0;
  border-radius: 4px; /* Bo góc nhẹ nhàng */
  position: relative;
  background-color: #fff;
  transition: border-color 0.2s ease;
}

.m-main:focus-within {
  border-color: #50b83c; /* Highlight viền khi focus vào input bên trong */
  box-shadow: 0 0 0 2px rgba(80, 184, 60, 0.2);
}

.m-main.input-err {
  border-color: #e81e1e !important;
}

input {
  border: none !important;
  outline: none !important;
  background-color: transparent;
  padding: 0 12px;
}

input[type="text"] {
  width: calc(100% - 36px);
  height: 34px;
  font-size: 14px;
}

input[type="button"] {
  height: 36px;
  width: 36px;
  border-left: solid 1px #e0e0e0;
  cursor: pointer;
  padding: 0;
}

.combo-icon {
  position: absolute;
  top: 0;
  right: 0;
  height: 100% !important;
  /* Sử dụng SVG inline để không phụ thuộc vào ảnh ngoài */
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E") no-repeat center center;
  background-size: 18px;
  border-radius: 0 3px 3px 0;
}

.m-item-list {
  position: absolute;
  width: 100%;
  z-index: 10;
  top: calc(100% + 4px); /* Vị trí dropdown ngay bên dưới input */
  border: solid 1px #e0e0e0;
  border-radius: 4px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-height: 200px;
  overflow-y: auto;
}

.m-item {
  height: 36px;
  padding: 0 12px;
  font-size: 14px;
  display: flex;
  align-items: center;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.m-item:hover {
  background-color: #f0f0f0;
}

.m-item.selected-item {
  background-color: #50b83c;
  color: #fff;
}

.errMess {
  color: #e81e1e;
  font-size: 13px;
  margin-top: -4px; /* Giảm khoảng cách khi có lỗi để giao diện đẹp hơn */
}
</style>