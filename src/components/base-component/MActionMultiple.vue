<template>
    <div :class="{'focused': showAction, 'disable': !enable }" @blur="comboOnBlur" @click="comboOnClick" class="action-multiple" tabindex="0">
          <div class="action-multiple__text">{{ res.vi.actionMultiple.title }}</div>
          <div class="action-multiple__icon"></div>
          <div class="action-multiple__action" v-show="showAction">
            <div class="multiple_delete" @click="multipleDelete" >{{ res.vi.actionMultiple.deleteAction }}</div>
          </div>
        </div>
</template>
<script>
import resources from '@/js/resources';

export default {

    props:{
      // Cho phép sửa hay khônt
      enable: {
        type: Boolean,
        required: false,
        default: false,
      },
    },

    data() {
        return {
          showAction: false,
          res: resources
        }
    },

    methods: {
      /**
       * Xự kiện click vào item trong context
       * 
       * @author pvdat (04/04/2023)
       */
        comboOnClick(){
          if (this.enable && !this.showAction)
            this.showAction = true;
          else this.showAction = false;
        },

        /**
         * Xự kiện xóa
         * 
         * @author pvdat (04/04/2023)
         */
        multipleDelete(){
          this.$emit('deleteMultiple');
          // this.showAction = false;
        }
    },
}
</script>
<style scoped>
     .action-multiple{
    position: absolute;
    height: 26px;
    left: 22px;
    width: 180px;
    border: solid #222 1px;
    border-radius: 4px;
  }

  .action-multiple__text{
    height: 13px;
    line-height: 26px;
    padding-left: 16px;
    font-size: 13px;
    font-family: opens-san-bold;
    font-weight: 600;
  }

  .action-multiple__action{
    top: 32px;
    right: 0;
    position: absolute;
    z-index: 99;
    background-color: #fff;
    border: solid #e0e0e0 1px;
  } 

  .action-multiple:hover{
    background-color: #e0e0e0;
    cursor: default;
  }
  .action-multiple__action div {
    padding: 8px 12px;
  }

  .action-multiple__action div:hover{
    background-color: #f0f0f0;
    cursor: pointer;
    color:#50B83C;
  }

  .action-multiple__icon{
    height: 24px;
    width: 24px;
    position: absolute;
    background: url('@/assets/img/Sprites.64af8f61.svg') no-repeat -364px -356px;
    right: 12px;
    top: 1px;
  }

  .focused{
    outline: solid #d0d0d0 2px;
  }

  .disable{
    border-color: #757575;
    color: #757575;
    user-select: none;
  }

  .disable:hover{
    border-color: #757575;
    color: #757575;
    background-color: inherit;
    cursor: not-allowed;
  }

  .disable .action-multiple__icon{
    background: url('@/assets/img/Sprites.64af8f61.svg') no-repeat -1746px -307px;
  }

  .multiple_delete{
    font-size: 13px;
  }
</style>