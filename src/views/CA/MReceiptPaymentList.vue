<template>
  <div class="rp-main">
    <div class="content-main__header">
        <div class="action-multiple__icon"></div>
        <m-action-multiple
        class="action-multiple"
        :enable="enableMultipleEditor"
        @deleteMultiple="multipleDelete"
        ></m-action-multiple>
      <m-search-bar @onSearch="onSearch" ref="searchBar"></m-search-bar>
      <div
        @click="this.gridKey++"
        title="Tải lại (Ctrl + R)"
        class="icon reload-icon"
      ></div>
      <div
        title="Xuất ra excel (Ctrl + E)"
        @click="excelExport"
        class="icon export-excel-icon"
      ></div>
      <div title="Tùy chỉnh giao diện" @click="UISetting = true" class="icon setup-icon"></div>
      <MOptionalButton ref="btn1" @onClick="showNewPopup(0)" content="P. xuất"></MOptionalButton>
      <MOptionalButton ref="btn2" @onClick="showNewPopup(0)" content="P. nhập"></MOptionalButton>
    </div>
    <div ref="reMaster" class="content-main_master">
        <div class="content-main__data">
            <MGridData
            ref="gridMaster"
            :api="this.APIString"
            :data="[
                {
                  title: resources.vi.cashControl.gridData.rp_date,
                  tooltip: resources.vi.cashControl.gridData.rp_date,
                  dataField: 're_date',
                  dataType: 'date',
                  colWidth: '200',
                  colColor: '111111',
                },
                {
                  title: resources.vi.cashControl.gridData.ca_date,
                  tooltip: resources.vi.cashControl.gridData.rp_date,
                  dataField: 'ca_date',
                  dataType: 'date',
                  colColor: '111111',
                  colWidth: '200',
                },
                {
                  title: resources.vi.cashControl.gridData.rp_ref_no,
                  tooltip: resources.vi.cashControl.gridData.rp_ref_no,
                  dataField: 're_ref_no',
                  dataType: 'text',
                  colColor: '0075c0',
                  colWidth: '150',
                },
                {
                  title: resources.vi.cashControl.gridData.rp_description,
                  tooltip: resources.vi.cashControl.gridData.rp_description,
                  dataField: 're_description',
                  dataType: 'text',
                  colColor: '111111',
                  colWidth: '350',
                },
                {
                  title: resources.vi.cashControl.gridData.amount,
                  tooltip: resources.vi.cashControl.gridData.amount,
                  dataField: 'total_amount',
                  dataType: 'd-money',
                  colColor: '111111',
                  colWidth: '200',
                },
                {
                  title: resources.vi.cashControl.gridData.object_code,
                  tooltip: resources.vi.cashControl.gridData.object_code,
                  dataField: 'supplier_code',
                  dataType: 'text',
                  colColor: '111111',
                  colWidth: '150',
                },
                {
                  title: resources.vi.cashControl.gridData.object,
                  tooltip: resources.vi.cashControl.gridData.object,
                  dataField: 'supplier_name',
                  dataType: 'text',
                  colColor: '111111',
                  colWidth: '200',
                },
                {
                  title: resources.vi.cashControl.gridData.rp_reason,
                  tooltip: resources.vi.cashControl.gridData.rp_reason,
                  dataField: 're_reason',
                  dataType: 'text',
                  colColor: '111111',
                  colWidth: '150',
                },
                {
                  title: resources.vi.cashControl.gridData.ca_type,
                  tooltip: resources.vi.cashControl.gridData.ca_type,
                  dataField: 'ca_type_name',
                  dataType: 'text',
                  colColor: '111111',
                  colWidth: '150',
                },
            ]"
            :isFixedStart="true"
            :isFixedEnd="true"
            :muiltiple-select="true"
            :editable="true"
            :key="gridKey"
            recordId="re_id"
            @loadCompleted = "gridMasterLoaded"
            @gridItemClicked = "gridItemOnClicked"
            @functionClicked = "watchPayment"
            @duplicateEvent="duplicateEvent"
            @deleteEvent="showConfirmDelete"
            @modifyEvent="modifyPayment"
            @dbClicked="watchPayment"
            @selectMultiple="updateSelected"
            :isFocusFirst="true"
            function="Xem"
            ></MGridData>
        </div>
        <div class="re-pagination">
          <div class="total_amount">
            <div class="total_txt">{{ this.resources.vi.cashControl.gridMaster.total_txt }}</div>
            <div class="total_value">{{ this.formatMoney(this.total_amount_master) }}</div>
          </div>
          <MPagination
          :totalRecord="this.totalMaster"
          @updateAPI="updateMasterApi"
          ref="pagingMaster"
        ></MPagination>
        </div>
    </div>
    <div ref="reDetail" class="content-main_detail">
        <div class="re-main__header">
            <div class="re-header__name">{{ this.resources.vi.cashControl.detail }}</div>
            <div ref="reDetailCollase" class="re-header__collase" @click="collaseDetail"></div>
        </div>
        <div class="content-main__data detail-data">
            <MGridData
            ref="gridDetail"
            :api="this.detailAPI"
            :data="[
                {
                  title: '#',
                  tooltip: '',
                  dataField: 're_no',
                  dataType: 'num',
                  colColor: '111111',
                  colWidth: '0',
                },
                {
                  title: resources.vi.cashControl.gridDetail.rp_description,
                  tooltip: resources.vi.cashControl.gridDetail.rp_description,
                  dataField: 'rpd_description',
                  dataType: 'text',
                  colColor: '111111',
                  colWidth: '150',
                },
                {
                  title: resources.vi.cashControl.gridDetail.debit_account,
                  tooltip: resources.vi.cashControl.gridDetail.debit_account_tooltip,
                  dataField: 'debit_account',
                  dataType: 'text',
                  colColor: '111111',
                  colWidth: '100',
                },
                {
                  title: resources.vi.cashControl.gridDetail.credit_account,
                  tooltip: resources.vi.cashControl.gridDetail.credit_account_tooltip,
                  dataField: 'credit_account',
                  dataType: 'text',
                  colColor: '111111',
                  colWidth: '100',
                },
                {
                  title: resources.vi.cashControl.gridDetail.amount,
                  tooltip: resources.vi.cashControl.gridDetail.amount,
                  dataField: 'amount',
                  dataType: 'd-money',
                  colColor: '111111',
                  colWidth: '150',
                },
                {
                  title: resources.vi.cashControl.gridDetail.object,
                  tooltip: resources.vi.cashControl.gridDetail.object,
                  dataField: 'supplier_code',
                  dataType: 'text',
                  colColor: '111111',
                  colWidth: '150',
                },
                {
                  title: resources.vi.cashControl.gridDetail.object_name,
                  tooltip: resources.vi.cashControl.gridDetail.object_name,
                  dataField: 'supplier_name',
                  dataType: 'text',
                  colColor: '111111',
                  colWidth: '350',
                },
            ]"
            :key="gridKey"
            @loadCompleted = "gridDetailLoaded"
            ></MGridData>
        </div>
        <div ref="detailPaging" class="re-pagination">
          <div class="total_amount">
            <div class="total_txt">{{ this.resources.vi.cashControl.gridMaster.total_txt }}</div>
            <div class="total_value">{{ this.formatMoney(this.total_amount_detail) }}</div>
          </div>
          <MPagination
          :totalRecord="this.totalDetail"
          @updateAPI="updateAPIDetail"
          ref="pagingDetail"
        ></MPagination>
        </div>
    </div>
    <!-- <MPaymentDetail :formMode="detailMode" :payment="detailPayment" @closeDetail="closeDetail" v-if="showDetail"></MPaymentDetail> -->
  </div>
  <MConfirmDeleteDialog v-if="showConfirm" :messagse="confirmMessage" @hideDeleteDialog="showConfirm = false"
          @hideAndDelete="deleteEvent"></MConfirmDeleteDialog>
