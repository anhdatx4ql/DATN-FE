<template>
  <div class="account-detail" :key="key">
    <div ref="detailMain" class="ad-main">
      <div ref="detailExpandBtn" @click="expandOnClick" class="ad-expand"></div>
      <div class="ad-title">
        <div class="ad-title__content">
          {{ this.formTitle }}
        </div>
        <div class="ad-title__action">
          <div class="icon help-icon" title="Trợ giúp (F1)"></div>
          <div class="icon close-icon" title="Đóng (ESC)" @click="this.$emit('closeUISeting')"></div>
        </div>
      </div>
      <div class="popup_main_content">
        <div class="content-main__header">
          <MSearchBar class="search-bar" ref="searchBar" :width="175" :placeholder="this.resources.vi.accountList.searchPlaceholder" @onSearch="this.searchOnInput"></MSearchBar>
        </div>
        <div class="p-main__content">
          <div class="p-main-content__scrollable">
            <div class="pc-row pc-header">
              <div class="pc-icon"></div>
              <MCheckbox ref="parentCheck" @click="parentClicked"></MCheckbox>
              <div class="pc-title">{{ this.resources.vi.ui_setting_data.colName }}</div>
            </div>
            <div ref="sortable" class="sortable">
              <div class="pc-row pc-row__data" v-for="(item,index) in sortData" :key="index">
                <div class="pc-icon"></div>
                <MCheckbox @click="this.localData[index]['display'] = !this.localData[index]['display']" :isChecked="item['display']"></MCheckbox>
                <div class="pc-title">{{ item[modelValue] }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="popup-main__footer">
        <div class="btn group-btn">
          <div class="btn-setdefault">
            <button @click="setDefaultUI" title="Lấy mẫu ngầm định" id="saveAdd">
              {{ this.resources.vi.ui_setting_button.setDefault }}
            </button>
          </div>
          <div class="btn-save">
            <button ref="saveButton" @click="saveUI" id="save" :title="this.resources.vi.btnAction.storeTooltip" class="optionalBtn">
              {{ this.resources.vi.btnAction.store }}
            </button>
          </div>
        </div>
        <div class="btn btn-close">
          <button ref="lastButton" @click="this.$emit('closeUISeting')" id="cancel" :title="this.resources.vi.btnAction.cancelTooltip"
            class="optionalBtn">
            {{ this.resources.vi.btnAction.cancel }}
          </button>
        </div>
      </div>
    </div>
    <MSingleActionDialog ref="singleDialog" @dialogOnClose="dialogClosed"></MSingleActionDialog>
    <MConfirmDialog
      v-if="showConfirmChange"
      @hideDialog="showConfirmChange = false"
      @hideDialogPopup="this.undoData()"
      @hideAndSave="this.saveData()"
    ></MConfirmDialog>
  </div>
</template>
<script>
import resources from '@/js/resources.js'
import MSingleActionDialog, { dialogType } from './MSingleActionDialog.vue';
import { toastControl } from '@/store/toast';
import MConfirmDialog from './MConfirmDialog.vue';
import MSearchBar from '../base-component/MSearchBar.vue';
import MCheckbox from '../base-component/MCheckbox.vue';
import Sortable from 'sortablejs'
import { accountListFull } from '@/js/gridDataConfig';

export default {
  name: "MAccountDetail",

  props: {
    data:{
      type: Array,
      required: false,
    },

    modelValue: {
      type: String,
      required: false,
    }
  },

  setup() {
    const Toast = toastControl();
    return {
      Toast,
    };
  },

  components: {
    MSingleActionDialog,
    MConfirmDialog,
    MSearchBar,
    MCheckbox
  },

  created() {
    this.formTitle = this.resources.vi.ui_setting;
    if (localStorage.AccountUI){
      this.sortData = JSON.parse(localStorage.AccountUI);
    } else {
      this.sortData = accountListFull;
    }
    this.localData = this.sortData.slice();
  },

  mounted() {
    this.initSortable();
    window.addEventListener('keydown', this.handleOnKeydown);
    
  },

  unmounted(){
    window.removeEventListener('keydown', this.handleOnKeydown);
  },

  data() {
    return {
      isExpanded: false,
      resources: resources,
      collase: false,
      localData: null,
      sortData: null,
      key: 0,
    }
  },

  methods: {

    initSortable(){
      Sortable.create(this.$refs.sortable, {
      animation: 125,
      onEnd: (evt) => {
        if (evt.newIndex != evt.oldIndex){
          let oldAccount = this.localData[evt.oldIndex]
          if (evt.oldIndex < evt.newIndex) {
            for (let i = evt.oldIndex; i <= evt.newIndex;i++){
              if (i != evt.newIndex)
                this.localData[i] = this.localData[i + 1];
              else this.localData[evt.newIndex] = oldAccount;
            }
          } else {
            for (let i = evt.oldIndex; i>= evt.newIndex; i--){
              if (i != evt.newIndex)
                this.localData[i] = this.localData[i - 1];
              else this.localData[evt.newIndex] = oldAccount;
            }
          }
        }
      }
    });
    },

    /**
     * Hàm lấy mẫu ngầm định
     * @author Xuân Đào (13/05/2023)
     */
    setDefaultUI(){
      this.sortData = accountListFull;
      this.localData = accountListFull;
      this.key++;
      setTimeout(() => {
        this.initSortable();
      }, 200);
    },

    /**
     * Hàm lưu ui đã chọn
     * @author Xuân Đào (13/05/2023)
     */
    saveUI(){
      let activeUI = 0;
      this.localData.forEach(el => {
        if (el.display) activeUI++;
      })
      if (activeUI > 0){
        this.$emit("saveUI", this.localData);
        localStorage.AccountUI = JSON.stringify(this.localData);
      } else {
        this.$refs.singleDialog.showDialogOn(dialogType.error, "Cần ít nhất 1 cột dữ liệu để hiển thị vui lòng kiểm tra lại!", this.resources.vi.btnAction.confirm);
      }
    },

    /**
     * Hàm check / uncheck toàn bộ hàng
     * @author Xuân Đào (13/05/2023)
     */
    parentClicked(){
      this.localData.forEach(el => {
        el['display'] = this.$refs.parentCheck.checked
      })
      let els = this.$refs.sortable.children;
      for (let i=0;i<els.length;i++){
          if (this.$refs.parentCheck.checked){
            els[i].children[1].classList.add("checked");
          } else {
            els[i].children[1].classList.remove("checked");
          }
        }
    },

    /**
     * Hàm mở rộng popup
     * @author Xuân Đào (13/05/2023)
     */
    expandOnClick() {
      if (!this.isExpanded) {
        this.isExpanded = true;
        this.$refs.detailMain.classList.remove("ad-collase");
        this.$refs.detailMain.classList.add("ad-full");
        this.$refs.detailExpandBtn.classList.add("expanded");
      } else {
        this.isExpanded = false;
        this.$refs.detailMain.classList.remove("ad-full");
        this.$refs.detailExpandBtn.classList.remove("expanded");
        this.$refs.detailMain.classList.add("ad-collase");
      }
    },

    /**
     * Hàm lưu thu gọn popup
     * @author Xuân Đào (13/05/2023)
     */
    collaseOnClick() {
      if (!this.collase) {
        this.collase = true;
        this.$refs.collaseContent.classList.add("collase-inf");
        this.$refs.collaseContent.classList.remove("expand-inf");
        this.$refs.collaseIcon.classList.add("rotate90");
        this.$refs.collaseIcon.classList.remove("unrotate");
      } else {
        this.collase = false;
        this.$refs.collaseContent.classList.remove("collase-inf");
        this.$refs.collaseContent.classList.add("expand-inf");
        this.$refs.collaseIcon.classList.remove("rotate90");
        this.$refs.collaseIcon.classList.add("unrotate");
      }
    },
  },
}
</script>
<style scoped>

.pc-row__data:hover{
  background-color: #f6f6f6;
}

.sortable{
  user-select: none;
  cursor: pointer;
}

.pc-header{
  background-color: #efefef;
}

.pc-header .pc-icon{
  background: transparent !important;
}

.pc-row{
  display: flex;
  column-gap: 12px;
  align-items: center;
  height: 32px;
  padding: 0 12px;
  font-size: 13px;
  border-bottom: solid #d0d0d0 1px;
}

.pc-header .pc-title{
  font-family: Notosans-bold;
}

.p-main__content{
  width: calc(100% - 48px);
  margin: 8px 24px;
  height: calc(100% - 44px - 118px);
  position: absolute;
}

.btn-save button{
  font-weight: 500;
  border: none;
  background-color: #2ca01c;
  border-radius: 4px;
  color: #fff;
}
.btn-save button:hover{
  background-color: #57C841;
  cursor: pointer;
}

.btn-setdefault button{
  padding: 0 12px;
}
.btn-setdefault button:hover{
  background-color: #e0e0e0;
  cursor: pointer;
}

.p-content__header{
  display: flex;
  position: relative;
}

.search-bar{
  position: absolute;
  left: 15px;
}

.property-group {
  display: flex;
  flex-direction: column;
  row-gap: 8px;
}

.property-group div {
  font-size: 13px;
  font-family: Notosans-bold;
}

.ad-collase__item--title {
  font-size: 13px;
  color: #111111;
  min-width: 100px;
}

.ad-collase__item {
  height: 26px;
  width: 100%;
  display: flex;
  align-items: center;
  column-gap: 2%;
}

.ad-collase__content--right {
  height: 100%;
  width: 49%;
  display: flex;
  flex-direction: column;
  row-gap: 10px;
}

.ad-collase__content--left {
  height: 100%;
  width: 49%;
  margin-right: 2%;
  display: flex;
  flex-direction: column;
  row-gap: 10px;
}

.ad-collase__content {
  display: flex;
  height: 100%;
  width: 98%;
  margin-left: 2%;
  position: relative;
}

.adc-header__content {
  height: 22px;
  line-height: 22px;
  font-size: 16px;
  font-family: Notosans;
  color: #111111;
}

.adc-header__content:hover {
  color: #2ca10c;
}

.adc-header__icon {
  background: url("@/assets/img/Sprites.64af8f61.svg") no-repeat -371px -364px;
  width: 10px;
  height: 8px;
  transform: rotate(0deg);
}

.ad-collase__header {
  height: 30px;
  width: 100%;
  display: flex;
  column-gap: 4px;
  align-items: center;
  cursor: pointer;
}

.ad-collase__information {
  height: 35%;
  width: 100%;
}

.ad-checkbox__txt {
  color: #111111;
  font-size: 13px;
}

.ad-checkbox__container {
  display: flex;
  align-items: center;
  column-gap: 8px;
  cursor: pointer;
}

.ad-content__row--item {
  flex: 1;
}

.ad-content__row2 {
  width: calc(50% - 6px);
  display: flex;
  column-gap: 12px;
}

.ad-content__row1 {
  width: calc(25% - 6px);
  display: flex;
}

.ad-content__row {
  width: 100%;
  display: flex;
  column-gap: 12px;
}

.ad-footer {
  height: 46px;
  width: 100%;
  border-top: solid 1px #d0d0d0;
}

.ad-content {
  width: 100%;
  height: 45%;
  display: flex;
  flex-direction: column;
  row-gap: 10px;
}

.ad-base__information {
  width: calc(100% - 32px);
  height: calc(100% - 46px - 61px);
  margin: 0 16px;
}

.ad-title__action {
  display: flex;
  padding: 16px;
  column-gap: 8px;
}

.ad-title__content {
  font-size: 24px;
  font-family: Notosans-semibold;
  line-height: 33px;
  padding: 16px;
}

.ad-title {
  height: 61px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.account-detail {
  height: 100vh;
  width: 100%;
  left: 0;
  top: 0;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.4);
  position: fixed;
}

.ad-main {
  height: 100%;
  width: 800px;
  resize: none;
  box-sizing: border-box;
  background-color: #fff;
  border-radius: 4px;
  position: absolute;
  right: 0;
}

.ad-expand {
  height: 50px;
  width: 12px;
  border: solid #d0d0d0 1px;
  background-color: #fff;
  position: absolute;
  top: calc(50% - 50px);
  left: -6px;
  border-radius: 10px;
  cursor: pointer;
}

.expanded {
  rotate: 180deg;
}

.collased {
  rotate: 180deg;
}

.ad-expand::after {
  content: "";
  display: block;
  width: 8px;
  height: 14px;
  position: absolute;
  top: calc(50% - 7px);
  left: 2px;
  background: url("@/assets/img/Sprites.64af8f61.svg") no-repeat -36px -361px;
}

.ad-full {
  animation-name: expand;
  animation-duration: 0.5s;
  animation-fill-mode: forwards;
}

.ad-collase {
  animation-name: collase;
  animation-duration: 0.5s;
  animation-fill-mode: forwards;
}

.icon {
  cursor: pointer;
}

.collase-inf::after {
  content: "";
  height: 100%;
  width: 100%;
  background-color: #fff;
  position: absolute;
  bottom: 1px;
  left: 0;
  animation-name: collaseInf;
  animation-duration: 0.5s;
  animation-fill-mode: forwards;
}

.expand-inf::after {
  content: "";
  height: 100%;
  width: 100%;
  background-color: #fff;
  position: absolute;
  bottom: 1px;
  left: 0;
  animation-name: expandInf;
  animation-duration: 0.5s;
  animation-fill-mode: forwards;
}

.rotate90 {
  transform: rotate(-90deg);
  transition-duration: 0.5s;
}

.unrotate {
  transform: rotate(0deg);
  transition-duration: 0.5s;
}

.popup-main__footer {
  position: absolute;
  bottom: 0;
  height: 48px;
}

@keyframes expand {
  from {
    width: 800px;
  }

  to {
    width: 99%;
  }
}

@keyframes collase {
  from {
    width: 99%;
  }

  to {
    width: 800px;
  }
}

@keyframes collaseInf {
  from {
    height: 0%;
  }

  to {
    height: 100%;
  }
}

@keyframes expandInf {
  from {
    height: 100%;
  }

  to {
    height: 0%;
  }
}
</style>