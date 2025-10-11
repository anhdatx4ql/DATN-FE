import { defineStore } from 'pinia'

export const sortedArray = defineStore('SortedArray', {
    state: () => ({
        sortedArr: [],
    }),
    actions: {
      addItem(item){
        this.sortedArr.push(item);
      },

      removeAll(){
        this.sortedArr = [];
      },

      removeItemFromList(index) {
        let arr = [];
        for (let i = 0; i < this.sortedArr.length; i++) {
          if (i !== index) {
            arr.push(this.sortedArr[i]);
          }
        }
        this.removeAll();
        this.sortedArr = arr;
      },

      insertToPosition(index, data) {
        let result = [];
        for (let i = 0; i < this.sortedArr.length; i++) {
          if (i != index) {
            result.push(this.sortedArr[i]);
          } else {
            result.push(this.sortedArr[i]);
            result.push(data);
          }
        }
        this.sortedArr.removeAll();
        this.sortedArr = result;
      },
    }
  })