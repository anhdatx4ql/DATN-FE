<template>
    <div class="lp-main">
        <div class="linding-page__title">{{ resources.vi.di.title[0] }}</div>
        <div class="landing-page">
            <div class="landing-page__main">
                <div class="landing-page__row lp-row__1">
                    <div class="landing-area lp-area__1">
                        <div class="lp-area__title">{{ resources.vi.di.areaTitle.object }}</div>
                        <div class="lp-area__content">
                            <router-link :to="'DI/'+item['router']" class="lp-area__item" v-for="(item, index) in resources.vi.di.objectList" :key="index">{{ item['txt'] }}</router-link>
                        </div>
                    </div>
                    <div class="landing-area lp-area__2">
                        <div class="lp-area__title">{{ resources.vi.di.areaTitle.commodity }}</div>
                        <div class="lp-area__content">
                            <div class="lp-area__item" v-for="(item, index) in resources.vi.di.commodityList" :key="index">{{ item }}</div>
                        </div>
                    </div>
                    <div class="landing-area lp-area__3">
                        <div class="lp-area__title">{{ resources.vi.di.areaTitle.account }}</div>
                        <div class="lp-area__content">
                            <router-link :to="'DI/'+item['router']" class="lp-area__item" v-for="(item, index) in resources.vi.di.accountList" :key="index">{{ item['txt'] }}</router-link>
                        </div>
                    </div>
                </div>
    
                <div class="landing-page__row lp-row__2">
                    <div class="landing-area lp-area__1">
                        <div class="lp-area__title">{{ resources.vi.di.areaTitle.expense }}</div>
                        <div class="lp-area__content">
                            <div class="lp-area__item" v-for="(item, index) in resources.vi.di.expenseList" :key="index">{{ item }}</div>
                        </div>
                    </div>
                    <div class="landing-area lp-area__2">
                        <div class="lp-area__title">{{ resources.vi.di.areaTitle.bank }}</div>
                        <div class="lp-area__content">
                            <div class="lp-area__item" v-for="(item, index) in resources.vi.di.bankList" :key="index">{{ item }}</div>
                        </div>
                    </div>
                    <div class="landing-area lp-area__3">
                        <div class="lp-area__title">{{ resources.vi.di.areaTitle.branch }}</div>
                        <div class="lp-area__content">
                            <div class="lp-area__item" v-for="(item, index) in resources.vi.di.branchList" :key="index">{{ item }}</div>
                        </div>
                    </div>
                </div>
    
                <div class="landing-page__row lp-row__3">
                    <div class="landing-area lp-area__1">
                        <div class="lp-area__title">{{ resources.vi.di.areaTitle.assets }}</div>
                        <div class="lp-area__content">
                            <div class="lp-area__item" v-for="(item, index) in resources.vi.di.assetsList" :key="index">{{ item }}</div>
                        </div>
                    </div>
                    <div class="landing-area lp-area__2">
                        <div class="lp-area__title">{{ resources.vi.di.areaTitle.tax }}</div>
                        <div class="lp-area__content">
                            <div class="lp-area__item" v-for="(item, index) in resources.vi.di.taxList" :key="index">{{ item }}</div>
                        </div>
                    </div>
                    <div class="landing-area lp-area__3">
                        <div class="lp-area__title">{{ resources.vi.di.areaTitle.other }}</div>
                        <div class="lp-area__content">
                            <div class="lp-area__item" v-for="(item, index) in resources.vi.di.otherList" :key="index">{{ item }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import resources from '@/js/resources';
export default {
    name: "MDILandingPage",
    data() {
        return {
            resources: resources,
        }
    },
}
</script>
<style>
    .linding-page__title{
        height: 61px;
        width: 100%;
        font-size: 24px;
        font-family: Notosans-bold;
        line-height: 54px;
    }

    .lp-main{
        height: 90%;
        width: 100%;
    }

    .landing-page{
        height: 98%;
        width: 100%;
        background-color: #fff;
        position: relative;
    }

    .landing-page__main{
        height: calc(100% - 60px);
        width: calc(100% - 60px);
        position: absolute;
        top: 30px;
        left: 30px;
    }

    .landing-page__row{
        height: 130px;
        width: 100%;
        padding-bottom: 20px;
        display: flex;
    }

    .landing-area{
        height: 100%;
        width: calc(100%/3);
    }

    .lp-area__title{
        height: 27px;
        width: 100%;
        font-size: 14px;
        line-height: 20px;
        font-family: Notosans-bold;
    }

    .lp-area__content{
        display: flex;
        flex-direction: column;
    }

    .lp-area__item{
        font-size: 13px;
        height: 25px;
        line-height: 20px;
        color: #0075c0;
    }
    
    .lp-area__item:hover{
        cursor: pointer;
    }
</style>