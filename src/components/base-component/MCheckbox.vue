<template>
    <div @focus="onFocus" @blur="onBlur" tabindex="1" ref="checkbox" class="m-checkbox" :class="{'checked': checked}" @click="checkboxOnClick">
        <div :class="{'onFocus': isFocus}"></div>
    </div>
</template>
<script>
export default {
    props:{
        // Kích thước của checkbox
        width: {
            type: Number,
            required: false,
            default: 16,
        },

        // Chiều cao checkbox
        height: {
            type: Number,
            required: false,
            default: 16,
        },

        // Có check hay không
        isChecked: {
            type: Boolean,
            required: false,
            default: false,
        },

        // Có check hay không dựa theo số
        isCheckedByNum: {
            type: Number,
            required: false,
            default: -1,
        }
    },

    watch:{
        isCheckedByNum: function(newVal){
            if (newVal != -1){
            if (this.isCheckedByNum == 0) this.checked = true;
            else this.checked = false;
        }
        }
    },

    created(){
        if (this.isChecked)
            this.checked = this.isChecked;
    },
    

    mounted(){
        this.$refs.checkbox.style.width = this.width + "px";
        this.$refs.checkbox.style.height = this.height + "px";
        if (this.isCheckedByNum != -1){
            if (this.isCheckedByNum == 0) this.checked = true;
            else this.checked = false;
        }
    },

    methods:{

        /**
         * Hàm cập nhật trạng thái khi click checkbox
         * @author Xuân Đào(13/05/2023)
         */
        checkboxOnClick(){
            if (this.$refs.checkbox.classList[1] == "checked"){
                this.checked = false;
                this.$refs.checkbox.classList.remove("checked");
            } else {
                this.checked = true;
                this.$refs.checkbox.classList.add("checked");
            }
        },

        /**
         * Hàm cập nhật trạng thái khi focus checkbox
         * @author Xuân Đào(13/05/2023)
         */
        onFocus(){
            this.isFocus = true;
            window.addEventListener("keydown", this.hanldeOnKeydown)
        },

        /**
         * Hàm cập nhật trạng thái khi blur checkbox
         * @author Xuân Đào(13/05/2023)
         */
        onBlur(){
            this.isFocus = false;
            window.removeEventListener("keydown", this.hanldeOnKeydown)
        },

        /**
         * Hàm xử lý sự kiện bàn phím cho checkbox
         * @author Xuân Đào(13/05/2023)
         */
        hanldeOnKeydown(){
            if(event.key == "Enter"){
                this.checked = !this.checked;
                this.$emit("updateStatus");
            }
        },

        /**
         * Hàm set focus vào checkbox
         * @author Xuân Đào(13/05/2023)
         */
        setFocus(){
            this.$refs.checkbox.focus();
        }
    },

    data() {
        return {
            checked: false,
            isFocus: false,
        }
    },
}
</script>
<style scoped>
    .m-checkbox{
        height: 16px;
        width: 16px;
        border: solid #b0b0b0 1px;
        border-radius: 2px;
        position: relative;
        cursor: pointer;
    }
    .m-checkbox:focus{
        outline: unset;
    }

    .onFocus{
        height: 20px;
        width: 20.75px;
        border: solid #3ae0bf 1px;
        border-radius: 2px;
        position: absolute;
        top: -3px;
        left: -3px;
    }

    .checked{
        background: url('/src/assets/img/Sprites.64af8f61.svg') no-repeat -896px -312px;
        border-color: #57C841;
    }
</style>