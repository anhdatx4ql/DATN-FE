// component dùng để hiển thị data dưới dạng grid với dữ liệu được truyền vào thông qua api
// Props: data bao gồm dữ liệu về tên các cột cần có, modelName tương ứng với các cột, loại cột, độ rộng cột.
// @author  Xuân Đào (12/03/2023)
<template>
  <div class="grid-viewer" ref="gridViewer" @click="getClickedPosition">
    <div class="grid-viewer__scroll">
      <table class="grid-table" ref="gridTable">
        <thead ref="tableThead">
          <tr class="grid-title">
            <th
              class="multiple-select"
              :class="[{ 'fix-start': isFixedStart }]"
              v-if="muiltipleSelect"
            >
              <MCheckbox ref="parentCheckbox" @click="parentCheckBoxOnClick"></MCheckbox>
              <div class="rightBorder"></div>
            </th>
            <th
              :class="[item.dataType, {'first-column': index==0}, {'last-column': index==data.length-1}]"
              v-for="(item, index) in data"
              :key="index"
              :title="item.tooltip"
            >
              {{ item.title }}
            </th>
            <th
              class="editable"
              :class="{ 'fix-end': isFixedEnd }"
              v-if="editable"
            >
              Chức năng
              <div class="leftBorder"></div>
            </th>
          </tr>
        </thead>
        <tbody ref="tableBody" class="grid-body">
          <MGridDataLoading :numOfColumn="data.length" v-if="showLoading"></MGridDataLoading>
          <tr v-for="(item, index) in gridData" :key="index" 
          @click="itemOnClick(item, index)"
          :class="{'tr-selected': index == 0 && isFocusFirst}"
          >
            <td
              v-if="muiltipleSelect"
              :class="{ 'fix-start': isFixedStart }"
              v-show="!showLoading"
            >
              <MCheckbox @click="checkBoxOnClick(item)" ref="childCheckbox">
              </MCheckbox>
              <div class="rightBorder"></div>
            </td>
            <td
              :class="[value.dataType, {'first-column': index==0}, {'last-column': index==data.length-1}]"
              v-for="(value, index) in data"
              :key="index"
              v-show="!showLoading"
              :style="[{maxWidth: value['colWidth']+'px'},{color: '#' + value['colColor']}]"
              :title="item[value.dataField]"
              @dblclick="editOnDbClick(item)"
            >
            <div v-if="value['dataType'] == 'asset-status'">
              <div class="asset-status status-1" v-if="item[value.dataField] == 0">Đang sử dụng</div>
              <div class="asset-status status-2" v-if="item[value.dataField] == 1">Chưa sử dụng</div>
              <div class="asset-status status-3" v-if="item[value.dataField] == 2">Đang sửa chữa</div>
              <div class="asset-status status-4" v-if="item[value.dataField] == 3">Đã hư hỏng</div>
            </div>
            <div v-else>
              {{ item[value.dataField] }}
            </div>
            </td>
            <td
              class="editable"
              :class="{ 'fix-end': isFixedEnd }"
              v-if="editable"
              v-show="!showLoading"
            >
              <div class="edit">
                <div class="edit-text" @click="this.$emit('dbClicked', item)">{{ this.function }}</div>
                <div
                  tabindex="0"
                  class="edit-icon"
                  @click="editOnClick(item)"
                  @blur="editOnBlur"
                ></div>
              </div>
              <div class="leftBorder"></div>
            </td>
          </tr>
        </tbody>
        <div class="no-data" v-show="noData">{{ this.resources.vi.noDataGrid }}</div>
      </table>
    </div>
    <MContextMenu
      ref="context"
      slot1="Sửa"
      slot2="Xóa"
      slot3 ="Nhân bản"
      @action1="ModifyEvent"
      @action2="DeleteEvent"
      @action3="DuplicateEvent"
      v-show="showContext"
    ></MContextMenu>
  </div>
</template>
<script>
import MGridDataLoading from "../unit-components/MGridDataLoading.vue";
import MContextMenu from "./MContextMenu.vue";
import MCheckbox from "./MCheckbox.vue";
import { deleteType } from '../unit-components/MConfirmDeleteDialog.vue';
import { multipleSelectedData } from "@/store/multipleDeleteEmployee";
import { loader } from "@/store/loader";
import Sortable from "sortablejs"
import resources from "@/js/resources";

