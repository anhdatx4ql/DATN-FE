<template>
    <div class="al-main">
        <div class="al-main__content">
            <div class="al-img"></div>
            <div class="al-text">{{ this.resources.vi.empty_monetary_flow }}</div>
        </div>
    </div>
</template>
<script>
import resources from '@/js/resources'
export default {
    data() {
        return {
            resources: resources
        }
    },
}
</script>
<style scoped>

    .al-text{
        text-align: center;
        font-size: 20px;
        font-family: Notosans-bold;
        color: #111111;
        position: absolute;
        bottom: -24px;
    }

    .al-img{
        background: url('@/assets/img/bg_TienGui_DuBaoDongTien.c2d5f130.svg') no-repeat;
        height: 200px;
        width: 390px;
        position: absolute;
        left: 25%;
        top: 20%;
    }

    .al-main{
        height: 100%;
        width: 100%;
        position: relative;
        background-color: #fff;
    }

    .al-main__content{
        height: 50%;
        width: 50%;
        position: absolute;
        top: 20%;
        left: 25%;
    }
</style>