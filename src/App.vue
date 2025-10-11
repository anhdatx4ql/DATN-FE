<template>
  <div class="app">
    <TheMenu/>
    <TheHeader/>
    <TheContent/>
    <MToastItem :toastMess="ToastControl.toastMess" :kindOfToast="ToastControl.toastType" v-if="ToastControl.isShow" />
    <MCircleLoader v-if="Loader.isShowLoader"></MCircleLoader>
  </div>
</template>

<script>
import TheContent from './layout/TheContent.vue'
import TheHeader from './layout/TheHeader.vue'
import TheMenu from './layout/TheMenu.vue'
import MToastItem from '../src/components/base-component/MToastItem.vue'
import resources from './js/resources'
import { toastControl } from './store/toast.js'
import MCircleLoader from './components/CircleLoader.vue'
import { loader } from './store/loader'
import { multipleSelectedData } from './store/multipleDeleteEmployee'
import { paymentDetail } from './store/paymentDetail'

export default {
  name: 'App',
  components: {
    TheHeader,
    TheMenu,
    TheContent,
    MToastItem,
    MCircleLoader,
  },

  setup(){
    const ToastControl = toastControl();
    const Loader = loader();
    const SelectedList = multipleSelectedData();
    const PaymentDetail = paymentDetail();
    return {
      ToastControl, Loader, SelectedList, PaymentDetail
    }
  },

  created(){
    let me = this;
    if ((typeof sessionStorage.token == 'undefined' || !sessionStorage.token) && (typeof localStorage.token == 'undefined' || !localStorage.token)) {
      me.$router.push('/login');
    } else {
      me.$router.push('/');
    }
  },

  methods: {
    
  },
  
  data() {
    return {
      res: resources,
    }
  },

  provide(){
    return {
      // showToastMsg: this.showToast
    }
  },
}
</script>

<style>
  @import url("./css/main.css");
</style>