export default {
  name: "MGridData",

  emits: ['update:totalRecord', 'update:enableMultipleEditor'],

  setup(){
    const SelectedList = multipleSelectedData()
    const Loader = loader()
    return {
      SelectedList, Loader
    }
  },

  components: {
    MContextMenu,
    MGridDataLoading,
    MCheckbox,
  },

  props: {
    // Api lấy dữ liệu cho grid data
    api: {
      type: String,
      required: true,
    },

    // Dữ liệu mapping với api
    data: {
      type: Object,
      required: true,
    },

    // Fix cột đầu tiên trong grid
    isFixedStart: {
      type: Boolean,
      required: false,
      default: false,
    },

    // Fix cột cuối cùng trong grid
    isFixedEnd: {
      type: Boolean,
      required: false,
      default: false,
    },

    // Grid ao gồm gột chọn nhiều hay không
    muiltipleSelect: {
      type: Boolean,
      required: false,
      default: false,
    },

    // Grid gồm gột chức năng hay không
    editable: {
      type: Boolean,
      required: false,
      default: false,
    },

    isFocusFirst:{
      type: Boolean,
      requried: false,
      default: false,
    },

    function: {
      type: String,
      required: false,
      default: "Sửa"
    },

    recordId: {
      type: String,
      required: false,
    }
  },

  /**
   * Lấy dữ liệu từ api và đổ vào data
   *
   * @author  Xuân Đào(12/03/2023)
   */
  created() {
    this.getApiData();

  },

  /**
   * Định dạng dữ liệu tiêu đề
   *
   * @author  Xuân Đào(12/03/2023)
   */
  mounted() {
    let totalWidth = 0;
    if (!this.muiltipleSelect) {
      for (let i = 0; i < this.data.length; i++) {
        this.$refs.tableThead.children[0].children[i].style.width =
          this.data[i].colWidth + "px";
        if (parseInt(this.data[i].colWidth))
          totalWidth += parseInt(this.data[i].colWidth);
        if (this.data[i].dataType == "date") {
          this.$refs.tableThead.children[0].children[i].classList.add(
            "align-center"
          );
        }
      }
    } else {
      for (let i = 0; i < this.data.length; i++) {
        this.widthList.push(this.data[i].colWidth);
        this.$refs.tableThead.children[0].children[i + 1].style.width =
          this.data[i].colWidth + "px";
        if (parseInt(this.data[i].colWidth))
          totalWidth += parseInt(this.data[i].colWidth);
        if (this.data[i].dataType == "date") {
          this.$refs.tableThead.children[0].children[i + 1].classList.add(
            "align-center"
          );
        }
      }
    }
    this.$refs.gridViewer.style.minWidth = totalWidth + "px";
    // this.initSortable();
    this.resizableGrid(this.$refs.gridTable.children[0]);
  },

  watch: {
    api: function(){
      this.getApiData();
    }
  },

  data() {
    return {
      gridData: null,
      showContext: false,
      cursor_y: 0,
      formated: false,
      showLoading: true,
      showData: true,
      selected: null,
      selectedData: null,
      apiString: null,
      selectedMultiple: [],
      selectedMultipleRow: [],
      widthList:[],
      serviceResult: null,
      resources: resources,
      noData: false,
    };
  },
  methods: {

    /**
     * Hàm emit sửa dữ liệu
     * @author Xuân Đào(13/05/2023)
     */
    ModifyEvent(){
      this.$emit("dbClicked", this.selectedData);
    },

    // getWidthList(){
    //   let wList = "";
    //   for(let i=0;i<this.data.length;i++){
    //     if (i == 0) wList += this.data[i]['colWidth'];
    //   }
    // },

    /**
     * Hàm emit xóa dữ liệu
     * @author Xuân Đào(13/05/2023)
     */
    DeleteEvent(){
      this.$emit("deleteEvent", this.selectedData);
    },

    /**
     * Hàm emit nhân bản dữ liệu
     * @author Xuân Đào(13/05/2023)
     */
    DuplicateEvent(){
      this.$emit("duplicateEvent", this.selectedData);
    },

    /**
     * Hàm khởi tạo cho phép thay đổi vị trí cột hiển thị
     * @author Xuân Đào(13/05/2023)
     */
    initSortable(){
      let ths = this.$refs.tableThead.children[0];
      Sortable.create(ths, {
        draggable: 'th',
        onEnd: (evt) => {
          if (evt.oldIndex != evt.newIndex)
            this.$emit("columnSwapped", evt.newIndex, evt.oldIndex);
        },
        animation: 0,
        filter: ".editable",
        ghostClass: 'ghost-class',  
        onMove: function (e) { return e.related.className.indexOf('static') === -1;  }
      })
    },

    /**
     * Hàm định dạng tiền
     * @param amount: Số tiền
     * @param decimalCount: Số lượng số sau dấu phẩy
     * @param thousands: Ngăn cách hàng nghìn
     * @author Xuân Đào(13/05/2023)
     */
    formatMoney(amount, decimalCount = 0, decimal = "", thousands = ".") {
      decimalCount = Math.abs(decimalCount);
      decimalCount = isNaN(decimalCount) ? 2 : decimalCount;
      const negativeSign = amount < 0 ? "-" : "";
      let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
      let j = (i.length > 3) ? i.length % 3 : 0;
      return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
    },

    /**
     * Hàm lấy dữ liệu từ api
     * @author Xuân Đào(13/05/2023)
     */
    async getApiData(){
    if(this.api){
      this.showLoading = true;
      try {
        let data = await (await fetch(this.api)).json();
        this.serviceResult = data.Data;
        // if (!serviceData) serviceData = data['data'];
        this.gridData = this.serviceResult['data'];
        if (this.gridData[0]){
          this.noData = false;
          let total_record = this.serviceResult['totalRecord'][0]['Total record'];
          this.$emit('refresh', total_record);
          for(let i=0;i<this.data.length;i++){
            if (this.data[i]['dataType'] === 'date'){
              for(let j=0;j<this.gridData.length;j++){
                this.gridData[j][this.data[i]['dataField']] = this.dateFormator(this.gridData[j][this.data[i]['dataField']]);
                this.gridData[j].re_no = j+1;
              }
            }
            if (this.data[i]['dataType'] === 'd-money'){
              for(let j=0;j<this.gridData.length;j++){
                this.gridData[j][this.data[i]['dataField']] = this.formatMoney(this.gridData[j][this.data[i]['dataField']]);
              }
            }
          }
          for(let j=0;j<this.gridData.length;j++){
            this.gridData[j].re_no = j+1;
          }
        } else this.noData = true;
        this.showLoading = false;
        this.gridOnLoaded();
        this.apiString = this.api;
      } catch (ex) {
        console.log(ex);
      }
    }
    },

    /**
     * Hàm emit load xong dữ liệu
     * @author Xuân Đào(13/05/2023)
     */
    gridOnLoaded(){
      this.$emit("loadCompleted", this.serviceResult);
      if (this.isFocusFirst){
        this.selected = this.$refs.tableBody.children[0];
        this.selected.classList.add("tr-selected");
        this.selectedData = this.gridData[0];
      }
    },

    /**
     * Hàm xử lý checkbox gridData
     * 
     * @author Xuân Đào (04/04/2023)
     */

    handleCheckboxOnLoad(data){
      let elm = [];
      if (this.$refs.tableBody)
        elm = this.$refs.tableBody.children;
      for(let i=0;i<elm.length;i++){
        elm[i].classList.remove("checked-item");
        elm[i].children[0].children[0].classList.remove("checked");
      }
      for(let i=0;i<this.SelectedList.selectedItemList.length;i++){
        if (this.isExitsItemInArray(data, this.SelectedList.selectedItemList[i]) !== -1){
          elm[this.isExitsItemInArray(data, this.SelectedList.selectedItemList[i])].classList.add("checked-item");
          elm[this.isExitsItemInArray(data, this.SelectedList.selectedItemList[i])].children[0].children[0].classList.add("checked");
        }
      }
    },

    /**
     * Hàm kiểm tra item có tồn tại trong array
     * 
     * @author Xuân Đào (04/04/2023)
     */
    isExitsItemInArray(arr, item){
      for (let i=0;i<arr.length;i++){
        if (arr[i]['EmployeeId'] == item['EmployeeId']) return i;
      }
      return -1
    },

    /**
     * Hàm nhân bản dữ liệu 
     * 
     * @author Xuân Đào (04/04/2023)
     */
    duplicateData(){
      this.$emit("duplicateData", this.selectedData);
    },

    /**
     * Hàm xử lý ô checkbox cha
     * 
     * @author Xuân Đào (04/04/2023)
     */
    parentCheckBoxOnClick(){
      let data = this.$refs.tableBody.children;
      if (this.$refs.parentCheckbox.checked){
        for (let i=0;i<data.length;i++){
          data[i].classList.add("checked-item");
          data[i].children[0].children[0].classList.add("checked");
          if (!this.selectedMultipleRow.includes(data[i])){
            this.selectedMultipleRow.push(data[i]);
            this.selectedMultiple.push(this.gridData[i][this.recordId])
          }
        }
      } else {
        for (let i=0;i<data.length;i++){
          data[i].classList.remove("checked-item");
          data[i].children[0].children[0].classList.remove("checked");
          if (this.selectedMultipleRow.includes(data[i])){
            this.selectedMultipleRow = this.removeItemFromArr(this.selectedMultipleRow, this.selectedMultipleRow.indexOf(data[i]));
            this.selectedMultiple = [];
          }
        }
      }
      this.$emit('selectMultiple', this.selectedMultipleRow.length);
    },

    getSelectedList(){
      return this.selectedMultiple;
    },

    /**
     * Hàm xóa các hàng được chọn
     * 
     * @author Xuân Đào (04/04/2023)
     */
    deleteSelectedMultipleRow(){
      this.selectedMultipleRow.forEach(el => {
        el.remove();
      })
      this.selectedMultipleRow = [];
      this.SelectedList.selectedItemList = [];
    },

    /**
     * Hàm xóa 1 hàng
     * 
     * @author Xuân Đào (04/04/2023)
     */
    deleteSelectedRow(){
      this.selected.remove();
    },
    
    /**
     * Hàm click checkbox
     * 
     * @author Xuân Đào (04/04/2023)
     */
    checkBoxOnClick(item) {
      let targetEl = event.target.parentElement.parentElement
      if (this.selectedMultiple.includes(item[this.recordId])) {
        this.selectedMultipleRow = this.removeItemFromArr(this.selectedMultipleRow, this.selectedMultiple.indexOf(item[this.recordId]));
        this.selectedMultiple = this.removeItemFromArr(this.selectedMultiple, this.selectedMultiple.indexOf(item[this.recordId]));
        targetEl.classList.remove("checked-item");
      } else {
        this.selectedMultiple.push(item[this.recordId]);
        this.selectedMultipleRow[this.selectedMultipleRow.length] = targetEl;
        targetEl.classList.add("checked-item");
      }
      this.$emit('selectMultiple', this.selectedMultipleRow.length);
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

    /**
     * Hàm lấy giới tính theo mã
     * @param {mã giới tính} genderCode
     * @author Xuân Đào (20/03/2023)
     */

    getGenderName(genderCode) {
      switch (genderCode) {
        case 0:
          return "Nữ";
        case 1:
          return "Nam";
        case 2:
          return "Khác";
        case 3:
          return "";
      }
    },

    /**
     * Ẩn context menu
     *
     * @author Xuân Đào (20/03/2023)
     */

    editOnBlur() {
      event.target.parentElement.classList.remove("tr-selected");
      setTimeout(() => {
        this.showContext = false;
      }, 300);
    },

    /**
     * Set vị trí hiển thị cho con text menu
     *
     * @author Xuân Đào (20/03/2023)
     */

    editOnClick(item) {
      this.getClickedPosition(event);
      if (this.cursor_y < 550)
        this.$refs.context.setPosition(50, this.cursor_y + 15);
      else 
        this.$refs.context.setPosition(50, this.cursor_y - 105);
      this.showContext = true;
      this.selectedData = item;
      this.selected = event.target.parentElement.parentElement.parentElement;
    },

    /**
     * Xử lý sự kiện click vào các hàng trong table
     *
     * @author  Xuân Đào (14/03/2023x)
     */
    itemOnClick(item, index) {
      if (event.target.classList[0] == 'edit-text') return;
      this.$refs.tableBody.children[0].classList.remove("tr-selected");
      if (this.selected === null) this.selected = this.$refs.tableBody.children[index];
      else {
        this.selected.classList.remove("tr-selected");
        this.selected = this.$refs.tableBody.children[index];
      }
      this.selected.classList.add("tr-selected");
      this.selectedData = item;
      this.$emit("gridItemClicked", item);
    },
    /**
     * Hàm định dạng dữ liệu ngày tháng
     *
     * @author  Xuân Đào (12/03/2023)
     */
    dateFormator(date) {
      const dateData = new Date(date);
      const day =
        dateData.getDate() < 10 ? "0" + dateData.getDate() : dateData.getDate();
      const month =
        dateData.getMonth() + 1 < 10
          ? "0" + (dateData.getMonth() + 1)
          : dateData.getMonth() + 1;
      const year = dateData.getFullYear();
      return `${day}/${month}/${year}`;
    },

    /**
     * Hàm hiển thị contextmenu
     *
     * @author  Xuân Đào (12/03/2023)
     */
    showContextMenu() {
      this.showContext = true;
    },

    /**
     * Hàm ẩn contextmenu
     *
     * @author  Xuân Đào (12/03/2023)
     */
    hideContextMenu() {
      this.showContext = false;
    },

    /**
     * Hàm lấy dữ liệu vị trí click chuột
     *
     * @author  Xuân Đào (12/03/2023)
     */
    getClickedPosition(event) {
      this.cursor_y = event.clientY;
    },

    /**
     * Hàm ẩn animation loading khi load xong dữ liệu
     *
     * @author  Xuân Đào (12/03/2023)
     */
    hideLoadingSkeleton() {
      this.showLoading = false;
    },

    /**
     * Hàm làm mới dữ liệu
     *
     * @author  Xuân Đào (12/03/2023)
     */
    async refreshData(api) {
      try {
        this.apiString = api;
        this.showLoading = true;
        this.showData = false;
        let rawData = await (await fetch(this.apiString)).json();
        this.gridData = await rawData.data;
        this.$emit('refresh', rawData.totalRecord.TotalRecord);
        this.showLoading = false;
        setTimeout(() => {
          this.handleCheckboxOnLoad(this.gridData);
        }, 100);
        this.showData = true;
      } catch (ex) {
        console.log(ex);
      }
    },

    /**
     * Hàm hiển thị form sửa khi nhấn double click
     *
     * @author  Xuân Đào (12/03/2023)
     */
    editOnDbClick(item) {
      this.$emit("dbClicked", item);
    },

    /**
     * Hàm xóa một bản ghi
     *
     * @author  Xuân Đào (12/03/2023)
     */
    deleteRowData() {
      this.$emit("deleteRc", this.selectedData, deleteType.singleDelete);
    },

    /**
     * Hàm kiểm tra số hàng còn lại trong grid
     *
     * @author  Xuân Đào (12/03/2023)
     */
    getRemainingRow(){
      return this.$refs.tableBody.children.length;
    },

    resizableGrid(table) {
      var row = table.getElementsByTagName('tr')[0],
      cols = row ? row.children : undefined;
      if (!cols) return;
      
      table.style.overflow = 'hidden';
      
      var tableHeight = table.offsetHeight;
      
      for (var i=0;i<cols.length;i++){
        var div = createDiv(tableHeight);
        cols[i].appendChild(div);
        setListeners(div);
      }

      function setListeners(div){
        var pageX,curCol,nxtCol,curColWidth,nxtColWidth;

        div.addEventListener('mousedown', function (e) {
        curCol = e.target.parentElement;
        nxtCol = curCol.nextElementSibling;
        pageX = e.pageX; 
      
        var padding = paddingDiff(curCol);
      
        curColWidth = curCol.offsetWidth - padding;
        if (nxtCol)
          nxtColWidth = nxtCol.offsetWidth - padding;
        });

        div.addEventListener('mouseover', function (e) {
        e.target.style.borderRight = '2px solid transparent';
        })

        div.addEventListener('mouseout', function (e) {
        e.target.style.borderRight = '';
        })

        document.addEventListener('mousemove', function (e) {
        if (curCol) {
          var diffX = e.pageX - pageX;
      
          if (nxtCol)
          nxtCol.style.width = (nxtColWidth - (diffX))+'px';

          curCol.style.width = (curColWidth + diffX)+'px';
        }
        });

        document.addEventListener('mouseup', function () { 
        curCol = undefined;
        nxtCol = undefined;
        pageX = undefined;
        nxtColWidth = undefined;
        curColWidth = undefined
        });
      }
      
      function createDiv(height){
        var div = document.createElement('div');
        div.style.top = 0;
        div.style.right = 0;
        div.style.width = '5px';
        div.style.position = 'absolute';
        div.style.cursor = 'col-resize';
        div.style.userSelect = 'none';
        div.style.height = height + 'px';
        return div;
      }
      
      function paddingDiff(col){
      
        if (getStyleVal(col,'box-sizing') == 'border-box'){
        return 0;
        }
      
        var padLeft = getStyleVal(col,'padding-left');
        var padRight = getStyleVal(col,'padding-right');
        return (parseInt(padLeft) + parseInt(padRight));

      }

      function getStyleVal(elm,css){
        return (window.getComputedStyle(elm, null).getPropertyValue(css))
      }
      },
  },
};
</script>
<style scoped>


.first-column{
  border-left: unset !important;
}

.last-column{
  border-right: unset !important;
}

.gre-main__scroll{
  overflow-x: auto;
}

table thead tr th{
  border-top: unset !important;
  border-bottom: unset !important;
}

.no-data{
  position: absolute;
  font-size: 13px;
  text-align: center;
  width: calc(100vw - 200px);
  line-height: 36px;
  margin-top: 10px;
  color: #111111;
}

.no-data::before{
  content: '';
  display: block;
  height: 80px;
  width: 130px;
  position: relative;
  left: calc(100% - 730px);
  background: url("@/assets/icons/nodata.svg") no-repeat;
}

.first-data{
  border-left: unset;
}

.multiple-select {
  width: 30px;
}

.editable {
  width: 150px;
  text-align: center;
  border-right: unset !important;
}

.edit-text {
  cursor: pointer;
  margin-left: 15px;
}

.checked-item, .checked-item td:first-child, .checked-item td:last-child{
    background-color: #e5f3ff;
    z-index: 3;
}

.rightBorder{
  height: 100%;
  width: 0.5px !important;
  background-color: #bfbfbf;
  z-index: 99;
  top: 0;
  right: 0.25px;
  position: absolute;
}

/* tr td:first-child{
  border-right: unset;
} */

.leftBorder{
  height: 100%;
  width: 0.5px;
  background-color: #bfbfbf;
  z-index: 999;
  top: 0;
  left: 0.25px;
  position: absolute;
}

.disable-editor{
  pointer-events: none;
  padding: 0 !important;
}

.enable-editor:focus{
  border: solid #2ca01c 1px;
  border-radius: 4px;
  background-color: #fff;
}

.grid-input{
  border: unset;
  outline: unset;
  line-height: 26px;
  height: 26px;
  padding-left: 8px;
  background-color: unset;
  font-size: 14px;
  font-family: Notosans;
}

.date{
  text-align: center;
}

.asset-status{
  height: 30px;
  width: 150px;
  text-align: center;
  font-family: Notosans-semibold;
  line-height: 30px;
}

.status-1{
  color: #2ca01c;
}
.status-2{
  color: #00d8ff;
}
.status-3{
  color: #fcba03;
}
.status-4{
  color: #dd1b16;
}

tbody tr td > div{
  overflow: hidden;
  text-overflow: ellipsis;
}

</style>