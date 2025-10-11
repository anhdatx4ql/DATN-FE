<template>
    <div class="container">
        <div class="main" style="position: relative;">
            <div class="header" style="font-family: Notosans-bold; font-size: 20px; line-height: 40px; margin-left: 250px; width: 100%;">Cấp phát thiết bị</div>
            <div class="main-content">
                <div class="left-side">
                    <div class="title" style="font-family: Notosans-bold; float: left; position: absolute; left: 100px; top: 70px;">Nhân viên</div>
                    <div class="autocom" style="width: 200px; position: absolute; top: 130px; left: 70px; float: left;">
                        <el-autocomplete
                            v-model="state"
                            :fetch-suggestions="querySearchAsync"
                            placeholder="Please input"
                            @select="handleSelect"
                        />
                    </div>
                </div>
                <div class="right-side">
                    <div class="title" style="font-family: Notosans-bold; position: absolute; right: 100px; top: 70px;">Thiết bị</div>
                    <div class="autocom" style="width: 200px; position: absolute; top: 130px; right: 70px;">
                        <el-autocomplete
                            v-model="state"
                            :fetch-suggestions="querySearchAssetAsync"
                            placeholder="Please input"
                            @select="handleSelect"
                        />
                    </div>
                </div>
            </div>
            <div class="footer" style="width: calc(100% - 40px); position: absolute; bottom: 0; height: 50px;">
                <div style="display: flex; justify-content: space-between;">
                    <div><button>Cấp phát</button></div>
                    <div><button @click="$emit('hide')">Hủy</button></div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import resources from '@/js/resources';
export default {

    created() {
        this.getDefault();
    },

    methods:{
        getDefault(){
            fetch(this.res.endpoint + `Employees/Filter?pageSize=20&pageNumber=${this.employeePage}`).then((res) => res.json()).then((data) => this.employeePage = data);
        },
    },

    data() {
        return {
            res: resources,
            employeePage: 1,
            employeeKey: '',
            assetPage: 1,
            assetKey: '',
            querySearchAsync: '',
        }
    },    
}
</script>
<style scoped>
    .container{
        height: 100vh;
        width: 100vw;
        position: fixed;
        z-index: 999;
        top: 0;
        left: 0;
        background-color: #111111d4;
    }

    .main{
        height: 350px;
        width: 700px;
        margin-top: calc((100vh - 350px)/2);
        margin-left: calc((100vw - 700px)/2);
        background-color: #fff;
        border-radius: 8px;
        padding: 20px;
    }

    button{
        padding: 8px 12px;
        border-radius: 8px;
        border: solid #666666 1px;

    }
    button:hover{
        background-color: #dddddd;
        cursor: pointer;
    }
</style>