<template>
  <div>
    <div>
      <h1>Gas Readings</h1>
      <p>reading: {{ gasHistory.reading1 }}</p>
    </div>

    <div>
      <h1>Co2 Readings</h1>
      <p>reading: {{ gasHistory.co2 }}ppm</p>
    </div>

    <div>
      <h1>TVOC</h1>
      <p>reading: {{ gasHistory.tvoc }}ppb</p>
    </div>

    <div>
      <h1>Random</h1>
      <p>reading: {{ gasHistory.reading4 }}</p>
    </div>
    <!-- button -->

    <div>
      <h2>Manual fan speed</h2>
      <toggle-button :value="SwitchValue" color="teal" :sync="true" :labels="true" @change="postSwitchValue" width="65" height="30" />
    </div>

    <div>
      
      <h2>Manual Fan speed</h2>
      <v-slider v-model="fanSpeed" thumb-label :label="fanSpeed.toString()" :style="{ width: '90%' }"
            step="5" max="255" min="50" @change="postFanSpeed"></v-slider>
    </div>
  </div>
</template>

  
  <script>
  import DataService from "../service/dataservice";
  import { ToggleButton } from 'vue-js-toggle-button';

  
  
  
  

  
  export default {
    data() {
      return {
        
        gasHistory: {},
        fanSpeed: 0, // Initialize the fan speed to 0
        SwitchValue: '', // Initialize the checkbox value to false
      };
    },
  
    created() {
    console.log("Component created"); // Check if the created() hook is triggered
    this.getHistory();
    this.getSwitchValue();
  
    setInterval(() => {
      console.log("1s"); // Check if the interval is executed every second
      
    }, 1000);
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
  
  
  
  
  
  
      getHistory() {
      DataService.getAll("gasHistory")
        .then(res => {
          console.log("abc", res.data);
          if (res.data.length > 0) {
            const maxId = Math.max(...res.data.map(item => item.id));
            const latestObject = res.data.find(item => item.id === maxId);
            this.gasHistory.reading1 = latestObject.reading1;
            this.gasHistory.reading4 = latestObject.reading4;
            this.gasHistory.co2 = latestObject.reading2;
            this.gasHistory.tvoc = latestObject.reading3;
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
  
  