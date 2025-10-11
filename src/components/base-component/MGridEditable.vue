<template>
  <div class="gre-main" :class="{ disableEditor: !this.editable }">
    <div ref="scroller" class="gre-main__scroll">
      <table border="0" ref="gridTable">
        <thead>
          <tr>
            <td class="row_no fix-start">#</td>
            <td
              :style="{ width: item.width + 'px', textAlign: item.align }"
              v-for="(item, index) in mapData"
              :key="index"
            >
              {{ item.title }}
              <div :class="{ 'left-border': index == 0 && fixStart }"></div>
            </td>
            <td class="fix-end"></td>
          </tr>
        </thead>
        <tbody ref="tbody">
          <tr
            v-for="(data, inx) in this.gridData"
            :key="inx"
            @click="rowOnClick(inx)"
          >
            <td class="row_no fix-start">{{ inx + 1 }}</td>
            <td
              :class="{
                'last-row': index == this.mapData.length - 1,
              }"
              :style="{ maxWidth: item.width + 'px' }"
              v-for="(item, index) in mapData"
              :key="index"
            >
              <div v-if="data['edit_mode']">
                <input
                  id="gridInput"
                  autocomplete="off"
                  v-if="item['type'] != 'combobox'"
                  @keyup="inputOnType(item['type'])"
                  @blur="inputOnInput(item['type'], inx, index)"
                  @focus="inputOnFocus"
                  :tabindex="[item['editable'] ? '0' : '-1']"
                  :maxlength="[item['type'] == 'd-money' ? '18' : '999']"
                  :style="{ textAlign: item.align }"
                  :class="{
                    disable: !editable || !item['editable'],
                    'edit-mode': item['editable'],
                  }"
                  type="text"
                  :value="data[item['modelValue']]"
                />
                <MScrollableCombobox
                  :top="item['top'] + (inx)*32"
                  :left="item['left']"
                  :required="true"
                  class="sc-combobox"
                  :id="'stCombobox'+index"
                  @click="this.currentElementIndex = index"
                  @itemSelect="comboboxOnSelect"
                  :defaultValue="data[item['modelValue']]"
                  :position-top="comboboxData[0]['positionTop']"
                  v-else-if="index != 4"
                  :api="comboboxData[0]['api']"
                  :width="comboboxData[0]['width']"
                  :map-data="comboboxData[0]['mapData']"
                  :display-model="comboboxData[0]['displayModel']"
                ></MScrollableCombobox>
                <MScrollableCombobox
                  :top="item['top'] + (inx)*32"
                  :left="item['left']"
                  class="sc-combobox"
                  id="rdCombobox"
                  @click="this.currentElementIndex = index"
                  @itemSelect="comboboxOnSelect"
                  :defaultValue="data[item['modelValue']]"
                  :position-top="comboboxData[1]['positionTop']"
                  :positionLeft="comboboxData[1]['positionLeft']"
                  v-else
                  :api="comboboxData[1]['api']"
                  :width="comboboxData[1]['width']"
                  :map-data="comboboxData[1]['mapData']"
                  :display-model="comboboxData[1]['displayModel']"
                ></MScrollableCombobox>
              </div>
              <div
                class="view-mode"
                v-else
                :style="[{ textAlign: item.align }]"
                :title="data[item['modelValue']]"
              >
                {{ data[item["modelValue"]] }}
              </div>
            </td>
            <td class="fix-end">
              <div class="delete-icon" @click="deleteOnClick(inx)"></div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import resources from "@/js/resources";
