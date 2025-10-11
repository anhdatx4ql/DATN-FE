import { defineStore } from 'pinia'
import {ToastType} from '@/components/base-component/MToastItem.vue';

export const toastControl = defineStore('ToastControl', {
    state: () => ({
      toastType: ToastType,
      toastMess: "",
      isShow: false,
    }),
    actions: {
      showToast(){
        this.isShow = true;
        setTimeout(() => this.isShow = false, 5000)
      },
  
      setToastMessage(msg){
        this.toastMess = msg;
      },
  
      setToastType(type){
        this.toastType = type;
      },
      
      showToastMsg(toastKind, msg){
        this.setToastType(toastKind);
        this.setToastMessage(msg)
        this.showToast();
      }
    }
  })