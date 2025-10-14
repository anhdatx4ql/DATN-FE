<template>
    <div class="pg-main">
      <div class="part1">
            Tổng số: <b id="numberOfRecord"> {{ totalRecordFormated }}</b> bản ghi
      </div>
      <div class="part2" v-if="allowPaging">
        <div>
          <MComboboxNomal
              :data="[
                  '10 bản ghi trên 1 trang',
                  '20 bản ghi trên 1 trang',
                  '30 bản ghi trên 1 trang',
                  '50 bản ghi trên 1 trang',
                  '100 bản ghi trên 1 trang',
              ]"
              :enable="true"
              displayDirection="Up"
              :defaultValue="1"
              @changeVal="updateVal"
          >
          </MComboboxNomal>
        </div>
        <div class="page-number" ref="paging">
          <div @click="previousPage" :class="{'disabled': currentPage==1}" class="previous">Trước</div>
          <div @click="pageNumberOnClick" class="backToStart" v-if="slot1 != 1">1</div>
          <div class="backToStart" v-if="slot1 != 1">. . .</div>
          <div @click="pageNumberOnClick" class="slot1 selected-page">{{ slot1 }}</div>
          <div @click="pageNumberOnClick" class="slot2" v-if="totalPage >= 2">{{ slot2 }}</div>
          <div @click="pageNumberOnClick" class="slot3" v-if="totalPage >= 3">{{ slot3 }}</div>
          <div @click="pageNumberOnClick" class="slot4" v-if="totalPage >= 4">{{ slot4 }}</div>
          <div @click="pageNumberOnClick" class="slot5" v-if="totalPage >= 5">{{ totalPage }}</div>
          <div @click="nextPage" :class="{'disabled': currentPage==totalPage}" class="next">Sau</div>
        </div>
      </div>
    </div>
</template>
<script>
import MComboboxNomal from "../base-component/MComboboxNomal.vue";

export default {
    components: { MComboboxNomal },

    props: {
      //Tổng số bản ghi
        totalRecord: {
            type: Number,
            required: true,
            default: 0,
        },

        // Có hiển thị phần phân trang hay không
        allowPaging:{
          type: Boolean,
          required: false,
          default: true,
        }
    },

    watch:{

    },

    computed:{

      /**
       * Hàm định dạng hiển thị tổng số bản ghi
       * 
       * @author pvdat (11/05/2023)
       */
      totalRecordFormated(){
        return this.formatMoney(this.totalRecord);
      },

      // Tính tổng số trang
      totalPage(){
        if (this.totalRecord % this.pageSize == 0) {
          return Math.round(this.totalRecord/this.pageSize);
        } 
        else {
          if (Math.round(this.totalRecord/this.pageSize) > this.totalRecord/this.pageSize) return Math.round(this.totalRecord/this.pageSize);
          else  return Math.round(this.totalRecord/this.pageSize) + 1;
        }
      },

      // Tính giá trị của slot page 1
      slot1(){
        if (this.totalPage <= 5) return 1;
        if (this.currentPage < 2) return this.currentPage;
        else if (this.currentPage >= this.totalPage - 4) return this.totalPage - 4;
        else return this.currentPage-1;
      },

      // Tính giá trị của slot page 2
      slot2(){
        return this.slot1 + 1;
      },

      // Tính giá trị của slot page 3
      slot3(){
        return this.slot2 + 1;
      },

      // Tính giá trị của slot page 4
      slot4(){
        if (this.totalPage <= 5) return 4;
        else if (this.slot3 + 2 === this.totalPage) return this.totalPage - 1;
        else if (this.currentPage >= this.totalPage - 4) return this.totalPage - 1;
        else if (this.currentPage == this.totalPage) return this.totalPage - 1;
        else return ". . .";
      }
    },

    created(){
      this.selectedOption = 1;
    },

    data() {
      return {
        selectedOption: null,
        pageSize: 20,
        currentPage: 1,
      }
    },

    methods: {

    /**
     * Hàm định dạng tiền
     * @param amount: Số tiền
     * @param decimalCount: Số lượng số sau dấu phẩy
     * @param thousands: Ngăn cách hàng nghìn
     * @author pvdat(13/05/2023)
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
     * Quay lại trang trước
     *
     * @author  pvdat (12/03/2023)
     */
      previousPage(){
        if (this.currentPage > 1) {
          this.currentPage--;
          this.resetSelected();
        }
      },

    /**
     * Tới trang tiếp theo
     *
     * @author  pvdat (12/03/2023)
     */
      nextPage(){
        if (this.currentPage < this.totalPage) {
          this.currentPage++;
          this.resetSelected();
        }
      },

    /**
     * Cập nhật dữ liệu khi api thay đổi
     *
     * @author  pvdat (12/03/2023)
     */
      updateVal(newVal){
        this.defaultValue = newVal;
        switch(newVal){
          case 0:{
            this.pageSize = 10;
            break;
          }
          case 1:{
            this.pageSize = 20;
            break;
          }
          case 2:{
            this.pageSize = 30;
            break;
          }
          case 3:{
            this.pageSize = 50;
            break;
          }
          case 4:{
            this.pageSize = 100;
            break;
          }
        }
        this.currentPage = 1;
        this.$emit("updateAPI", this.pageSize, this.currentPage)
      },

    /**
     * Đi tới page được chỉ định
     *
     * @author  pvdat (12/03/2023)
     */
      pageNumberOnClick(){
        if (!isNaN(Number(event.target.textContent))){
          this.currentPage = Number(event.target.textContent);
          this.resetSelected();
        }
      },

    /**
     * Reset page được chọn
     *
     * @author  pvdat (12/03/2023)
     */
      resetSelected(){
        this.$emit("updateAPI", this.pageSize, this.currentPage)
        setTimeout(() => {
          for (let i=0; i< this.$refs.paging.children.length; i++){
            if(Number(this.$refs.paging.children[i].textContent) === this.currentPage) this.$refs.paging.children[i].classList.add("selected-page");
            else this.$refs.paging.children[i].classList.remove("selected-page");
          }
        }, 50);
      }
    },
}
</script>
<style scoped>
    .page-number{
      display: flex;
      margin-right: 12px;
      align-items: center;
      margin-left: 12px;
      column-gap: 4px;
    }
    .page-number div{
      height: 22px;
      min-width: 22px;
      line-height: 22px;
      text-align: center;
      cursor: pointer;
      user-select: none;
    }

    .selected-page{
      border: solid #b0b0b0 1px;
      font-weight: 700;
    }

    .disabled{
      color: #b0b0b0;
      cursor: not-allowed;
    }

    .disabled:hover{
      cursor: not-allowed;
    }

    .pg-main{
      height: calc(100% - 28px);
      width: calc(100% - 24px);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 12px;
    }

    .part1{
      height: 100%;
      display: flex;
      align-items: center;
      column-gap: 4px;
      font-size: 13px;
    }

    .part2{
      height: 100%;
      display: flex;
      align-items: center;
      font-size: 13px;
    }
</style>