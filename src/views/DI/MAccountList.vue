<template>
  <div class="content" ref="content">
    <div class="content-header">
      <div class="content-title">{{ this.resources.vi.accountList.title }}</div>
    </div>
    <router-link to='/DI' class="ct-header">
      <div class="ct-header__icon back-icon"></div>
      <div class="ct-header__text">{{ resources.vi.di.return }}</div>
    </router-link>
    <!-- Phần hiển thị nội dung chính của table -->
    <div class="content-main">
      <div class="content-main__header">
        <MSearchBar class="search-bar" ref="searchBar" :width="225" :placeholder="this.resources.vi.accountList.inputPlaceholder" @onSearch="this.searchOnInput"></MSearchBar>
        <div class="grid-action" @click="gridOnAction">{{ this.gridAction }}</div>
        <div @click="gridKey++" title="Tải lại (Ctrl + R)" class="icon reload-icon"></div>
        <div
        title="Xuất ra excel (Ctrl + E)"
        @click="excelExport"
        class="icon export-excel-icon"
        ></div>
        <div title="Tùy chỉnh giao diện" @click="UISetting = true" class="icon setup-icon"></div>
        <div class="create-btn">
          <div class="ct-btn" @click="showNewPopup(0, this.$refs.gridData.selectedData)"> Thêm </div>
          <div class="more-icon">
            <div class="more-icon__icon"></div>
          </div>
        </div>
      </div>
      <div class="content-main__data">
        <MGridTree
          ref="gridData"
          :api="this.APIString"
          :data="AccountList"
          :isFixedStart="false"
          :isFixedEnd="true"
          @deleteRc="deleteRecord"
          @dbClicked="editOnDbClick"
          @refresh="updateTotal"
          @selectMultiple="selectMultiple"
          @duplicateData="duplicateEmployee"
          @columnSwapped="columnSwapped"
          @loadCompleted="gridLoaded"
          @rowDbClick="itemOnDbClick"
          @updateRecord="updateAccount"
          @updateStatus="updateAccountStatus"
          @updateAction="updateAction"
          :muiltiple-select="false"
          :editable="true"
          :key="this.gridKey"
        ></MGridTree>
      </div>
      <div class="content-main__footer">
        <MPagination
          class="paging"
          :totalRecord="this.totalRecord"
          ref="pagingMaster"
          :allow-paging="false"
        ></MPagination>
      </div>
    </div>
    <MSingleActionDialog
    ref="singleDialog"
    ></MSingleActionDialog>
    <MAccountDetail @reloadGrid="this.gridKey++" ref="accountDetail" @closeOnSuccess="closeDetailOnSuccess" :form-mode="formMode" :account="selectedAccount" @closeMe="closeDetail" v-if="showDetail" :sortedData="this.sortedData"></MAccountDetail>
    <MCircleLoader v-if="showLoader"></MCircleLoader>
    <MConfirmDeleteDialog      
      ref="confirmDelete"
      v-if="showConfirm"
      @hideDeleteDialog="closeDeleteDialog"
      @hideAndDelete="closeAndDelete"
      :messagse="confirmMessage"
      ></MConfirmDeleteDialog>
      <MUISeting @setDefault="setDefaultUI" @saveUI="applyUI" @closeUISeting="UISetting = false" :data="AccountListFull" v-if="UISetting" modelValue="title"></MUISeting>
  </div>
</template>
<script>
import MGridTree from "@/components/base-component/MGridTree.vue";
import {accountList, accountListFull} from "@/js/gridDataConfig.js"
// import { ToastType } from '../base-component/MToastItem.vue';
import { toastControl } from "@/store/toast";
import { formAction } from "@/components/unit-components/MEmployeeDetail.vue";
import MSearchBar from "@/components/base-component/MSearchBar.vue";
import resources from "@/js/resources";
import MSingleActionDialog, { dialogType } from "@/components/unit-components/MSingleActionDialog.vue";
import MCircleLoader from "@/components/base-component/MCircleLoader.vue";
import { loader } from '@/store/loader';
import MAccountDetail, { formMode } from "@/components/unit-components/MAccountDetail.vue";
import MPagination from "@/components/base-component/MPagination.vue";
import MConfirmDeleteDialog, { deleteType } from '@/components/unit-components/MConfirmDeleteDialog.vue';
import { ToastType } from '@/components/base-component/MToastItem.vue';
import MUISeting from "@/components/unit-components/MUISeting.vue";

