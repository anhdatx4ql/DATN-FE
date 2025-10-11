<template>
  <tr v-for="n in 5" :key="n">
    <td v-for="n in this.numOfColumn" :key="n">
      <div class="loading"></div>
    </td>
  </tr>
</template>
<script>
export default {
  name: "MGridLoader",
  props:{
    numOfColumn:{
      type: Number,
      required: false,
      default: 10,
    }
  }
};
</script>
<style scoped>
.loading {
  height: 50%;
  width: 75%;
  background-color: #e0e0e0;
  top: 25%;
  z-index: 66;
  left: 12.5%;
  position: absolute;
  background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 40%,
      rgba(255, 255, 255, 0.5) 50%,
      rgba(255, 255, 255, 0) 60%
    )
    #EEEEEE;
  background-size: 200% 100%;
  background-position-x: 120%;
  animation: 1s loading ease-in-out infinite;
}
@keyframes loading {
    to {
        background-position-x: -20%;
    }
}
</style>