<template>
  <div class="create-btn">
    <div v-if="!this.loader" class="ct-btn" @click="onClick">{{ this.content }}</div>
    <div v-else class="ct-btn">
        <MCustomLoader></MCustomLoader>
    </div>
    <div class="more-icon">
      <div class="more-icon__icon"></div>
    </div>
  </div>
</template>
<script>
import MCustomLoader from './MCustomLoader.vue';
export default {
  name: "MOptionalButton",

  props: {
    content: {
      type: String,
      required: false,
    },
  },

  components:{MCustomLoader},

  methods: {
    onClick(){
        this.$emit("onClick");
    }
  },

  data() {
    return {
        loader: false,
    }
  },
};
</script>
<style scoped>
.create-btn {
  height: 28px;
  width: 120px;
  background-color: #2ca01c;
  border-radius: 25px;
  display: flex;
  margin-right: 12px;
  cursor: pointer;
  position: relative;
}

.ct-btn {
  color: #fff;
  font-size: 13px;
  font-family: Notosans-bold;
  height: 28px;
  width: 84px;
  line-height: 28px;
  text-align: center;
  z-index: 2;
  position: relative;
}

.ct-btn:hover {
  border-radius: 25px 0 0 25px;
  background-color: #2fc21c;
}

.more-icon {
  height: 28px;
  position: absolute;
  right: 0;
  width: 35px;
}

.more-icon__icon{
  background: url("@/assets/img/Sprites.64af8f61.svg") no-repeat -840px -357px;
  height: 20px;
  border-left: solid #fff 1px;
  position: absolute;
  top: 4px;
  width: 35px;
}
.more-icon:hover {
  background-color: #2fc21c;
  border-radius: 0 25px 25px 0;
}
</style>