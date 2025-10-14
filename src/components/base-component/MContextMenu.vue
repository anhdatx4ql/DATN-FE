// Component tạo context menu

<template>
  <div ref="main" class="edit-menu">
    <div class="edit-menu__item item1" v-if="this.slot1" @click="this.$emit('action1')">{{ this.slot1 }}</div>
    <div class="edit-menu__item item2" v-if="this.slot2" @click="this.$emit('action2')">{{ this.slot2 }}</div>
    <div class="edit-menu__item item3" v-if="this.slot3" @click="this.$emit('action3')">{{ this.slot3}}</div>
    <div class="edit-menu__item item4" v-if="this.slot4" @click="this.$emit('action4')">{{ this.slot4 }}</div>
  </div>
</template>
<script>
import resources from '@/js/resources';
export default {
  name:"MContextMenu",

  props:{

    slot1: {
      type: String,
      required: false,
    },

    slot2: {
      type: String,
      required: false,
    },

    slot3: {
      type: String,
      required: false,
    },

    slot4:{
      type: String,
      required: false,
    }
  },

  methods: {
    /**
     * Hàm set vị trí hiển thị cho context menu
     * @param x x
     * @param y y
     * Author: pvdat (12/03/2023)
     */
    setPosition(x, y){
      this.$refs.main.style.right = x + "px";
      y = y > 800 ? y -= 154 : y;
      this.$refs.main.style.top = y + "px";
    },
  },

  data() {
    return {
      showContext: false,
      resources: resources,
    }
  },
};
</script>
<style scoped>
.edit-menu {
  position: fixed;
  width: 120px;
  right: 0px;
  top: 0px;
  background-color: #fff;
  z-index: 10;
  display: flex;
  flex-direction: column;
  display: block;
  border: solid 1px #b0b0b0;
  overflow: auto;
}

.edit-menu__item {
  top: 0px;
  height: 28px;
  line-height: 28px;
  font-size: 13px;
  position: relative;
  padding-top: 4px;
  padding-left: 8px;
}

.edit-menu__item:hover {
  background-color: rgba(80, 184, 60, 0.1);
  color: #2ca01c;
  cursor: pointer;
}


</style>