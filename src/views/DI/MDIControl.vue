<template>
    <div class="DI">
        <router-view></router-view>
    </div>
</template>
<script>
import resources from '@/js/resources';
export default {
    name: "DIControl",
    data() {
        return {
            resources: resources,
        }
    },
}
</script>
<style scoped>
    .DI{
        height: 100%;
        width: calc(100% - 40px);
        margin: 0 20px;
    }

    .di-content{
        height: calc(100% - 61px);
        width: 100%;
    }
    
</style>