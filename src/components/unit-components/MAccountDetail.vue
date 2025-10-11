<template>
  <div class="account-detail" :key="formKey">
    <div ref="detailMain" class="ad-main">
      <div ref="detailExpandBtn" @click="expandOnClick" class="ad-expand"></div>
      <div class="ad-title">
        <div class="ad-title__content">
          {{ this.formTitle }}
        </div>
        <div class="ad-title__action">
          <div class="icon help-icon" title="Trợ giúp (F1)"></div>
          <div class="icon close-icon" title="Đóng (ESC)" @click="closeDetail"></div>
        </div>
      </div>
      <div class="ad-base__information">
        <div class="ad-content">
          <div class="ad-content__row1">
            <MInput ref="inpAccountNumber" class="ad-content__row--item" titleColor="333333"
              :input-title="this.resources.vi.accountList.data.accountNumber" :required="true" inputType="number"
              v-model="this.currentAccount['accountnumber']" :max-length="20" :min-length="3"></MInput>
          </div>
          <div class="ad-content__row">
            <MInput ref="inpAccountName" class="ad-content__row--item" titleColor="333333"
              :input-title="this.resources.vi.accountList.data.accountName" v-model="this.currentAccount['accountname']"
              :required="true" :max-length="255" ></MInput>
            <MInput ref="inpEnglishName" class="ad-content__row--item" titleColor="333333"
              :input-title="this.resources.vi.accountList.data.englishName" v-model="this.currentAccount['englishname']"
              :required="false" :max-length="255"></MInput>
          </div>
          <div class="ad-content__row2">
            <MScrollableCombobox :width="440" :rawData="scrollableData" titleColor="333333"
              :inputTitle="this.resources.vi.accountList.parentAcc" :required="false" :mapData="[
                  {
                    title: this.resources.vi.accountList.data.accountNumber,
                    modelValue: 'accountnumber',
                    width: 150,
                  },
                  {
                    title: this.resources.vi.accountList.data.accountName,
                    modelValue: 'accountname',
                    width: 250,
                  },
                ]" ref="inpDependency" display-model="accountnumber" @updateModelValue="updateDependency" field="dependency"></MScrollableCombobox>
            <MScrollableCombobox :width="170" :rawData="this.resources.vi.accountDetail.property" titleColor="333333"
              inputTitle="Tính chất" :required="true" :mapData="[
                  {
                    title: 'Tính chất',
                    modelValue: 'props',
                    width: 150,
                  },
                ]" ref="inpProperty" display-model="props" @updateModelValue="updateProperty" field="props"></MScrollableCombobox>
          </div>
          <div class="ad-content__row">
            <MTextArea ref="inpDescription" class="ad-content__row--item" titleColor="333333"
              :input-title="this.resources.vi.accountList.data.description" v-model="this.currentAccount['description']" :maxLength="255" :required="false"></MTextArea>
          </div>
          <div class="ad-checkbox__container">
            <MCheckbox :isCheckedByNum="this.currentAccount['accountbyexception']" @click="this.accountByException = !this.accountByException" @updateStatus="this.accountByException = !this.accountByException" ref="checkAccounting"></MCheckbox>
            <div class="ad-checkbox__txt">
              {{ this.resources.vi.accountDetail.checkboxTitle.Accounting }}
            </div>
          </div>
        </div>

        <div class="ad-collase__information">
          <div class="ad-collase__header" @click="collaseOnClick">
            <div ref="collaseIcon" class="adc-header__icon"></div>
            <div class="adc-header__content">
              {{ this.resources.vi.accountDetail.followTo }}
            </div>
          </div>
          <div class="ad-collase__content" ref="collaseContent">
            <div class="ad-collase__content--left">
              <div class="ad-collase__item">
                <MCheckbox :isCheckedByNum="this.currentAccount['followobject']" @click="this.followObject = !this.followObject" @updateStatus="this.followObject = !this.followObject"></MCheckbox>
                <div class="ad-collase__item--title">
                  {{ this.resources.vi.accountDetail.checkboxTitle.Object }}
                </div>
                <MComboboxNomal :default-value-by-text="this.currentAccount['followobjectvalue']" ref="comboObject" :enable="this.followObject" :data="this.resources.vi.accountDetail.comboboxData.ObjectFollow
                  "></MComboboxNomal>
              </div>
              <div class="ad-collase__item">
                <MCheckbox :isCheckedByNum="this.currentAccount['followobjectthcp']" @click="this.followObjectTHCP = !this.followObjectTHCP" @updateStatus="this.followObjectTHCP = !this.followObjectTHCP"></MCheckbox>
                <div class="ad-collase__item--title">
                  {{ this.resources.vi.accountDetail.checkboxTitle.ObjectTHCP }}
                </div>
                <MComboboxNomal ref="comboObjectTHCP" :default-value-by-text="this.currentAccount['followobjectthcpvalue']" :enable="this.followObjectTHCP" :data="this.resources.vi.accountDetail.comboboxData.AlertRequired
                  "></MComboboxNomal>
              </div>
              <div class="ad-collase__item">
                <MCheckbox :isCheckedByNum="this.currentAccount['followorder']" @click="this.followOrder = !this.followOrder" @updateStatus="this.followOrder = !this.followOrder"></MCheckbox>
                <div class="ad-collase__item--title">
                  {{ this.resources.vi.accountDetail.checkboxTitle.Order }}
                </div>
                <MComboboxNomal ref="comboOrder" :default-value-by-text="this.currentAccount['followordervalue']" :enable="this.followOrder" :data="this.resources.vi.accountDetail.comboboxData.AlertRequired
                  "></MComboboxNomal>
              </div>
              <div class="ad-collase__item">
                <MCheckbox :isCheckedByNum="this.currentAccount['followcontract']" @click="this.followContract = !this.followContract" @updateStatus="this.followContract = !this.followContract"></MCheckbox>
                <div class="ad-collase__item--title">
                  {{
                    this.resources.vi.accountDetail.checkboxTitle
                      .PurchaseContract
                  }}
                </div>
                <MComboboxNomal :default-value-by-text="this.currentAccount['followcontractvalue']" ref="comboContract" :enable="this.followContract" :data="this.resources.vi.accountDetail.comboboxData.AlertRequired
                    "></MComboboxNomal>
              </div>
              <div class="ad-collase__item">
                <MCheckbox :isCheckedByNum="this.currentAccount['followunit']" @click="this.followUnit = !this.followUnit" @updateStatus="this.followUnit = !this.followUnit"></MCheckbox>
                <div class="ad-collase__item--title">
                  {{ this.resources.vi.accountDetail.checkboxTitle.Unit }}
                </div>
                <MComboboxNomal :default-value-by-text="this.currentAccount['followunitvalue']" ref="comboUnit" :enable="this.followUnit" :data="this.resources.vi.accountDetail.comboboxData.AlertRequired
                  "></MComboboxNomal>
              </div>
            </div>
            <div class="ad-collase__content--right">
              <div class="ad-collase__item">
                <MCheckbox :isCheckedByNum="this.currentAccount['followbankaccount']" @click="this.followBankAccount = !this.followBankAccount" @updateStatus="this.followBankAccount = !this.followBankAccount"></MCheckbox>
                <div class="ad-collase__item--title">
                  {{
                    this.resources.vi.accountDetail.checkboxTitle.BankAccount
                  }}
                </div>
              </div>
              <div class="ad-collase__item">
                <MCheckbox :isCheckedByNum="this.currentAccount['followconstruction']" @click="this.followConstruction = !this.followConstruction" @updateStatus="this.followConstruction = !this.followConstruction"></MCheckbox>
                <div class="ad-collase__item--title">
                  {{ this.resources.vi.accountDetail.checkboxTitle.Construct }}
                </div>
                <MComboboxNomal :default-value-by-text="this.currentAccount['followconstructionvalue']" ref="comboContruction" :enable="this.followConstruction" :data="this.resources.vi.accountDetail.comboboxData.AlertRequired
                  "></MComboboxNomal>
              </div>
              <div class="ad-collase__item">
                <MCheckbox :isCheckedByNum="this.currentAccount['followsellcontract']" @click="this.followSellContract = !this.followSellContract" @updateStatus="this.followSellContract = !this.followSellContract"></MCheckbox>
                <div class="ad-collase__item--title">
                  {{
                    this.resources.vi.accountDetail.checkboxTitle.SellContract
                  }}
                </div>
                <MComboboxNomal :default-value-by-text="this.currentAccount['followsellcontractvalue']" ref="comboSellContract" :enable="this.followSellContract" :data="this.resources.vi.accountDetail.comboboxData.AlertRequired
                    "></MComboboxNomal>
              </div>
              <div class="ad-collase__item">
                <MCheckbox :isCheckedByNum="this.currentAccount['followexpenseitem']" @click="this.followExpenseItem = !this.followExpenseItem" @updateStatus="this.followExpenseItem = !this.followExpenseItem"></MCheckbox>
                <div class="ad-collase__item--title">
                  {{ this.resources.vi.accountDetail.checkboxTitle.CPItem }}
                </div>
                <MComboboxNomal :default-value-by-text="this.currentAccount['followexpenseitemvalue']" ref="comboExpenseItem" :enable="this.followExpenseItem" :data="this.resources.vi.accountDetail.comboboxData.AlertRequired
                  "></MComboboxNomal>
              </div>
              <div class="ad-collase__item">
                <MCheckbox :isCheckedByNum="this.currentAccount['followstatisticalcode']" ref="lastCheckbox" @click="this.followStatisticalCode = !this.followStatisticalCode" @updateStatus="this.followStatisticalCode = !this.followStatisticalCode"></MCheckbox>
                <div class="ad-collase__item--title">
                  {{
                    this.resources.vi.accountDetail.checkboxTitle
                      .StatisticalCode
                  }}
                </div>
                <MComboboxNomal :default-value-by-text="this.currentAccount['followstatisticalcodevalue']"  ref="comboStatisticalCode" :enable="this.followStatisticalCode" :data="this.resources.vi.accountDetail.comboboxData.AlertRequired
                    "></MComboboxNomal>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="popup-main__footer">
        <div class="btn group-btn">
          <div class="btn-save">
            <button ref="saveButton" @click="saveOnClick(false)" id="save" :title="this.resources.vi.btnAction.storeTooltip" class="optionalBtn">
              {{ this.resources.vi.btnAction.store }}
            </button>
          </div>
          <div class="btn btn-saveAndAdd">
            <button @click="saveOnClick(true)" :title="this.resources.vi.btnAction.storeSaveToolTip" id="saveAdd">
              {{ this.resources.vi.btnAction.storeSave }}
            </button>
          </div>
        </div>
        <div class="btn btn-close">
          <button @click="closeDetail" ref="lastButton" id="cancel" :title="this.resources.vi.btnAction.cancelTooltip"
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
import MInput from '../base-component/MInput.vue';
import MTextArea from '../base-component/MTextArea.vue';
import MCheckbox from '../base-component/MCheckbox.vue';
import MComboboxNomal from '../base-component/MComboboxNomal.vue';
import MScrollableCombobox from '../base-component/MScrollableComboboxTree.vue';
import MSingleActionDialog, { dialogType } from './MSingleActionDialog.vue';
import { toastControl } from '@/store/toast';
import { ToastType } from '../base-component/MToastItem.vue';
import MConfirmDialog from './MConfirmDialog.vue';

