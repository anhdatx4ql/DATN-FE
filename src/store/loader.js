import { defineStore } from 'pinia'

export const loader = defineStore('Loader', {
    state: () => ({
        isShowLoader: false,
    }),
    actions: {
      showLoader(){
        this.isShowLoader = true;
      },

      closeLoader(){
        this.isShowLoader = false
      }
    }
  })