<template>
  <div class="input-component" :class="{ unfocus: !isFocus }" ref="inputComponent">
    <input
      ref="searchBar"
      @focus="inputOnFocus"
      @blur="inputOnBlur"
      @keyup="inputOnSearch"
      type="text"
      class="search"
      :placeholder="this.placeholder"
    />
    <div class="icon search-icon"></div>
  </div>
</template>
<script>
import debounce from 'lodash/debounce'
export default {
  name: "MSearchBar",

  props:{
    width: {
      type: Number,
      required: false,
    },

    placeholder:{
      type: String,
      required: false,
      default: "Tìm kiếm"
    }
  },

  mounted(){
    this.$refs.inputComponent.style.width = this.width + "px";
  },

  data() {
    return {
      isFocus: false,
    };
  },

  methods: {

    getInputValue(){
      return this.$refs.searchBar.value;
    },

    /**
     * Khi focus vào input
     *
     * @author  Xuân Đào (12/03/2023)
     */
    inputOnFocus() {
      this.isFocus = true;
    },

    /**
     * Khi thoát khỏi input
     *
     * @author  Xuân Đào (12/03/2023)
     */
    inputOnBlur() {
      this.isFocus = false;
    },

    /**
     * Hàm debounce tìm kiếm sau 0.5s không nhập liệu
     *
     * @author  Xuân Đào (12/03/2023)
     */
    inputOnSearch: debounce(function() {
      this.$emit('onSearch', this.$refs.searchBar.value);
    }, 500),
  },
};
</script>
<style scoped>
  input::placeholder{
    font-size: 12px;
  }
</style>