</template>
<script>

// Trạng thái của form
export const PaymentFormMode = {
  create: 0,
  modify: 1,
  watch: 2,
  duplicate: 3,
}

// Mode xóa dữ liệu
export const DeleteMode = {
  singleDelete: 0,
  multipleDelete: 1,
}

import resources from "@/js/resources";
import MSearchBar from '@/components/base-component/MSearchBar.vue';
import MActionMultiple from "@/components/base-component/MActionMultiple.vue";
import MGridData from "@/components/base-component/MGridData.vue";
import MPagination from "@/components/base-component/MPagination.vue";
// import MPaymentDetail from '@/views/CA/MPaymentDetail.vue';
import MOptionalButton from "@/components/base-component/MOptionalButton.vue";
import { paymentDetail } from "@/store/paymentDetail";
import { toastControl } from '@/store/toast';
import { ToastType } from '@/components/base-component/MToastItem.vue';
import MConfirmDeleteDialog from "@/components/unit-components/MConfirmDeleteDialog.vue";
import { loader } from '@/store/loader';
 
export default {
  components: { MSearchBar, MActionMultiple, MGridData, MPagination, MOptionalButton, MConfirmDeleteDialog },
  name: "MReceiptPaymentList",

  setup() {
    const PaymentDetail = paymentDetail();
    const Toast = toastControl();
    const Loader = loader();
    return {
      PaymentDetail, Toast, Loader
    };
  },

  created(){
    this.APIString = this.resources.endpoint + 'ReceiptPayment/Filter?pageSize=20&pageNumber=1&keyWord=';
  },

  mounted(){
    window.addEventListener("keydown", this.handleOnKeyDown);
  },

  unmounted(){
    window.removeEventListener("keydown", this.handleOnKeyDown);

  },

  methods: {
    handleOnKeyDown(){
      if (event.ctrlKey && event.key === '1'){
        event.preventDefault();
        this.showNewPopup(PaymentFormMode.create);
      }

      if (event.ctrlKey && event.key === 'm'){
        event.preventDefault();
        if (this.enableMultipleEditor) {
          this.multipleDelete();
        }
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
     * Hàm sửa chứng từ
     * @param payment: Chứng từ
     * @author pvdat (12/05/2023)
     */
    modifyPayment(payment){
      this.showNewPopup(PaymentFormMode.modify, payment)
    },
    
    /**
     * Hàm xóa hàng loạt chứng từ
     * @param payment: Chứng từ
     * @author pvdat (12/05/2023)
     */
    multipleDelete(){
      this.deleteMode = DeleteMode.multipleDelete;
      this.confirmMessage = this.resources.vi.actionMultiple.deleteMultipleConfirm;
      this.showConfirm = true;
    },

    /**
     * Hàm cập nhật trạng thái cho button xóa nhiều
     * @param payment: Chứng từ
     * @author pvdat (12/05/2023)
     */
    updateSelected(length){
      if (length > 1) this.enableMultipleEditor = true;
      else this.enableMultipleEditor = false;
    },

    /**
     * Hàm xuất excel chứng từ
     * @param payment: Chứng từ
     * @author pvdat (12/05/2023)
     */
    async excelExport(){
      this.Loader.showLoader();
      let keyword = this.$refs.searchBar.getInputValue();
      let apiString = `${this.resources.endpoint}ReceiptPayment/ExcelExport?widthList=50%2C150%2C150%2C100%2C250%2C150%2C200%2C200%2C250%2C200&keyword=${keyword}`;
      const res = await fetch(apiString);
      const data = await res.blob();
      var a = document.createElement("a");
      a.href = window.URL.createObjectURL(data);
      a.download = "Thu_chi_tien_mat-" + Date.now().toString();
      a.click();
      a.remove();
      this.Loader.closeLoader();
    },

    /**
     * Hàm tìm kiếm chứng từ
     * @param payment: Chứng từ
     * @author pvdat (12/05/2023)
     */
    onSearch(keyword){
      this.keyword = keyword;
      const pageSize = this.$refs.pagingDetail.pageSize;
      const pageNum = this.$refs.pagingDetail.currentPage;
      this.$refs.gridDetail.gridData = [];
      this.updateMasterApi(pageSize, pageNum);
    },

    /**
     * Hàm hiển thị xác nhận xóa chứng từ
     * @param payment: Chứng từ
     * @author pvdat (11/05/2023)
     */
    showConfirmDelete(payment){
      this.confirmMessage = "Bạn có muốn xóa chứng từ <" + payment['re_ref_no'] + "> đã chọn không?";
      this.selectedPayment = payment;
      this.deleteMode = DeleteMode.singleDelete;
      this.showConfirm = true;
    },

    /**
     * Hàm xóa chứng từ
     * @param payment: Chứng từ
     * @author pvdat (11/05/2023)
     */
    async deleteEvent(){
      if (this.deleteMode == DeleteMode.singleDelete){
        let apiString = this.resources.endpoint + "ReceiptPayment/FullDelete?id=" + this.selectedPayment['re_id'];
        const options = {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        };
        const res = await fetch(apiString, options);
        const data = await res.json();
        this.Toast.showToastMsg(ToastType.Success, data['Message']);
        this.gridKey++;
        this.showConfirm = false;
      } else if (this.deleteMode == DeleteMode.multipleDelete){
        let apiString = this.resources.endpoint + "ReceiptPayment/DeleteMultiple";
        const idList = this.$refs.gridMaster.selectedMultiple;
        const options = {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(idList),
        };
        const res = await fetch(apiString, options);
        const data = await res.json();
        this.Toast.showToastMsg(ToastType.Success, data['Message']);
        this.gridKey++;
        this.showConfirm = false;
        this.enableMultipleEditor = false;
      }
    },

    /**
     * Hàm nhân bản chứng từ
     * @param payment: Chứng từ
     * @author pvdat (11/05/2023)
     */
    duplicateEvent(payment){
      this.showNewPopup(PaymentFormMode.duplicate, payment)
    },

    /**
     * Hàm xem chứng từ
     * @param item: Chứng từ
     * @author pvdat (11/05/2023)
     */
    watchPayment(item){
      this.showNewPopup(PaymentFormMode.watch, item);
    },

    /**
     * Hàm cập nhật api detail
     * @author pvdat (11/05/2023)
     */
    updateAPIDetail(){
      // this.APIString = this.resources.endpoint + `ReceiptPayment/Filter?pageSize=${pageSize}&pageNumber=${pageNum}`;
    },

    /**
     * Hàm cập nhật api master
     * @param pageSize: Số bản ghi/trang
     * @param pageNum: Trang hiện tại
     * @author pvdat (11/05/2023)
     */
    updateMasterApi(pageSize, pageNum){
      this.APIString = this.resources.endpoint + `ReceiptPayment/Filter?pageSize=${pageSize}&pageNumber=${pageNum}&keyWord=${this.keyword}`;
    },

    /**
     * Hàm đi tới màn chi tiết chứng từ
     * @param payment: Chứng từ
     * @param formMode: hành động của form
     * @author pvdat (10/05/2023)
     */
    async showNewPopup(formMode, payment){
      let id = "";
      if (formMode != PaymentFormMode.create && formMode != PaymentFormMode.duplicate){
        id = payment['re_id'];
      }
      sessionStorage.paymentMode = formMode;
      if (formMode == PaymentFormMode.duplicate)
        sessionStorage.currentPaymentId = payment['re_id'];
      this.$router.push({ name: "PaymentDetail", params: {id: id, data: 2}});
    },

    /**
     * Hàm xử lý dữ liệu khi grid load xong
     * @param servie: Chứng từ
     * @author pvdat (10/05/2023)
     */
    gridMasterLoaded(service){
        if (this.$refs.gridMaster.gridData[0]) {
          this.currentPayment = this.$refs.gridMaster.gridData[0];
          this.total_amount_master = service['optionResult'][0]['sum'];
          this.totalMaster = service['totalRecord'][0]['Total record'];
          this.detailAPI = this.resources.endpoint + 'ReceiptPaymentDetail/GetAllByReId?re_id=' + this.currentPayment.re_id;
          this.$refs.gridDetail.getApiData();
          let gridMaster = this.$refs.gridMaster.gridData;
          for (let i = 0; i< gridMaster.length;i++){
            gridMaster[i].ca_type_name = "Phiếu chi";
          }
          this.$refs.gridMaster.gridData = gridMaster;
          const selectedList = this.$refs.gridMaster.selectedMultiple;
          setTimeout(() => {
            const checkboxList = document.querySelector(".grid-body").querySelectorAll(".m-checkbox");
            const trList = document.querySelector(".grid-body").querySelectorAll("tr");
            for (let i=0;i<checkboxList.length;i++){
              if (selectedList.indexOf(this.$refs.gridMaster.gridData[i]['re_id']) != -1){
                checkboxList[i].classList.add("checked");
                trList[i].classList.add("checked-item");
              } 
              else {
                checkboxList[i].classList.remove("checked");
                trList[i].classList.remove("checked-item");
              }
            }
          }, 100);
        } else {
          this.$refs.gridDetail.noData = true;
        }
    },

    /**
     * Hàm đi tới màn chi tiết chứng từ
     * @param payment: Chứng từ
     * @author pvdat (10/05/2023)
     */
    gridDetailLoaded(service){ 
      if (this.$refs.gridDetail.gridData[0]){
        this.total_amount_detail = service['summary'][0]['Total amount'];
        this.totalDetail = service['totalRecord'][0]['Total record'];
      }
      else this.total_amount_detail = 0;
    },

    /**
     * Hàm thu gọn detail
     * @author pvdat (10/05/2023)
     */
    collaseDetail(){
        if (!this.collased){
            this.$refs.reMaster.classList.remove('collase-master');
            this.$refs.reDetail.classList.remove('expand-detail');
            this.$refs.reDetailCollase.classList.remove('unrotate');
            this.$refs.reMaster.classList.add("expand-master");
            this.$refs.reDetail.classList.add("collase-detail");
            this.$refs.reDetailCollase.classList.add("rotate180deg");
            this.$refs.detailPaging.classList.add("detail-paging");
            this.collased = true;
        } else {
            this.$refs.reMaster.classList.remove("expand-master");
            this.$refs.reDetail.classList.remove("collase-detail");
            this.$refs.reDetailCollase.classList.remove("rotate180deg");
            this.$refs.reMaster.classList.add('collase-master');
            this.$refs.reDetail.classList.add('expand-detail');
            this.$refs.reDetailCollase.classList.add('unrotate');
            this.$refs.detailPaging.classList.remove("detail-paging");
            this.collased = false;
        }
    },

    /**
     * Hàm cập nhật detail khi chọn master 
     * @author pvdat (10/05/2023)
     */
    gridItemOnClicked(item){
      this.detailAPI = this.resources.endpoint + 'ReceiptPaymentDetail/GetAllByReId?re_id=' + item['re_id'];
    },

    /**
     * Hàm định dạng tiền
     * @author pvdat (09/05/2023)
     */
    formatMoney(amount, decimalCount = 0, decimal = "", thousands = ".") {
      decimalCount = Math.abs(decimalCount);
      decimalCount = isNaN(decimalCount) ? 2 : decimalCount;
      const negativeSign = amount < 0 ? "-" : "";
      let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
      let j = (i.length > 3) ? i.length % 3 : 0;
      return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
    },
  },

  data() {
    return {
      resources: resources,
      APIString: "",
      detailAPI: "",
      gridKey: 0,
      currentPayment: null,
      collased: false,
      total_amount_master: 0,
      total_amount_detail: 0,
      totalMaster: 0,
      totalDetail: 0,
      showDetail: false,
      detailPayment: null,
      detailMode: 0,
      showConfirm: false,
      confirmMessage: "",
      selectedPayment: null,
      keyword:"",
      enableMultipleEditor: false,
      deleteMode: 0,
    };
  },
};
</script>
<style scoped>

.setup-icon{
  padding-right: 6px;
  cursor: pointer;
}

.rp-main {
  height: 100%;
  width: 100%;
  background-color: #fff;
  position: relative;
}

.search-bar {
  position: absolute;
  left: 15px;
}

.action-multiple{
    margin-left: 24px;
}

.action-multiple__icon{
    height: 18px;
    width: 18px;
    background: url('@/assets/img/Sprites.64af8f61.svg') no-repeat -259px -147px;
    position: absolute;
    left: 12px;
    top: 18px;
}

.rp-main__content{
    height: calc(100% - 44px);
    width: 100%;
}

.re-main__header{
    height: 40px;
    background-color: #eceef1;
    position: relative;
}

.re-pagination{
    height: 66px;
    width: 100%;
    background-color: #fff;
}

.content-main_master{
    height: 50%;
    width: 100%;
}

.content-main_detail{
    height: calc(50% - 56px);
    width: 100%;
    position: absolute;
    bottom: 12px;
}

.content-main__data{
    height: 80%;
}

.detail-data{
    height: calc(80% - 40px);
}

.re-header__name{
    padding: 4px 16px;
    background-color: #f2ebbf;
    width: 50px;
    border-radius: 4px;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    font-size: 13px;
    font-family: Notosans-bold;
    text-align: center;
    position: absolute;
    bottom: 0;
}

.re-header__collase{
    height: 13px;
    width: 48px;
    background-color: #d4d7dc;
    border-radius: 4px;
    position: absolute;
    top: 0;
    left: calc(50% - 24px);
    cursor: pointer;
}

.re-header__collase::before{
    content: '';
    display: block;
    background: url('@/assets/img/Sprites.64af8f61.svg') no-repeat -564px -365px;
    width: 8px;
    height: 5px;
    position: absolute;
    top: 5px;
    left: calc(50% - 4px);
}

.total_txt{
  font-family: Notosans-bold;
  font-size: 13px;
  line-height: 28px;
  padding-left: 52px;

}

.total_value{
  font-family: Notosans-bold;
  font-size: 13px;
  line-height: 28px;
  position: absolute;
  right: 420px;
}

.total_amount{
  height: 28px;
  width: 100%;
  background-color: #e8eaef;
  display: flex;
  position: relative;
}
.detail-paging{
    display: none;
}

@keyframes collase-detail {
    from{height: calc(50% - 56px);}
    to{height: 40px;}
}

@keyframes expand-detail {
    from{height: 40px;}
    to{height: calc(50% - 56px);}
}

@keyframes expand-master {
    from{height: 50%;}
    to{height: calc(100% - 44px);}
}

@keyframes collase-master {
    from{height: calc(100% - 40px);}
    to{height: 50%;}
}

.rotate180deg{
    transform: rotate(180deg);
    transition-duration: 0.5s;
}

.unrotate{
    transform: rotate(0deg);
    transition-duration: 0.5s;
}

.collase-detail{
    animation-name: collase-detail;
    animation-duration: 0.5s;
    animation-fill-mode: forwards;
}

.expand-detail{
    animation-name: expand-detail;
    animation-duration: 0.5s;
    animation-fill-mode: forwards;
}

.collase-master{
    animation-name: collase-master;
    animation-duration: 0.5s;
    animation-fill-mode: forwards;
}

.expand-master{
    animation-name: expand-master;
    animation-duration: 0.5s;
    animation-fill-mode: forwards;
}
</style>