export const formMode = {
  create: 0,
  modify: 1,
  duplicate: 2,
}

export default {
  name: "MAccountDetail",

  props: {
    // Dữ liệu đã được sắp xếp
    sortedData: {
      type: Array,
      required: false,
    },

    // Dữ liệu binding lên form
    account: {
      type: Object,
      required: false,
      default: null,
    },

    // Hành động của form
    formMode: {
      type: Number,
      required: false,
      default: formMode.create,
    },
  },

  setup() {
    const Toast = toastControl();
    return {
      Toast,
    };
  },

  components: {
    MInput,
    MTextArea,
    MCheckbox,
    MComboboxNomal,
    MScrollableCombobox,
    MSingleActionDialog,
    MConfirmDialog
  },

  created() {
    if (this.formMode === formMode.modify || this.formMode === formMode.duplicate) {
      this.currentAccount = Object.assign({},this.account);
      this.followObject = !this.currentAccount['followobject'];
      this.followContract = !this.currentAccount['followcontract'];
      this.followExpenseItem = !this.currentAccount['followexpenseitem'];
      this.followObjectTHCP = !this.currentAccount['followobjectthcp'];
      this.followOrder = !this.currentAccount['followorder'];
      this.followSellContract = !this.currentAccount['followsellcontract'];
      this.followStatisticalCode = !this.currentAccount['followstatisticalcode'];
      this.followUnit = !this.currentAccount['followunit'];
      this.followBankAccount = !this.currentAccount['followbankaccount'];
      this.followConstruction = !this.currentAccount['followconstruction'];
      console.log(this.currentAccount);
    } else {
      let parent = "";
      if (this.account){
        parent = this.account['accountid'];
      }
      this.currentAccount = {
        accountid: "",
        accountname: "",
        accountnumber: "",
        dependency: parent,
        description: null,
        englishname: "",
        followObject: 1,
        followObjectValue: null,
        followObjectTHCP: 1,
        followObjectTHCPValue: null,
        followOrder: 1,
        followOrderValue: null,
        followContract: 1,
        followContractValue: null,
        followUnit: 1,
        followUnitValue: null,
        followBankAccount: 1,
        followConstruction: 1,
        followConstructionValue: null,
        followSellContract: 1,
        followSellContractValue: null,
        followExpenseItem: 1,
        followExpenseItemValue: null,
        followStatisticalCode: 1,
        followStatisticalCodeValue: null,
        accountByException: 1,
      }
    }

    if (this.formMode == formMode.modify){
      this.scrollableData = this.sortedData.slice()
      if (this.account){
        let index = -1;
        for (let i=0;i<this.scrollableData.length;i++){
          if (this.scrollableData[i]['accountnumber'] == this.account['accountnumber']){
            index = i;
          }
        }
        if (index != -1){
          let j = index+1;
          if (j < this.scrollableData.length){
            while(this.scrollableData[index]['datalevel'] < this.scrollableData[j]['datalevel']){
              this.scrollableData = this.removeItemFromArr(this.scrollableData, j);
            }
          }
          this.scrollableData = this.removeItemFromArr(this.scrollableData, index);
        }
      }
    } else {
      this.scrollableData = this.sortedData.slice()
    }

    switch (this.formMode) {
      case formMode.create: {
        this.formTitle = this.resources.vi.accountDetail.title.create;
        break;
      }

      case formMode.modify: {
        this.formTitle = this.resources.vi.accountDetail.title.update;
        break;
      }

      case formMode.duplicate: {
        this.formTitle = this.resources.vi.accountDetail.title.duplicate;
        break;
      }
    }


  },

  mounted() {
    this.$nextTick(() => {
      this.inputList.push(this.$refs.inpAccountNumber);
      this.inputList.push(this.$refs.inpAccountName);
      this.inputList.push(this.$refs.inpEnglishName);
      this.inputList.push(this.$refs.inpDependency);
      this.inputList.push(this.$refs.inpDescription);
      this.inputList.push(this.$refs.inpProperty);
      this.$refs.inpAccountNumber.setFocus();
      if (this.formMode == formMode.create)
        this.$refs.inpProperty.selectedIndex = 0;
      if (this.account){
        if (this.formMode == formMode.create){
          this.$refs.inpDependency.setSelectedValue(this.account['accountid'], "accountid");
        }
        else {
          this.$refs.inpProperty.setSelectedValue(this.account['propertyname'], "props");
          this.$refs.inpDependency.setSelectedValue(this.account['dependency'], "accountid");
        }
      }
      this.beforeAccount = Object.assign({}, this.currentAccount);
      console.log(this.currentAccount);
      window.addEventListener('keydown', this.handleOnKeydown);
    })
  },

  unmounted(){
    window.removeEventListener('keydown', this.handleOnKeydown);
  },

  data() {
    return {
      formKey: 0,
      isExpanded: false,
      resources: resources,
      collase: false,
      inputList: [],
      currentError: null,
      currentAccount: null,
      beforeAccount: null,
      showConfirmChange: false,
      formTitle: "",
      selectedParent: null,
      followObject: false,
      followObjectValue: null,
      followObjectTHCP: false,
      followObjectTHCPValue: null,
      followOrder: false,
      followOrderValue: null,
      followContract: false,
      followContractValue: null,
      followUnit: false,
      followUnitValue: null,
      followBankAccount: false,
      followConstruction: false,
      followConstructionValue: null,
      followSellContract: false,
      followSellContractValue: null,
      followExpenseItem: false,
      followExpenseItemValue: null,
      followStatisticalCode: false,
      followStatisticalCodeValue: null,
      accountByException: false,
      scrollableData: [],
    }
  },

  methods: {

    /**
     * Hàm xử lý sự kiện bàn phím
     * @author Xuân Đào (04/05/2023)
     */
    handleOnKeydown(){
      if (event.key == 'Tab'){
        if(this.$refs.inpDescription.isFocus){
          event.preventDefault();
          this.$refs.checkAccounting.setFocus();
        }

        if (this.$refs.lastCheckbox.isFocus){
          event.preventDefault();
          this.$refs.saveButton.focus();
        }

        if (document.activeElement.id == 'cancel'){
          event.preventDefault();
          this.$refs.inpAccountNumber.setFocus();
        }
      }

      if (event.ctrlKey && event.key === 's'){
        event.preventDefault();
        this.saveOnClick(false);
      }
      
      if (event.key === 'Escape') {
        //ESC Pressed
        this.closeDetail();
      }

      if (event.ctrlKey && event.shiftKey && event.key === 'S') {
        event.preventDefault(); 
        this.saveOnClick(true);
      }

      if (event.key == "F1"){
        event.preventDefault();
        this.showDeveloping();
      }
    },

    /**
     * Hàm hiển thị tính năng đang phát triển
     * @author Xuân Đào (04/05/2023)
     */
    showDeveloping(){
      this.$refs.singleDialog.showDialogOn(dialogType.info, resources.vi.dialogMessage.developing, resources.vi.btnAction.close)
    },

    /**
     * Hàm cập nhật dữ liệu tính chất
     * @author Xuân Đào (04/05/2023)
     */
    updateProperty(value){
      this.currentAccount['propertyname'] = value;
    },

    /**
     * Hàm cập nhật dữ liệu tài khoản tổng hợp
     * @author Xuân Đào (04/05/2023)
     */
    updateDependency(value){
      this.currentAccount['dependency'] = value;
    },

    /**
     * Hàm yêu cầu lưu dữ liệu
     * @author Xuân Đào (04/05/2023)
     */
    saveData(){
      this.showConfirmChange = false;
      this.saveOnClick();
    },

    /**
     * Hàm hủy bỏ những thay đổi
     * @author Xuân Đào (04/05/2023)
     */
    undoData(){
      this.showConfirmChange = false;
      this.$emit("closeMe");
    },

    /**
     * Hàm đóng form
     * @author Xuân Đào (04/05/2023)
     */
    closeDetail() {
      if (JSON.stringify(this.beforeAccount) != JSON.stringify(this.currentAccount)) {
        this.showConfirmChange = true;
        return;
      }
      this.$emit("closeMe");
    },

    /**
     * Hàm mở rộng form
     * @author Xuân Đào (04/05/2023)
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
     * Hàm thu gọn form
     * @author Xuân Đào (04/05/2023)
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

    /**
     * Hàm xử lý validate dữ liệu
     * @author Xuân Đào (04/05/2023)
     */
    validate() {
      this.currentError = null;
      this.inputList.forEach(el => {
        el.validate();
        if (el.isError && !this.currentError) {
          this.currentError = el
        }
      })
      if (this.currentError){
        this.$refs.singleDialog.showDialogOn(dialogType.error, this.currentError.errMessage, resources.vi.btnAction.close)
        return false;
      } 
      else return true;
    },

    /**
     * Hàm lưu dữ liệu
     * @author Xuân Đào (04/05/2023)
     */
    async saveOnClick(reload) {
      if(this.validate()){
        const data = this.getInputData();
        let res = await this.saveAccount(data);
        if (res.status == 201 || res.status == 200){
          if (res['value']['IsSuccess']){
            this.Toast.showToastMsg(ToastType.Success, res.message)
            if (!reload)
              this.$emit("closeOnSuccess");
            else {
              this.$emit("reloadGrid");
              this.currentAccount = Object.assign({}, this.beforeAccount);
              /*eslint-disable no-debugger */
              debugger
              let detail = document.querySelector(".account-detail");
              if (detail){
                let checkboxs = detail.querySelectorAll(".m-checkbox");
                checkboxs.forEach(el => el.classList.remove("checked"));
              }
              this.followObject = false;
              this.followObjectTHCP = false;
              this.followBankAccount = false;
              this.followConstruction = false;
              this.followContract = false;
              this.followExpenseItem = false;
              this.followOrder = false;
              this.followSellContract = false;
              this.followStatisticalCode = false;
              this.$refs.inpProperty.selectedIndex = 0;
            }
          } else {
            this.currentError = this.inputList[0];
            this.$refs.singleDialog.showDialogOn(dialogType.error, res['value']['Data'][0]['UserMsg'], resources.vi.btnAction.close)
          }
        }
      }
    },

    /**
     * Hàm lấy danh sách tài khoản con theo index
     * @param index: Chỉ số tài khoản cha
     * @authod Xuân Đào (25/04/2023)
     */
    GetChildList(index){
      let list = [];
      let curIndex = index
      while(this.sortedData[index + 1]['datalevel'] > this.sortedData[curIndex]['datalevel']){
        list.push(this.sortedData[index + 1]);
        index++;
      }
      return list;
    },

    /**
     * Hàm focus nhập liệu lỗi khi đóng dialog
     * @author Xuân Đào (04/05/2023)
     */
    dialogClosed() {
      if (this.currentError)
        this.currentError.setFocus();
    },

    /**
     * Hàm xóa 1 item khỏi array
     *
     * @author Xuân Đào (04/04/2023)
     */
     removeItemFromArr(proxy, index) {
      let arr = [];
      for (let i = 0; i < proxy.length; i++) {
        if (i !== index) {
          arr.push(proxy[i]);
        }
      }
      return arr;
    },

    findParentByAccountNumber(accountNumber){
      for (let i=0;i<this.sortedData.length;i++){
        if (this.sortedData[i]['accountnumber'] == accountNumber) return this.sortedData[i];
      }
      return null;
    },

    /**
     * Hàm lấy dữ liệu input
     * @author Xuân Đào (04/05/2023)
     */
    getInputData() {
      let dataLevel = 0;
      if (this.$refs.inpDependency.value){
        dataLevel = this.findParentByAccountNumber(this.$refs.inpDependency.value)['datalevel'] + 1;
      }
      let account = {
        accountid: "dcf2e391-29a0-4b54-b616-95a211caf4c5",
        accountname: this.$refs.inpAccountName.value,
        accountnumber: this.$refs.inpAccountNumber.value,
        dependency: this.$refs.inpDependency.value ? this.findParentByAccountNumber(this.$refs.inpDependency.value)['accountid'] : null,
        property: this.$refs.inpProperty.selectedIndex,
        description: this.$refs.inpDescription.value,
        status: 0,
        datalevel: dataLevel,
        englishname: this.$refs.inpEnglishName.value,
        followObject: this.followObject ? 0 : 1,
        followObjectValue: this.followObject ? this.$refs.comboObject.comboboxData[this.$refs.comboObject.selected] : null,
        followObjectTHCP: this.followObjectTHCP ? 0 : 1,
        followObjectTHCPValue: this.followObjectTHCP ? this.$refs.comboObjectTHCP.comboboxData[this.$refs.comboObjectTHCP.selected] : null,
        followOrder: this.followOrder ? 0 : 1,
        followOrderValue: this.followOrder ? this.$refs.comboOrder.comboboxData[this.$refs.comboOrder.selected] : null,
        followContract: this.followContract ? 0 : 1,
        followContractValue: this.followContract ? this.$refs.comboContract.comboboxData[this.$refs.comboContract.selected] : null,
        followUnit: this.followUnit ? 0 : 1,
        followUnitValue: this.followUnit ? this.$refs.comboUnit.comboboxData[this.$refs.comboUnit.selected] : null,
        followBankAccount: this.followBankAccount ? 0 : 1,
        followConstruction: this.followConstruction ? 0 : 1,
        followConstructionValue: this.followConstruction ? this.$refs.comboContruction.comboboxData[this.$refs.comboContruction.selected] : null,
        followSellContract: this.followSellContract ? 0 : 1,
        followSellContractValue: this.followSellContract ? this.$refs.comboSellContract.comboboxData[this.$refs.comboSellContract.selected] : null,
        followExpenseItem: this.followExpenseItem ? 0 : 1,
        followExpenseItemValue: this.followExpenseItem ? this.$refs.comboExpenseItem.comboboxData[this.$refs.comboExpenseItem.selected] : null,
        followStatisticalCode: this.followStatisticalCode ? 0 : 1,
        followStatisticalCodeValue: this.followStatisticalCode ? this.$refs.comboStatisticalCode.comboboxData[this.$refs.comboStatisticalCode.selected] : null,
        accountByException: this.accountByException ? 0 : 1,
      }
      return account;
    },

    /**
     * Hàm lưu dữ liệu
     * @author Xuân Đào (04/05/2023)
     */
    async saveAccount(account){
      try {
        if (!account['dependency'] || account['dependency'].trim().length == 0){
          account['datalevel'] = 0;
        } else {
          let parentAccount = this.sortedData[this.findParent(this.sortedData, account['dependency'])];
          if (parentAccount){
            if (account['accountnumber'].toString().substring(0, parentAccount['accountnumber'].toString().length) != parentAccount['accountnumber']){
              this.$refs.singleDialog.showDialogOn(dialogType.success, "Số tài khoản con phải bắt đầu bằng số tài khoản tổng hợp!", "Đóng");
              this.currentError = this.$refs.inpAccountNumber;
              return {status: 400};
            }
          }
          account['datalevel'] = parentAccount['datalevel'] + 1;
        }
        // if (this.findParent(this.sortedData, account['accountid'])){
        //   let childList = this.GetChildList(this.findParent(this.sortedData, account['accountid']));
        //   if (childList.length > 0){
        //     /*eslint-disable no-debugger */
        //     debugger
        //     return;
        //   }
        // }
        let queryString = (this.formMode == formMode.create || this.formMode == formMode.duplicate) ? `${this.resources.endpoint}Account`
                          :`${this.resources.endpoint}Account?id=${this.currentAccount['accountid']}`;
        const options = {
          method: (this.formMode == formMode.create || this.formMode == formMode.duplicate) ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(account),
        };
        let res = await fetch(queryString, options);
        let data = await res.json();
        return { status: res.status, value: data, message: data['Message'] };
      } catch (err) {
        return { status: 400, value: null, message: err};
      }
    },

    findParent(arr, data) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i]["accountid"] === data) return i;
      }
    },
  },
}
</script>
<style scoped>
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