// Hành động của grid
export const Action = {
  expand: 0,
  fold: 1,
}

// Trạng thái của tài khoản
export const accountStatus = {
  using: 0,
  unuse: 1,
}

// Tính chất của tài khoản
export const AccountProperty = {
  Debt: 0,
  Excess: 1,
  Hermaphrodite: 2,
  NoBalance: 3,
}

// Hành động của dialog
export const DialogAction = {
  Delete: 0,
  Update: 1,
}

export default {
  name: "MEmployeeList",
  // inject:['showToastMsg'],
  // Set up toast message
  setup() {
    const Toast = toastControl();
    const Loader = loader();
    return {
      Toast, Loader
    };
  },
  components: {
    MGridTree,
    MSearchBar,
    MSingleActionDialog,
    MCircleLoader,
    MAccountDetail,
    MPagination,
    MConfirmDeleteDialog,
    MUISeting
  },
  created() {
    // fetch("https://apidemo.laptrinhweb.edu.vn/api/v1/Employees")
    //   .then((res) => resources.json())
    //   .then((data) => {
    //     this.employees = data;
    //   });
    this.APIString =
      `${this.resources.endpoint}Account`;
    window.addEventListener("keydown", this.handleKeyDown);
    if (localStorage.AccountUI){
      let arr = JSON.parse(localStorage.AccountUI);
      for (let i=0;i<arr.length;i++){
        if (arr[i]['display']){
          this.AccountList.push(arr[i]);
        }
      }
    } else {
      this.AccountList = accountList;
    }
  },
  
  mounted(){
    this.gridAction = this.resources.vi.accountList.expandAll
    this.sortedData = this.$refs.gridData.sortedData;
  },

  unmounted() {
    window.removeEventListener("keydown", this.handleKeyDown);
  },

  watch: {
    gridKey: function(){
      this.gAction = 0;
      this.gridAction = this.resources.vi.accountList.expandAll;
    }
  },

  methods: {

    /**
     * Hàm xử lý sự kiện bàn phím 
     * 
     * @authod Xuân Đào (01/05/2023)
     */
    handleKeyDown(){
      if (event.ctrlKey && event.key === '1'){
        event.preventDefault();
        this.showNewPopup(0, this.$refs.gridData.selectedData);
      }

      if (event.ctrlKey && event.key === 'r') {
        event.preventDefault();
        this.gridKey++;
      }

      if (event.ctrlKey && event.key === 'e') {
        event.preventDefault();
        this.excelExport();
      }
    },

    /**
     * Hàm xử lấy mẫu ngầm định 
     * 
     * @authod Xuân Đào (09/05/2023)
     */
    setDefaultUI(){
      this.UISetting = false;
      this.AccountList = accountList;
    },

    /**
     * Hàm áp dụng tùy chỉnh giao diện 
     * 
     * @authod Xuân Đào (09/05/2023)
     */
    applyUI(result){
      let newUI = [];
      if (result){
        for(let i=0;i<result.length;i++){
          if (result[i]['display']) newUI.push(result[i]);
        }
        this.AccountList = newUI;
        this.UISetting = false;
      } else {
        this.UISetting = false;
        this.Toast.showToastMsg(ToastType.Success, this.resources.vi.errorMes)
      }
    },

    /**
     * Hàm thay đổi dữ liệu khi đổi vị trí cột 
     * 
     * @authod Xuân Đào (09/05/2023)
     */
    columnSwapped(newIndex, oldIndex){
      let oldAccount = this.AccountList[oldIndex]
      if (oldIndex < newIndex) {
        for (let i = oldIndex; i <= newIndex;i++){
          if (i != newIndex)
            this.AccountList[i] = this.AccountList[i + 1];
          else this.AccountList[newIndex] = oldAccount;
        }
      } else {
        for (let i = oldIndex; i>= newIndex; i--){
          if (i != newIndex)
            this.AccountList[i] = this.AccountList[i - 1];
          else this.AccountList[newIndex] = oldAccount;
        }
      }
      this.gridKey++;
    },

    /**
     * Hàm xử tìm kiếm dữ liệu 
     * 
     * @authod Xuân Đào (01/05/2023)
     */
    searchOnInput(value){
      this.$refs.gridData.sortedData = this.sortedData;
      if (value.trim().length > 0){
        this.gAction = Action.expand;
        this.searchByKeyword(value);
      } else {
        this.gAction = Action.fold;
        this.totalRecord = this.sortedData.length;
      }
      setTimeout(() => {
        this.gridOnAction();
      }, 100)
    },

    /**
     * Hàm tìm kiếm tài khoản theo keyword
     * 
     * @authod Xuân Đào (01/05/2023)
     */
    searchByKeyword(keyword){
      let indexs = [];
      // Tìm kiếm theo keyword
      for(var i=0; i<this.sortedData.length; i++) {
        let keys = Object.keys(this.sortedData[i]);
        keys.forEach(key => {
          if (this.sortedData[i]) {
            if (this.sortedData[i][key] && this.sortedData[i][key].toString().indexOf(keyword) != -1){
              indexs.push(i);
              i++;
              return;
            }
          }
        })
      }
      // Lấy thêm tất cả tài khoản cha nếu có
      indexs.forEach(index => {
        while (this.sortedData[index]['datalevel'] > 0){
          if (this.sortedData[index]['datalevel'] > this.sortedData[index-1]['datalevel']){
            indexs.push(index-1);
          }
          index--;
        }
      })
      // Loại bỏ các chỉ số bị lặp
      let uni = [...new Set(indexs)];
      let unique = uni.sort(function(a, b){return a - b});
      let newArray = [];
      let j=0;
      for (let i=0;i<this.sortedData.length;i++){
        if (i == unique[j]){
          newArray.push(this.sortedData[i]);
          j++;
        }
      }
      this.totalRecord = newArray.length;
      this.$refs.gridData.sortedData = newArray;
    },

    /**
     * Hàm cập nhật trạng thái grid
     * @param action - Đóng / mở
     * @authod Xuân Đào (29/04/2023)
     */
    updateAction(action){
      if (action == Action.expand){
        this.gAction = Action.expand;
        this.gridAction = this.resources.vi.accountList.expandAll;
      } else {
        this.gAction = Action.fold;
        this.gridAction = this.resources.vi.accountList.foldAll;
      }
    },

    /**
     * Hàm đóng / mở toàn bộ grid
     * 
     * @authod Xuân Đào (29/04/2023)
     */
    gridOnAction(){
      this.$refs.gridData.foldOrExpandAll(this.gAction);
    },

    /**
     * Hàm xuất dữ liệu ra excel
     * 
     * @authod Xuân Đào (28/04/2023)
     */
    async excelExport(){
      this.Loader.showLoader();
      if(this.$refs.searchBar.getInputValue().length > 0){
        this.searchOnInput(this.$refs.searchBar.getInputValue());
        this.sortedData = this.$refs.gridData.sortedData;
      }
      let excelData = Object.assign({}, this.sortedData);
      let body = "[";
      for(let i=0;i<this.sortedData.length;i++){
        excelData[i]['dependency'] = "3fa85f64-5717-4562-b3fc-2c963f66afa6";
        if (i == 0){
          body += JSON.stringify(excelData[i]);
        } else {
          body += "," + JSON.stringify(excelData[i]);
        }
      }
      body += "]";
      const apiString = `${this.resources.endpoint}Account/ExcelExport?widthList=175,250,150,250,300,200`;
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: body,
      }
      let res = await fetch(apiString, options);
      let data = await res.blob();
      var a = document.createElement("a");
      a.href = window.URL.createObjectURL(data);
      a.download = "Danh_sach_tai_khoan-" + Date.now().toString();
      a.click();
      a.remove();
      this.Loader.closeLoader();
    },

    /**
     * Hàm nhân bản tài khoản
     * 
     * @authod Xuân Đào (28/04/2023)
     */
    updateAccount(account){
      this.showNewPopup(formMode.duplicate, account);
    },

    async closeAndDelete(){
      this.showConfirm = false;
      if (this.dialogAction == DialogAction.Delete){
        const apiString = `${this.resources.endpoint}Account/${this.selectedAccount['accountid']}`;
        const options = {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        };
        const res = await fetch(apiString, options);
        if (res.status === 200) {
          let data = await res.json();
          this.Toast.showToastMsg(ToastType.Success,data['Message']);
          this.$refs.gridData.deleteSelectedRow();
          this.totalRecord--;
          if (this.selectedAccount && this.selectedAccount.isSub)
            this.gridKey++;
          /*eslint-disable no-debugger */
          // debugger
          // if (this.selectedAccount && this.selectedAccount.isSub == true){
          //   let parentIndex = this.findParent(this.sortedData, this.selectedAccount['dependency']);
          //   if (this.sortedData[parentIndex + 2]){
          //     if (this.sortedData[parentIndex]['datalevel'] >= this.sortedData[parentIndex + 2]['datalevel']) {
          //       this.gridKey++;
          //     }
          //   } else {
          //     this.gridKey++;
          //   }
          // }

          
          // if (this.selectedAccount['dependency'] && this.selectedAccount['dependency'].trim().length > 0){
          //   let haveChild = 0;
          //   for (let i=0;i<this.sortedData.length;i++){
          //     if (this.selectedAccount['dependency'] == this.sortedData[i]['dependency']){
          //       haveChild += 1;
          //       break;
          //     }
          //   }
          //   if (haveChild == 1){
          //     this.$refs.gridData.sortedData[this.findParent(this.$refs.gridData.sortedData, this.selectedAccount['dependency'])]['haveSub'] = false;
          //   }
          // }
        }
      } else {
        this.updateChildAccount();
      }
    },

    /**
     * Hàm đóng popup cảnh báo
     * 
     * @authod Xuân Đào (28/04/2023)
     */
    closeDeleteDialog(){
      this.showConfirm = false;
    },

    /**
     * Hàm cập nhật trạng thái grid khi thêm mới thành công
     * 
     * @authod Xuân Đào (28/04/2023)
     */
    closeDetailOnSuccess(){
      this.closeDetail();
      this.gridKey++;
    },

    /**
     * Hàm sửa khi double click grid
     * 
     * @authod Xuân Đào (27/04/2023)
     */
    itemOnDbClick(item){
      this.showNewPopup(formMode.modify, item);
    },

    /**
     * Hàm hiển thị popup tài khoản
     * 
     * @authod Xuân Đào (27/04/2023)
     */
    showNewPopup(mode, data){
      this.formMode = mode;
      this.selectedAccount = data;
      // this.selectedAccount = this.$refs.gridData.selectedData;
      this.showDetail = true;
    },

    /**
     * Hàm đóng popup tài khoản
     * 
     * @authod Xuân Đào (27/04/2023)
     */
    closeDetail(){
      this.showDetail = false;
    },

    /**
     * Hàm xử lý khi load xong grid
     * 
     * @authod Xuân Đào (27/04/2023)
     */
    gridLoaded(){
      this.sortedData = this.$refs.gridData.sortedData;
      this.totalRecord = this.$refs.gridData.gridData[0]['total_record'];
      this.formatDisplayData();
      if (this.$refs.searchBar.getInputValue().length > 0){
        this.searchOnInput(this.$refs.searchBar.getInputValue());
      }
    },

    /**
     * Hàm định dạng dữ liệu hiển thị
     * 
     * @authod Xuân Đào (27/04/2023)
     */
    formatDisplayData(){
      for(let i = 0;i < this.sortedData.length; i++){
        this.sortedData[i].displayCode = "---".repeat(this.sortedData[i]['datalevel']) + " " + this.sortedData[i]['accountnumber'];
        switch(this.sortedData[i]['property']){
          case AccountProperty.Debt:{
            this.sortedData[i].propertyname = this.resources.vi.accountList.props.Debt
            break;
          }
          case AccountProperty.Excess:{
            this.sortedData[i].propertyname = this.resources.vi.accountList.props.Excess
            break;
          }
          case AccountProperty.Hermaphrodite:{
            this.sortedData[i].propertyname = this.resources.vi.accountList.props.Hermaphrodite
            break;
          }
          case AccountProperty.NoBalance:{
            this.sortedData[i].propertyname = this.resources.vi.accountList.props.NoBalance
            break;
          }
        }

        switch(this.sortedData[i]['status']){
          case accountStatus.unuse:{
            this.sortedData[i].statusname = this.resources.vi.accountList.status.unuse;
            break;
          }
          case accountStatus.using: {
            this.sortedData[i].statusname = this.resources.vi.accountList.status.using
            break;
          }
        }
      }

    },

    /**
     * Hàm yêu cầu xóa tài khoản
     * @param data: dữ liệu
     * @param type: kiểu xóa - single/multiple
     * @authod Xuân Đào (27/04/2023)
     */
    deleteRecord(data, type){
      if (type === deleteType.singleDelete) {
        this.selectedAccount = data;
        if(this.selectedAccount['haveSub']){
          this.$refs.singleDialog.showDialogOn(dialogType.error, this.resources.vi.accountList.deleteFail, this.resources.vi.btnAction.close)
          // let subAccount = "";
          // let numOfSub = 0;
          // let index = this.findParent(this.sortedData, this.selectedAccount['accountid']);
          // let loop = true;
          // while(loop){
          //   if (this.sortedData[index + 1]['datalevel'] > this.selectedAccount['datalevel']){
          //     if (numOfSub <= 5){
          //       subAccount += `<${this.sortedData[index + 1]['accountnumber']}>`
          //     }
          //     numOfSub++;
          //     index++;
          //   } else {
          //     loop = false;
          //   }
          // }
          // if (numOfSub > 5){
          //   this.confirmMessage = `${this.resources.vi.dialogMessage.confirmDeleteAccount} 
          //   <${data['accountnumber']}> cùng các tài khoản phụ ${subAccount} và ${numOfSub - 5} tài khoản khác không ?`;
          // } else{
          //   this.confirmMessage = `${this.resources.vi.dialogMessage.confirmDeleteAccount} 
          //   <${data['accountnumber']}> cùng các tài khoản phụ ${subAccount} không ?`;
          // }
        } else {
          this.confirmMessage = `${this.resources.vi.dialogMessage.confirmDeleteAccount} <${data['accountnumber']}> đã chọn không?`;
          this.showConfirm = true;
          this.dialogAction = DialogAction.Delete;
        }
      } else if (type === deleteType.multipleDelete) {
        this.confirmMessage = this.resources.vi.dialogMessage.confirmMultipleDelete;
      }
    },

    /**
     * Hàm tìm tài khoản cha
     * 
     * @authod Xuân Đào (27/04/2023)
     */
    findParent(arr, data) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i]["accountid"] === data) return i;
      }
    },

    /**
     * Hàm chèn dữ liệu vào mảng
     * 
     * @authod Xuân Đào (26/04/2023)
     */
    insertToPosition(arr, index, data) {
      let result = [];
      for (let i = 0; i < arr.length; i++) {
        if (i != index) {
          result.push(arr[i]);
        } else {
          result.push(arr[i]);
          result.push(data);
        }
      }
      return result;
    },

    /**
     * Hàm cập nhật trạng thái tài khoản
     * @param: account - tài khoản cập nhật
     * @param: index - chỉ số tài khoản
     * @authod Xuân Đào (26/04/2023)
     */
    async updateAccountStatus(account, index){
      try {
        if (account['isSub'] && account['status'] == 1){
          let i = index
          while(this.sortedData[i - 1]['datalevel'] > 0){
            if (this.sortedData[i - 1]['status'] == 1){
              this.$refs.singleDialog.showDialogOn(dialogType.error, this.resources.vi.accountList.updateStatusFail, this.resources.vi.btnAction.confirm);
              return;
            }
            i--;
          }
          if (this.sortedData[i - 1]['status'] == 1){
            this.$refs.singleDialog.showDialogOn(dialogType.error, this.resources.vi.accountList.updateStatusFail, this.resources.vi.btnAction.confirm);
            return;
          }
        }
        if (account.status == 0) account.status = 1;
        else account.status = 0;
        if (account['dependency'] == null || account['dependency'].trim().length < 1) {
          account['dependency'] = null;
        }
        this.formMode = formMode.modify;
        const res = await this.saveAccount(account);
        if (res.status == 200 || res.status == 201){
          this.Toast.showToastMsg(ToastType.Success, res.message);
          switch(account.status){
            case accountStatus.unuse:{
            account.statusname = this.resources.vi.accountList.status.unuse;
            break;
            }
            case accountStatus.using: {
              account.statusname = this.resources.vi.accountList.status.using
              break;
            }
          }
          if (account['haveSub']){
            let childList = this.GetChildList(index);
            let ids = account['accountid'];
            for(let i=0;i<childList.length;i++){
              ids += `,${childList[i]['accountid']}`;
            }
            if (account['status'] == 1) {
              let res = await this.updateMultipleAccount(ids, 1);
              if (res['status'] == 200) {
                this.Toast.showToastMsg(ToastType.Success, res.message);
                account['status'] = 1;
                account['statusname'] = this.resources.vi.accountList.status.unuse;
                for(let i=0;i<childList.length;i++){
                  childList[i]['status'] = 1;
                  childList[i]['statusname'] = this.resources.vi.accountList.status.unuse;
                }
              } else {
                this.Toast.showToastMsg(ToastType.Success, res.message);
              }
            } else {
              this.confirmMessage = this.resources.vi.accountList.updateStatusConfirm;
              this.dialogAction = DialogAction.Update;
              this.showConfirm = true;
            }
          }
        } else {
          this.Toast.showToastMsg(ToastType.Success, this.resources.vi.errorMes);
        }
      } catch (ex) {
        console.log(ex);
        this.Toast.showToastMsg(ToastType.Success, this.resources.vi.errorMes);
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
     * Hàm cập nhật trạng thái các tài khoản bị ảnh hưởng
     * 
     * @authod Xuân Đào (26/04/2023)
     */
    async updateChildAccount(){
      const index = this.$refs.gridData.selectedIndex;
      let childList = this.GetChildList(index);
      let ids = "";
      for(let i=0;i<childList.length;i++){
        if (i == 0)
          ids += `${childList[i]['accountid']}`;
        ids += `,${childList[i]['accountid']}`;
      }

      let res = await this.updateMultipleAccount(ids, 0);
      if (res.status == 200){
        this.Toast.showToastMsg(ToastType.Success, res.message);
        for(let i=0;i<childList.length;i++){
          childList[i]['status'] = 0;
          childList[i]['statusname'] = this.resources.vi.accountList.status.using;
        }
      } else {
        this.Toast.showToastMsg(ToastType.Success, this.resources.vi.errorMes);
      }
    },

    /**
     * Hàm cập nhật hàng loạt tài khoản
     * 
     * @authod Xuân Đào (26/04/2023)
     */
    async updateMultipleAccount(ids, newStatus){
      try {
        /*eslint-disable no-debugger */
        // debugger
        let queryString = `${this.resources.endpoint}Account/UpdateMultiple?ids=${ids}&newStatus=${newStatus}`;
        const options = {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        }
        let res = await fetch(queryString, options);
        let data = await res.json();
        return { status: res.status, value: data, message: data['Message'] }; 
      } catch (err) {
        return { status: 400, value: null, message: err};
      }
    },

    /**
     * Hàm lưu tài khoản
     * 
     * @authod Xuân Đào (26/04/2023)
     */
    async saveAccount(account){
      try {
        let queryString = (this.formMode == formMode.create || this.formMode == formMode.duplicate) ? `${this.resources.endpoint}Account`
                          :`${this.resources.endpoint}Account?id=${account['accountid']}`;
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
  },
  data() {
    return {
      showDetail: false,
      showLoading: true,
      showToast: false,
      deleteDialog: false,
      APIString: null,
      resources: resources,
      popupTitle: "",
      action: formAction.createRecord,
      showLoader: false,
      sortedData: null,
      totalRecord: 0,
      selectedAccount: null,
      selectedIndex: 0,
      formMode: 0,
      gridKey: 0,
      confirmMessage: "",
      showConfirm: false,
      gridAction: null,
      gAction: 0,
      AccountList: [],
      AccountListFull: accountListFull,
      UISetting: false,
      dialogAction: 0,
    };
  },
};
</script>
<style scoped>

.setup-icon{
  margin-right: 12px;
}

.grid-action{
  font-size: 13px;
  margin-right: 12px;
  color: #0075c0;
  cursor: pointer;
}

.content-main__footer{
  height: 40px !important;
}

.icon:hover {
  cursor: pointer;
}

.ct-header{
  display: flex;
  font-size: 13px;
  height: 22px;
  max-width: 200px;
  line-height: 20px;
  align-items: center;
  column-gap: 4px;
  margin-left: 4px;
  color: #0075c0;
}

.create-btn{
  height: 28px;
  width: 100px;
  background-color: #2ca01c;
  border-radius: 25px;
  display: flex;
  margin-right: 20px;
  cursor: pointer;
  position: relative;
}

.ct-btn{
  color: #fff;
  font-size: 13px;
  font-family: Notosans-bold;
  height: 28px;
  width: 64px;
  line-height: 28px;
  text-align: center;
  z-index: 2;
}

.ct-btn:hover{
  border-radius: 25px 0 0 25px;
  background-color: #2fc21c;
}

.more-icon{
  height: 28px;
  width: 36px;
  position: relative;
}

.more-icon__icon{
  height: 20px;
  width: 35px;
  background: url('@/assets/img/Sprites.64af8f61.svg') no-repeat -840px -357px;
  position: absolute;
  right: 0;
  top: 4px;
  border-left: solid #fff 1px;
}

.more-icon:hover{
  background-color: #2fc21c;
  border-radius: 0 25px 25px 0;
}

.search-bar{
  position: absolute;
  left: 15px;
}
</style>