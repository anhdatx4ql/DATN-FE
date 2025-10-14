// component dùng để hiển thị data dưới dạng gridtree với dữ liệu được truyền vào thông qua api
// @author  pvdat (12/03/2023)
<template>
  <div class="grid-viewer" ref="gridViewer" @click="getClickedPosition">
    <div class="grid-viewer__scroll">
      <table class="grid-table table" ref="gridTable" v-columns-resizable>
        <thead ref="tableThead">
          <tr class="grid-title">
            <th
              class="multiple-select"
              :class="{ 'fix-start': isFixedStart }"
              v-if="muiltipleSelect"
            >
              <MCheckbox
                ref="parentCheckbox"
                @click="parentCheckBoxOnClick"
              ></MCheckbox>
              <div class="rightBorder"></div>
            </th>
            <th
              :class="[item.dataType, {'last-row': index == data.length - 1}]"
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
        <tbody ref="tableBody">
          <MGridDataLoading
            v-if="showLoading"
            :numOfColumn="this.data.length + 1"
          ></MGridDataLoading>
          <tr
            v-for="(item, index) in sortedData"
            :key="index"
            :ref="'item' + index"
            :class="{
              subElement: item.isSub,
              rootElement: !item.isSub,
              haveSub: item.haveSub,
            }"
            @click="itemOnClick(item, index)"
            @dblclick="itemOnDbClick(item)"
          >
            <td
              v-if="muiltipleSelect"
              :class="{ 'fix-start': isFixedStart }"
              v-show="showData"
            >
              <MCheckbox @click="checkBoxOnClick(item)"> </MCheckbox>
              <div class="rightBorder"></div>
            </td>
            <td
              v-for="(value, inx) in data"
              :key="inx"
              @dblclick="editOnDbClick(item)"
              :class="[{
                subElm: item.isSub && inx == 0,
                subElm2: item.isSub && inx == 0 && item['datalevel'] == 2,
                subElm3: item.isSub && inx == 0 && item['datalevel'] == 3,
                subElm4: item.isSub && inx == 0 && item['datalevel'] == 4,
                subElm5: item.isSub && inx == 0 && item['datalevel'] >= 5,
              }]"
              :style="{maxWidth: value['colWidth']+'px'}"
              :title=" item[value.dataField] "
            
            >
              <div class="td-contain" :class="value.dataType" :style="{maxWidth: value['colWidth']+'px'}">
                <MExpandCheckbox
                  @clicked="checkboxClicked(index)"
                  v-if="inx == 0"
                  :isShow="item.haveSub"
                ></MExpandCheckbox>
                {{ item[value.dataField] }}
              </div>
            </td>
            <td
              class="editable"
              :class="{ 'fix-end': isFixedEnd }"
              v-if="editable"
              v-show="showData"
            >
              <div class="edit">
                <div class="edit-text" @click="itemOnDbClick(item)">Sửa</div>
                <div
                  tabindex="0"
                  class="edit-icon"
                  @click="editOnClick(item, index)"
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
      slot1="Nhân bản"
      slot2="Xóa"
      @action2="deleteRowData"
      @action1="duplicateData"
      @action3="this.$emit('updateStatus', this.selectedData, this.selectedIndex)"
      :slot3="this.status"
      v-show="showContext"
    ></MContextMenu>
  </div>
</template>
<script>
import MGridDataLoading from "../unit-components/MGridDataLoading.vue";
import MContextMenu from "./MContextMenu.vue";
import MCheckbox from "./MCheckbox.vue";
import { deleteType } from "../unit-components/MConfirmDeleteDialog.vue";
import MExpandCheckbox from "./MExpandCheckbox.vue";
import { sortedArray } from "@/store/sortedData";
import resources from "@/js/resources.js";
import { Action } from '@/views/DI/MAccountList.vue';
import Sortable from "sortablejs";

