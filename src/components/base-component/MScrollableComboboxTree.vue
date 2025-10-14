<template>
    <div class="inf-component com1">
    <div class="text-area">
      <span ref="inpText" class="bold-text" :title="tooltip">{{ inputTitle }}</span>
      <span v-if="this.required" class="requried"> *</span>
    </div>
    <input
      ref="mInput"
      type="text"
      autocomplete="off"
      id="employeeCode"
      v-model="this.value"
      :title="this.errMessage"
      @focus="showContent"
      @blur="hideContent"
      @input="comboOnInput"
    />
    <div @blur="iconOnBlur" ref="dropdown" class="cb-dropdown" @click="iconOnClick" tabindex="1">
        <div class="cb-dropdown__icon"></div>
    </div>

    <div ref="comboData" class="cb-data" v-show="showData" @scroll="dataOnScroll">
        <table :border="0" class="combo-table">
            <thead ref="tbHead">
                <tr>
                    <td v-for="(item, index) in this.mapData" :key="index">{{ item['title'] }}</td>
                </tr>
            </thead>
            <tbody ref="tbody">
                <tr @click="rowOnClick(index)" v-for="(item, index) in this.apiData" :key="index">
                    <td :style="[inx == 0 ? {paddingLeft: 12 + item['datalevel']*10 + 'px'}:{}, item['haveSub'] ? {fontFamily: 'Notosans-bold'}:{}]" v-for="(data, inx) in this.mapData" :key="inx">{{ item[data['modelValue']] }}</td>
                </tr>
            </tbody>
        </table>
        <div class="no-data" v-show="noData">Không có dữ liệu để hiển thị</div>
    </div>
    <!-- <div v-if="isError" class="errMessage">{{ inputTitle }} không được trống</div> -->
  </div>
</template>
<script>

