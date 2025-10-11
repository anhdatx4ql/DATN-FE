<template>
        <div>
            <button :class="kind">{{ value }}</button>
        </div>
</template>
<script>
export default {
    props:{
        // Loại button
        kind:{
            type: String,
            required: false,
            default: 'original'
        },

        //
        value:{
            type: String,
            required: false,
            default: 'click'
        }
    }
}
</script>
<style scoped>
    
</style>