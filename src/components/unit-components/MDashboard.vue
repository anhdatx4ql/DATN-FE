<template>
    <div class="home">
        <div style="font-size: 22px; width: 200px; font-family: Opens-san-bold; line-height: 30px; position: relative; top: 15px; left: 35px;">Tổng quan</div>
        <div style="height: 90%; width: 94%; margin: 0 auto; margin-top: 30px; background-color: #fff;">
      <div class="pie-statistic" style="transform: scale(0.9); top: 20px; left: 20px;">
        <div id="chart">
          <Doughnut class="ms-doughnut-char" :key="chartKey" :data="chartData" :options="options" />
        </div>
      </div>
      <div class="chart-expanation" style="margin-left: 100px; transform: scale(0.85);">
        <div style="height: 30px; font-size: 22px; margin-top: 55px; color: #444444; font-family: Notosans-semibold; line-height: 30px; text-align: center; width: 650px;">Tình trạng sử dụng thiết bị</div>
        <div style="height: 16px; color: #a0a0a0; width: 650px; text-align: center; margin-top: 0px;">{{ dateToText(new Date()) }}</div>
        <div class="container" style="display: flex; column-gap: 36px;">
          <div>
            <div class="item" style="display: flex; column-gap: 8px; position: relative; top: 20px;">
              <div class="icon used-icon"></div>
              <div class="text1" style="font-size: 18px; color: #666666;">Đang sử dụng: {{ using }}</div>
              <div class="text2" style="position: absolute; font-family: Poppins-bold; font-size: 16px;">{{ usingPercent }}%</div>
            </div>
    
            <div class="item" style="display: flex; column-gap: 8px; position: relative; top: 50px;">
              <div class="icon total-icon"></div>
              <div class="text1" style="font-size: 18px; color: #666666;">Chưa sử dụng: {{ notuse }}</div>
              <div class="text2" style="position: absolute; font-family: Poppins-bold; font-size: 16px;">{{ notusePercent }}%</div>
            </div>
          </div>
          <div>
            <div class="item" style="display: flex; column-gap: 8px; position: relative; top: 20px;">
              <div class="icon repair-icon"></div>
              <div class="text1" style="font-size: 18px; color: #666666;">Đang sửa chữa: {{ repair }}</div>
              <div class="text2" style="position: absolute; font-family: Poppins-bold; font-size: 16px;">{{ repairPercent }}%</div>
            </div>
    
            <div class="item" style="display: flex; column-gap: 8px; position: relative; top: 50px;">
              <div class="icon broken-icon"></div>
              <div class="text1" style="font-size: 18px; color: #666666;">Đã hư hỏng: {{ broken }}</div>
              <div class="text2" style="position: absolute; font-family: Poppins-bold; font-size: 16px;">{{ brokenPercent }}%</div>
            </div>
          </div>
        </div>
        <MCircleLoader v-if="showLoader"></MCircleLoader>
      </div>
      <div id="lineChart" :key="lineKey" class="line-chart" style="height: 308px; width: 100%; margin-top: 30px; position: relative;">
      </div>
    </div>
    </div>
  </template>
  
  <script>
  import { Doughnut } from 'vue-chartjs'
  import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js'
  import MCircleLoader from '@/components/base-component/MCircleLoader.vue'
  import ApexCharts from 'apexcharts'
  import resources from '@/js/resources'
  
  ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title)
  
  export default {
    name: 'HomeView',
    components: {
      Doughnut,
      MCircleLoader,
    },
    computed:{
      usingPercent(){
        return Math.round(this.using/this.totalAsset*100)
      },
      notusePercent(){
        return Math.round(this.notuse/this.totalAsset*100)
      },
      repairPercent(){
        return Math.round(this.repair/this.totalAsset*100)
      },
      brokenPercent(){
        return Math.round(this.broken/this.totalAsset*100)
      }
    },
    created(){
      this.getStatisData();
    },
    mounted(){
      // this.renderLineChart();
    },
  
    methods:{
  
      renderLineChart(){
        let options = {
        chart: {
          type: 'line',
          height: 300,
          width: 1200,
          dropShadow: {
            enabled: true,
            color: '#000',
            top: 18,
            left: 7,
            blur: 10,
            opacity: 0.2
          },
          toolbar: {
            show: false
          }
        },
        colors: ['#2ca01c', '#dd1b16'],
        dataLabels: {
          enabled: true,
        },
        stroke: {
          curve: 'smooth'
        },
        title: {
          text: 'Tình trạng mua sắm thiết bị trong năm',
          align: 'center',
        },
        grid: {
          borderColor: '#e7e7e7',
          row: {
            colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.5
          },
        },
        markers: {
          size: 1
        },
        xaxis: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          title: {
            text: 'Month'
          }
        },
        yaxis: {
          title: {
            text: 'Số lượng'
          },
          min: 10,
          max: 170
        },
        legend: {
          position: 'top',
          horizontalAlign: 'right',
          floating: true,
          offsetY: -25,
          offsetX: -5
        },
        series: this.lineSeries,
        
      }
  
      let chart = new ApexCharts(document.querySelector("#lineChart"), options);
      chart.render();
      setTimeout(() => {
        let chart = document.querySelector('.apexcharts-svg');
        if (chart){
          chart.style.position = 'absolute';
          chart.style.top = 0;
          chart.style.left = '30px';
        }
      }, 100);
      },
  
      calculatePercent(value){
        return Math.round(value/this.totalAsset)*100;
      },
  
      getStatisData(){
        let endpoint = `${this.res.endpoint}Asset`;
        this.showLoader = true;
        setTimeout(async () => {
          let res = await fetch(endpoint);
          let data = await res.json();
          if (data){
            this.totalAsset = data.length;
            this.using = data.filter(x => x.status == 0).length;
            this.notuse = data.filter(x => x.status == 1).length;
            this.repair = data.filter(x => x.status == 2).length;
            this.broken = data.filter(x => x.status == 3).length;
            this.chartData.datasets[0].data[0] = this.using;
            this.chartData.datasets[0].data[1] = this.notuse;
            this.chartData.datasets[0].data[2] = this.repair;
            this.chartData.datasets[0].data[3] = this.broken;
            this.chartKey++;
            let currentYearAssets = data.filter(x => ((new Date(x.boughtat)).getFullYear() == (new Date()).getFullYear())),
                previousYearAssets = data.filter(x => ((new Date(x.boughtat)).getFullYear() == (new Date()).getFullYear() - 1)),
                currentYearData = [],
                previouesYearData = [];
            for (let i=1;i<=12;i++){
              let currentMonthData = currentYearAssets.filter(x => (new Date(x.boughtat)).getMonth() + 1 == i).length || 0;
              let previousMonthData = previousYearAssets.filter(x => (new Date(x.boughtat)).getMonth() + 1 == i).length || 0;
              if (currentMonthData != 0)
                currentYearData.push(currentMonthData);
              previouesYearData.push(previousMonthData);
            }
            this.lineSeries[0].data = currentYearData;
            this.lineSeries[1].data = previouesYearData;
            this.renderLineChart();
          }
          this.showLoader = false;
        }, 1);
      },
  
      dateFormater(date) {
        if (new Date(date)){
          let data = new Date(date),
              day = data.getDay() > 10 ? data.getDay() : '0' + data.getDay(),
              month = data.getMonth() > 10 ? data.getMonth() + 1 : '0' + data.getMonth() + 1,
              year = data.getFullYear();
          return `${day}/${month}/${year}`;
        }
      },
  
      dateToText(date) {
        if (new Date(date)){
          let data = new Date(date),
              month = data.getMonth() + 1,
              year = data.getFullYear();
          let monthText = '';
          switch(month) {
            case 1: {
              monthText = 'January'
              break;
            }
            case 2: {
              monthText = 'February'
              break;
            }
            case 3: {
              monthText = 'March'
              break;
            }
            case 4: {
              monthText = 'April'
              break;
            }
            case 5: {
              monthText = 'May'
              break;
            }
            case 6: {
              monthText = 'June'
              break;
            }
            case 7: {
              monthText = 'July'
              break;
            }
            case 8: {
              monthText = 'August'
              break;
            }
            case 9: {
              monthText = 'September'
              break;
            }
            case 10: {
              monthText = 'October'
              break;
            }
            case 11: {
              monthText = 'December'
              break;
            }
            case 12: {
              monthText = 'November'
              break;
            }
          }
          return `${monthText} - ${year}`;
        }
      }
    },
  
    data() {
      return {
        chartData: {
          labels: ['Sử dụng', 'Chưa sử dụng', 'Sửa chữa', 'Đã hỏng'],
          datasets: [
            {
              backgroundColor: ['#2ca01c', '#00D8FF', '#fcba03', '#DD1B16'],
              data: [80, 10, 5, 5]
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        },
  
        series: [
          {
            name: "High - 2013",
            data: [28, 29, 33, 36, 32, 32, 33]
          },
          {
            name: "Low - 2013",
            data: [12, 11, 14, 18, 17, 13, 13]
          }
        ],
  
        chartOptions: {
              chart: {
                height: 350,
                type: 'line',
                dropShadow: {
                  enabled: true,
                  color: '#000',
                  top: 18,
                  left: 7,
                  blur: 10,
                  opacity: 0.2
                },
                toolbar: {
                  show: false
                }
              },
              colors: ['#77B6EA', '#545454'],
              dataLabels: {
                enabled: true,
              },
              stroke: {
                curve: 'smooth'
              },
              title: {
                text: 'Average High & Low Temperature',
                align: 'left'
              },
              grid: {
                borderColor: '#e7e7e7',
                row: {
                  colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                  opacity: 0.5
                },
              },
              markers: {
                size: 1
              },
              xaxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                title: {
                  text: 'Month'
                }
              },
              yaxis: {
                title: {
                  text: 'Temperature'
                },
                min: 5,
                max: 40
              },
              legend: {
                position: 'top',
                horizontalAlign: 'right',
                floating: true,
                offsetY: -25,
                offsetX: -5
              }
            },
          lineSeries: [
          {
            name: "Mua mới - 2023",
            data: [28, 29, 33, 36, 32, 32, 33]
          },
          {
            name: "Mua mới - 2022",
            data: [12, 11, 14, 18, 17, 13, 13, 29, 20, 21, 22, 10]
          }
        ],
  
        using: 0,
        notuse: 0,
        repair: 0,
        broken: 0,
        chartKey: 0,
        totalAsset: 0,
        showLoader: false,
        lineKey: 0,
        res: resources,
      }
    }
  }
  </script>
  <style scoped>
  
    .item{
      height: 100px;
      width: 300px;
      box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
      border-radius: 20px;
    }
    .pie-statistic{
      height: 300px;
      width: 500px;
      position: relative;
      border-right: solid 1px #e5e5e5;
      box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
      border-bottom: solid 1px #e5e5e5;
      border-radius: 4px;
    }
    .apexcharts-svg{
      position: absolute;
    }
    #chart{
      position: relative;
    }
    .ms-doughnut-char{
      position: absolute;
    }
    .chart-title{
      color: #666;
      position: relative;
      left: 15px;
    }
    .chart-expanation{
      height: 300px;
      width: 300px;
      position: absolute;
      top: 8px;
      left: 520px;
    }
  
    .total-icon{
      background-image: url('@/assets/icons/useable.png');
      height: 30px;
      width: 30px;
      background-size: contain;
      border-radius: 50%;
    }
    .used-icon{
      background-image: url('@/assets/icons/using.png');
      height: 30px;
      width: 30px;
      background-size: contain;
      border-radius: 50%;
    }
    .repair-icon{
      background-image: url('@/assets/icons/broken.png');
      height: 30px;
      width: 30px;
      background-size: contain;
      border-radius: 50%;
    }
    .broken-icon{
      background-image: url('@/assets/icons/broke.jpg');
      height: 30px;
      width: 30px;
      background-size: 60px 60px;
      background-position: -15px -15px;
      background-color: #87ff78;
      border-radius: 50%;
    }
    .icon{
      position: relative;
      top: 30px;
      left: 30px;
    }
  
    .text1{
      position: relative;
      top: 30px;
      left: 40px;
    }
    .text2{
      position: relative;
      top: 60px;
      left: 78px;
      color: #444444;
    }
  
    ::v-deep .apexcharts-title-text{
      font-family: Notosans-bold !important;
    }
  
    ::v-deep .apexcharts-yaxis-title-text{
      font-family: Notosans-bold !important;
    }
  </style>
  