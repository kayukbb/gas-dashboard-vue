import Vue from 'vue'
import App from './App.vue'
import router from './router'

import 'vuetify/dist/vuetify.css'
import Vuetify from 'vuetify'
import ToggleButton from 'vue-js-toggle-button'


Vue.use(ToggleButton)

Vue.use(Vuetify)



const vuetify = new Vuetify()

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')