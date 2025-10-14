<template>
  <div
    class="combobox-nomal"
    id="combobox-paging"
    tabindex="0"
    :class="{ 'focused': showData, 'disabled': !enable }"
    @focus="comboboxOnFocus"
    @blur="comboboxOnBlur"
    @keydown="comboboxOnKeyDown"
    ref="focusable"
  >
    <input ref="cbInput" type="text" class="selected" tabindex="-1" v-model="comboboxData[selected]" />
    <div class="icon dropdown-icon" @click="iconOnClick"></div>
    <div ref="cbMain" class="combo-item-list" v-show="showData">
      <div
        :class="{ 'seleted-item': selected == index }"
        class="combo-item"
        @click="itemOnClick(index)"
        v-for="(item, index) in comboboxData"
        :key="index"
      >
        {{ item }}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    // Dữ liệu cho combobox
    data: {
      type: Array,
      required: true,
    },

    // Item được chọn của combobox
    defaultValue: {
      type: Number,
      required: false,
      default: 0,
    },

    enable: {
      type: Boolean,
      required: false,
      default: true,
    },

    displayDirection: {
      type: String,
      required: false,
      default: "Down",
    },

    display_list_no:{
      type: Boolean,
      required: false,
      default: false,
    },

    defaultValueByText:{
      type: String,
      required: false,
    }
  },

  created() {
    this.selected = this.defaultValue;
    if (this.display_list_no){
      for(let i=0;i<this.data.length;i++) this.comboboxData.push(`${i+1}. ${this.data[i]}`);
    } else {
      this.comboboxData = this.data;
    }
    this.isEnable = this.enable;
  },

  watch:{
    enable: function(newVal){
      if(!newVal) this.selected = -1;
      else this.selected = 0;
    }
  },

  mounted(){

    if(!this.enable) this.$refs.cbInput.value = ""; 

    switch(this.displayDirection){
      case "Down":{
        this.$refs.cbMain.classList.add("combo-item-list__down")
        break;
      }
      case "Up":{
        this.$refs.cbMain.classList.add("combo-item-list__up")
        break;
      }
      case "Left":{
        this.$refs.cbMain.classList.add("combo-item-list__left")
        break;
      }
      case "Right":{
        this.$refs.cbMain.classList.add("combo-item-list__right")
        break;
      }
    }

    this.$nextTick(function () {
      if (this.defaultValueByText && this.defaultValueByText.length > 0){
        this.$refs.cbInput.value = this.defaultValueByText;
        for (let i=0;i<this.comboboxData.length;i++){
          if (this.comboboxData[i] == this.defaultValueByText){
            this.selected = i;
          }
        }
      }
    })
  },

  data() {
    return {
      selected: null,
      comboboxData: [],
      showData: false,
      isEnable: false,
    };
  },

  methods: {

    /**
     * Set blur ra khỏi combobox 
     * 
     * @author pvdat (14/05/2023)
     * */
    setBlur(){
      this.$refs.focusable.classList.remove('focused');
    },

     /**
     * Set focus vào combobox 
     * 
     * @author pvdat (14/05/2023)
     * */
    setFocus(){
      this.$refs.focusable.classList.add('focused');
      this.$refs.focusable.focus();
    },

    /**
     * Xự kiện click vào item trong combobox
     * 
     * @author pvdat (04/04/2023)
     */
    itemOnClick(index) {
      this.selected = index;
      this.$emit("changeVal", index);
      this.showData = false;
    },

    /**
     * Xự kiện focus vào input trong combobox
     * 
     * @author pvdat (04/04/2023)
     */
    comboboxOnFocus() {
      if(this.isEnable)
        this.showData = true;
    },

    /**
     * Xự kiện unfocus khỏi input trong combobox
     * 
     * @author pvdat (04/04/2023)
     */
    comboboxOnBlur() {
      this.showData = false;
    },

    /**
     * Xự kiện bàn phím trong combobox
     * 
     * @author pvdat (04/04/2023)
     */
    comboboxOnKeyDown() {
      if (event.key == "ArrowUp") {
        if (this.selected == 0) this.selected = this.comboboxData.length - 1;
        else this.selected--;
        this.showData = true;
      } else if (event.key == "ArrowDown") {
        if (this.selected == this.comboboxData.length - 1) this.selected = 0;
        else this.selected++;
        this.showData = true;
      } else if (event.key == "Enter") {
        this.$emit("changeVal", this.selected);
        this.showData = false;
      } else if (event.key == "Tab") {
        this.$emit("changeVal", this.selected);
        this.showData = false;
      }
    },

    /**
     * Xự kiện chuột trong combobox
     * 
     * @author pvdat (04/04/2023)
     */
    iconOnClick(){
      if(this.enable){
        this.showData = !this.showData;
      }
    },
  },
};
</script>
<style scoped>

.disabled{
  background-color: #eff0f2;
  cursor: not-allowed;
}

input {
  border: unset;
  font-size: 13px;
  outline: unset;
  background-color: unset;
  pointer-events: none;
}
.combobox-nomal {
  font-size: 14px;
  height: 26px;
  width: 220px;
  color: #1f1f1f;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: #b0b0b0 1px solid;
  border-radius: 2px;
  position: relative;
  outline: unset;
}

.combobox-nomal:focus{
  border: #50b83c solid 1px;
}

.disabled .dropdown-icon{
  cursor: not-allowed;
}

.dropdown-icon {
  cursor: pointer;
  margin-top: 15px;
  position: absolute;
  right: 0;
}

.selected {
  line-height: 26px;
  margin: 0;
  width: 100%;
  padding-left: 12px;
}

.combo-item-list {
  width: 100%;
  position: absolute;
  background-color: #fff;
  border: solid #b0b0b0 1px;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  z-index: 99;
}

.combo-item-list__up{
  bottom: 30px;
}

.combo-item-list__down{
  top: 30px;
}

.combo-item-list__up{
  bottom: 30px;
}

.combo-item-list__up{
  bottom: 30px;
}

.combo-item {
  height: 32px;
  line-height: 26px;
  padding-left: 12px;
  display: flex;
  align-items: center;
}

.combo-item:last-child {
  margin-bottom: 4px;
}

.combo-item:first-child {
  margin-top: 4px;
}

.combo-item:hover {
  background-color: #f0f0f0;
  color: #50b83c;
  cursor: pointer;
}

.seleted-item {
  background-color: #50b83c !important;
  color: #fff !important;
}

.focused {
  border: #50b83c solid 1px;
}
</style>