import MScrollableCombobox from "./MScrollableComboboxForGrid.vue";
export default {
  name: "MGridEditable",

  props: {
    // Api lấy dữ liệu cho grid
    api: {
      type: String,
      required: false,
    },

    // Dữ liệu của grid khi không có api
    data: {
      type: Array,
      required: false,
    },

    // Dữ liệu mapping lên grid
    mapData: {
      type: Array,
      required: false,
    },

    // Cố định cột đầu tiên hay không
    fixStart: {
      type: Boolean,
      required: false,
      default: false,
    },

    // Cố định cột cuối cùng hay không
    fixEnd: {
      type: Boolean,
      required: false,
      default: false,
    },

    // Có cho phép sửa hay không
    editable: {
      type: Boolean,
      required: false,
      default: false,
    },

    // Dữ liệu cho combobox trong grid
    comboboxData: {
      type: Array,
      required: false,
    },
  },

  components: { MScrollableCombobox },

  created() {
    if (this.api) {
      this.getApiData();
    } else {
      this.gridData = this.data;
      this.formatDataMoney();
    }
  },

  watch: {
    data: function () {
      this.gridData = this.data;
    },

    selected_index: function (newVal, oldVal) {
      if (newVal == -1) return;
      let trList = this.$refs.tbody.children;
      if (oldVal) {
        if (trList[oldVal])
          trList[oldVal].classList.remove("tr-selected");
      }
      setTimeout(() => {
        this.selected_index = newVal;
        if (trList[newVal]){
          trList[newVal].classList.add("tr-selected");
          this.selected_row = trList[newVal];
        }
      }, 10);
    },
  },

  mounted() {
    let totalWidth = 0;
    for (let i = 0; i < this.mapData.length; i++) {
      totalWidth += this.mapData[i]["width"];
    }
    this.resizableGrid(this.$refs.gridTable.children[0]);
    this.$refs.scroller.style.width = totalWidth + "px";
  },

  methods: {

    /**
     * Bôi đen toàn bộ dữ liệu khi input được focus
     * 
     * @author Xuân Đào (12/05/2023)
     */
    inputOnFocus(){
      event.target.select();
    },

    /**
     * Hàm định dạng tiền
     * @author Xuân Đào(13/05/2023)
     */
    formatDataMoney() {
      this.gridData.forEach((element) => {
        element["amount"] = this.formatMoney(element["amount"]);
      });
    },

    /**
     * Hàm focus nhập liệu lỗi
     * @param index: Chỉ số hàng bị lỗi
     * @param elIndex: Chỉ số cột bị lỗi
     * @author Xuân Đào(13/05/2023)
     */
    focusElement(index, elIndex) {
      let trList = this.$refs.tbody.children;
      /*eslint-disable no-debugger */
      // debugger
      trList[index].children[elIndex].querySelector("input").focus();
    },

    /**
     * Hàm định dạng tiền khi input
     * @param type: Kiểu dữ liệu của input
     * @author Xuân Đào(13/05/2023)
     */
    inputOnType(type) {
      if (type == "d-money") {
        // if (event.keyCode >= 65 && event.keyCode <= 90) {
        //   event.preventDefault();
        //   return;
        // }
        let element = event.target;
        // if (element.value.length >= 14 && isFinite(event.key)) {
        //   event.preventDefault();
        // }
        element.value = this.formatMoney(element.value.replaceAll(".", ""));
      }
    },

    /**
     * Xóa dữ liệu
     * @param inx: vị trí xóa
     * @author Xuân Đào(13/05/2023)
     */
    deleteOnClick(inx) {
      let grid = [];
      for(let i=0;i<this.gridData.length;i++){
        if (i != inx){
          grid.push(this.gridData[i]);
        }
      }
      if (grid.length == 0) {
        const newData = {
          re_no: 1,
          rpd_description: "Chi tien cho",
          debit_account: "",
          credit_account: "",
          amount: 0,
          supplier_code: "",
          supplier_name: "",
          edit_mode: false,
        }
        grid.push(newData);
      }
      this.gridData = grid;
      this.$emit("updateSumaryAmount")
      this.selected_index = 0;
    },

    // inputOnType: debounce(function(type) {
    //   if (type == 'd-money'){
    //     event.target.value = this.formatMoney(event.target.value);
    //   }
    // }, 100),

    /**
     * Hàm binding dữ liệu 2 chiều
     * @author Xuân Đào(13/05/2023)
     */
    inputOnInput(type, dataIndex, modelIndex) {
      this.$emit(
        "updateEdittedValue",
        event.target.value,
        dataIndex,
        modelIndex + 1
      );
      if (type == "d-money") {
        this.$emit(
          "updateSumaryAmount",
          event.target.value,
          dataIndex,
          modelIndex + 1
        );
      }
    },

    /**
     * Hàm binding dữ liệu 2 chiều cho combobox
     * @author Xuân Đào(13/05/2023)
     */
    comboboxOnSelect(data) {
      this.$emit("comboOnChange", this.currentElementIndex + 1, data);
    },

    /**
     * Hàm định dạng tiền
     * @author Xuân Đào(13/05/2023)
     */
    formatMoney(amount, decimalCount = 0, decimal = ",", thousands = ".") {
      decimalCount = Math.abs(decimalCount);
      decimalCount = isNaN(decimalCount) ? 2 : decimalCount;
      const negativeSign = amount < 0 ? "-" : "";
      let i = parseInt(
        (amount = Math.abs(Number(amount) || 0).toFixed(decimalCount))
      ).toString();
      let j = i.length > 3 ? i.length % 3 : 0;
      return (
        negativeSign +
        (j ? i.substr(0, j) + thousands : "") +
        i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) +
        (decimalCount
          ? decimal +
            Math.abs(amount - i)
              .toFixed(decimalCount)
              .slice(2)
          : "")
      );
    },

    /**
     * Hàm cập nhật hàng được chọn và cho phép sửa
     * @param indexL Chỉ số hàng được chọn
     * @author Xuân Đào(13/05/2023)
     */
    rowOnClick(index) {
      if (event.target.classList[0] === "delete-icon") return;
      let target = this.$refs.tbody.children[index];
      if (!this.selected_row) {
        this.selected_row = target;
        if (!this.selected_index) {
          this.selected_index = index;
          this.gridData[index].edit_mode = true;
        } else {
          this.gridData[this.selected_index].edit_mode = false;
          this.gridData[index].edit_mode = true;
        }
      } else {
        this.gridData[this.selected_index].edit_mode = false;
        this.gridData[index].edit_mode = true;
        this.selected_index = index;
        this.selected_row.classList.remove("tr-selected");
        this.selected_row = target;
      }
      this.selected_row.classList.add("tr-selected");
    },

    /**
     * Khởi tạo cho phép thay đổi độ rông cột
     * @author Xuân Đào(13/05/2023)
     */
    resizableGrid(table) {
      var row = table.getElementsByTagName("tr")[0],
        cols = row ? row.children : undefined;
      if (!cols) return;

      table.style.overflow = "hidden";

      var tableHeight = table.offsetHeight;

      for (var i = 0; i < cols.length; i++) {
        var div = createDiv(tableHeight);
        cols[i].appendChild(div);
        setListeners(div);
      }

      function setListeners(div) {
        var pageX, curCol, nxtCol, curColWidth, nxtColWidth;

        div.addEventListener("mousedown", function (e) {
          curCol = e.target.parentElement;
          nxtCol = curCol.nextElementSibling;
          pageX = e.pageX;

          var padding = paddingDiff(curCol);

          curColWidth = curCol.offsetWidth - padding;
          if (nxtCol) nxtColWidth = nxtCol.offsetWidth - padding;
        });

        div.addEventListener("mouseover", function (e) {
          e.target.style.borderRight = "2px solid transparent";
        });

        div.addEventListener("mouseout", function (e) {
          e.target.style.borderRight = "";
        });

        document.addEventListener("mousemove", function (e) {
          if (curCol) {
            var diffX = e.pageX - pageX;

            if (nxtCol) nxtCol.style.width = nxtColWidth - diffX + "px";

            curCol.style.width = curColWidth + diffX + "px";
          }
        });

        document.addEventListener("mouseup", function () {
          curCol = undefined;
          nxtCol = undefined;
          pageX = undefined;
          nxtColWidth = undefined;
          curColWidth = undefined;
        });
      }

      function createDiv(height) {
        var div = document.createElement("div");
        div.style.top = 0;
        div.style.right = 0;
        div.style.width = "5px";
        div.style.position = "absolute";
        div.style.cursor = "col-resize";
        div.style.userSelect = "none";
        div.style.height = height + "px";
        return div;
      }

      function paddingDiff(col) {
        if (getStyleVal(col, "box-sizing") == "border-box") {
          return 0;
        }

        var padLeft = getStyleVal(col, "padding-left");
        var padRight = getStyleVal(col, "padding-right");
        return parseInt(padLeft) + parseInt(padRight);
      }

      function getStyleVal(elm, css) {
        return window.getComputedStyle(elm, null).getPropertyValue(css);
      }
    },
  },

  data() {
    return {
      resources: resources,
      selected_row: null,
      selected_index: null,
      currentElementIndex: 0,
      gridData: null,
    };
  },
};
</script>
<style scoped>
.disableEditor {
  pointer-events: none;
}

