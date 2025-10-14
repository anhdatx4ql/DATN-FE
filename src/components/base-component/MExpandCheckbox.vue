<template>
    <div ref="checkbox" @click="checkBoxOnClick" :class="{'collase': checked, 'showBox': !isShow}">
        
    </div>
</template>
<script>
export default {
    name: "MExpandCheckBox",
    props:{
        isShow: {
            type: Boolean,
            required: false,
            default: true,
        }
    },

    methods: {
         /**
         * Xử lý khi click checkbox 
         * 
         * @author pvdat (14/05/2023)
         * */
        checkBoxOnClick(){
            // this.checked = !this.checked;
            if (!this.isClassExist(this.$refs.checkbox.classList, 'collase')) {
                this.$refs.checkbox.classList.add('collase');
            } else {
                this.$refs.checkbox.classList.remove('collase');
            }
            this.$emit("clicked");
        },

         /**
         * Kiểm tra check box được check hay chưa 
         * 
         * @author pvdat (14/05/2023)
         * */
        isClassExist(list, className) {
            for (let i = 0; i < list.length; i++) {
                if (list[i] == className) return true;
            }
            return false;
        },
    },

    data() {
        return {
            checked: false,
        }
    },
}
</script>
<style scoped>

    div {
        background: url('@/assets/img/Sprites.64af8f61.svg') no-repeat -608px -312px;
        width: 15px;
        height: 15px;
        cursor: pointer;
    }
    .collase{
        background: url('@/assets/img/Sprites.64af8f61.svg') no-repeat -560px -312px;
        width: 15px;
        height: 15px;
        cursor: pointer;
    }

    .showBox{
        width: 15px;
        height: 15px;
        background: unset;
    }

</style>