export default {
    props: {

        api: {
            type: String,
            required: false,
        },

        rawData:{
            type: Array,
            required: false,
        },

        mapData:{
            type: Array,
            required: false,
        },

        modelValue: {
            type: String,
        },

        inputTitle:{
            type: String,
            required: false,
        },

        required:{
            type: Boolean,
            required: false,
            default: false,
        },

        titleColor: {
            type: String,
            required: false,
            dafault: "000"
        },
        width:{
            type: Number,
            required: false,
            default: 300,
        },
        
        fixToPosition:{
            type: Number,
            required: false,
            default: 1,
        },

        displayModel:{
            type: String,
            required: false,
        },

        field:{
            type: String,
            required: false,
        },

        positionLeft: {
            type: Number,
            required: false,
            default: 0,
        },

        positionTop: {
            type: Number,
            required: false,
            default: 50,
        },

        defaultValue: {
            type: String, Number, Boolean,
            required: false,
        }
    },

    created() {
        this.value = this.modelValue;
        if (this.api){
            this.localAPI = this.api + this.currentPage;
            this.getApiData();
        } else {
            this.apiData = this.rawData;
            if (this.apiData.length > 0) this.noData = false;
            this.fixedData = Object.assign({}, this.rawData);
        }
        this.fixPositionIndex = parseInt(this.fixToPosition);
    },

    mounted() {
        this.$nextTick(() => {
        // this.focus();
            this.$refs.inpText.style.color = `#${this.titleColor}`;
            this.$refs.comboData.style.width = `${this.width}px`;
            let thList = this.$refs.tbHead.children[0].children;
            for (let i =0; i<thList.length;i++){
                thList[i].style.width = this.mapData[i].width + 'px';
            }

            this.$refs.comboData.style.top = this.positionTop + 'px';
            this.$refs.comboData.style.left = this.positionLeft + 'px';

            if (!this.inputTitle) {
                this.$refs.dropdown.style.top = "4px";
                // this.$refs.comboData.style.top = "30px";
            }
            if (this.inputTitle == "Tài khoản tổng hợp"){
                if (this.account){
                    let index = this.findParent(this.account['accountid'], this.apiData);
                    while(this.account['datalevel'] < this.apiData[index]['datalevel']){
                        this.apiData = this.removeItemFromArr(this.apiData, index);
                        index++;
                    }
                }
            }
        });
    },

    watch:{
        selectedIndex: function(newVal, oldVal){
            let elementList = this.$refs.tbody.children;
            if (newVal == -1) {
                if (oldVal >= 0) elementList[oldVal].classList.remove("row-selected");
                this.value = null;
            }
            if (oldVal != -1){
                if (newVal >= this.fixPositionIndex){
                    if (newVal > oldVal){
                        this.scrollYPos += 36;
                    } else {
                        if (this.scrollYPos > 0)
                            this.scrollYPos -= 36;
                    }
                } else {
                    if (newVal < oldVal){
                        if (this.scrollYPos > 0)
                            this.scrollYPos -= 36;
                    }
                }
                this.$refs.comboData.scrollTo(0, this.scrollYPos)
                elementList[oldVal].classList.remove("row-selected");
            }
            if (elementList[newVal])
                elementList[newVal].classList.add("row-selected");
            this.value = this.apiData[this.selectedIndex][this.displayModel];
        },
    },

    methods: {

        comboOnInput(){
            this.apiData = this.rawData;
            if (event.target.value.length < 1){
                if (this.required) this.showErr();
                this.selectedIndex = -1;
            } else {
                this.showData = true;
                this.apiData = this.apiData.filter(obj => obj[this.displayModel].toString().startsWith(event.target.value));
            }
            this.noData = this.apiData.length > 0 ? false : true;
        },

        async getApiData(){
            try{
                let data = await (await fetch(this.localAPI)).json();
                if (!this.apiData[0])
                    this.apiData = data['data'];
                else {
                    this.apiData.push(...data['data']);
                }
                if (this.defaultValue) {
                    this.setSelectedValue(this.defaultValue, this.displayModel);
                }
                if (this.apiData.length > 0) this.noData = false;
            } catch (ex) {
                console.log(ex);
            }
        },

        showContent(){
            this.showData = true;
            window.addEventListener('keydown', this.handleOnKeyDown);
            setTimeout(() => {
                this.$refs.comboData.scrollTo(0, this.scrollYPos);
            }, 10);
        },

        hideContent(){
            setTimeout(() => {
                this.showData = false;
                this.validate();
            }, 350);
            window.removeEventListener('keydown', this.handleOnKeyDown);
        },

        iconOnClick(){
            window.addEventListener('keydown', this.handleOnKeyDown);
            this.$refs.dropdown.focus();
            this.showData = !this.showData;
            setTimeout(() => {
                this.$refs.comboData.scrollTo(0, this.scrollYPos);
            }, 10);
        },

        iconOnBlur(){
            this.hideContent();
        },

        dataOnScroll(){

            let scrollPosition = this.$refs.comboData.scrollTop;
            let scrollRange = this.$refs.comboData.scrollHeight - this.$refs.comboData.clientHeight;
            let rangeLeft = scrollRange - scrollPosition;
            if (rangeLeft < 2) {
                if (this.api){
                    this.currentPage++;
                    this.localAPI = this.api + this.currentPage;
                    this.getApiData();
                }
            }
        },

        rowOnClick(index){
            this.scrollYPos = (index - this.fixPositionIndex)*36;
            this.selectedIndex = index;
            this.value = this.apiData[this.selectedIndex][this.displayModel];
            this.$emit("updateModelValue", this.apiData[this.selectedIndex][this.field]);
            this.$emit("itemSelect", this.apiData[this.selectedIndex]);
        },

        handleOnKeyDown(){
            if (event.key == "ArrowDown"){
                this.showData = true;
                if (this.selectedIndex == -1) {
                    this.selectedIndex = 0;
                }
                else if (this.selectedIndex < this.apiData.length - 1) {
                    this.selectedIndex++;
                } 
                this.$emit("updateModelValue", this.apiData[this.selectedIndex][this.field]);

            }

            if (event.key == "ArrowUp"){
                event.preventDefault();
                this.showData = true;
                if (this.selectedIndex > 0) {
                    this.selectedIndex--;
                } 
                this.$emit("updateModelValue", this.apiData[this.selectedIndex][this.field]);
            }

            if (event.key == "Enter" || event.key == "Tab"){
                if (this.selectedIndex != -1)
                    this.value = this.apiData[this.selectedIndex][this.displayModel];
                this.showData = false;
                this.$emit("itemSelect", this.apiData[this.selectedIndex]);
            }
            
        },

        validate(){
            if (!this.required) return;
            let value = "";
            if(this.$refs.mInput){
                value = this.$refs.mInput.value;
                if (value.trim() == "" || value == null || value == undefined){
                this.showErr();
                } else {
                this.hideErr();
                }

                let check = false;
                this.apiData.forEach(el => {
                    if (el[this.displayModel] == value) check = true;
                })

                if(!check)
                    this.showErr();
            }
        },

        setSelectedValue(value, modelValue){
            for (let i=0;i<this.apiData.length;i++){
                if (this.apiData[i][modelValue] == value){
                    this.selectedIndex = i;
                    this.scrollYPos = (i-this.fixPositionIndex)*36;
                    return;
                }
            }
        },

        /**
         * Hàm hiển thị thông báo lỗi nếu có
         */
        showErr(){
            this.isError = true;
            this.$refs.mInput.classList.add("input-err");
            if (this.inputTitle)
                this.errMessage = this.inputTitle + " không được trống!";
            else this.errMessage = "Trường không được phép trống!";
        },
        /**
         * Hàm xoá thông báo lỗi nếu có
         */
        hideErr(){
            this.$refs.mInput.classList.remove("input-err");
            this.isError = false;
            this.errMessage = "";
        },

        setFocus(){
            this.$refs.mInput.focus();
        },

        getDataLevel(){
            return this.apiData[this.selectedIndex];
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

        findParent(arr, data) {
            for (let i = 0; i < arr.length; i++) {
                if (arr[i]["accountid"] === data) return i;
            }
        },
    },

    data() {
        return {
            value: null,
            fixedData: [],
            apiData: [],
            showData: false,
            currentPage: 1,
            localAPI: null,
            selectedIndex: -1,
            scrollYPos: 0,
            fixPositionIndex: 0,
            errMessage: "",
            noData: true,
        }
    },
    
}
</script>
<style scoped>

    .requried{
        color: red;
    }

    .no-data{
        width: 100%;
        text-align: center;
        font-size: 13px;
        line-height: 36px;
    }

    tbody .row-selected:hover td:first-child, tbody .row-selected:hover td:last-child{
        background-color: #50b83c !important;
        z-index: 3;
    } 

    .row-selected, .row-selected:hover{
        background-color: #50b83c !important;
        color: #fff !important;
        z-index: 9;
    }

    thead tr {
        position: sticky;
        top: 0;
        z-index: 9;
    }

    a {
        border: unset;
        outline: unset;
        text-decoration: none;
        color: #E81E1E;
    }

    .combo-table, tbody, thead{
        border-collapse: collapse;
    }

    .text-area{
    font-size: 13px;

    }

    table td{
        border: none;
    }

    table thead tr{
        background-color: #e6e6e6;
    }

    table thead tr td{
        font-family: Notosans-bold;
    }

    .com1 {
    flex: 1;
    width: 25%;
    }
    .errMes{
    font-size: 13px;
    color: red;
    }
    .input-err{
        border-color: #E81E1E !important;
    }

    .bold-text{
    font-family: opens-san-bold !important;
    font-weight: 600;
    }

    .cb-dropdown__icon{
        background: url('@/assets/img/Sprites.64af8f61.svg') no-repeat -564px -365px;
        width: 8px;
        height: 5px;
        position: absolute;
        right: 10px;
        bottom: 10px;
    }

    .cb-dropdown__icon:focus, .cb-dropdown:focus{
        border: unset;
        outline: unset;
    }
    
    .cb-dropdown{
        height: 26px;
        width: 26px;
        position: absolute;
        right: 0;
        top: 22px;
        cursor: pointer;
    }

    .cb-dropdown:hover{
        background-color: #b8b8b8e3;
    }

    .cb-data{
        min-height: 72px;
        max-height: 200px;
        width: 200%;
        box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
        background-color: #fff;
        position: absolute;
        top: 50px;
        z-index: 999;
        border-radius: 4px;
        border: solid #b8b8b8e3 1px;
        overflow: auto;
        cursor: pointer;
    }

    .cb-data__title{
        height: 26px;
        width: 100%;
        background-color: #dfdfdf;
        display: flex;
        column-gap: 20px;
        position: sticky;
        top: 0;
    }

    .cb-data__title--item{
        font-size: 13px;
        font-family: Notosans-bold;
        line-height: 26px;
        padding: 0 10px;
    }

    /* .cb-data__item{
        display: flex;
        column-gap: 20px;
    }

    .cb-data__item--value{
        font-size: 13px;
        font-family: Notosans;
        padding: 8px 12px;
    }
    .cb-data__item:hover{
        background-color: rgb(233, 232, 232);
        color: rgb(47, 199, 13);
    } */

    ::-webkit-scrollbar {
    width: 0.5em;
    height: 0.5em;
    z-index: 99999999;
    }
    ::-webkit-scrollbar-track-piece {
        background-color: #E6E6E6;
    }
    ::-webkit-scrollbar-thumb {
        background-color: #B0B0B0;
    }
</style>