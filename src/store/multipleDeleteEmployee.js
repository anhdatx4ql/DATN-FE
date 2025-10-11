import { defineStore } from 'pinia'

export const multipleSelectedData = defineStore('MultipleSelectedData', {
    state: () => ({
        selectedItemList: [],
    }),
    actions: {
      addItem(item){
        this.selectedItemList.push(item);
      },

      removeAll(){
        this.selectedItemList = [];
      },

      removeItemFromList(index) {
        let arr = [];
        for (let i = 0; i < this.selectedItemList.length; i++) {
          if (i !== index) {
            arr.push(this.selectedItemList[i]);
          }
        }
        this.removeAll();
        this.selectedItemList = arr;
      },
    }
  })