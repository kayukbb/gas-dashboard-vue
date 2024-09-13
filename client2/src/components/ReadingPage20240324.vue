<template>
  <div>
  <v-container class="bg-surface-variant m-6">
    <v-col col="auto">
      <v-row justify="center">

        <v-card class="mx-auto m-6" elevation="9" min-height="330" variant="outlined" style="border-radius: 40px;">
          <v-card-title style="margin-bottom: 20px;">
            <h1>Gas Readings1</h1>
          </v-card-title>
          <v-card-item class="d-flex justify-center align-center">
            <v-progress-circular :color="getReadingColor(gasHistory.reading3)" :size="200" :width="20" :rotate="270"
              :value="10" style="font-size: 50px; font-weight: bold;">
              {{ gasHistory.reading1 }}%
            </v-progress-circular>
          </v-card-item>
        </v-card>

        <v-card class="mx-auto m-6" elevation="9" min-height="330" variant="outlined" style="border-radius: 40px;">
          <v-card-title style="margin-bottom: 20px;">
            <h1>Gas Readings2</h1>
          </v-card-title>
          <v-card-item class="d-flex justify-center align-center">
            <v-progress-circular :color="getReadingColor(gasHistory.reading3)" :size="200" :width="20" :rotate="270"
              :value="10" style="font-size: 50px; font-weight: bold;">
              {{ gasHistory.reading2 }}%
            </v-progress-circular>
          </v-card-item>
        </v-card>

        <v-card class="mx-auto m-6" elevation="9" min-height="330" variant="outlined" style="border-radius: 40px;">
          <v-card-title style="margin-bottom: 20px;">
            <h1>Gas Readings3</h1>
          </v-card-title>
          <v-card-item class="d-flex justify-center align-center">
            <v-progress-circular :color="getReadingColor(gasHistory.reading3)" :size="200" :width="20" :rotate="270"
              :value="10" style="font-size: 50px; font-weight: bold;">
              {{ gasHistory.reading3 }}%
            </v-progress-circular>
          </v-card-item>
        </v-card>

        <v-card class="mx-auto m-6" elevation="9" min-height="330" variant="outlined" style="border-radius: 40px;">
          <v-card-title style="margin-bottom: 20px;">
            <h1>Gas Readings4</h1>
          </v-card-title>
          <v-card-item class="d-flex justify-center align-center">
            <v-progress-circular :color="getReadingColor(gasHistory.reading3)" :size="200" :width="20" :rotate="270"
              :value="10" style="font-size: 50px; font-weight: bold;">
              {{ gasHistory.reading4 }}%
            </v-progress-circular>
          </v-card-item>
        </v-card>

      </v-row>
    </v-col>

  </v-container>


  <v-col  no-gutters class="justify-center">

      <!-- button -->
      <v-card class="mb-2 text-center" variant="outlined" width="250" style="border-radius: 40px;">
        <v-card-title>
          <h2>Switch Auto</h2>
        </v-card-title>
        <v-card-text>
          <toggle-button :value="SwitchValue" color="teal" :sync="true" :labels="true" @change="postSwitchValue" width="65" height="30" />
        </v-card-text>
      </v-card>


      <v-card width="1000" variant="outlined" style="border-radius: 40px;" v-if="SwitchValue">
        <v-card-title>
          <h2>Manual Fan speed</h2>
        </v-card-title>
        <v-card-text>
          <v-slider v-model="fanSpeed" thumb-label :label="fanSpeed.toString()" :style="{ width: '90%' }"
            step="5" max="255" min="50" @change="postFanSpeed"></v-slider>
        </v-card-text>
      </v-card>
  </v-col>






</div>
</template>

<script>
import DataService from "../service/dataservice";
import { ToggleButton } from 'vue-js-toggle-button';


function map(value, inMin, inMax, outMin, outMax) {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

export default {
  data() {
    return {
      gasreading: {},
      gasHistory: {},
      fanSpeed: 0, // Initialize the fan speed to 0
      SwitchValue: '', // Initialize the checkbox value to false
    };
  },

  created() {
    this.getLatestReading(); // Initial fetching of the latest reading
    this.getHistory();
    this.getSwitchValue();
    this.getReadingColor();

    // Start polling for the latest reading every 5 seconds
    this.pollingInterval = setInterval(() => {
      this.getHistory();
    }, 5000);
  },

  beforeUnmount() {
    // Stop polling when the component is unmounted
    clearInterval(this.pollingInterval);
  },

  component: {
    ToggleButton,
  },

  

  methods: {
    getLatestReading() {
      DataService.getOne("gasReading")
        .then(res => {
          if (res.data) {
            this.gasreading = res.data;
          }
        })
        .catch(error => {
          console.error(error);
        });
    },


   getReadingColor(reading) {
    let color1, color2, ratio;

    if (reading >= 0 && reading <= 25) {
        color1 = [0, 128, 128]; // teal
        color2 = [243, 202, 32]; // yellow
        ratio = reading / 25;
    } else if (reading > 25 && reading <= 50) {
        color1 = [243, 202, 32]; // yellow
        color2 = [255, 110, 64]; // orange
        ratio = (reading - 25) / 25;
    } else if (reading > 50 && reading <= 75) {
        color1 = [255, 110, 64]; // orange
        color2 = [178, 2, 56]; // red
        ratio = (reading - 50) / 25;
    } else if (reading > 75 && reading <= 100) {
        color1 = [178, 2, 56]; // red
        color2 = [178, 2, 56]; // red
        ratio = 1;
    }

    let color = color1.map((val, i) => (1 - ratio) * val + ratio * color2[i]);
    return `rgb(${color.map(Math.round).join(',')})`;
},




    getHistory() {
      DataService.getAll("gasHistory")
        .then(res => {
          console.log("abc", res.data);
          if (res.data.length > 0) {
            const maxId = Math.max(...res.data.map(item => item.id));
            const latestObject = res.data.find(item => item.id === maxId);
            const mappedReadings = {
              reading1: Math.round(map(latestObject.reading1, 0, 4065, 0, 100)),
              reading2: Math.round(map(latestObject.reading2, 0, 4065, 0, 100)),
              reading3: Math.round(map(latestObject.reading3, 0, 4065, 0, 100)),
              reading4: Math.round(map(latestObject.reading4, 0, 4065, 0, 100))
            };
            this.gasHistory = mappedReadings;
          }
          console.log("abcde", this.gasHistory);
        })
        .catch(error => {
          console.error(error);
        });
    },

    getSwitchValue() {
      DataService.getOne("getSwitchValue")
        .then(res => {
          this.SwitchValue = res.data.switchValue;
        })
        .catch(error => {
          console.error(error);
        });
    },

    postFanSpeed() {
      const data = {
        fanSpeed: this.fanSpeed
      };

      DataService.postOne("postFanSpeed", data)
        .then(res => {
          console.log(res);
          // Handle the response as needed
        })
        .catch(error => {
          console.error(error);
        });
    },

    postSwitchValue() {
      this.SwitchValue = !this.SwitchValue;

      DataService.postOne("SwitchValue", JSON.stringify({ value: this.SwitchValue }), {
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(res => {
          console.log(res);
          // Handle the response as needed
        })
        .catch(error => {
          console.error(error);
        });

    },

  }
};
</script>

<style>

</style>