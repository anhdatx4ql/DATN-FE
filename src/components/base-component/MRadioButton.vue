// Component build radio button theo mảng được chuyền qua props
// Author: Xuân Đào (15/03/2023)
<template>
    <div class="container">
        <div class="title">{{ title }}</div>
        <div class="btn-group" :class="{flex: this.isFlex}">
            <div class="radio-item" v-for="(item, index) in data" :key="index">
                <input  
                type="radio"
                :name="this.name"
                :id="item"
                :value="item"
                v-model="value"
                >
                <label :for="item">{{ item }}</label>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: "MRadioButton",

    props:{
        // Dữ liệu cho radiobutton
        data:{
            type: [String, Array],
            required: true,
        },
        
        // Tên
        name: {
            type: String,
            required: false,
            default: "Ratio",
        },

        // Tiêu đề
        title: {
            type: String,
            required: false,
        },

        // Chiều hiển thị
        isFlex: {
            type: Boolean,
            required: false,
            default: true,
        },
        modelValue: {
            type: String,
            required: false,
        }
    },
    
    created(){
        this.value = this.modelValue
    },

    data() {
        return {
            value: null,
        }
    },
}
</script>
<style scoped>

    .container{
        display: flex;
        flex-direction: column;
        row-gap: 12px;
        box-sizing: border-box;
    }
    .flex{
        display: flex;
        align-items: center;
        column-gap: 20px;
    }

    .title{
        line-height: 22px;
        font-size: 13px;
        margin-top: -5px;
        font-weight: 600;
        font-family: opens-san-bold;
    }

    label{
        font-size: 13px;
        line-height: 22px;
    }

    .radio-item{
        display: flex;
        column-gap: 10px;
        align-items: center;
        box-sizing: border-box;
        min-width: 60px;
    }

    .radio-item:last-child{
        margin: 0;
    }

    input{
        margin: 0;
    }

    /* Custom radio button styles */
    input[type="radio"] {
        /* Hide default radio button */
        appearance: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        /* Create custom radio button */
        border-radius: 50%;
        width: 20px;
        height: 20px;
        border: 1px solid #999;
        /* Set background color */
        background-color: #fff;
        box-sizing: border-box;
    }

    /* Custom radio button checked styles */
        input[type="radio"]:checked::before {
        content: '';
        position: absolute;
        top: 3px;
        left: 3px;
        border-radius: 50%;
        background-color: #2ca01c;
        width: 12px;
        height: 12px;
    }


    input[type="radio"]:checked{
        border-color: #2ca01c;
        position: relative;
    }
    
</style>