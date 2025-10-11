import { defineStore } from 'pinia'

export const paymentDetail = defineStore('PaymentDetail', {
    state: () => ({
        currentPayment: null,
        actionMode: null,
    }),
    actions: {
      setCurrentPayment(payment){
        this.currentPayment = payment;
      },

      setActionMode(mode){
        this.actionMode = mode;
      }
    }
  })