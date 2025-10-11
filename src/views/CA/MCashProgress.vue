<template>
    <div class="cash-progress">
        <div class="c-major">
            <div class="c-major__main">
                <div class="c-major__main--content">
                    <div class="c-major__title">{{ resources.vi.cash.progress.title }}</div>
                    <div class="c-major__content">
                        <router-link to="CA/ReceiptPayment" class="cm-content c-major__content--1">
                            <div class="cm-title__button">{{ resources.vi.cash.main.content[0] }}</div>
                        </router-link>
                        <div to="CA/ReceiptPayment" class="cm-content c-major__content--2">
                            <div class="cm-title__button">{{ resources.vi.cash.main.content[2] }}</div>
                        </div>
                        <div @click="gotoDetail" class="cm-content c-major__content--3">
                            <div class="cm-title__button">{{ resources.vi.cash.main.content[1] }}</div>
                        </div>
                    </div>
                </div>
                <div class="c-major__main--menu">
                    <router-link to="/DI/DICustomer" class="c-menu__item">
                        <div class="c-menu__item--icon customer-icon"></div>
                        <div class="c-menu__item--content">{{ resources.vi.cash.main.menu[0] }}</div>
                    </router-link>
                    <router-link to="/DI/DISupplier" class="c-menu__item">
                        <div class="c-menu__item--icon supplier-icon"></div>
                        <div class="c-menu__item--content">{{ resources.vi.cash.main.menu[1] }}</div>
                    </router-link>
                    <router-link to="/DI/DIEmployee" class="c-menu__item">
                        <div class="c-menu__item--icon employee-icon"></div>
                        <div class="c-menu__item--content">{{ resources.vi.cash.main.menu[2] }}</div>
                    </router-link>
                    <router-link to="DI/DIAccountSystem" class="c-menu__item">
                        <div class="c-menu__item--icon account-icon"></div>
                        <div class="c-menu__item--content">{{ resources.vi.cash.main.menu[3] }}</div>
                    </router-link>
                </div>
            </div>
            <div class="c-major__report">
                <div class="cr-title">{{ resources.vi.cash.report.title }}</div>
                <div class="cr-content">
                    <div class="cr-content__main">
                        <div class="cr-content__item cr-content__item-1">
                            <div class="cr-content__icon"></div>
                            <div class="cr-content__content">{{ resources.vi.cash.report.main[0] }}</div>
                        </div>
                        <div class="cr-content__item cr-content__item-1">
                            <div class="cr-content__icon"></div>
                            <div class="cr-content__content">{{ resources.vi.cash.report.main[1] }}</div>
                        </div>
                        <div class="cr-content__item cr-content__item-1">
                            <div class="cr-content__icon"></div>
                            <div class="cr-content__content">{{ resources.vi.cash.report.main[2] }}</div>
                        </div>
                        <div class="cr-content__item cr-content__item-1">
                            <div class="cr-content__icon"></div>
                            <div class="cr-content__content">{{ resources.vi.cash.report.main[3] }}</div>
                        </div>
                        <div class="cr-content__item cr-content__item-1">
                            <div class="cr-content__icon"></div>
                            <div class="cr-content__content">{{ resources.vi.cash.report.main[4] }}</div>
                        </div>
                    </div>
                </div>
                <div class="cr-footer">{{ resources.vi.cash.report.footer }}</div>
            </div>
        </div>
    </div>