/* .disableEditor tr, .disableEditor tbody tr td:first-child, .disableEditor tbody tr td:last-child{
  background-color: #f0f0f0 !important;
} */

.view-mode {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sc-combobox {
  margin-bottom: 4px;
}

.cb-dropdown {
  position: absolute;
  top: 4px;
}

.com1 {
  width: 100%;
  display: flex;
  position: relative;
}

table {
  border-collapse: collapse;
}

table tr {
  height: 32px !important;
}

thead tr td {
  background-color: #e0e0e0;
  color: #111111;
  font-family: Notosans-bold;
}

tr td input {
  width: calc(100% - 16px);
  border: unset;
  outline: unset;
  font-size: 13px;
  background-color: unset;
  font-family: Notosans;
  line-height: 26px;
  height: 26px;
}

tr td .edit-mode {
  border: solid 1px #a0a0a0;
  padding: 0 8px;
  border-radius: 2px;
  background-color: #fff;
}

tr td input:focus {
  border: solid 1px #2ca01c;
}

.disable {
  user-select: none;
  pointer-events: none;
}

.fix-end {
  width: 5px;
  border-left: unset !important;
}

.delete-icon {
  height: 16px;
  width: 16px;
  background: url("@/assets/img/Sprites.64af8f61.svg") no-repeat -464px -313px;
  cursor: pointer;
}
</style>