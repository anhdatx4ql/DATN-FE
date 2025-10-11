<template>
    <div class="content" ref="content">
      <div class="content-header" style="margin-left: 20px">
        <div class="content-title">Cấp phát tài sản</div>
      </div>
      <router-link to='/DI' class="ct-header" style="margin-left: 20px">
        <div class="ct-header__icon back-icon"></div>
        <div class="ct-header__text">{{ res.vi.di.return }}</div>
      </router-link>
      <!-- Phần hiển thị nội dung chính của table -->
      <div class="content-main">
        <div class="content-main__header">
          <MActionMultiple
            :enable="enableMultipleEditor"
            @deleteMultiple="multipleDelete"
          ></MActionMultiple>
          <MSearchBar @onSearch="this.searchOnInput"></MSearchBar>
          <div @click="renewData" title="Tải lại (Ctrl + R)" class="icon reload-icon"></div>
          <div
            title="Xuất ra excel (Ctrl + E)"
            @click="excelExport"
            class="icon export-excel-icon"
          ></div>
          <div class="create-btn">
            <div class="ct-btn" @click="showNewPopup"> Thêm </div>
            <div class="more-icon"></div>
          </div>
        </div>
        <div style="background-color: #fafafa;" class="content-main__data">
          <el-skeleton v-if="!isLoaded" :rows="13" animated />
          <el-collapse v-else v-model="activeNames" @change="handleChange">
            <el-collapse-item v-for="(item, index) in employees" :key="index" :title="item['employeecode'] + ' - ' + item['fullname']">
              <div class="assigned-item" v-for="(assign, assignIndex) in item.assigned" :key="assignIndex">
                <div class="asset-code">{{ assign['assetcode'] }}</div>
                <div class="asset-line"></div>
                <div class="asset-name">{{ assign['assetname'] }}</div>
                <div>-</div>
                <div class="asset-price">{{ '$' + formatMoney(assign['price']) }}</div>
                <div class="action-button" @click="unassign(assign, item)">Thu hồi</div>
                <div class="deploy-button" @click="reassign(assign)">Cấp phát lại</div>
                <div v-if="assign['status'] || assign['status'] == 0">
                  <div class="asset-status status-2" v-if="assign['status'] == 1">Chưa sử dụng</div>
                  <div class="asset-status status-3" v-else-if="assign['status'] == 2">Đang sửa chữa</div>
                  <div class="asset-status status-4" v-else-if="assign['status'] == 3">Đã hư hỏng</div>
                  <div class="asset-status status-1" v-else>Đang sử dụng</div>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
        <div class="content-main__footer">
          <MPagination
            :totalRecord="this.totalRecord"
            @updateAPI="updateAPIString"
            ref="paging"
          ></MPagination>
        </div>
      </div>
      <MDeployDetail
        ref="empDetail"
        v-if="isShowPopup"
        @hide="isShowPopup = false"
      ></MDeployDetail>
      <MDeleteConfirmDialog
        ref="confirmDelete"
        v-if="deleteDialog"
        @hideDeleteDialog="closeDeleteDialog"
        @hideAndDelete="closeAndDelete"
        :messagse="deleteMessage"
      ></MDeleteConfirmDialog>
      <MSingleActionDialog
      ref="singleDialog"
      ></MSingleActionDialog>
      <MCircleLoader v-if="showLoader"></MCircleLoader>
      <el-dialog
        v-model="dialogVisible"
        title="Thu hồi tài sản"
        width="50%"
      >
        <span>{{ dialogMessage }}</span>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">Hủy</el-button>
            <el-button type="primary" @click="redeployAsset">
              Đồng ý
            </el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </template>
  <script>
  import MDeleteConfirmDialog, { deleteType } from "@/components/unit-components/MConfirmDeleteDialog.vue";
  import { toastControl } from "@/store/toast";
  import { formAction } from "@/components/unit-components/MEmployeeDetail.vue";
  import { ToastType } from "@/components/base-component/MToastItem.vue";
  import MPagination from "@/components/base-component/MPagination.vue";
  import MSearchBar from "@/components/base-component/MSearchBar.vue";
  import MActionMultiple from "@/components/base-component/MActionMultiple.vue";
  import resources from "@/js/resources";
  import MSingleActionDialog, { dialogType } from "@/components/unit-components/MSingleActionDialog.vue";
  import MCircleLoader from "@/components/base-component/MCircleLoader.vue";
  import MDeployDetail from "./DeployDetail.vue";
  import { loader } from '@/store/loader';
  
  export default {
    name: "AssetList",
    // inject:['showToastMsg'],
    // Set up toast message
    setup() {
      const ToastControl = toastControl();
      const Loader = loader();
      return {
        ToastControl, Loader
      };
    },
    components: {
      MDeleteConfirmDialog,
      MDeployDetail,
      MPagination,
      MSearchBar,
      MActionMultiple,
      MSingleActionDialog,
      MCircleLoader
    },
    created() {
      this.APIString =
        `${this.res.endpoint}Employees/Filter?pageSize=20&pageNumber=1&keyWord=`;
      window.addEventListener("keydown", this.handleKeyDown);
      this.getStaticData();
      this.getAllAsset();
    },
  
    unmounted() {
      window.removeEventListener("keydown", this.handleKeyDown);
    },
  
    watch: {},
  
    methods: {

      async redeployAsset(){
        this.dialogVisible = false;
        this.isLoaded = false;
        try{
          if (this.currentAsset) {
            /*eslint-disable no-debugger */
            debugger
            this.currentAsset.boughtat = new Date(this.currentAsset.boughtat);
            this.currentAsset.warrantyto = new Date(this.currentAsset.warrantyto);
            if (this.currentAsset.price) this.currentAsset.price = parseInt(this.currentAsset.price.toString().replaceAll('.', ''));
            this.currentAsset['employeeid'] = null;
            const options = {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(this.currentAsset),
            };
            let res = await fetch(`${this.res.endpoint}Asset/?id=${this.currentAsset['assetid']}`, options);
            let data = await res.json();
            if (res.status == 200 || res.status == 201) {
                this.ToastControl.showToastMsg(
                    ToastType.Success,
                    data['message']
                )
                this.currentEmployee['assigned'] = this.currentEmployee['assigned'].filter(x => x['assetid'] != this.currentAsset['assetid']);
                this.$emit('closeEvent');
            }
          }
          this.isLoaded = true;
        } catch (err) {
          this.isLoaded = true;
          //
        }
      },

      unassign(asset, employee){
        this.dialogMessage = `Bạn có chắc muốn thu hồi ${asset['assetname']} của ${employee['fullname']} không ?`;
        this.dialogVisible = true;
        this.currentEmployee = employee;
        this.currentAsset = asset;
      },

      async getAllAsset() {
        let res = await fetch(`${this.res.endpoint}Asset`);
        if (res.status == 200) {
          let data = await res.json();
          if(this.employees && this.employees.length > 0) {
            this.employees.forEach((employee) => {
              employee.assigned = data.filter(x => x.employeeid == employee['employeeid']);
            })
          }
        }
      },

      async getStaticData(){
        let res = await fetch(this.APIString),
            data = await res.json();
        if (res.status == 200) {
          this.isLoaded = true;
          this.employees = data['Data'].data.filter(x => x['fullname']);
          this.totalRecord = data['Data'].totalRecord[0]['Total record'];
          this.employees.forEach(employee => { employee['fullname'] = employee['fullname'] ? employee['fullname'] : ''})
        }
      },

      formatDateToDisplay(data) {
        const dateVal = new Date(data);
        let date = dateVal.getDate();
        let month = dateVal.getMonth() + 1;
        const fyear = dateVal.getFullYear();
        date = date < 10 ? "0" + date : date;
        month = month < 10 ? "0" + month : month;
        return `${month}-${date}/${fyear}`;
      },
  
      /**
       * Xóa hàng loạt bản ghi
       * 
       * @author Xuân Đào (14/03/2023)
       */
      multipleDelete() {
        this.deleteRecord(null, deleteType.multipleDelete);
      },
  
      /**
       * Check số lượng bản ghi được chọn
       * 
       * @author Xuân Đào (14/03/2023)
       */
      selectMultiple(num) {
        if (num > 1) this.enableMultipleEditor = true;
        else this.enableMultipleEditor = false;
      },
  
      /**
       * Cập nhật api phân trang
       * 
       * @author Xuân Đào (14/03/2023)
       */
      updateAPIString(pageSize, pageNumber) {
        this.APIString = `${this.res.endpoint}Employee/Filter?pageSize=${pageSize}&pageNumber=${pageNumber}&keyWord=${this.keyWord}`;
        this.$refs.gridData.refreshData(this.APIString);
        this.currentPage = pageNumber;
        this.pageSize = pageSize;
      },
  
      /**
       * Hàm cập nhật tổng số bản ghi
       * @param {*} total tổng số bản ghi
       * @author Xuân Đào (20/03/2023)
       */
      updateTotal(total) {
        this.totalRecord = total;
      },

      formatMoney(amount, decimalCount = 0, decimal = "", thousands = ".") {
      decimalCount = Math.abs(decimalCount);
      decimalCount = isNaN(decimalCount) ? 2 : decimalCount;
      const negativeSign = amount < 0 ? "-" : "";
      let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
      let j = (i.length > 3) ? i.length % 3 : 0;
      return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
    },
  
      /**
       * Hàm format việc hiển thị ngày tháng đúng định dạng
       * @param data dữ liệu ngày cần format
       *
       * Author: Xuân Đào (02/03/2023)
       */
      formatDate(data) {
        const dateVal = new Date(data);
        let date = dateVal.getDate();
        let month = dateVal.getMonth() + 1;
        const fyear = dateVal.getFullYear();
        date = date < 10 ? "0" + date : date;
        month = month < 10 ? "0" + month : month;
        return `${date}/${month}/${fyear}`;
      },
  
      /**
       * Hàm format dữ liệu ngày thàng
       *
       * Author: Xuân Đào (03/03/2023)
       */
       readableDateFormater(data) {
        const date = new Date(data);
        const dateVal =
          date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
        const month =
          date.getMonth() < 10
            ? "0" + (date.getMonth() + 1)
            : date.getMonth() + 1;
        const year = date.getFullYear();
        return `${year}-${month}-${dateVal}`;
      },
      /**
       * Hàm hiển thị popup thêm nhân viên
       * @author Xuân Đào 02.03.2023
       */
      showPopup() {
        this.isShowPopup = true;
      },
  
      /**
       * Hàm hiển thị popup thêm nhân viên
       * Author: Xuân Đào (02/03/2023)
       */
      async showNewPopup() {
        this.action = formAction.createRecord;
        const data = await fetch(`${this.res.endpoint}Employee/NewEmployeeCode`);
        const newCode = await data.text();
        this.selectedEmployee = {
          EmployeeCode: newCode,
          FullName: "",
          GenderName: "",
          DepartmentName: "",
          PositionName: "",
          DateOfBirth: "",
          IdentityNumber: "",
        }
        this.popupTitle = this.res.vi.employeeDetail.createTitle;
        this.isShowPopup = true;
      },
  
      /**
       * Hàm làm mới dữ liệu
       */
      reloadData() {
        this.renewData();
      },
  
      renewData() {
        this.gridKey++;      
        this.$refs.gridData.refreshData(this.APIString);
      },
  
      /**
       * Hàm đóng thị popup thêm nhân viên
       * Author: Xuân Đào (02/03/2023)
       */
      closePopup() {
        this.isShowPopup = false;
      },
  
      /**
       * Hàm double click để sửa 1 nhân viên
       * @param employee Lấy ra nhân viên được click
       * Author: Xuân Đào (02/03/2023)
       */
      editOnDbClick(employee) {
        this.selectedEmployee = employee;
        this.action = formAction.updateRecord;
        this.popupTitle = this.res.vi.employeeDetail.updateTitle;
        this.showPopup();
      },
  
      /**
       * Hàm hiển thị context menu
       *
       * Author: Xuân Đào
       */
      editOnClick(event) {
        event.target.nextElementSibling.style.display = "block";
        event.target.addEventListener("focusout", () => {
          setTimeout(() => {
            event.target.nextElementSibling.style.display = "none";
          }, 300);
        });
      },
      /**
       * Hàm xử lý phím tắt
       */
      handleKeyDown(event) {
        if (event.ctrlKey && event.key === '1'){
          event.preventDefault();
          this.showNewPopup();
        }
  
        if (event.ctrlKey && event.key === 'd'){
          event.preventDefault();
          if (this.$refs.gridData.selectedData) {
            this.deleteRecord(this.$refs.gridData.selectedData, deleteType.singleDelete);
          }
        }
        
        if (event.ctrlKey && event.key === 'm'){
          event.preventDefault();
          if(this.$refs.gridData.getSelectedList().length > 0){
            this.deleteRecord(null, deleteType.multipleDelete);
          }
        }
  
        if (event.ctrlKey && event.key === 'r') {
          event.preventDefault();
          this.reloadData();
        }
  
        if (event.ctrlKey && event.key === 'e') {
          event.preventDefault();
          this.excelExport();
        }
      },
  
      /**
       * Hàm hiển thị thông báo toast
       */
      showToastMessage(toastKind, toastMess) {
        this.toastKind = toastKind;
        this.toastMess = toastMess;
        this.showToast = true;
        setTimeout(() => {
          this.showToast = false;
        }, 5000);
      },
  
      /**
       * Hàm xóa một bản ghi trong database
       *
       * Author: Xuân Đào (07/03/2023)
       */
      deleteRecord(employee, type) {
        if (type === deleteType.singleDelete || typeof(type) == 'undefined') {
          this.selectedEmployee = employee;
          this.deleteMessage = `Bạn có chắc muốn xóa thiết bị <${this.selectedEmployee['assetcode']}> không ?`;
        } else if (type === deleteType.multipleDelete) {
          this.deleteMessage = 'Bạn có chắc muốn xóa những thiết bị đã chọn không ?';
        }
  
        this.showDeleteDialog(type);
      },
      /**
       * Hàm hiển thị xác nhận xóa
       *
       * Author: Xuân Đào (08/03/2023)
       */
      showDeleteDialog(deleteType) {
        this.deleteDialog = true;
        setTimeout(() => {
          this.$refs.confirmDelete.deleteType = deleteType;
        }, 100);
      },
  
      /**
       * Ẩn popup xác nhận xóa
       *
       * Author: Xuân Đào (08/03/2023)
       */
      closeDeleteDialog() {
        this.deleteDialog = false;
      },
  
      /**
       * Ẩn popup và xóa record
       */
      async closeAndDelete(type) {
        this.closeDeleteDialog();
        try {
          if (type === deleteType.singleDelete || typeof type == 'undefined') {
            this.$refs.gridData.deleteSelectedRow();
            const apiString = `${this.res.endpoint}Employee/${this.selectedEmployee['assetid']}`;
            const options = {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
            };
            const res = await fetch(apiString, options);
            if (res.status === 200) {
              let data = await res.json();
              this.ToastControl.showToastMsg(ToastType.Success,data['Message']);
            }
          } else if (type === deleteType.multipleDelete) {
            let dataList = this.$refs.gridData.getSelectedList();
            let idList = dataList[0].assetid
            for (let i=1;i<dataList.length;i++){
              idList += `,${dataList[i].assetid}`;
            }
            const apiString = `${this.res.endpoint}Employee/MultipleDelete?recordIds=${idList}`;
            const options = {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
            };
            const res = await fetch(apiString, options);
            const data = await res.json();
            if (res.status === 200) {
              this.ToastControl.showToastMsg(ToastType.Success, data['Message']);
              this.totalRecord -= this.$refs.gridData.getSelectedList().length;
              this.$refs.gridData.deleteSelectedMultipleRow();
              this.selectMultiple(0);
              const rowLeft = this.$refs.gridData.getRemainingRow();
              if (rowLeft == 0) {
                this.reloadData();
              }
            }
          }
        } catch (err) {
          console.log(err);
        }
      },
  
      /**
       * Filter khi nhập tìm kiếm
       * 
       * @author Xuân Đào (23/03/2023)
       */
      searchOnInput(key) {
        this.keyWord = key ? key:"";
          this.updateAPIString(this.pageSize, this.currentPage);
      },
  
      /**
       * Xuất dữ liệu hiện tại ra excel
       * 
       * @author Xuân Đào (23/03/2023)
       */
      async excelExport() {
        this.Loader.showLoader();
        let api = `${this.res.endpoint}Employee/ExcelExport?widthList=${this.$refs.gridData.widthList.toString()}`;
        if (this.keyWord)
          api = `${this.res.endpoint}Employee/ExcelExport?widthList=${this.$refs.gridData.widthList.toString()}&keyWord=${this.keyWord}`;
        fetch(api)
          .then((res) => res.blob())
          .then((data) => {
            var a = document.createElement("a");
            a.href = window.URL.createObjectURL(data);
            a.download = "Danh_sach_nhan_vien-" + Date.now().toString();
            a.click();
            a.remove();
            this.Loader.closeLoader();
          })
          .catch(err => {
            console.log(err);
          })
        // const link = window.URL.createObjectURL(res);
        // console.log(link);
        // new JsFileDownloader({url: link});
      },
  
      /**
       * Hàm nhân bản nhân viên
       *
       * @author  Xuân Đào (12/03/2023)
       */
      async duplicateEmployee(employee){
        this.action = formAction.duplicateRecord;
        this.selectedEmployee = employee;
        const newCode = await fetch(`${this.res.endpoint}Employee/NewEmployeeCode`);
        const data = await newCode.text();
        this.selectedEmployee.EmployeeCode = data;
        this.selectedEmployee.DateOfBirth = this.readableDateFormater(this.selectedEmployee.DateOfBirth);
        this.selectedEmployee.IdentityDate = this.readableDateFormater(this.selectedEmployee.IdentityDate);
        this.popupTitle = this.res.vi.employeeDetail.createTitle;
        this.isShowPopup = true;
      },
  
      /**
       * Reload lại grid data
       *
       * @author  Xuân Đào (12/03/2023)
       */
      updateGridData(employee){
       this.$refs.gridData.gridData.push(employee);
       this.gridKey++;
      },
  
      /**
       * Hiển thị thông báo tính năng đang được phát triển
       *
       * @author  Xuân Đào (12/03/2023)
       */
      showDeveloping(){
        this.$refs.singleDialog.showDialogOn(dialogType.info, resources.vi.dialogMessage.developing, resources.vi.btnAction.close)
      },
  
      /**
       * Hàm load lại popup
       *
       * @author  Xuân Đào (12/03/2023)
       */
      reloadEmployeeDetail(){
        this.closePopup();
        this.showNewPopup();
        this.popupKey++;
      }
    },
    data() {
      return {
        employees: [],
        isShowPopup: false,
        selectedEmployee: null,
        showLoading: true,
        lastKeyPress: null,
        lastTimePress: null,
        showToast: false,
        toastMess: "",
        deleteDialog: false,
        showData: true,
        totalRecord: 0,
        APIString: null,
        keyWord: "",
        currentPage: 1,
        pageSize: 20,
        multipleSelected: [],
        enableMultipleEditor: false,
        deleteMessage: "",
        res: resources,
        popupTitle: "",
        action: formAction.createRecord,
        gridKey: 0,
        popupKey: 0,
        showLoader: false,
        isLoaded: false,
        dialogVisible: false,
        dialogMessage: '',
        currentEmployee: null,
        currentAsset: null,
      };
    },
  };
  </script>
  <style scoped>
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
  }
  
  .ct-btn{
    color: #fff;
    font-size: 13px;
    font-family: Notosans-bold;
    height: 22px;
    margin-top: 3px;
    width: 50px;
    line-height: 22px;
    margin-left: 15px;
    border-right: solid #fff 1px;
  }
  
  .more-icon{
    margin-top: 3px;
    margin-left: 6px;
    height: 22px;
    width: 22px;
    background: url('@/assets/img/Sprites.64af8f61.svg') no-repeat -846px -356px;
  }

  ::v-deep .el-collapse-item__header{
    padding: 0 30px;
    font-size: 16px;
    color: #444444;
    font-family: Notosans-semibold;
  }

  .assigned-item{
    display: flex;
    padding: 0 40px;
    column-gap: 30px;
    height: 38px;
    line-height: 38px;
    border-bottom: solid #eeeeee 1px;
    position: relative;
  }

  .assigned-item:hover, .action-button:hover{
    background-color: #fafafa;
  }

  .asset-line{
    height: 20px;
    margin-top: 10px;
    border-radius: 4px;
    width: 2px;
    background-color: #666666;
  }

  .action-button{
    position: absolute;
    right: 20px;
    border-radius: 8px;
    line-height: 28px;
    margin-top: 4px;
    height: 28px;
    padding: 0px 8px;
    border: solid #dd1b16 1px;
    color: #dd1b16;
    cursor: pointer;
    font-family: Notosans-semibold;
    user-select: none;
  }

  .deploy-button{
    position: absolute;
    right: 100px;
    border-radius: 8px;
    line-height: 28px;
    margin-top: 4px;
    height: 28px;
    padding: 0px 8px;
    border: solid #2ca01c 1px;
    color: #2ca01c;
    cursor: pointer;
    user-select: none;
    font-family: Notosans-semibold;
  }

  .asset-status{
    height: 30px;
    width: 150px;
    text-align: center;
    font-family: Notosans-semibold;
    line-height: 30px;
    border: solid 1px;
    position: absolute;
    border-radius: 8px;
    right: 32%;
  }

  .status-1{
    color: #2ca01c;
    border-color: #2ca01c;
  }
  .status-2{
    color: #00d8ff;
    border-color: #00d8ff;
  }
  .status-3{
    color: #fcba03;
    border-color: #fcba03;
  }
  .status-4{
    color: #dd1b16;
    border-color: #dd1b16;
  }

  </style>