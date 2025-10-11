<template>
    <div class="cash-main">
        <div class="cash-menubar">
            <router-link to="/CA" class="cash-menu">Quy trình</router-link>
            <router-link to="/CA/ReceiptPayment" class="cash-menu">Thu, chi tiền</router-link>
            <router-link to="/CA/AuditList" class="cash-menu">Kiểm kê</router-link>
            <router-link to="/CA/MonetaryFlow" class="cash-menu">Dự báo dòng tiền</router-link>
        </div>
        <div class="cash-router-view">
            <router-view></router-view>
        </div>
    </div>
</template>
<script>
export default {
    
}
</script>
<style scoped>
    .cash-main{
        height: 100%;
        margin-left: 20px;
        width: calc(100% - 40px);
    }
    
    .cash-menubar{
        height: 41px;
        display: flex;
        position: relative;
        border-bottom: solid #d0d0d0 1px;        
    }

    .cash-menu{
        height: 27px;
        margin-top: 10px;
        padding: 0px 25px;
        font-size: 13px;
        line-height: 27px;
        position: relative;
        color: black
    }

    .cash-menu:hover{
        cursor: pointer;
        color: #2ca01c;
    }
    .cash-router-view{
        height: calc(100% - 41px - 12px);
        width: 100%;
        margin-top: 12px;
    }

    .cash-menubar .router-link-exact-active{
        background-color: #f2ebbf;
        border-radius: 4px 4px 0px 0px;
        font-family: opens-san-bold;
        box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    }

    .cash-menubar .router-link-exact-active::after{
        content: '';
        display: block;
        height: 4px;
        width: 100%;
        position: absolute;
        left: 0;
        background-color: #2ca01c;
    }
</style>