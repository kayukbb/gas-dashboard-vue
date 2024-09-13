<template>
  <div>
    <h1>{{ formattedDate }}</h1>
    <LineChartGenerator
      :chart-options="chartOptions"
      :chart-data="gasChartData"
      :chart-id="chartId"
      :dataset-id-key="datasetIdKey"
      :plugins="plugins"
      :css-classes="cssClasses"
      :styles="styles"
      :width="width"
      :height="height"
    />
  </div>
</template>

<script>
import { Line as LineChartGenerator } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement
} from 'chart.js'
import DataService from '@/service/dataservice'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement
)

export default {
  name: 'GasLineChart',
  components: {
    LineChartGenerator
  },
  props: {
    chartId: {
      type: String,
      default: 'line-chart'
    },
    datasetIdKey: {
      type: String,
      default: 'label'
    },
    width: {
      type: Number,
      default: 400
    },
    height: {
      type: Number,
      default: 400
    },
    cssClasses: {
      default: '',
      type: String
    },
    styles: {
      type: Object,
      default: () => ({})
    },
    plugins: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      gasChartData: {
        labels: [],
        datasets: []
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: true
      },
      gasHistory: [],
      formattedDate: ''
    }
  },
  methods: {
    formatDate(dateString) {
      const dateObj = new Date(dateString);
      const year = dateObj.getFullYear();
      const month = dateObj.getMonth() + 1;
      const day = dateObj.getDate();
      const hours = dateObj.getHours();
      const minutes = dateObj.getMinutes();
      const seconds = dateObj.getSeconds();

      const formattedDate = `${year}-${month}-${day}`;
      const formattedTime = `${hours}:${minutes}:${seconds}`;

      return { formattedDate, time: formattedTime };
    },
    getHistory() {
      DataService.getAll('gasHistory')
        .then(res => {
          this.gasHistory = res.data;
          this.gasHistory.sort((a, b) => {
            return new Date(a.createdAt) - new Date(b.createdAt);
          });

          this.gasHistory = this.gasHistory.slice(-500); // Get the last 100 entries

          let gasReadings = [];
          const colors = ['red', 'blue', 'green', 'orange'];

          for (let i = 1; i <= 4; i++) {
            let dataset = {
    label: i === 1 ? 'Flammable gas' : i === 2 ? 'CO2' : i === 3 ? 'TVOC' : 'Air Quality',
    data: [],
    backgroundColor: 'rgba(0, 0, 0, 0)',
    borderColor: colors[i - 1]
            };
            this.gasHistory.forEach(data => {
              const { time } = this.formatDate(data.createdAt);

              let reading = {
                x: time,
                y: data[`reading${i}`]
              };
              if (reading.y !== undefined && reading.y !== null && !isNaN(reading.y) && reading.y >= 0 && reading.y <= 60000) {
                dataset.data.push(reading);
              }
            });
            gasReadings.push(dataset);
          }

          this.gasChartData.datasets = gasReadings;
          this.formattedDate = this.formatDate(this.gasHistory[0].createdAt).formattedDate; // Assign the formatted date to the 'formattedDate' variable
        })
        .catch(error => {
          console.error(error);
        });
    }
  },
  mounted() {
    this.getHistory();
  }
}
</script>