export default {
  name: "MGridData",

  emits: ["update:totalRecord", "update:enableMultipleEditor"],

  setup() {
    const SortedArray = sortedArray();
    return {
      SortedArray,
    };
  },

  components: {
    MContextMenu,
    MGridDataLoading,
    MCheckbox,
    MExpandCheckbox,
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
  },
  /**
   * Lấy dữ liệu từ api và đổ vào data
   *
   * @author  pvdat(12/03/2023)
   */
  created() {
    try {
      this.getApiData();
      this.apiString = this.api;
    } catch (ex) {
      console.log(ex);
    }
  },

  /**
   * Định dạng dữ liệu tiêu đề
   *
   * @author  pvdat(12/03/2023)
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
    this.resizableGrid(this.$refs.tableThead);
    this.initSortable();
    this.currentHideRow = this.subData.length;
  },

  watch:{
    currentHideRow: function(newVal){
      if (newVal < this.subData.length){
        this.$emit("updateAction", 1);
      } else {
        this.$emit("updateAction", 0);
      }
    },

    sortedData: function(newVal){
      if (newVal != newVal.length == 0 && !this.showLoading) this.noData = true;
      else this.noData = false;
    },

    showLoading: function(){
      if (this.showLoading) this.noData = false;
      else this.noData = true;
    }
  },

  data() {
    return {
      resources: resources,
      gridData: null,
      showContext: false,
      cursor_y: 0,
      showLoading: true,
      showData: true,
      selected: null,
      selectedData: null,
      selectedIndex:null,
      apiString: null,
      sortedData: [],
      rootData: [],
      subData: [],
      currentHideRow: 0,
      foldAll: false,
      status: '',
      noData: false,
    };
  },
  methods: {

    /**
     * Khởi tạo việc cho phép đổi cột
     * 
     * @author pvdat (12/05/2023)
     */
    initSortable(){
      let ths = this.$refs.tableThead.children[0];
      Sortable.create(ths, {
        draggable: 'th',
        onEnd: (evt) => {
          if (evt.oldIndex != evt.newIndex)
            this.$emit("columnSwapped", evt.newIndex, evt.oldIndex);
        },
        animation: 125,
        filter: ".editable",
        ghostClass: 'ghost-class',  
        onMove: function (e) { return e.related.className.indexOf('static') === -1;  }
      })

      // let els = this.$refs.tableBody.children;
      // for (let i=0;i<els.length;i++){
      //   new Sortable(els[i], {
      //     group: 'nested',
      //     animation: 150,
      //     fallbackOnBody: true,
      //     swapThreshold: 0.65
      //   });
      // }
    },

    foldOrExpandAll(action){
      const arrElement = this.$refs.tableBody.children;
      if (action == Action.expand){
        for (let i=0;i<arrElement.length;i++){
          arrElement[i].classList.remove("subElement");
          arrElement[i].children[0].firstChild.firstChild.classList.add("collase");
        }
        this.currentHideRow = -1;
      } else {
        for (let i=0;i<arrElement.length;i++){
          if (this.sortedData[i]['datalevel'] > 0) {
            arrElement[i].classList.add("subElement");
          }
          arrElement[i].children[0].firstChild.firstChild.classList.remove("collase");
        }
        this.currentHideRow = this.subData;
      }
    },

    getWidthList(){
      let widthList = "";
      for(let i=0;i<this.data.length;i++){
        if (i == 0){
          widthList += this.data[i]['colWidth'];
        } else {
          widthList += ','+this.data[i]['colWidth'];
        }
      }
      return widthList;
    },

    /**
     * Sự kiện nhân bản
     * 
     * @author pvdat (12/05/2023)
     */
    duplicateData(){
      this.$emit("updateRecord", this.selectedData);
    },

    /**
     * Double click vào row
     * 
     * @author pvdat (12/05/2023)
     */
    itemOnDbClick(item){
      this.$emit("rowDbClick", item);
    },

    /**
     * Xử lý đóng mở cây
     * 
     * @author pvdat (12/05/2023)
     */
    checkboxClicked(index) {
      let i = index + 1;
      let next = true;
      const arrElement = this.$refs.tableBody.children;
      const mode = {
        collase: 0,
        expand: 1,
      }
      let actionMode = mode.expand;
      if (!this.isClassExist(event.target.classList, "collase")) actionMode = mode.collase;
      
      while (next) {
        if (actionMode == mode.expand){
          if (this.sortedData[index]["datalevel"] === this.sortedData[i]["datalevel"] - 1) {
            arrElement[i].classList.remove("subElement");
          }
        } else {
          if (this.sortedData[index]["datalevel"] < this.sortedData[i]["datalevel"]) {
            arrElement[i].classList.add("subElement");
            arrElement[i].children[0].firstChild.firstChild.classList.remove("collase");
          }
        }
        if (this.sortedData[index]["datalevel"] >= this.sortedData[i]["datalevel"]) {
            next = false;
        }
        i++;
      }
      let c = 0;
      for (let i=0;i<arrElement.length;i++){
        let clist = arrElement[i].classList;
        clist.forEach(clas =>{
          if (clas === "subElement"){
            c++;
          }
        })
      }

      this.currentHideRow = c;
    },

    /**
     * Kiểm tra tồn tại của class
     * 
     * @author pvdat (12/05/2023)
     */
    isClassExist(list, className) {
      for (let i = 0; i < list.length; i++) {
        if (list[i] == className) return true;
      }
      return false;
    },

    /**
     *Lấy dữ liệu từ api
     * 
     * @author pvdat (12/05/2023)
     */
    async getApiData() {
      let data = await (await fetch(this.api)).json();
      data.forEach((el) => {
        if (!el["dependency"] || el["dependency"].trim() == '') {
          this.rootData.push(el);
          el.isSub = false;
          el.haveSub = false;
          this.sortedData.push(el);
        } else {
          el.isSub = true;
          this.subData.push(el);
        }
      });
      for(let i=0;i<this.subData.length;i++){
        let index = this.findParent(this.sortedData, this.subData[i]['dependency']);
        this.sortedData[index].haveSub = true;
        this.subData[i].haveSub = false;
        let insertIndex = index;
        while (this.sortedData[insertIndex+1] && this.sortedData[insertIndex+1]['datalevel'] > this.sortedData[index]['datalevel']) insertIndex++;
        this.sortedData = this.insertToPosition(this.sortedData, insertIndex, this.subData[i]);
      }
      this.gridData = data;
      this.$emit("loadCompleted");
      for(let i=0;i<this.gridData.length;i++){
        this.gridData[i]['created_date_display'] = this.dateFormator(this.gridData[i]['created_date']);
        this.gridData[i]['modifieddate_display'] = this.dateFormator(this.gridData[i]['modifieddate']);
      }
      this.showLoading = false;
    },

    /**
     * Tìm kiếm phần tử cha
     * 
     * @author pvdat (12/05/2023)
     */
    findParent(arr, data) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i]["accountid"] === data) return i;
      }
    },

    /**
     * Chèn 1 phần tử vào 1 vị trí bất kỳ trong mảng
     * 
     * @author pvdat (12/05/2023)
     */
    insertToPosition(arr, index, data) {
      let result = [];
      for (let i = 0; i < arr.length; i++) {
        result.push(arr[i]);
        if (i == index) {
          result.push(data);
        }
      }
      return result;
    },

    /**
     * Hàm xóa 1 item khỏi array
     *
     * @author pvdat (04/04/2023)
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
     * Ẩn context menu
     *
     * @author pvdat (20/03/2023)
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
     * @author pvdat (20/03/2023)
     */

    editOnClick(item, index) {
      let trList = this.$refs.tableBody.children;
      switch(item['status']){
        case 0: {
          this.status= 'Ngừng sử dụng';
          break;
        }
        case 1: {
          this.status= 'Sử dụng';
        }
      }
      this.getClickedPosition(event);
      if (this.cursor_y < 500)
        this.$refs.context.setPosition(50, this.cursor_y + 15);
      else {
        this.$refs.context.setPosition(50, this.cursor_y - 105);
      }
      this.showContext = true;
      this.selectedData = item;
      if (this.selected === null){
        this.selected = trList[index];
        this.selected.classList.add("tr-selected");
      } 
      else {
        this.selected.classList.remove("tr-selected");
        this.selected = trList[index];
        this.selected.classList.add("tr-selected");
      }
      this.selectedIndex = index;
    },

    deleteSelectedRow(){
      // let trList = this.$refs.tableBody.children;
      // trList[this.selectedIndex].remove();
      this.sortedData = this.removeItemFromArr(this.sortedData, this.selectedIndex);
    },

    /**
     * Xử lý sự kiện click vào các hàng trong table
     *
     * @author  pvdat (14/03/2023x)
     */
    itemOnClick(item, index) {
      let trList = this.$refs.tableBody.children;
      /* eslint-disable no-debugger */
      // debugger;
      if (this.selected === null){
        this.selected = trList[index];
        this.selected.classList.add("tr-selected");
      } 
      else {
        this.selected.classList.remove("tr-selected");
        this.selected = trList[index];
        this.selected.classList.add("tr-selected");
      }
      this.selectedData = item;
    },
    /**
     * Hàm định dạng dữ liệu ngày tháng
     *
     * @author  pvdat (12/03/2023)
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
     * @author  pvdat (12/03/2023)
     */
    showContextMenu() {
      this.showContext = true;
    },

    /**
     * Hàm ẩn contextmenu
     *
     * @author  pvdat (12/03/2023)
     */
    hideContextMenu() {
      this.showContext = false;
    },

    /**
     * Hàm lấy dữ liệu vị trí click chuột
     *
     * @author  pvdat (12/03/2023)
     */
    getClickedPosition(event) {
      this.cursor_y = event.clientY;
    },

    /**
     * Hàm ẩn animation loading khi load xong dữ liệu
     *
     * @author  pvdat (12/03/2023)
     */
    hideLoadingSkeleton() {
      this.showLoading = false;
    },

    /**
     * Hàm làm mới dữ liệu
     *
     * @author  pvdat (12/03/2023)
     */
    async refreshData(api) {
      try {
        this.apiString = api;
        this.showLoading = true;
        this.showData = false;
        let rawData = await (await fetch(this.apiString)).json();
        this.gridData = await rawData.data;
        this.$emit("refresh", rawData.totalRecord.TotalRecord);
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
     * @author  pvdat (12/03/2023)
     */
    editOnDbClick(item) {
      this.$emit("dbClicked", item);
    },

    /**
     * Hàm xóa một bản ghi
     *
     * @author  pvdat (12/03/2023)
     */
    deleteRowData() {
      this.$emit("deleteRc", this.selectedData, deleteType.singleDelete);
    },

    /**
     * Hàm kiểm tra số hàng còn lại trong grid
     *
     * @author  pvdat (12/03/2023)
     */
    getRemainingRow() {
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

.no-data{
  position: absolute;
  font-size: 13px;
  text-align: center;
  width: calc(100vw - 250px);
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
  left: calc(100% - 710px);
  background: url("@/assets/icons/nodata.svg") no-repeat;
}

.grid-title th{
  border-top: unset !important;
}

.last-row{
  border-right: unset !important;
}

.m-date{
  padding: 0 20px;
  text-align: center;
}

.fix-end{
  border-left: solid black 1px;
}

.date{
  text-align: center !important;
}

.ghost-class{
  background-color: #d0d0d0 !important;
}

tr th, tr td {
  border-left: unset !important;
}

tbody td div{
  overflow: hidden !important;
  white-space: nowrap ;
  text-overflow: ellipsis !important;
}

.date {
  text-align: center;
  padding: 0;
}

.multiple-select {
  width: 40px;
}

.editable {
  width: 150px;
  text-align: center;
}

.edit-text {
  cursor: pointer;
  margin-left: 15px;
}

.checked-item,
.checked-item td:first-child,
.checked-item td:last-child {
  background-color: #e5f3ff;
  z-index: 3;
}

.rightBorder {
  height: 100%;
  width: 0.5px;
  background-color: #e0e0e0;
  z-index: 999;
  top: 0;
  right: -1px;
  position: absolute;
}

.leftBorder {
  height: 100%;
  width: 0.5px;
  background-color: #d0d0d0;
  z-index: 999;
  top: 0;
  left: -0.25px;
  position: absolute;
}

.subElement {
  display: none;
}

.displaySubElement {
  display: block;
}

.td-check {
  display: flex;
  height: 100%;
  width: 100%;
  line-height: 36px;
}

.td-contain {
  display: flex;
  column-gap: 8px;
  align-items: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.haveSub {
  font-weight: 600;
}

.subElm::before {
  content: "";
  position: relative;
  height: 20px;
  width: 15px;
  display: block;
  float: left;
}

.subElm2::before {
  content: "";
  position: relative;
  height: 20px;
  width: 30px;
  display: block;
  float: left;
}
.subElm3::before {
  content: "";
  position: relative;
  height: 20px;
  width: 45px;
  display: block;
  float: left;
}

.subElm4::before {
  content: "";
  position: relative;
  height: 20px;
  width: 60px;
  display: block;
  float: left;
}

.subElm5::before {
  content: "";
  position: relative;
  height: 20px;
  width: 75px;
  display: block;
  float: left;
}
</style>