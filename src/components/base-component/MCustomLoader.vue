<template>
    <div :style="{color: '#' + this.color}" class="custom-loader"></div>
</template>
<script>
export default {
    name: "MCustomLoader",
    props:{
        color: {
            type: String,
            required: false,
            default: "fff",
        }
    },
}
</script>
<style scoped>
    .custom-loader {
    position: absolute;
    left: calc(100%/2);
    top: calc(100%/2);
  --d: 9px;
  width: 1.5px;
  height: 1.5px;
  border-radius: 50%;
  color: #fff;
  box-shadow: 
    calc(1*var(--d))      calc(0*var(--d))     0 0,
    calc(0.707*var(--d))  calc(0.707*var(--d)) 0 0.5px,
    calc(0*var(--d))      calc(1*var(--d))     0 1px,
    calc(-0.707*var(--d)) calc(0.707*var(--d)) 0 1.5px,
    calc(-1*var(--d))     calc(0*var(--d))     0 2px,
    calc(-0.707*var(--d)) calc(-0.707*var(--d))0 2.5px,
    calc(0*var(--d))      calc(-1*var(--d))    0 3px;
  animation: s7 0.75s infinite steps(8);
}

@keyframes s7 {
  100% {transform: rotate(1turn)}
}
</style>