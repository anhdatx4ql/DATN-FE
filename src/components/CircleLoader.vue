<template>
    <div class="l-overlay">
        <div class="pulsing-2"></div>
    </div>
</template>
<script>
export default {
    
}
</script>
<style scoped>
.l-overlay{
    height: 100vh;
    width: 100vw;
    background-color: #ffffffd3;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99999;
}
.pulsing-2 {
  margin: calc((100vh - 30px)/2) auto;
  width:30px;
  height:30px;
  border-radius: 50%;
  background:#0C21C1;
  box-shadow: 0 0 0 0 #0c21c1a4;
  animation:pl2 1.5s infinite linear;
  position: relative;
}
.pulsing-2:before,
.pulsing-2:after {
  content:"";
  position: absolute;
  inset:0;
  border-radius: inherit;
  box-shadow: 0 0 0 0 #0c21c1b3;
  animation: inherit;
  animation-delay: -0.5s;
}
.pulsing-2:after {
  animation-delay: -1s;
}
@keyframes pl2 {
    100% {box-shadow: 0 0 0 40px #0c21c103}
}
</style>