</template>
<script>
import resources from '@/js/resources';
import { PaymentFormMode } from './MReceiptPaymentList.vue';
export default {
    name: "MCashProgress",

    methods: {
        /**
         * Hàm mở popup payment detail
         * @author Xuân Đào (13/05/2023)
         */
        async gotoDetail(){
            sessionStorage.paymentMode = PaymentFormMode.create;
            this.$router.push({ name : "PaymentDetail"});
      }
    },

    data() {
        return {
            resources: resources,
        }
    },
}
</script>
<style scoped>  
    .cm-title__button {
        text-decoration: none;
        color: #111111;
    }

    .cash-progress{
        height: 100%;
        width: 100%;
        position: relative;
    }

    .c-major{
        display: flex;
        height: 460px;
        width: 1000px;
        position: absolute;
        top: calc((100% - 460px)/2);
        left: 150px;
    }

    .c-major__main{
        height: 100%;
        width: 690px;
        display: flex;
        flex-direction: column;
        row-gap: 10px;
    }
    
    .c-major__report{
        height: 100%;
        width: calc(1000px - 690px - 10px);
        background-color: #fff;
        margin-left: 10px;
        border-radius: 4px;
        border: solid 1px #e0e0e0;
        position: relative;
    }

    .c-major__main--content{
        height: calc(100% - 70px - 10px);
        width: 100%;
        background-color: #fff;
        border: solid 1px #e0e0e0;
        border-radius: 4px;
    }

    .c-major__main--menu{
        height: 70px;
        width: 100%;
        background-color: #fff;
        border: solid 1px #e0e0e0;
        border-radius: 4px;
        display: flex;
        position: relative;
    }

    .c-major__title{
        height: 40px;
        width: 100%;
        text-align: center;
        line-height: 40px;
        font-family: Notosans-bold;
        border-bottom: solid 1px #e0e0e0;
    }

    .c-major__content{
        height: calc(100% - 40px);
        width: 100%;
        background: url('@/assets/img/qt_TienMat.1f64b87b.svg');
        position: relative;
    }

    .cm-content{
        height: 90px;
        width: 90px;
    }

    .cm-content:hover{
        box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
        cursor: pointer;
    }

    .c-major__content--1{
        position: absolute;
        top: 40px;
        left: 90px;
    }   

    .c-major__content--2{
        position: absolute;
        width: 125px;
        top: 125px;
        left: 335px;
    } 
    
    .c-major__content--3{
        position: absolute;
        bottom: 30px;
        left: 90px;
    }  

    .cm-title__button{
        font-size: 13px;
        font-family: Notosans;
        width: 100%;
        text-align: center;
        height: 28px;
        line-height: 20px;
        position: absolute;
        bottom: 0;
    }

    .c-menu__item{
        height: 100%;
        padding: 0 48.15px;
        min-width: 72px;
        display: flex;
        flex-direction: column;
        row-gap: 4px;
        align-items: center;
        justify-content: center;
        border-right: solid #e0e0e0 1px;
    }
    .c-menu__item:hover{
        box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
        cursor: pointer;
    }

    .c-menu__item:last-child{
        border: unset;
    }

    .c-menu__item--icon{
        height: 20px;
        width: 20px;
    }

    .c-menu__item--content{
        font-size: 13px;
        font-family: Notosans;
        color: black;
    }

    .cr-title{
        height: 40px;
        width: 100%;
        text-align: center;
        line-height: 40px;
        font-family: Notosans-bold;
        border-bottom: solid 1px #e0e0e0;
    }

    .cr-footer{
        height: 40px;
        width: 100%;
        text-align: center;
        line-height: 40px;
        font-family: Notosans;
        position: absolute;
        bottom: 0;
        border-top: solid 1px #e0e0e0;
        color: #0075c0;
        font-size: 13px;
        cursor: pointer;
    }

    .cr-content{
        height: calc(100% - 85px);
        width: 100%;
        cursor: pointer;
    }

    .cr-content__item{
        height: calc(100%/5);
        width: 100%;
        display: flex;
        align-items: center;
        border-bottom: solid 1px #e0e0e0;
        column-gap: 16px;
    }

    .cr-content__item:hover .cr-content__content{
        color: #0075c0;
        cursor: pointer;
    }
    
    .cr-content__main{
        height: 100%;
        width: calc(100% - 32px);
        margin: 0px 16px;
    }

    .cr-content__icon{
        height: 7px;
        width: 7px;
        background-color: #646464;
        border-radius: 50%;
    }

    .cr-content__content{
        font-size: 13px;
    }
</style>